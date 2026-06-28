/**
 * Shared note types.
 *
 * Notes are intentionally separate from flashcards/decks. They are quick,
 * freeform writing surfaces for capturing thoughts that may later become cards.
 */
export type StudyNote = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  notebookId?: string;
};

export type Notebook = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type SaveNoteInput = {
  id?: string;
  body: string;
  notebookId?: string;
};
