import { createPdfNote, deleteNote, getNotes } from '@/storage/notes';
import { openPdfFile, pdfAvailabilityMessage, pickPdfFile, removePdfFile } from '@/storage/pdf-files';
import type { PdfAttachment, StudyNote } from '@/types/note';

let importing = false;

async function rollbackPdf(attachment: PdfAttachment) {
  try {
    await removePdfFile(attachment.fileName);
  } catch {
    throw new Error('The note was not saved, and its unused local PDF copy could not be removed. Please report this to us.');
  }
}

export async function importPdfNote(notebookId?: string): Promise<StudyNote | undefined> {
  const unavailable = pdfAvailabilityMessage();
  if (unavailable) throw new Error(unavailable);
  if (importing) return undefined;
  importing = true;
  try {
    // Native picking and bounded copy finish in a short-lived activity. Only
    // app-owned metadata crosses this bridge; source grants are not forwarded.
    const attachment = await pickPdfFile();
    if (!attachment) return undefined;
    try {
      return createPdfNote(attachment, notebookId);
    } catch {
      await rollbackPdf(attachment);
      throw new Error('Could not save the PDF note. Try again in an available notebook or Loose notes.');
    }
  } finally {
    importing = false;
  }
}

export async function openPdfNote(id: string, choose = false) {
  const note = getNotes().find((item) => item.id === id);
  if (note?.kind !== 'pdf' || !note.pdf) throw new Error('This PDF attachment is unavailable. Import the original again.');
  return openPdfFile(note.pdf, choose);
}

export async function deleteNoteWithAttachment(id: string) {
  const note = getNotes().find((item) => item.id === id);
  const deleted = deleteNote(id);
  let cleanupFailed = false;
  if (deleted && note?.kind === 'pdf' && note.pdf) {
    try {
      await removePdfFile(note.pdf.fileName);
    } catch {
      cleanupFailed = true;
    }
  }
  return { deleted, cleanupFailed };
}
