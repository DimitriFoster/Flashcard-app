import { storage } from './mmkv';
import { Platform } from 'react-native';

import type { Deck, Flashcard, NewDeck, NewFlashcard, ReviewGrade } from '@/types/flashcard';

const FLASHCARDS_KEY = 'flashcards';
const DECKS_KEY = 'decks';
export const DEFAULT_DECK_ID = 'default-deck';

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

function normalizeDeck(deck: Partial<Deck>): Deck {
  const now = new Date().toISOString();

  return {
    id: deck.id ?? createId('deck'),
    name: deck.name?.trim() || 'Untitled Deck',
    createdAt: deck.createdAt ?? now,
    updatedAt: deck.updatedAt ?? now,
  };
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function nextReviewState(flashcard: Flashcard, grade: ReviewGrade) {
  const now = new Date();
  const nowIso = now.toISOString();
  const currentEase = flashcard.easeFactor ?? 2.5;
  const currentInterval = flashcard.intervalDays ?? 0;
  const currentRepetitions = flashcard.repetitions ?? 0;
  const currentLapses = flashcard.lapses ?? 0;

  if (grade === 'again') {
    return {
      dueAt: nowIso,
      intervalDays: 0,
      easeFactor: Math.max(1.3, currentEase - 0.2),
      repetitions: 0,
      lapses: currentLapses + 1,
      lastReviewedAt: nowIso,
      lastStruggledAt: nowIso,
    };
  }

  const easeDelta = grade === 'hard' ? -0.15 : grade === 'easy' ? 0.15 : 0;
  const easeFactor = Math.max(1.3, currentEase + easeDelta);
  const intervalDays =
    grade === 'hard'
      ? Math.max(1, Math.round(currentInterval * 1.2) || 1)
      : grade === 'easy'
        ? Math.max(4, Math.round((currentInterval || 1) * easeFactor * 1.3))
        : currentRepetitions === 0
          ? 1
          : currentRepetitions === 1
            ? 3
            : Math.max(2, Math.round(currentInterval * easeFactor));

  return {
    dueAt: addDays(now, intervalDays).toISOString(),
    intervalDays,
    easeFactor,
    repetitions: currentRepetitions + 1,
    lapses: currentLapses,
    lastReviewedAt: nowIso,
    lastStruggledAt: grade === 'hard' ? nowIso : flashcard.lastStruggledAt,
  };
}

export function getDecks() {
  if (!canUseStorage()) {
    return [];
  }

  const flashcards = getFlashcards();
  const savedDecks = parseJsonArray<Deck>(storage.getString(DECKS_KEY)).map(normalizeDeck);
  const decks = savedDecks.length > 0 ? savedDecks : [createDefaultDeck()];
  const knownDeckIds = new Set(decks.map((deck) => deck.id));
  const missingDeckIds = new Set(
    flashcards.map((flashcard) => flashcard.deckId).filter((deckId) => !knownDeckIds.has(deckId))
  );

  const nextDecks = [
    ...decks,
    ...Array.from(missingDeckIds).map((deckId) =>
      normalizeDeck({ id: deckId, name: deckId === DEFAULT_DECK_ID ? 'Main Deck' : 'Recovered Deck' })
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
      ...nextReviewState(flashcard, grade),
      updatedAt: now,
    };

    return reviewedFlashcard;
  });

  if (reviewedFlashcard) {
    saveFlashcards(flashcards);
  }

  return reviewedFlashcard;
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

export function clearFlashcards() {
  if (!canUseStorage()) {
    return;
  }

  storage.remove(FLASHCARDS_KEY);
}
