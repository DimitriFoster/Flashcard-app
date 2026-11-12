import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';
import * as htmlparser2 from 'htmlparser2';

const src = fileURLToPath(new URL('../', import.meta.url));
const attachment = { fileName: 'pdf-test-123.pdf', originalName: 'My lecture.pdf', size: 1024 };

function fixture(options = {}) {
  const values = new Map();
  const cache = new Map();
  const calls = { picked: 0, removed: [], opened: [] };
  function load(file) {
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} };
    cache.set(file, module);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const require = (id) => {
      if (id === 'htmlparser2') return htmlparser2;
      if (id === 'react-native') return { Platform: { OS: 'android' } };
      if (id === './mmkv') return { storage: { getString: (key) => values.get(key), set: (key, value) => {
        if (options.failSave) throw new Error('storage unavailable');
        values.set(key, value);
      } } };
      if (id === '@/storage/pdf-files') return {
        pdfAvailabilityMessage: () => options.unavailable,
        pickPdfFile: async () => {
          calls.picked++;
          if (options.failPick) throw new Error('native import failed');
          return options.cancelled ? undefined : attachment;
        },
        removePdfFile: async (name) => { calls.removed.push(name); if (options.failRemove) throw new Error('delete failed'); },
        openPdfFile: async (pdf, choose) => { calls.opened.push({ pdf, choose }); return options.noReader ? 'no_reader' : 'opened'; },
      };
      return load(id.startsWith('@/') ? path.join(src, id.slice(2) + '.ts') : path.resolve(path.dirname(file), id + '.ts'));
    };
    vm.runInThisContext('(function(require,module,exports){' + code + '\n})', { filename: file })(require, module, module.exports);
    return module.exports;
  }
  return { calls, values, options, ...load(path.join(src, 'storage/pdf-notes.ts')), ...load(path.join(src, 'storage/notes.ts')), ...load(path.join(src, 'lib/pdf-note.ts')) };
}

test('PDF import persists metadata and selected notebook without changing text notes', async () => {
  const api = fixture();
  const text = api.saveNote({ body: 'My existing text' });
  const book = api.createNotebook('Lectures');
  const pdf = await api.importPdfNote(book.id);
  assert.equal(pdf.kind, 'pdf');
  assert.equal(pdf.title, 'My lecture');
  assert.equal(pdf.notebookId, book.id);
  assert.deepEqual(api.getNotes().find((note) => note.id === pdf.id).pdf, attachment);
  assert.deepEqual(api.getNotes().find((note) => note.id === text.id), text);
  assert.equal(api.calls.picked, 1);
});

test('cancelled imports and older APKs do not create files or notes', async () => {
  const api = fixture({ cancelled: true });
  assert.equal(await api.importPdfNote(), undefined);
  assert.equal(api.calls.picked, 1);
  assert.equal(api.getNotes().length, 0);
  const oldBuild = fixture({ unavailable: 'Install the updated APK' });
  await assert.rejects(oldBuild.importPdfNote(), /updated APK/);
  assert.equal(oldBuild.calls.picked, 0);
});

test('native picker or validation failures do not save metadata and allow retry', async () => {
  const api = fixture({ failPick: true });
  await assert.rejects(api.importPdfNote(), /native import failed/);
  assert.equal(api.getNotes().length, 0);
  api.options.failPick = false;
  assert.equal((await api.importPdfNote()).kind, 'pdf');
});

test('concurrent imports launch only one native picker', async () => {
  const api = fixture();
  const first = api.importPdfNote();
  assert.equal(await api.importPdfNote(), undefined);
  assert.equal((await first).kind, 'pdf');
  assert.equal(api.calls.picked, 1);
});

test('failed metadata saves roll back the app-owned PDF copy', async () => {
  const api = fixture({ failSave: true });
  await assert.rejects(api.importPdfNote(), /Could not save/);
  assert.deepEqual(api.calls.removed, [attachment.fileName]);
  assert.equal(api.getNotes().length, 0);
});

test('a removed notebook aborts import and cleans up its file', async () => {
  const api = fixture();
  await assert.rejects(api.importPdfNote('missing-book'), /Could not save/);
  assert.deepEqual(api.calls.removed, [attachment.fileName]);
});

test('failed rollback is reported instead of claiming successful cleanup', async () => {
  const api = fixture({ failSave: true, failRemove: true });
  await assert.rejects(api.importPdfNote(), /could not be removed/);
});

test('PDF metadata survives notebook moves, normal save, and notebook deletion', async () => {
  const api = fixture();
  const book = api.createNotebook('Lectures');
  const pdf = await api.importPdfNote();
  api.moveNoteToNotebook(pdf.id, book.id);
  const moved = api.saveNote({ id: pdf.id, body: 'not an editable PDF', notebookId: null });
  assert.equal(moved.title, pdf.title);
  assert.equal(moved.body, '');
  assert.deepEqual(moved.pdf, attachment);
  api.moveNoteToNotebook(pdf.id, book.id);
  api.deleteNotebook(book.id);
  assert.equal(api.getNotes()[0].notebookId, undefined);
  assert.deepEqual(api.getNotes()[0].pdf, attachment);
});

test('open/default/chooser do not resave the note; a deleted note cannot be opened', async () => {
  const api = fixture();
  const pdf = await api.importPdfNote();
  const before = api.values.get('notes');
  assert.equal(await api.openPdfNote(pdf.id), 'opened');
  assert.equal(await api.openPdfNote(pdf.id, true), 'opened');
  assert.deepEqual(api.calls.opened.map((call) => call.choose), [false, true]);
  assert.equal(api.values.get('notes'), before);
  await api.deleteNoteWithAttachment(pdf.id);
  await assert.rejects(api.openPdfNote(pdf.id), /unavailable/);
});

test('no compatible reader is returned to the UI without losing the PDF', async () => {
  const api = fixture({ noReader: true });
  const pdf = await api.importPdfNote();
  assert.equal(await api.openPdfNote(pdf.id), 'no_reader');
  assert.equal(api.getNotes().length, 1);
});

test('delete removes only the PDF copy, not text notes or original source', async () => {
  const api = fixture();
  const text = api.saveNote({ body: 'Keep me' });
  const pdf = await api.importPdfNote();
  assert.deepEqual(await api.deleteNoteWithAttachment(pdf.id), { deleted: true, cleanupFailed: false });
  assert.deepEqual(api.calls.removed, [attachment.fileName]);
  assert.deepEqual(api.getNotes(), [text]);
  await api.deleteNoteWithAttachment(text.id);
  assert.equal(api.calls.removed.length, 1);
});

test('cleanup failures are surfaced; malformed stored paths are never passed to native deletion', async () => {
  const api = fixture({ failRemove: true });
  const pdf = await api.importPdfNote();
  assert.deepEqual(await api.deleteNoteWithAttachment(pdf.id), { deleted: true, cleanupFailed: true });
  api.values.set('notes', JSON.stringify([{ ...pdf, pdf: { ...attachment, fileName: '../private-file' } }]));
  await api.deleteNoteWithAttachment(pdf.id);
  assert.equal(api.calls.removed.length, 1);
});

test('validation rejects traversal, remote paths, and malformed metadata; sanitizes display names', () => {
  const api = fixture();
  for (const name of ['../notes', 'pdf-a/b.pdf', 'pdf-a\\b.pdf', 'pdf-%2e.pdf', 'https://host/pdf-a.pdf', 'pdf-a.pdf\n']) {
    assert.equal(api.isPdfFileName(name), false);
    assert.equal(api.normalizePdfAttachment({ ...attachment, fileName: name }), undefined);
  }
  assert.equal(api.normalizePdfAttachment({ ...attachment, size: -1 }), undefined);
  assert.equal(api.normalizePdfAttachment({ ...attachment, size: 1.5 }), undefined);
  assert.equal(api.pdfDisplayName('../folder/lecture\u202e\u0000.pdf'), 'lecture.pdf');
  assert.ok(api.pdfDisplayName('x'.repeat(400)).length <= 180);
});
