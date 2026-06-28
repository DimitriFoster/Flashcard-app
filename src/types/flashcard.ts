/**
 * Shared domain types for the flashcard app.
 *
 * Keeping these in one file helps beginners understand the shape of the app's
 * data model before reading the screens or storage layer.
 */

/** User-facing review choices. These map directly to scheduling behavior. */
export type ReviewGrade = 'again' | 'hard' | 'good' | 'easy';

/**
 * Spaced repetition state.
 *
 * - new: never graduated into long-term review
 * - learning: short-term steps for new cards
 * - review: long-term scheduled cards
 * - relearning: failed review cards being repaired
 * - suspended: hidden from due review until the user restores it
 */
export type CardState = 'new' | 'learning' | 'review' | 'relearning' | 'suspended';

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

  /** Current spaced-repetition state. Older cards are migrated on read. */
  state?: CardState;

  /** Used by learning/relearning steps before a card graduates back to review. */
  learningStepIndex?: number;

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

/** Stored after each graded review. Useful for stats, debugging, and undo. */
export type ReviewLog = {
  id: string;
  cardId: string;
  deckId: string;
  grade: ReviewGrade;
  reviewedAt: string;

  previousState?: CardState;
  nextState?: CardState;

  previousDueAt?: string;
  nextDueAt?: string;

  previousIntervalDays?: number;
  nextIntervalDays?: number;

  previousEaseFactor?: number;
  nextEaseFactor?: number;
};
