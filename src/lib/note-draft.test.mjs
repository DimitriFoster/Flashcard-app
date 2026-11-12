import assert from 'node:assert/strict';
import test from 'node:test';

import { createEditorSaveInput, filterPickerNotebooks, getNotebookPickerHeight, isNoteDraftDirty, resolveSavedNotebookId } from './note-draft.ts';

const note = { id: 'note-1', body: 'Remember this', notebookId: 'ideas' };

test('unchanged note is clean; notebook-only and text-only edits are dirty', () => {
  assert.equal(isNoteDraftDirty(note, note.body, 'ideas'), false);
  assert.equal(isNoteDraftDirty(note, note.body, 'study'), true);
  assert.equal(isNoteDraftDirty(note, note.body, undefined), true);
  assert.equal(isNoteDraftDirty(note, 'New thought', 'ideas'), true);
});
test('empty new notes are not saved just because a notebook was chosen', () => {
  assert.equal(isNoteDraftDirty(undefined, '  ', 'ideas'), false);
  assert.equal(isNoteDraftDirty(undefined, 'New thought', 'ideas'), true);
});
test('autosave omits membership even when a different destination is pending', () => {
  const input = createEditorSaveInput({ id: note.id, body: 'Edited', notebookId: 'study', commitDestination: false });
  assert.equal(Object.hasOwn(input, 'notebookId'), false);
  assert.equal(resolveSavedNotebookId(input, note), 'ideas');
});
test('Save commits a chosen notebook', () => {
  const input = createEditorSaveInput({ id: note.id, body: note.body, notebookId: 'study', commitDestination: true });
  assert.equal(resolveSavedNotebookId(input, note), 'study');
});
test('Save to Loose notes explicitly clears rather than retaining membership', () => {
  const input = createEditorSaveInput({ id: note.id, body: note.body, commitDestination: true });
  assert.equal(input.notebookId, null);
  assert.equal(resolveSavedNotebookId(input, note), undefined);
});
test('omitted notebook keeps legacy caller behavior', () => {
  assert.equal(resolveSavedNotebookId({ body: note.body }, note), 'ideas');
  assert.equal(resolveSavedNotebookId({ body: note.body }), undefined);
});
test('new note saves with its intended destination', () => {
  assert.equal(createEditorSaveInput({ body: 'New', notebookId: 'study', commitDestination: true }).notebookId, 'study');
  assert.equal(createEditorSaveInput({ body: 'New', commitDestination: true }).notebookId, null);
});
test('search trims query and matches names without mutating order/data', () => {
  const notebooks = [{ id: 'a', name: 'Garden Ideas' }, { id: 'b', name: 'Study notes' }];
  assert.deepEqual(filterPickerNotebooks(notebooks, '  IDEAS  '), [notebooks[0]]);
  assert.deepEqual(filterPickerNotebooks(notebooks, ''), notebooks);
  assert.deepEqual(filterPickerNotebooks(notebooks, 'missing'), []);
  assert.equal(notebooks.length, 2);
});
test('menu fits the actual remaining viewport, including short keyboard layouts', () => {
  assert.equal(getNotebookPickerHeight(700), 424);
  assert.equal(getNotebookPickerHeight(250), 194);
  assert.equal(getNotebookPickerHeight(30), 0);
});
