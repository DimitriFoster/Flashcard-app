/**
 * Shared note types.
 *
 * Notes are intentionally separate from flashcards/decks. They are quick,
 * freeform writing surfaces for capturing thoughts that may later become cards.
 */
export type PdfAttachment = {
  /** App-owned basename, not an absolute path that can change after an update. */
  fileName: string;
  originalName: string;
  size: number;
};

export type RichNoteText = { version: 1; html: string };

export type StudyNote = {
  id: string;
  title: string;
  body: string;
  richText?: RichNoteText;
  createdAt: string;
  updatedAt: string;
  notebookId?: string;
  /** Older notes without a kind remain text notes. */
  kind?: 'text' | 'pdf';
  pdf?: PdfAttachment;
};

export type Notebook = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  shelfId?: string;
};

export type NotebookShelf = {
  id: string;
  name: string;
  createdAt: string;
};

export type SaveNoteInput = {
  id?: string;
  body: string;
  /** Omit to preserve unchanged formatting; null explicitly removes formatting. */
  richText?: RichNoteText | null;
  /** Omit to preserve membership; null explicitly saves to Loose notes. */
  notebookId?: string | null;
};
