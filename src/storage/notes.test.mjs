import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';
import * as htmlparser2 from 'htmlparser2';

const src = fileURLToPath(new URL('../', import.meta.url));

test('format-only saves survive reopen and notebook moves without changing plain previews', () => {
  const api = fixture();
  const original = api.saveNote({ body: 'Title\nBody' });
  const richText = { version: 1, html: '<html><h1>Title</h1><p><b>Body</b></p></html>' };
  assert.equal(api.isNoteDraftDirty(original, original.body, undefined, richText), true);
  api.saveNote({ id: original.id, body: original.body, richText });
  const book = api.createNotebook('Keep');
  api.saveNote({ id: original.id, body: original.body, notebookId: book.id });
  const reopened = api.getNotes()[0];
  assert.equal(reopened.richText.html, richText.html);
  assert.equal(reopened.title, 'Title');
  assert.equal(reopened.notebookId, book.id);
  assert.equal(api.isNoteDraftDirty(reopened, reopened.body, book.id, richText), false);
});

test('a plain edit drops stale formatting, and clearing a rich note persists an empty body', () => {
  const api = fixture();
  const note = api.saveNote({ body: 'Old', richText: { version: 1, html: '<p><b>Old</b></p>' } });
  api.saveNote({ id: note.id, body: 'New' });
  assert.equal(api.getNotes()[0].richText, undefined);
  api.saveNote({ id: note.id, body: '', richText: { version: 1, html: '<html><p><br></p></html>' } });
  assert.equal(api.getNotes()[0].body, '');
  assert.equal(api.getNotes()[0].title, 'Untitled note');
});

// Load the real storage helpers with isolated in-memory MMKV, never device data.
function fixture() {
  const values = new Map();
  const cache = new Map();
  function load(file) {
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} };
    cache.set(file, module);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const require = (id) => {
      if (id === 'htmlparser2') return htmlparser2;
      if (id === 'react-native') return { Platform: { OS: 'android' } };
      if (id === './mmkv') return { storage: { getString: (key) => values.get(key), set: (key, value) => values.set(key, value) } };
      return load(id.startsWith('@/') ? path.join(src, id.slice(2) + '.ts') : path.resolve(path.dirname(file), id + '.ts'));
    };
    vm.runInThisContext('(function(require,module,exports){' + code + '\n})', { filename: file })(require, module, module.exports);
    return module.exports;
  }
  return { ...load(path.join(src, 'storage/notes.ts')), ...load(path.join(src, 'lib/note-draft.ts')) };
}

test('new note saves to the selected notebook and is readable after reopening', () => {
  const api = fixture();
  const book = api.createNotebook('  Ideas  ');
  const note = api.saveNote(api.createEditorSaveInput({ body: 'Remember this', notebookId: book.id, commitDestination: true }));
  assert.equal(api.getNotes()[0].id, note.id);
  assert.equal(api.getNotes()[0].notebookId, book.id);
  assert.equal(api.getNotebooks()[0].name, 'Ideas');
});
test('pending destination survives text autosave without moving the stored note', () => {
  const api = fixture();
  const a = api.createNotebook('Ideas'), b = api.createNotebook('Study');
  const original = api.saveNote({ body: 'One', notebookId: a.id });
  api.saveNote(api.createEditorSaveInput({ id: original.id, body: 'Two', notebookId: b.id, commitDestination: false }));
  const stored = api.getNotes()[0];
  assert.equal(stored.body, 'Two');
  assert.equal(stored.notebookId, a.id);
  assert.equal(api.isNoteDraftDirty(stored, 'Two', b.id), true);
  const moved = api.saveNote(api.createEditorSaveInput({ id: original.id, body: 'Two', notebookId: b.id, commitDestination: true }));
  assert.equal(moved.id, original.id);
  assert.equal(moved.createdAt, original.createdAt);
  assert.equal(moved.notebookId, b.id);
  assert.equal(api.getNotes().length, 1);
});
test('moving to Loose notes preserves content and does not delete empty notebooks', () => {
  const api = fixture();
  const book = api.createNotebook('Ideas');
  api.createNotebook('An empty notebook to keep');
  const original = api.saveNote({ body: 'Keep this text', notebookId: book.id });
  const loose = api.saveNote({ id: original.id, body: original.body, notebookId: null });
  assert.equal(loose.notebookId, undefined);
  assert.equal(loose.body, original.body);
  assert.equal(api.getNotebooks().length, 2);
  assert.equal(api.getNotes().filter((note) => !note.notebookId).length, 1);
});
test('legacy text-only save preserves membership, including intentional empty body', () => {
  const api = fixture();
  const book = api.createNotebook('Ideas');
  const note = api.saveNote({ body: 'Some text', notebookId: book.id });
  const saved = api.saveNote({ id: note.id, body: '' });
  assert.equal(saved.body, '');
  assert.equal(saved.notebookId, book.id);
});
