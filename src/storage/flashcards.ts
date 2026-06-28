/**
 * Flashcard and deck storage helpers.
 *
 * This file is the app's local data access layer. Screens should call these
 * functions instead of reading/writing MMKV directly.
 */
import { Platform } from 'react-native';

import { calculateNextReviewState, getCardState } from '@/lib/review-scheduling';
import type {
  Deck,
  Flashcard,
  NewDeck,
  NewFlashcard,
  ReviewGrade,
  ReviewLog,
} from '@/types/flashcard';
import type { ParsedImportCard } from '@/lib/import-parser';

import { storage } from './mmkv';

const FLASHCARDS_KEY = 'flashcards';
const DECKS_KEY = 'decks';
const REVIEW_LOGS_KEY = 'review-logs';
const LAST_REVIEW_UNDO_KEY = 'last-review-undo';
const NOTES_KEY = 'notes';
const NOTEBOOKS_KEY = 'note-notebooks';

/** Stable fallback deck used when the app starts with no saved decks. */
export const DEFAULT_DECK_ID = 'default-deck';

type LastReviewUndo = {
  card: Flashcard;
  logId: string;
};

/**
 * Safely parse an array from storage.
 * If storage has invalid JSON or the wrong shape, return an empty array instead
 * of crashing the app.
 */
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

function parseJsonObject<T>(value: string | undefined): T | undefined {
  if (!value) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? (parsed as T) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Protects against storage reads during web/static rendering.
 * On native, MMKV is available. On web, window must exist first.
 */
function canUseStorage() {
  return Platform.OS !== 'web' || typeof window !== 'undefined';
}

/**
 * Simple local ID generator.
 * Good enough for offline local data; replace with UUIDs if sync is added later.
 */
function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createDefaultDeck(): Deck {
  const now = new Date().toISOString();

  return {
    id: DEFAULT_DECK_ID,
    name: 'Main Deck',
    createdAt: now,
    updatedAt: now,
  };
}

function saveFlashcards(flashcards: Flashcard[]) {
  storage.set(FLASHCARDS_KEY, JSON.stringify(flashcards));
}

function saveDecks(decks: Deck[]) {
  storage.set(DECKS_KEY, JSON.stringify(decks));
}

function saveReviewLogs(logs: ReviewLog[]) {
  storage.set(REVIEW_LOGS_KEY, JSON.stringify(logs));
}

function saveLastReviewUndo(value: LastReviewUndo) {
  storage.set(LAST_REVIEW_UNDO_KEY, JSON.stringify(value));
}

function clearLastReviewUndo() {
  storage.remove(LAST_REVIEW_UNDO_KEY);
}

/**
 * Normalize cards loaded from storage.
 * This doubles as a lightweight migration layer if older cards are missing fields.
 */
function normalizeFlashcard(card: Partial<Flashcard>): Flashcard {
  const now = new Date().toISOString();
  const dueAt = card.dueAt;
  const state = card.state ?? (dueAt ? 'review' : 'new');

  return {
    id: card.id ?? createId('card'),
    deckId: card.deckId ?? DEFAULT_DECK_ID,
    front: card.front ?? '',
    back: card.back ?? '',
    createdAt: card.createdAt ?? now,
    updatedAt: card.updatedAt ?? now,

    state,
    learningStepIndex: card.learningStepIndex ?? 0,
    dueAt,
    intervalDays: card.intervalDays ?? 0,
    easeFactor: card.easeFactor ?? 2.5,
    repetitions: card.repetitions ?? 0,
    lapses: card.lapses ?? 0,
    lastReviewedAt: card.lastReviewedAt,
    lastStruggledAt: card.lastStruggledAt,
  };
}

/** Normalize decks loaded from storage or recovered from card deck IDs. */
function normalizeDeck(deck: Partial<Deck>): Deck {
  const now = new Date().toISOString();

  return {
    id: deck.id ?? createId('deck'),
    name: deck.name?.trim() || 'Untitled Deck',
    createdAt: deck.createdAt ?? now,
    updatedAt: deck.updatedAt ?? now,
  };
}

function createReviewLog(previousCard: Flashcard, nextCard: Flashcard, grade: ReviewGrade): ReviewLog {
  return {
    id: createId('review-log'),
    cardId: previousCard.id,
    deckId: previousCard.deckId,
    grade,
    reviewedAt: nextCard.lastReviewedAt ?? new Date().toISOString(),

    previousState: getCardState(previousCard),
    nextState: getCardState(nextCard),

    previousDueAt: previousCard.dueAt,
    nextDueAt: nextCard.dueAt,

    previousIntervalDays: previousCard.intervalDays,
    nextIntervalDays: nextCard.intervalDays,

    previousEaseFactor: previousCard.easeFactor,
    nextEaseFactor: nextCard.easeFactor,
  };
}

export function getDecks() {
  if (!canUseStorage()) {
    return [];
  }

  const flashcards = getFlashcards();
  const savedDecks = parseJsonArray<Deck>(storage.getString(DECKS_KEY)).map(normalizeDeck);
  const decks = savedDecks.length > 0 ? savedDecks : [createDefaultDeck()];

  /**
   * If flashcards reference decks that do not exist anymore, recover placeholder
   * decks so those cards remain reachable instead of becoming orphaned data.
   */
  const knownDeckIds = new Set(decks.map((deck) => deck.id));
  const missingDeckIds = new Set(
    flashcards.map((flashcard) => flashcard.deckId).filter((deckId) => !knownDeckIds.has(deckId))
  );

  const nextDecks = [
    ...decks,
    ...Array.from(missingDeckIds).map((deckId) =>
      normalizeDeck({
        id: deckId,
        name: deckId === DEFAULT_DECK_ID ? 'Main Deck' : 'Recovered Deck',
      })
    ),
  ];

  if (nextDecks.length !== savedDecks.length) {
    saveDecks(nextDecks);
  }

  return nextDecks;
}

export function addDeck(input: NewDeck) {
  if (!canUseStorage()) {
    throw new Error('Deck storage is only available on the client.');
  }

  const now = new Date().toISOString();
  const deck: Deck = {
    id: createId('deck'),
    name: input.name.trim(),
    createdAt: now,
    updatedAt: now,
  };

  const decks = [deck, ...getDecks()];
  saveDecks(decks);

  return deck;
}

export function getFlashcards() {
  if (!canUseStorage()) {
    return [];
  }

  const rawCards = parseJsonArray<Partial<Flashcard>>(storage.getString(FLASHCARDS_KEY));
  const flashcards = rawCards.map(normalizeFlashcard);

  /** If normalization filled missing SRS values, write the migrated data back. */
  const needsMigration = rawCards.some((card, index) => {
    const normalized = flashcards[index];

    return (
      card.deckId !== normalized.deckId ||
      card.state !== normalized.state ||
      card.learningStepIndex !== normalized.learningStepIndex ||
      card.intervalDays !== normalized.intervalDays ||
      card.easeFactor !== normalized.easeFactor ||
      card.repetitions !== normalized.repetitions ||
      card.lapses !== normalized.lapses
    );
  });

  if (needsMigration) {
    saveFlashcards(flashcards);
  }

  return flashcards;
}

export function getFlashcardsByDeck(deckId: string) {
  return getFlashcards().filter((flashcard) => flashcard.deckId === deckId);
}

export function addFlashcard(input: NewFlashcard) {
  if (!canUseStorage()) {
    throw new Error('Flashcard storage is only available on the client.');
  }

  const now = new Date().toISOString();
  const flashcard: Flashcard = {
    id: createId('card'),
    deckId: input.deckId,
    front: input.front,
    back: input.back,
    createdAt: now,
    updatedAt: now,

    state: 'new',
    learningStepIndex: 0,
    intervalDays: 0,
    easeFactor: 2.5,
    repetitions: 0,
    lapses: 0,
  };

  const flashcards = [flashcard, ...getFlashcards()];
  saveFlashcards(flashcards);

  return flashcard;
}

export function updateFlashcard(id: string, input: Partial<NewFlashcard>) {
  if (!canUseStorage()) {
    return undefined;
  }

  const now = new Date().toISOString();
  let updatedFlashcard: Flashcard | undefined;

  const flashcards = getFlashcards().map((flashcard) => {
    if (flashcard.id !== id) {
      return flashcard;
    }

    updatedFlashcard = {
      ...flashcard,
      ...input,
      updatedAt: now,
    };

    return updatedFlashcard;
  });

  if (updatedFlashcard) {
    saveFlashcards(flashcards);
  }

  return updatedFlashcard;
}

export function getReviewLogs() {
  if (!canUseStorage()) {
    return [];
  }

  return parseJsonArray<ReviewLog>(storage.getString(REVIEW_LOGS_KEY));
}

export function getLastReviewUndo() {
  if (!canUseStorage()) {
    return undefined;
  }

  return parseJsonObject<LastReviewUndo>(storage.getString(LAST_REVIEW_UNDO_KEY));
}

export function reviewFlashcard(id: string, grade: ReviewGrade) {
  if (!canUseStorage()) {
    return undefined;
  }

  const now = new Date().toISOString();
  let reviewedFlashcard: Flashcard | undefined;
  let previousFlashcard: Flashcard | undefined;

  const flashcards = getFlashcards().map((flashcard) => {
    if (flashcard.id !== id) {
      return flashcard;
    }

    previousFlashcard = flashcard;
    reviewedFlashcard = {
      ...flashcard,
      ...calculateNextReviewState(flashcard, grade),
      updatedAt: now,
    };

    return reviewedFlashcard;
  });

  if (reviewedFlashcard && previousFlashcard) {
    const log = createReviewLog(previousFlashcard, reviewedFlashcard, grade);
    const logs = [log, ...getReviewLogs()];

    saveFlashcards(flashcards);
    saveReviewLogs(logs);
    saveLastReviewUndo({
      card: previousFlashcard,
      logId: log.id,
    });
  }

  return reviewedFlashcard;
}

export function undoLastReview() {
  if (!canUseStorage()) {
    return undefined;
  }

  const undo = getLastReviewUndo();

  if (!undo) {
    return undefined;
  }

  let restoredCard: Flashcard | undefined;
  const flashcards = getFlashcards().map((flashcard) => {
    if (flashcard.id !== undo.card.id) {
      return flashcard;
    }

    restoredCard = undo.card;
    return undo.card;
  });

  if (!restoredCard) {
    clearLastReviewUndo();
    return undefined;
  }

  saveFlashcards(flashcards);
  saveReviewLogs(getReviewLogs().filter((log) => log.id !== undo.logId));
  clearLastReviewUndo();

  return restoredCard;
}


export type ImportCardsOptions = {
  mode: 'existingDeck' | 'newDeck';
  existingDeckId?: string;
  newDeckName?: string;
  skipDuplicates?: boolean;
};

export type ImportCardsResult = {
  importedCards: number;
  skippedDuplicates: number;
  skippedRows: number;
  createdDeck?: Deck;
  decks: Deck[];
  flashcards: Flashcard[];
};

export type AppBackup = {
  version: 1;
  exportedAt: string;
  decks: Deck[];
  flashcards: Flashcard[];
  reviewLogs: ReviewLog[];
  notes: unknown[];
  notebooks: unknown[];
};

function createNewImportedFlashcard(input: NewFlashcard): Flashcard {
  const now = new Date().toISOString();

  return {
    id: createId('card'),
    deckId: input.deckId,
    front: input.front,
    back: input.back,
    createdAt: now,
    updatedAt: now,

    state: 'new',
    learningStepIndex: 0,
    intervalDays: 0,
    easeFactor: 2.5,
    repetitions: 0,
    lapses: 0,
  };
}

export function importParsedCards(cards: ParsedImportCard[], options: ImportCardsOptions): ImportCardsResult {
  if (!canUseStorage()) {
    throw new Error('Flashcard import is only available on the client.');
  }

  const existingDecks = getDecks();
  const existingCards = getFlashcards();
  let decks = existingDecks;
  let createdDeck: Deck | undefined;
  let targetDeckId = options.existingDeckId;

  if (options.mode === 'newDeck') {
    createdDeck = addDeck({ name: options.newDeckName?.trim() || 'Imported Deck' });
    decks = getDecks();
    targetDeckId = createdDeck.id;
  }

  if (!targetDeckId) {
    return {
      importedCards: 0,
      skippedDuplicates: 0,
      skippedRows: cards.length,
      createdDeck,
      decks,
      flashcards: existingCards,
    };
  }

  const duplicateKeys = new Set(
    existingCards.map((card) => `${card.deckId}::${card.front.trim().toLowerCase()}::${card.back.trim().toLowerCase()}`)
  );

  let skippedDuplicates = 0;
  let skippedRows = 0;
  const importedFlashcards: Flashcard[] = [];

  for (const card of cards) {
    const front = card.front.trim();
    const back = card.back.trim();

    if (!front || !back) {
      skippedRows += 1;
      continue;
    }

    const deckId = targetDeckId;
    const duplicateKey = `${deckId}::${front.toLowerCase()}::${back.toLowerCase()}`;

    if (options.mode === 'existingDeck' && options.skipDuplicates && duplicateKeys.has(duplicateKey)) {
      skippedDuplicates += 1;
      continue;
    }

    duplicateKeys.add(duplicateKey);
    importedFlashcards.push(createNewImportedFlashcard({ deckId, front, back }));
  }

  const flashcards = [...importedFlashcards, ...getFlashcards()];
  saveFlashcards(flashcards);
  clearLastReviewUndo();

  return {
    importedCards: importedFlashcards.length,
    skippedDuplicates,
    skippedRows,
    createdDeck,
    decks: getDecks(),
    flashcards: getFlashcards(),
  };
}

export function exportAppBackup(): AppBackup {
  if (!canUseStorage()) {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      decks: [],
      flashcards: [],
      reviewLogs: [],
      notes: [],
      notebooks: [],
    };
  }

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    decks: getDecks(),
    flashcards: getFlashcards(),
    reviewLogs: getReviewLogs(),
    notes: parseJsonArray<unknown>(storage.getString(NOTES_KEY)),
    notebooks: parseJsonArray<unknown>(storage.getString(NOTEBOOKS_KEY)),
  };
}

export function exportAppBackupText() {
  return JSON.stringify(exportAppBackup(), null, 2);
}

export type ImportAppBackupResult = {
  decks: Deck[];
  flashcards: Flashcard[];
  reviewLogs: ReviewLog[];
  notes: unknown[];
  notebooks: unknown[];
};

export function importAppBackupText(rawText: string): ImportAppBackupResult | undefined {
  if (!canUseStorage()) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(rawText) as Partial<AppBackup>;

    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.decks) || !Array.isArray(parsed.flashcards)) {
      return undefined;
    }

    const decks = parsed.decks.map(normalizeDeck);
    const flashcards = parsed.flashcards.map(normalizeFlashcard);
    const reviewLogs = Array.isArray(parsed.reviewLogs) ? parsed.reviewLogs : [];
    const notes = Array.isArray(parsed.notes) ? parsed.notes : [];
    const notebooks = Array.isArray(parsed.notebooks) ? parsed.notebooks : [];

    saveDecks(decks.length > 0 ? decks : [createDefaultDeck()]);
    saveFlashcards(flashcards);
    saveReviewLogs(reviewLogs);
    storage.set(NOTES_KEY, JSON.stringify(notes));
    storage.set(NOTEBOOKS_KEY, JSON.stringify(notebooks));
    clearLastReviewUndo();

    return {
      decks: getDecks(),
      flashcards: getFlashcards(),
      reviewLogs: getReviewLogs(),
      notes,
      notebooks,
    };
  } catch {
    return undefined;
  }
}

export function deleteDeck(id: string) {
  if (!canUseStorage()) {
    return undefined;
  }

  const decks = getDecks();
  const deckToDelete = decks.find((deck) => deck.id === id);

  if (!deckToDelete) {
    return undefined;
  }

  const flashcards = getFlashcards();
  const nextFlashcards = flashcards.filter((flashcard) => flashcard.deckId !== id);
  const remainingDecks = decks.filter((deck) => deck.id !== id);
  const nextDecks = remainingDecks.length > 0 ? remainingDecks : [createDefaultDeck()];
  const deletedCards = flashcards.length - nextFlashcards.length;

  saveDecks(nextDecks);
  saveFlashcards(nextFlashcards);
  saveReviewLogs(getReviewLogs().filter((log) => log.deckId !== id));
  clearLastReviewUndo();

  return {
    deck: deckToDelete,
    deletedCards,
    decks: nextDecks,
    flashcards: nextFlashcards,
  };
}

export function deleteFlashcard(id: string) {
  if (!canUseStorage()) {
    return false;
  }

  const flashcards = getFlashcards();
  const nextFlashcards = flashcards.filter((flashcard) => flashcard.id !== id);

  if (nextFlashcards.length === flashcards.length) {
    return false;
  }

  saveFlashcards(nextFlashcards);
  saveReviewLogs(getReviewLogs().filter((log) => log.cardId !== id));
  clearLastReviewUndo();

  return true;
}

/** Development helper for resetting card data without deleting decks. */
export function clearFlashcards() {
  if (!canUseStorage()) {
    return;
  }

  storage.remove(FLASHCARDS_KEY);
  storage.remove(REVIEW_LOGS_KEY);
  clearLastReviewUndo();
}
