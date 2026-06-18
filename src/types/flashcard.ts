/**
 * Shared domain types for the flashcard app.
 *
 * Keeping these in one file helps beginners understand the shape of the app's
 * data model before reading the screens or storage layer.
 */

/** A single study card belonging to one deck. */
export type Flashcard = {
  /** Unique card ID used for updates, deletes, and review actions. */
  id: string;

  /** Foreign-key style relationship to Deck.id. */
  deckId: string;

  /** The prompt/question side of the card. */
  front: string;

  /** The answer/explanation side of the card. */
  back: string;

  /** ISO timestamp for sorting and future sync/migration work. */
  createdAt: string;

  /** ISO timestamp updated whenever the card changes. */
  updatedAt: string;

  /** Optional spaced-repetition fields. New cards may not have these yet. */
  dueAt?: string;
  intervalDays?: number;
  easeFactor?: number;
  repetitions?: number;
  lapses?: number;
  lastReviewedAt?: string;
  lastStruggledAt?: string;
};

/** A named collection of flashcards. */
export type Deck = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

/** Input required when creating a new flashcard. */
export type NewFlashcard = {
  deckId: string;
  front: string;
  back: string;
};

/** Input required when creating a new deck. */
export type NewDeck = {
  name: string;
};

/** User-facing review choices. These map directly to scheduling behavior. */
export type ReviewGrade = 'again' | 'hard' | 'good' | 'easy';
