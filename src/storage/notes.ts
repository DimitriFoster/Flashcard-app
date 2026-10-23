/**
 * Local note storage helpers.
 *
 * Screens should use these helpers instead of reading/writing MMKV directly.
 * The notes feature is separate from flashcards so the app can support quick,
 * freeform capture without forcing every thought into a card immediately.
 */
import { Platform } from 'react-native';

import { FIRST_SHELF, FIRST_SHELF_ID, moveNotebooksFromShelf, renameShelfInList, restoreNotebookShelves } from '@/lib/notebook-shelves';
import type { Notebook, NotebookShelf, SaveNoteInput, StudyNote } from '@/types/note';

import { storage } from './mmkv';

const NOTES_KEY = 'notes';
const NOTEBOOKS_KEY = 'note-notebooks';
const NOTEBOOK_SHELVES_KEY = 'note-notebook-shelves';

function parseJsonArray<T>(value: string | undefined): T[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function canUseStorage() {
  return Platform.OS !== 'web' || typeof window !== 'undefined';
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createTitle(body: string) {
  const firstMeaningfulLine = body
    .split('\n')
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstMeaningfulLine) {
    return 'Untitled note';
  }

  return firstMeaningfulLine.length > 42
    ? `${firstMeaningfulLine.slice(0, 41)}…`
    : firstMeaningfulLine;
}

function normalizeNote(note: Partial<StudyNote>): StudyNote {
  const now = new Date().toISOString();
  const body = note.body ?? '';

  return {
    id: note.id ?? createId('note'),
    title: note.title?.trim() || createTitle(body),
    body,
    createdAt: note.createdAt ?? now,
    updatedAt: note.updatedAt ?? now,
    notebookId: note.notebookId,
  };
}

function normalizeNotebook(notebook: Partial<Notebook>): Notebook {
  const now = new Date().toISOString();

  return {
    id: notebook.id ?? createId('notebook'),
    name: notebook.name?.trim() || 'Notebook',
    createdAt: notebook.createdAt ?? now,
    updatedAt: notebook.updatedAt ?? now,
    shelfId: notebook.shelfId,
  };
}

function saveNotes(notes: StudyNote[]) {
  storage.set(NOTES_KEY, JSON.stringify(notes));
}

function saveNotebooks(notebooks: Notebook[]) {
  storage.set(NOTEBOOKS_KEY, JSON.stringify(notebooks));
}

function saveNotebookShelves(shelves: NotebookShelf[]) {
  storage.set(NOTEBOOK_SHELVES_KEY, JSON.stringify(shelves));
}

export function getNotebookShelves(): NotebookShelf[] {
  if (!canUseStorage()) {
    return [FIRST_SHELF];
  }

  const stored = parseJsonArray<Partial<NotebookShelf>>(storage.getString(NOTEBOOK_SHELVES_KEY));
  return restoreNotebookShelves(stored);
}

export function renameNotebookShelf(id: string, name: string) {
  if (!canUseStorage()) {
    return undefined;
  }

  const renamed = renameShelfInList(getNotebookShelves(), id, name);
  if (!renamed) {
    return undefined;
  }

  saveNotebookShelves(renamed);
  return renamed.find((shelf) => shelf.id === id);
}

export function createNotebookShelf(name: string) {
  if (!canUseStorage()) {
    return undefined;
  }

  const shelves = getNotebookShelves();
  const shelf: NotebookShelf = {
    id: createId('shelf'),
    name: name.trim() || `Shelf ${shelves.length + 1}`,
    createdAt: new Date().toISOString(),
  };
  saveNotebookShelves([...shelves, shelf]);
  return shelf;
}

export function deleteNotebookShelf(id: string) {
  if (!canUseStorage() || id === FIRST_SHELF_ID) {
    return undefined;
  }

  const shelves = getNotebookShelves();
  if (!shelves.some((shelf) => shelf.id === id)) {
    return undefined;
  }

  const notebooks = moveNotebooksFromShelf(getNotebooks(), id);
  const remainingShelves = shelves.filter((shelf) => shelf.id !== id);
  saveNotebooks(notebooks);
  saveNotebookShelves(remainingShelves);
  return { notebooks, shelves: remainingShelves };
}

export function moveNotebookToShelf(notebookId: string, shelfId: string) {
  if (!canUseStorage() || !getNotebookShelves().some((shelf) => shelf.id === shelfId)) {
    return undefined;
  }

  let movedNotebook: Notebook | undefined;
  const notebooks = getNotebooks().map((notebook) => {
    if (notebook.id !== notebookId) {
      return notebook;
    }
    movedNotebook = { ...notebook, shelfId: shelfId === FIRST_SHELF_ID ? undefined : shelfId };
    return movedNotebook;
  });
  if (movedNotebook) {
    saveNotebooks(notebooks);
  }
  return movedNotebook;
}

export function getNotes() {
  if (!canUseStorage()) {
    return [];
  }

  const rawNotes = parseJsonArray<Partial<StudyNote>>(storage.getString(NOTES_KEY));
  const notes = rawNotes.map(normalizeNote);
  const sortedNotes = [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const needsMigration = rawNotes.some(
    (note, index) =>
      note.id !== notes[index].id ||
      note.title !== notes[index].title ||
      note.body !== notes[index].body ||
      note.createdAt !== notes[index].createdAt ||
      note.updatedAt !== notes[index].updatedAt ||
      note.notebookId !== notes[index].notebookId
  );

  if (needsMigration) {
    saveNotes(sortedNotes);
  }

  return sortedNotes;
}

export function getNotebooks() {
  if (!canUseStorage()) {
    return [];
  }

  const rawNotebooks = parseJsonArray<Partial<Notebook>>(storage.getString(NOTEBOOKS_KEY));
  const notebooks = rawNotebooks.map(normalizeNotebook);
  const knownNotebookIds = new Set(notebooks.map((notebook) => notebook.id));

  /**
   * If notes reference notebook IDs that do not exist yet, recover small
   * placeholder notebooks so grouped notes remain reachable.
   */
  const recoveredNotebooks = getNotes()
    .map((note) => note.notebookId)
    .filter((notebookId): notebookId is string => Boolean(notebookId))
    .filter((notebookId) => !knownNotebookIds.has(notebookId))
    .map((notebookId) =>
      normalizeNotebook({
        id: notebookId,
        name: 'Recovered notebook',
      })
    );

  const nextNotebooks = [...notebooks, ...recoveredNotebooks].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  );

  if (recoveredNotebooks.length > 0 || rawNotebooks.length !== nextNotebooks.length) {
    saveNotebooks(nextNotebooks);
  }

  return nextNotebooks;
}

export function saveNote(input: SaveNoteInput) {
  if (!canUseStorage()) {
    throw new Error('Note storage is only available on the client.');
  }

  const body = input.body;
  const now = new Date().toISOString();
  const notes = getNotes();
  const existingNote = input.id ? notes.find((note) => note.id === input.id) : undefined;
  const nextNote: StudyNote = {
    id: existingNote?.id ?? input.id ?? createId('note'),
    title: createTitle(body),
    body,
    createdAt: existingNote?.createdAt ?? now,
    updatedAt: now,
    notebookId: input.notebookId ?? existingNote?.notebookId,
  };

  const nextNotes = existingNote
    ? notes.map((note) => (note.id === existingNote.id ? nextNote : note))
    : [nextNote, ...notes];

  saveNotes([...nextNotes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));

  return nextNote;
}

export function deleteNote(id: string) {
  if (!canUseStorage()) {
    return false;
  }

  const notes = getNotes();
  const noteToDelete = notes.find((note) => note.id === id);
  const nextNotes = notes.filter((note) => note.id !== id);

  if (!noteToDelete || nextNotes.length === notes.length) {
    return false;
  }

  saveNotes(nextNotes);

  /**
   * Remove empty notebooks so the sidebar does not collect dead groups.
   */
  if (noteToDelete.notebookId) {
    const hasRemainingNotes = nextNotes.some((note) => note.notebookId === noteToDelete.notebookId);

    if (!hasRemainingNotes) {
      saveNotebooks(getNotebooks().filter((notebook) => notebook.id !== noteToDelete.notebookId));
    }
  }

  return true;
}

export function renameNotebook(id: string, name: string) {
  if (!canUseStorage()) {
    return undefined;
  }

  const trimmedName = name.trim() || 'Notebook';
  const now = new Date().toISOString();
  let renamedNotebook: Notebook | undefined;

  const notebooks = getNotebooks().map((notebook) => {
    if (notebook.id !== id) {
      return notebook;
    }

    renamedNotebook = {
      ...notebook,
      name: trimmedName,
      updatedAt: now,
    };

    return renamedNotebook;
  });

  if (renamedNotebook) {
    saveNotebooks(notebooks);
  }

  return renamedNotebook;
}

export function moveNoteOutOfNotebook(noteId: string) {
  if (!canUseStorage()) {
    return undefined;
  }

  const now = new Date().toISOString();
  let movedNote: StudyNote | undefined;

  const nextNotes = getNotes().map((note) => {
    if (note.id !== noteId) {
      return note;
    }

    movedNote = {
      ...note,
      notebookId: undefined,
      updatedAt: now,
    };

    return movedNote;
  });

  if (!movedNote) {
    return undefined;
  }

  const remainingNotebookIds = new Set(
    nextNotes
      .map((note) => note.notebookId)
      .filter((notebookId): notebookId is string => Boolean(notebookId))
  );

  const nextNotebooks = getNotebooks().filter((notebook) => remainingNotebookIds.has(notebook.id));

  saveNotes(nextNotes.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
  saveNotebooks(nextNotebooks.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));

  return {
    notes: getNotes(),
    notebooks: getNotebooks(),
    note: movedNote,
  };
}

export function deleteNotebook(id: string) {
  if (!canUseStorage()) {
    return undefined;
  }

  const notebooks = getNotebooks();
  const notebookToDelete = notebooks.find((notebook) => notebook.id === id);

  if (!notebookToDelete) {
    return undefined;
  }

  const now = new Date().toISOString();
  const nextNotes = getNotes().map((note) =>
    note.notebookId === id
      ? {
          ...note,
          notebookId: undefined,
          updatedAt: now,
        }
      : note
  );
  const nextNotebooks = notebooks.filter((notebook) => notebook.id !== id);

  saveNotes(nextNotes.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
  saveNotebooks(nextNotebooks.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));

  return {
    notebook: notebookToDelete,
    notes: getNotes(),
    notebooks: getNotebooks(),
  };
}

export function moveNoteToNotebook(noteId: string, notebookId: string) {
  if (!canUseStorage()) {
    return undefined;
  }

  const now = new Date().toISOString();
  const notebooks = getNotebooks();
  const targetNotebook = notebooks.find((notebook) => notebook.id === notebookId);

  if (!targetNotebook) {
    return undefined;
  }

  let movedNote: StudyNote | undefined;

  const nextNotes = getNotes().map((note) => {
    if (note.id !== noteId) {
      return note;
    }

    movedNote = {
      ...note,
      notebookId,
      updatedAt: now,
    };

    return movedNote;
  });

  if (!movedNote) {
    return undefined;
  }

  const nextNotebooks = notebooks.map((notebook) =>
    notebook.id === notebookId ? { ...notebook, updatedAt: now } : notebook
  );

  saveNotes(nextNotes.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
  saveNotebooks(nextNotebooks.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));

  return {
    notes: getNotes(),
    notebooks: getNotebooks(),
    note: movedNote,
  };
}

export function createNotebook(name: string, shelfId = FIRST_SHELF_ID) {
  if (!canUseStorage()) {
    return undefined;
  }

  if (!getNotebookShelves().some((shelf) => shelf.id === shelfId)) {
    return undefined;
  }

  const now = new Date().toISOString();
  const notebook: Notebook = {
    id: createId('notebook'),
    name: name.trim() || 'Notebook',
    createdAt: now,
    updatedAt: now,
    shelfId: shelfId === FIRST_SHELF_ID ? undefined : shelfId,
  };

  saveNotebooks([notebook, ...getNotebooks()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));

  return notebook;
}
