/**
 * Spaced-repetition scheduling logic.
 *
 * This file is intentionally separate from storage and UI.
 * For an entry-level review project, this is a strong structure because it makes
 * the review algorithm easy to test and improve without touching screen code.
 */
import type { CardState, Flashcard, ReviewGrade } from '@/types/flashcard';

const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;

const LEARNING_STEPS_MINUTES = [1, 10];
const RELEARNING_STEPS_MINUTES = [10];

/** Return a new Date instead of mutating the original Date object. */
function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

/** Return a new Date instead of mutating the original Date object. */
function addMinutes(date: Date, minutes: number) {
  const nextDate = new Date(date);
  nextDate.setMinutes(nextDate.getMinutes() + minutes);
  return nextDate;
}

function clampEase(value: number) {
  return Math.max(MIN_EASE_FACTOR, value);
}

export function getCardState(card: Flashcard): CardState {
  if (card.state) {
    return card.state;
  }

  return card.dueAt ? 'review' : 'new';
}

/**
 * Calculate the next review fields after a user grades a card.
 *
 * This is intentionally not a perfect Anki clone. It is a readable first SRS
 * engine with the important pieces:
 * - new cards go through learning steps
 * - review failures enter relearning
 * - old review cards grow intervals over time
 * - every card keeps ease, lapses, repetitions, and due dates
 */
export function calculateNextReviewState(flashcard: Flashcard, grade: ReviewGrade) {
  const now = new Date();
  const nowIso = now.toISOString();

  const state = getCardState(flashcard);
  const currentEase = flashcard.easeFactor ?? DEFAULT_EASE_FACTOR;
  const currentInterval = flashcard.intervalDays ?? 0;
  const currentRepetitions = flashcard.repetitions ?? 0;
  const currentLapses = flashcard.lapses ?? 0;
  const currentLearningStep = flashcard.learningStepIndex ?? 0;

  if (state === 'suspended') {
    return {
      lastReviewedAt: flashcard.lastReviewedAt,
    };
  }

  if (state === 'new' || state === 'learning') {
    if (grade === 'again') {
      return {
        state: 'learning' as const,
        learningStepIndex: 0,
        dueAt: addMinutes(now, LEARNING_STEPS_MINUTES[0]).toISOString(),
        intervalDays: 0,
        easeFactor: clampEase(currentEase - 0.15),
        repetitions: currentRepetitions,
        lapses: currentLapses,
        lastReviewedAt: nowIso,
        lastStruggledAt: nowIso,
      };
    }

    if (grade === 'hard') {
      return {
        state: 'learning' as const,
        learningStepIndex: 0,
        dueAt: addMinutes(now, 5).toISOString(),
        intervalDays: 0,
        easeFactor: clampEase(currentEase - 0.1),
        repetitions: currentRepetitions,
        lapses: currentLapses,
        lastReviewedAt: nowIso,
        lastStruggledAt: nowIso,
      };
    }

    if (grade === 'easy') {
      const intervalDays = 4;
      return {
        state: 'review' as const,
        learningStepIndex: 0,
        dueAt: addDays(now, intervalDays).toISOString(),
        intervalDays,
        easeFactor: clampEase(currentEase + 0.15),
        repetitions: currentRepetitions + 1,
        lapses: currentLapses,
        lastReviewedAt: nowIso,
        lastStruggledAt: flashcard.lastStruggledAt,
      };
    }

    const nextLearningStep = currentLearningStep + 1;

    if (nextLearningStep < LEARNING_STEPS_MINUTES.length) {
      return {
        state: 'learning' as const,
        learningStepIndex: nextLearningStep,
        dueAt: addMinutes(now, LEARNING_STEPS_MINUTES[nextLearningStep]).toISOString(),
        intervalDays: 0,
        easeFactor: currentEase,
        repetitions: currentRepetitions,
        lapses: currentLapses,
        lastReviewedAt: nowIso,
        lastStruggledAt: flashcard.lastStruggledAt,
      };
    }

    const intervalDays = 1;
    return {
      state: 'review' as const,
      learningStepIndex: 0,
      dueAt: addDays(now, intervalDays).toISOString(),
      intervalDays,
      easeFactor: currentEase,
      repetitions: currentRepetitions + 1,
      lapses: currentLapses,
      lastReviewedAt: nowIso,
      lastStruggledAt: flashcard.lastStruggledAt,
    };
  }

  if (state === 'relearning') {
    if (grade === 'again') {
      return {
        state: 'relearning' as const,
        learningStepIndex: 0,
        dueAt: addMinutes(now, RELEARNING_STEPS_MINUTES[0]).toISOString(),
        intervalDays: Math.max(0, Math.round(currentInterval * 0.5)),
        easeFactor: clampEase(currentEase - 0.2),
        repetitions: currentRepetitions,
        lapses: currentLapses + 1,
        lastReviewedAt: nowIso,
        lastStruggledAt: nowIso,
      };
    }

    if (grade === 'hard') {
      return {
        state: 'relearning' as const,
        learningStepIndex: 0,
        dueAt: addMinutes(now, RELEARNING_STEPS_MINUTES[0]).toISOString(),
        intervalDays: Math.max(0, Math.round(currentInterval * 0.6)),
        easeFactor: clampEase(currentEase - 0.15),
        repetitions: currentRepetitions,
        lapses: currentLapses,
        lastReviewedAt: nowIso,
        lastStruggledAt: nowIso,
      };
    }

    const intervalDays =
      grade === 'easy'
        ? Math.max(3, Math.round((currentInterval || 1) * 1.15))
        : Math.max(1, Math.round((currentInterval || 1) * 0.8));

    return {
      state: 'review' as const,
      learningStepIndex: 0,
      dueAt: addDays(now, intervalDays).toISOString(),
      intervalDays,
      easeFactor: grade === 'easy' ? clampEase(currentEase + 0.1) : currentEase,
      repetitions: currentRepetitions + 1,
      lapses: currentLapses,
      lastReviewedAt: nowIso,
      lastStruggledAt: flashcard.lastStruggledAt,
    };
  }

  if (grade === 'again') {
    return {
      state: 'relearning' as const,
      learningStepIndex: 0,
      dueAt: addMinutes(now, RELEARNING_STEPS_MINUTES[0]).toISOString(),
      intervalDays: Math.max(0, Math.round(currentInterval * 0.5)),
      easeFactor: clampEase(currentEase - 0.2),
      repetitions: currentRepetitions,
      lapses: currentLapses + 1,
      lastReviewedAt: nowIso,
      lastStruggledAt: nowIso,
    };
  }

  const easeDelta = grade === 'hard' ? -0.15 : grade === 'easy' ? 0.15 : 0;
  const easeFactor = clampEase(currentEase + easeDelta);

  const intervalDays =
    grade === 'hard'
      ? Math.max(1, Math.round((currentInterval || 1) * 1.2))
      : grade === 'easy'
        ? Math.max(4, Math.round((currentInterval || 1) * easeFactor * 1.3))
        : currentRepetitions === 0
          ? 1
          : currentRepetitions === 1
            ? 3
            : Math.max(2, Math.round((currentInterval || 1) * easeFactor));

  return {
    state: 'review' as const,
    learningStepIndex: 0,
    dueAt: addDays(now, intervalDays).toISOString(),
    intervalDays,
    easeFactor,
    repetitions: currentRepetitions + 1,
    lapses: currentLapses,
    lastReviewedAt: nowIso,
    lastStruggledAt: grade === 'hard' ? nowIso : flashcard.lastStruggledAt,
  };
}
