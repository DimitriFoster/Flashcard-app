/**
 * Spaced-repetition scheduling logic.
 *
 * This file is intentionally separate from storage and UI.
 * For an entry-level review project, this is a strong structure because it makes
 * the review algorithm easy to test and improve without touching screen code.
 */
import type { Flashcard, ReviewGrade } from '@/types/flashcard';

/** Return a new Date instead of mutating the original Date object. */
function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

/**
 * Calculate the next review fields after a user grades a card.
 *
 * This is a lightweight spaced-repetition algorithm inspired by common SRS ideas:
 * - Again: reset progress and make the card due immediately.
 * - Hard: keep the interval short and slightly reduce ease.
 * - Good: use normal progression.
 * - Easy: increase ease and push the card farther into the future.
 *
 * The function returns only the fields that should change. The storage layer
 * merges these values back into the existing Flashcard object.
 */
export function calculateNextReviewState(flashcard: Flashcard, grade: ReviewGrade) {
  const now = new Date();
  const nowIso = now.toISOString();

  /** Defaults let old cards continue working if new review fields are added later. */
  const currentEase = flashcard.easeFactor ?? 2.5;
  const currentInterval = flashcard.intervalDays ?? 0;
  const currentRepetitions = flashcard.repetitions ?? 0;
  const currentLapses = flashcard.lapses ?? 0;

  if (grade === 'again') {
    return {
      dueAt: nowIso,
      intervalDays: 0,
      /** Ease is never allowed below 1.3 so the card can still recover over time. */
      easeFactor: Math.max(1.3, currentEase - 0.2),
      repetitions: 0,
      lapses: currentLapses + 1,
      lastReviewedAt: nowIso,
      lastStruggledAt: nowIso,
    };
  }

  const easeDelta = grade === 'hard' ? -0.15 : grade === 'easy' ? 0.15 : 0;
  const easeFactor = Math.max(1.3, currentEase + easeDelta);

  /**
   * The interval calculation is deliberately simple for now.
   * It can be replaced later with a more formal algorithm without changing UI code.
   */
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
