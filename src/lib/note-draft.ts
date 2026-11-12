import type { Notebook, RichNoteText, SaveNoteInput, StudyNote } from '@/types/note';

export function isNoteDraftDirty(note: StudyNote | undefined, body: string, notebookId?: string, richText?: RichNoteText) {
  return note
    ? note.body !== body || note.notebookId !== notebookId || (richText !== undefined && note.richText?.html !== richText.html)
    : body.trim().length > 0;
}

export function createEditorSaveInput({
  id, body, notebookId, commitDestination, richText,
}: {
  id?: string;
  body: string;
  notebookId?: string;
  commitDestination: boolean;
  richText?: RichNoteText | null;
}): SaveNoteInput {
  // Autosave persists text only. A destination choice is committed by Save.
  return {
    id,
    body,
    ...(richText !== undefined ? { richText } : {}),
    ...(commitDestination || !id ? { notebookId: notebookId ?? null } : {}),
  };
}

export function resolveSavedNotebookId(input: SaveNoteInput, existingNote?: StudyNote) {
  return input.notebookId === null ? undefined : input.notebookId ?? existingNote?.notebookId;
}

export function filterPickerNotebooks(notebooks: Notebook[], query: string) {
  const search = query.trim().toLocaleLowerCase();
  return notebooks.filter((notebook) => notebook.name.toLocaleLowerCase().includes(search));
}

export function getNotebookPickerHeight(availableHeight: number) {
  return Math.max(0, Math.min(424, availableHeight - 56));
}
