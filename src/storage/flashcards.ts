/**
 * Flashcard and deck storage helpers.
 *
 * This file is the app's local data access layer. Screens should call these
 * functions instead of reading/writing MMKV directly.
 *
 * For an entry-level review project, this is a good separation of concerns:
 * - UI components handle display and events.
 * - Storage helpers handle persistence.
 * - review-scheduling.ts handles the spaced-repetition math.
 */
import { Platform } from 'react-native';

import { calculateNextReviewState } from '@/lib/review-scheduling';
import type { Deck, Flashcard, NewDeck, NewFlashcard, ReviewGrade } from '@/types/flashcard';

import { storage } from './mmkv';

const FLASHCARDS_KEY = 'flashcards';
const DECKS_KEY = 'decks';

/** Stable fallback deck used when the app starts with no saved decks. */
export const DEFAULT_DECK_ID = 'default-deck';

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

/**
 * Normalize cards loaded from storage.
 * This doubles as a lightweight migration layer if older cards are missing fields.
 */
function normalizeFlashcard(card: Partial<Flashcard>): Flashcard {
  const now = new Date().toISOString();

  return {
    id: card.id ?? createId('card'),
    deckId: card.deckId ?? DEFAULT_DECK_ID,
    front: card.front ?? '',
    back: card.back ?? '',
    createdAt: card.createdAt ?? now,
    updatedAt: card.updatedAt ?? now,
    dueAt: card.dueAt,
    intervalDays: card.intervalDays,
    easeFactor: card.easeFactor,
    repetitions: card.repetitions,
    lapses: card.lapses,
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

  /** If normalization filled missing deckId values, write the migrated data back. */
  const needsMigration = rawCards.some((card, index) => card.deckId !== flashcards[index].deckId);

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

export function reviewFlashcard(id: string, grade: ReviewGrade) {
  if (!canUseStorage()) {
    return undefined;
  }

  const now = new Date().toISOString();
  let reviewedFlashcard: Flashcard | undefined;

  const flashcards = getFlashcards().map((flashcard) => {
    if (flashcard.id !== id) {
      return flashcard;
    }

    reviewedFlashcard = {
      ...flashcard,
      ...calculateNextReviewState(flashcard, grade),
      updatedAt: now,
    };

    return reviewedFlashcard;
  });

  if (reviewedFlashcard) {
    saveFlashcards(flashcards);
  }

  return reviewedFlashcard;
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
  return true;
}

/** Development helper for resetting card data without deleting decks. */
export function clearFlashcards() {
  if (!canUseStorage()) {
    return;
  }

  storage.remove(FLASHCARDS_KEY);
}
