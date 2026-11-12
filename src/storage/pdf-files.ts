import { requireOptionalNativeModule } from 'expo';
import { Platform } from 'react-native';

import { isPdfFileName, normalizePdfAttachment } from '@/lib/pdf-note';
import type { PdfAttachment } from '@/types/note';

type PdfFilesModule = {
  pickPdfAsync: () => Promise<{ fileName: string; size: number; originalName: string } | null>;
  openPdfAsync: (name: string, displayName: string, choose: boolean) => Promise<'opened' | 'no_reader'>;
  deletePdfAsync: (name: string) => Promise<void>;
};

const nativeFiles = Platform.OS === 'android' ? requireOptionalNativeModule<PdfFilesModule>('FolioPdfFiles') : null;

export function pdfAvailabilityMessage() {
  if (Platform.OS !== 'android') return 'PDF attachments are available in the Android app for now.';
  if (!nativeFiles || typeof nativeFiles.pickPdfAsync !== 'function') return 'Install the updated Folio APK to use PDF attachments. Your existing notes are unchanged.';
  return undefined;
}

function requireFiles() {
  const message = pdfAvailabilityMessage();
  if (!nativeFiles || message) throw new Error(message);
  return nativeFiles;
}

function fileError(error: unknown): Error {
  const code = error && typeof error === 'object' && 'code' in error ? error.code : undefined;
  const messages: Record<string, string> = {
    PDF_TOO_LARGE: 'Choose a PDF smaller than 25 MB.',
    PDF_INVALID: 'This file does not look like a PDF. Choose another file.',
    PDF_MISSING: 'The PDF file is no longer on this device. Import the original again.',
    PDF_UNAVAILABLE: 'Could not access this PDF. Check available storage and try again.',
    PDF_DELETE_FAILED: 'The PDF copy could not be deleted from this device.',
    PDF_BUSY: 'A PDF import is already open. Finish it before choosing another file.',
  };
  // Never display raw native errors, file paths, or provider details.
  return new Error(typeof code === 'string' && messages[code] ? messages[code] : 'Could not access this PDF. Please try again.');
}

export async function pickPdfFile(): Promise<PdfAttachment | undefined> {
  const files = requireFiles();
  try {
    const copied = await files.pickPdfAsync();
    if (!copied) return undefined;
    const attachment = normalizePdfAttachment(copied);
    if (!attachment) {
      if (isPdfFileName(copied.fileName)) await files.deletePdfAsync(copied.fileName);
      throw new Error('Invalid file metadata');
    }
    return attachment;
  } catch (error) {
    throw fileError(error);
  }
}

export async function openPdfFile(attachment: PdfAttachment, choose: boolean) {
  const files = requireFiles();
  const pdf = normalizePdfAttachment(attachment);
  if (!pdf) throw new Error('This PDF attachment is unavailable. Import the original again.');
  try {
    return await files.openPdfAsync(pdf.fileName, pdf.originalName, choose);
  } catch (error) {
    throw fileError(error);
  }
}

export async function removePdfFile(fileName: string) {
  const files = requireFiles();
  if (!isPdfFileName(fileName)) throw new Error('Invalid PDF attachment.');
  try {
    await files.deletePdfAsync(fileName);
  } catch (error) {
    throw fileError(error);
  }
}
