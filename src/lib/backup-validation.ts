import type { Deck, Flashcard, ReviewLog } from '@/types/flashcard';
import type { Notebook, StudyNote } from '@/types/note';
import { assertImportText, MAX_IMPORT_CARDS, MAX_IMPORT_FIELD } from './import-policy';
import { normalizeRichNote } from './rich-note';

type RecordValue = Record<string, unknown>;
const states = ['new', 'learning', 'review', 'relearning', 'suspended'];
const fail = (): never => { throw new Error('This backup has invalid or unsupported data. Nothing was imported.'); };
function record(value: unknown): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fail();
  return value as RecordValue;
}
function text(value: unknown, max = 200, allowEmpty = false): string {
  if (typeof value !== 'string' || value.length > max || (!allowEmpty && !value.trim()) || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value)) return fail();
  return value;
}
function id(value: unknown) {
  const result = text(value, 200);
  if (!/^[a-zA-Z0-9_-]+$/.test(result) || ['__proto__', 'constructor', 'prototype'].includes(result)) return fail();
  return result;
}
function date(value: unknown): string {
  const result = text(value, 40);
  if (!/^\d{4}-\d\d-\d\dT/.test(result) || !Number.isFinite(Date.parse(result))) return fail();
  return result;
}
function list(value: unknown, max: number): unknown[] {
  if (!Array.isArray(value) || value.length > max) return fail();
  return value;
}
function optionalFields(row: RecordValue, numbers: string[], dates: string[], enums: string[]) {
  const result: RecordValue = {};
  for (const key of numbers) {
    if (row[key] === undefined) continue;
    const value = row[key];
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1e7) return fail();
    if (['learningStepIndex', 'repetitions', 'lapses'].includes(key) && !Number.isInteger(value)) return fail();
    result[key] = value;
  }
  for (const key of dates) if (row[key] !== undefined) result[key] = date(row[key]);
  for (const key of enums) {
    if (row[key] === undefined) continue;
    if (!states.includes(row[key] as string)) return fail();
    result[key] = row[key];
  }
  return result;
}
function uniqueIds(items: { id: string }[]) {
  const ids = new Set(items.map((item) => item.id));
  if (ids.size !== items.length) fail();
  return ids;
}

export function validateAppBackup(rawText: string) {
  assertImportText(rawText);
  let parsed: unknown;
  try { parsed = JSON.parse(rawText.replace(/^\uFEFF/, '')); } catch { return fail(); }
  const source = record(parsed);
  if (source.version !== 1) return fail();
  const decks: Deck[] = list(source.decks, 200).map((item) => {
    const row = record(item);
    return { id: id(row.id), name: text(row.name), createdAt: date(row.createdAt), updatedAt: date(row.updatedAt) };
  });
  const deckIds = uniqueIds(decks);
  const flashcards: Flashcard[] = list(source.flashcards, MAX_IMPORT_CARDS).map((item) => {
    const row = record(item);
    const deckId = id(row.deckId);
    if (!deckIds.has(deckId)) return fail();
    return {
      id: id(row.id), deckId, front: text(row.front, MAX_IMPORT_FIELD, true), back: text(row.back, MAX_IMPORT_FIELD, true),
      createdAt: date(row.createdAt), updatedAt: date(row.updatedAt),
      ...optionalFields(row, ['learningStepIndex', 'intervalDays', 'easeFactor', 'repetitions', 'lapses'], ['dueAt', 'lastReviewedAt', 'lastStruggledAt'], ['state']),
    };
  });
  uniqueIds(flashcards);
  const reviewLogs: ReviewLog[] = list(source.reviewLogs ?? [], 20000).map((item) => {
    const row = record(item);
    if (!['again', 'hard', 'good', 'easy'].includes(row.grade as string)) return fail();
    return {
      id: id(row.id), cardId: id(row.cardId), deckId: id(row.deckId), grade: row.grade as ReviewLog['grade'], reviewedAt: date(row.reviewedAt),
      ...optionalFields(row, ['previousIntervalDays', 'nextIntervalDays', 'previousEaseFactor', 'nextEaseFactor'], ['previousDueAt', 'nextDueAt'], ['previousState', 'nextState']),
    };
  });
  uniqueIds(reviewLogs);
  const notebooks: Notebook[] = list(source.notebooks ?? [], 1000).map((item) => {
    const row = record(item);
    return { id: id(row.id), name: text(row.name), createdAt: date(row.createdAt), updatedAt: date(row.updatedAt) };
  });
  const notebookIds = uniqueIds(notebooks);
  const notes: StudyNote[] = list(source.notes ?? [], 5000).map((item) => {
    const row = record(item);
    if (row.kind === 'pdf' || row.pdf !== undefined) throw new Error('This backup contains PDF attachments, but not their files. Restore a text-only backup and import PDFs separately.');
    if (row.kind !== undefined && row.kind !== 'text') return fail();
    const body = text(row.body, 256 * 1024, true);
    const notebookId = row.notebookId === undefined ? undefined : id(row.notebookId);
    if (notebookId && !notebookIds.has(notebookId)) return fail();
    const richText = normalizeRichNote(row.richText, body);
    if (row.richText !== undefined && !richText) return fail();
    return { id: id(row.id), title: text(row.title, 200), body, notebookId, richText, createdAt: date(row.createdAt), updatedAt: date(row.updatedAt) };
  });
  uniqueIds(notes);
  return { decks, flashcards, reviewLogs, notes, notebooks };
}
