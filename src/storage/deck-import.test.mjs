import assert from 'node:assert/strict';
import test from 'node:test';
import { testModules } from '../test/module-loader.mjs';
const load = testModules();
const { assertImportText, getDeckFileKind } = load('lib/import-policy.ts');
const { parseCardImportText } = load('lib/import-parser.ts');
const { validateAppBackup } = load('lib/backup-validation.ts');
const { commitImport, recoverInterruptedImport } = load('storage/import-transaction.ts');
const when = '2026-10-26T12:00:00.000Z';
function backup() {
  return { version: 1, decks: [{ id: 'd', name: 'Deck', createdAt: when, updatedAt: when }], flashcards: [{ id: 'c', deckId: 'd', front: 'Q', back: 'A', createdAt: when, updatedAt: when }], notes: [], notebooks: [], reviewLogs: [] };
}
test('only explicit supported suffixes and UTF-8 sized text are accepted', () => {
  assert.equal(getDeckFileKind('Study.FOLIOPACK'), 'backup');
  for (const name of ['file.xlsx', '../file.csv', 'file.pdf', 'file.csv.exe']) assert.throws(() => getDeckFileKind(name));
  assert.throws(() => assertImportText('a\0b'), /UTF-8/);
  assert.doesNotThrow(() => assertImportText('Literal replacement character: \uFFFD'));
  assert.throws(() => assertImportText('a'.repeat(1024 * 1024 + 1)), /1 MB/);
  assert.throws(() => assertImportText('😀'.repeat(300000)), /1 MB/);
});
test('normal CSV, TSV, quoted commas and escaped quotes still import', () => {
  assert.deepEqual(parseCardImportText('front,back\n"A, B","say ""hi"""').cards, [{ front: 'A, B', back: 'say "hi"', deckName: undefined }]);
  assert.equal(parseCardImportText('Hello\tBonjour').cards[0].back, 'Bonjour');
  assert.equal(parseCardImportText('Hello|Bonjour').cards[0].front, 'Hello');
  assert.equal(parseCardImportText('front,back\n"two\nlines",answer').cards[0].front, 'two\nlines');
  assert.throws(() => parseCardImportText('front,back\n"unfinished,answer'), /not closed/);
});
test('card counts and per-side lengths are bounded', () => {
  assert.throws(() => parseCardImportText('word,meaning\n'.repeat(5001)), /5,000/);
  assert.throws(() => parseCardImportText('q,' + 'a'.repeat(16001)), /16,000/);
  assert.throws(() => parseCardImportText('front,back,unused\nword,meaning,' + 'a'.repeat(16001)), /16,000/);
});
test('backup validation rejects dangerous shapes before changing any data', () => {
  assert.equal(validateAppBackup(JSON.stringify(backup())).flashcards[0].front, 'Q');
  for (const mutate of [
    (b) => { b.decks[0].id = '__proto__'; },
    (b) => { b.flashcards[0].deckId = 'missing'; },
    (b) => { b.flashcards[0].front = {}; },
    (b) => { b.flashcards[0].easeFactor = -1; },
    (b) => { b.flashcards.push(b.flashcards[0]); },
    (b) => { b.notes = [null]; },
    (b) => { b.reviewLogs = 'bad'; },
    (b) => { b.notes = [{ kind: 'pdf', pdf: { fileName: 'pdf-secret.pdf' } }]; },
  ]) { const b = backup(); mutate(b); assert.throws(() => validateAppBackup(JSON.stringify(b))); }
});
test('backup drops unknown properties and validates rich text rather than trusting it', () => {
  const b = backup();
  b.decks[0].unexpected = 'not copied';
  b.notes = [{ id: 'n', title: 'Note', body: 'Hello', richText: { version: 1, html: '<p><b>Hello</b><img src="https://bad"></p>' }, createdAt: when, updatedAt: when }];
  const safe = validateAppBackup(JSON.stringify(b));
  assert.equal(safe.decks[0].unexpected, undefined);
  assert.equal(safe.notes[0].richText.html, '<html><p><b>Hello</b></p></html>');
});
test('failed writes roll back all collections and an interrupted import recovers on next read', () => {
  const values = new Map([['decks', 'original'], ['notes', 'original notes']]);
  let failOnce = true;
  const store = { getString: (key) => values.get(key), remove: (key) => values.delete(key), set: (key, value) => {
    if (key === 'notes' && failOnce) { failOnce = false; throw new Error('disk full'); }
    values.set(key, value);
  } };
  assert.throws(() => commitImport(store, { decks: 'replacement', notes: 'replacement notes' }), /disk full/);
  assert.equal(values.get('decks'), 'original');
  assert.equal(values.get('notes'), 'original notes');
  assert.equal(values.has('deck-import-rollback'), false);
  values.set('deck-import-rollback', JSON.stringify([['decks', 'original']]));
  values.set('decks', 'partial');
  recoverInterruptedImport(store);
  assert.equal(values.get('decks'), 'original');
});
test('old builds fail closed and cancelling a picker has no side effects', async () => {
  const old = testModules({ expo: { requireOptionalNativeModule: () => ({}) } })('storage/deck-import.ts');
  await assert.rejects(old.pickDeckFile(), /updated Folio/);
  let calls = 0;
  const api = testModules({ expo: { requireOptionalNativeModule: () => ({ pickDeckAsync: async () => { calls++; return null; } }) } })('storage/deck-import.ts');
  assert.equal(await api.pickDeckFile(), undefined);
  assert.equal(calls, 1);
});
