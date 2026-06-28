/**
 * Local note storage helpers.
 *
 * Screens should use these helpers instead of reading/writing MMKV directly.
 * The notes feature is separate from flashcards so the app can support quick,
 * freeform capture without forcing every thought into a card immediately.
 */
import { Platform } from 'react-native';

import type { Notebook, SaveNoteInput, StudyNote } from '@/types/note';

import { storage } from './mmkv';

const NOTES_KEY = 'notes';
const NOTEBOOKS_KEY = 'note-notebooks';

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
  };
}

function saveNotes(notes: StudyNote[]) {
  storage.set(NOTES_KEY, JSON.stringify(notes));
}

function saveNotebooks(notebooks: Notebook[]) {
  storage.set(NOTEBOOKS_KEY, JSON.stringify(notebooks));
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

/**
 * Group notes by dropping one note onto another note.
 *
 * Rules:
 * - If neither note is in a notebook, create a new notebook containing both.
 * - If one note is already in a notebook, move the other into that notebook.
 * - If both notes are in different notebooks, merge the source notebook into the target notebook.
 */
export function groupNotesIntoNotebook(sourceNoteId: string, targetNoteId: string) {
  if (!canUseStorage() || sourceNoteId === targetNoteId) {
    return undefined;
  }

  const notes = getNotes();
  const notebooks = getNotebooks();
  const sourceNote = notes.find((note) => note.id === sourceNoteId);
  const targetNote = notes.find((note) => note.id === targetNoteId);

  if (!sourceNote || !targetNote) {
    return undefined;
  }

  const now = new Date().toISOString();
  const targetNotebook = targetNote.notebookId
    ? notebooks.find((notebook) => notebook.id === targetNote.notebookId)
    : undefined;

  /**
   * Important drag rule:
   * If a note is dragged out of a notebook onto a loose note, create a new
   * notebook for just those two notes. Do not pull the target note back into the
   * source note's old notebook.
   */
  const notebookId = targetNotebook?.id ?? createId('notebook');
  const notebookName = targetNotebook?.name ?? 'Notebook';
  const notebookCreatedAt = targetNotebook?.createdAt ?? now;

  const nextNotes = notes.map((note) => {
    const shouldMove = note.id === sourceNoteId || note.id === targetNoteId;

    return shouldMove
      ? {
          ...note,
          notebookId,
          updatedAt: now,
        }
      : note;
  });

  const nextNotebook: Notebook = {
    id: notebookId,
    name: notebookName,
    createdAt: notebookCreatedAt,
    updatedAt: now,
  };

  const occupiedNotebookIds = new Set(
    nextNotes
      .map((note) => note.notebookId)
      .filter((id): id is string => Boolean(id))
  );

  const nextNotebooks = [
    nextNotebook,
    ...notebooks.filter((notebook) => notebook.id !== notebookId && occupiedNotebookIds.has(notebook.id)),
  ];

  saveNotes(nextNotes.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
  saveNotebooks(nextNotebooks.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));

  return {
    notes: getNotes(),
    notebooks: getNotebooks(),
    notebook: nextNotebook,
  };
}
