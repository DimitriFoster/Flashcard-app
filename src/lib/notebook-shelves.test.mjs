import assert from 'node:assert/strict';
import test from 'node:test';

import {
  FIRST_SHELF,
  groupNotebooksByShelf,
  moveNotebooksFromShelf,
  renameShelfInList,
  restoreNotebookShelves,
} from './notebook-shelves.ts';

const IDEAS = { id: 'ideas', name: 'Ideas', createdAt: '2026-01-01T00:00:00.000Z' };
const WRITING = { id: 'writing', name: 'Writing', createdAt: '2026-01-02T00:00:00.000Z' };
const NOTEBOOKS = [
  { id: 'legacy', name: 'Old notebook', createdAt: '', updatedAt: '' },
  { id: 'assigned', name: 'Garden ideas', createdAt: '', updatedAt: '', shelfId: 'ideas' },
  { id: 'orphan', name: 'Still reachable', createdAt: '', updatedAt: '', shelfId: 'removed' },
];

test('legacy and orphaned notebooks remain visible on the first shelf', () => {
  const groups = groupNotebooksByShelf([FIRST_SHELF, IDEAS], NOTEBOOKS);
  assert.deepEqual(groups[0].notebooks.map((book) => book.id), ['legacy', 'orphan']);
  assert.deepEqual(groups[1].notebooks.map((book) => book.id), ['assigned']);
});

test('each notebook belongs to exactly one shelf', () => {
  const groups = groupNotebooksByShelf([FIRST_SHELF, IDEAS, WRITING], NOTEBOOKS);
  assert.equal(groups.flatMap((group) => group.notebooks).length, NOTEBOOKS.length);
  assert.equal(new Set(groups.flatMap((group) => group.notebooks.map((book) => book.id))).size, NOTEBOOKS.length);
});

test('deleting an added shelf returns its notebooks to the first shelf', () => {
  const moved = moveNotebooksFromShelf(NOTEBOOKS, IDEAS.id);
  const groups = groupNotebooksByShelf([FIRST_SHELF, WRITING], moved);
  assert.deepEqual(groups[0].notebooks.map((book) => book.id), ['legacy', 'assigned', 'orphan']);
  assert.deepEqual(moved.map((book) => book.name), NOTEBOOKS.map((book) => book.name));
  assert.deepEqual(NOTEBOOKS[1].shelfId, IDEAS.id);
});

test('stored first-shelf titles survive reload without losing older shelves', () => {
  const restored = restoreNotebookShelves([{ ...FIRST_SHELF, name: 'Favorites' }, IDEAS]);
  assert.deepEqual(restored.map((shelf) => shelf.name), ['Favorites', 'Ideas']);
  assert.deepEqual(restoreNotebookShelves([IDEAS]).map((shelf) => shelf.name), ['Shelf 1', 'Ideas']);
});

test('renaming a shelf changes only its title and rejects blank names', () => {
  const shelves = [FIRST_SHELF, IDEAS];
  const renamed = renameShelfInList(shelves, FIRST_SHELF.id, '  Keepsakes  ');
  assert.equal(renamed?.[0].name, 'Keepsakes');
  assert.deepEqual(renamed?.[1], IDEAS);
  assert.equal(renameShelfInList(shelves, IDEAS.id, '   '), undefined);
  assert.equal(renameShelfInList(shelves, 'missing', 'Name'), undefined);
  assert.equal(FIRST_SHELF.name, 'Shelf 1');
});
