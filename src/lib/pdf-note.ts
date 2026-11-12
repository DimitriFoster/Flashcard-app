import type { PdfAttachment, StudyNote } from '@/types/note';

export const MAX_PDF_BYTES = 25 * 1024 * 1024;

export function isPdfFileName(value: unknown): value is string {
  return typeof value === 'string' && /^pdf-[a-z0-9-]{1,80}\.pdf$/.test(value);
}

export function assertPdfSize(size: number) {
  if (!Number.isSafeInteger(size) || size <= 0) throw new Error('This file is empty or unavailable. Choose another PDF.');
  if (size > MAX_PDF_BYTES) throw new Error('Choose a PDF smaller than 25 MB.');
}

export function pdfDisplayName(name: string) {
  // Control/bidirectional overrides must not disguise the filename in the UI.
  const base = name.split(/[\\/]/).pop()?.replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, '').trim() || 'Document';
  return `${base.replace(/\.pdf$/i, '').slice(0, 170) || 'Document'}.pdf`;
}

export function normalizePdfAttachment(value: unknown): PdfAttachment | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const pdf = value as Partial<PdfAttachment>;
  if (!isPdfFileName(pdf.fileName) || typeof pdf.size !== 'number' ||
      !Number.isSafeInteger(pdf.size) || pdf.size <= 0 || pdf.size > MAX_PDF_BYTES) return undefined;
  return {
    fileName: pdf.fileName,
    originalName: pdfDisplayName(typeof pdf.originalName === 'string' ? pdf.originalName : 'Document.pdf'),
    size: pdf.size,
  };
}

export function pdfNoteSummary(note: StudyNote) {
  const pdf = note.pdf;
  const size = pdf?.size ? (pdf.size < 1024 * 1024 ? `${Math.ceil(pdf.size / 1024)} KB` : `${(pdf.size / (1024 * 1024)).toFixed(1)} MB`) : '';
  return ['PDF attachment', size].filter(Boolean).join(' | ');
}
