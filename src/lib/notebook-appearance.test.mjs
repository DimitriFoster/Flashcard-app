import assert from 'node:assert/strict';
import test from 'node:test';
import { NOTEBOOK_APPEARANCES, getNotebookAppearance, getNotebookNotePreview, formatNotebookNoteDate } from './notebook-appearance.ts';

test('preserves all eight existing bookshelf cover assignments', () => {
  const keys = ['ideas', 'flowers', 'clouds', 'sun', 'moon', 'feather', 'leaves', 'checklist'];
  for (const id of ['', 'a', 'notebook-123', 'recovered', 'a-very-long-notebook-id', '\uD83D\uDCD6']) {
    let originalHash = 0;
    for (const c of id) originalHash = (originalHash * 31 + c.charCodeAt(0)) >>> 0;
    assert.equal(getNotebookAppearance(id).key, keys[originalHash % 8]);
  }
  assert.deepEqual(NOTEBOOK_APPEARANCES.map((item) => item.key), keys);
});

test('each cover has a color and appearance depends on ID, not name or shelf', () => {
  for (const appearance of NOTEBOOK_APPEARANCES) assert.match(appearance.coverColor, /^#[0-9A-F]{6}$/);
  const book = { id: 'notebook-123', name: 'Ideas', shelfId: 'one' };
  const appearance = getNotebookAppearance(book.id);
  book.name = 'Renamed'; book.shelfId = 'two';
  assert.deepEqual(getNotebookAppearance(book.id), appearance);
});

test('previews omit the title without prematurely truncating the body', () => {
  assert.equal(getNotebookNotePreview('Title\n\nOne\nTwo'), 'One Two');
  assert.equal(getNotebookNotePreview('Title'), 'Tap to keep writing');
  assert.equal(getNotebookNotePreview('Title\n' + 'x'.repeat(150)).length, 150);
});

test('date labels use local calendar days, including month boundaries', () => {
  const now = new Date(2026, 9, 1, 12);
  assert.equal(formatNotebookNoteDate(new Date(2026, 9, 1, 1).toISOString(), now), 'Today');
  assert.equal(formatNotebookNoteDate(new Date(2026, 8, 30, 23).toISOString(), now), 'Yesterday');
  assert.equal(formatNotebookNoteDate('invalid', now), 'Saved note');
});
