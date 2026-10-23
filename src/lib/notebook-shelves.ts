import type { Notebook, NotebookShelf } from '@/types/note';

export const FIRST_SHELF_ID = 'first-shelf';

export const FIRST_SHELF: NotebookShelf = {
  id: FIRST_SHELF_ID,
  name: 'Shelf 1',
  createdAt: '1970-01-01T00:00:00.000Z',
};

export function restoreNotebookShelves(stored: Partial<NotebookShelf>[]): NotebookShelf[] {
  const firstName = stored.find((shelf) =>
    shelf.id === FIRST_SHELF_ID && typeof shelf.name === 'string' && Boolean(shelf.name.trim())
  )?.name?.trim();
  const firstShelf = firstName
    ? { ...FIRST_SHELF, name: firstName }
    : FIRST_SHELF;
  const seen = new Set([FIRST_SHELF_ID]);
  const extraShelves = stored.filter((shelf): shelf is NotebookShelf => {
    if (typeof shelf.id !== 'string' || !shelf.id || seen.has(shelf.id) ||
        typeof shelf.name !== 'string' || !shelf.name.trim() ||
        typeof shelf.createdAt !== 'string') {
      return false;
    }
    seen.add(shelf.id);
    return true;
  });

  return [firstShelf, ...extraShelves];
}

export function renameShelfInList(shelves: NotebookShelf[], id: string, name: string) {
  const trimmedName = name.trim();
  if (!trimmedName || !shelves.some((shelf) => shelf.id === id)) {
    return undefined;
  }

  return shelves.map((shelf) => shelf.id === id ? { ...shelf, name: trimmedName } : shelf);
}

export function groupNotebooksByShelf(shelves: NotebookShelf[], notebooks: Notebook[]) {
  const shelfIds = new Set(shelves.map((shelf) => shelf.id));

  return shelves.map((shelf) => ({
    shelf,
    notebooks: notebooks.filter((notebook) => {
      const assignedId = notebook.shelfId && shelfIds.has(notebook.shelfId)
        ? notebook.shelfId
        : FIRST_SHELF_ID;
      return assignedId === shelf.id;
    }),
  }));
}

export function moveNotebooksFromShelf(notebooks: Notebook[], shelfId: string) {
  return notebooks.map((notebook) =>
    notebook.shelfId === shelfId ? { ...notebook, shelfId: undefined } : notebook
  );
}
