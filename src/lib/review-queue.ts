/**
 * Review queue helpers.
 *
 * These functions keep the UI honest about what "due" means without mixing
 * date logic into every screen.
 */
import type { Flashcard, ReviewLog } from '@/types/flashcard';
import { getCardState } from './review-scheduling';

export const DAILY_NEW_CARD_LIMIT = 10;

export type ReviewQueueOptions = {
  now?: Date;
  reviewLogs?: ReviewLog[];
  dailyNewCardLimit?: number;
};

type ReviewQueueInput = ReviewQueueOptions | Date;

function dueTime(card: Flashcard) {
  return card.dueAt ? new Date(card.dueAt).getTime() : 0;
}

/**
 * New cards are reviewable, but getReviewQueue caps how many new cards are
 * introduced at once. Scheduled cards are due when their dueAt timestamp is now
 * or in the past.
 */
export function isCardDue(card: Flashcard, now = new Date()) {
  const state = getCardState(card);

  if (state === 'suspended') {
    return false;
  }

  if (state === 'new') {
    return true;
  }

  if (!card.dueAt) {
    return true;
  }

  return new Date(card.dueAt).getTime() <= now.getTime();
}

function normalizeQueueOptions(input?: ReviewQueueInput): Required<ReviewQueueOptions> {
  if (input instanceof Date) {
    return {
      now: input,
      reviewLogs: [],
      dailyNewCardLimit: DAILY_NEW_CARD_LIMIT,
    };
  }

  const options = input ?? {};
  const configuredLimit = options.dailyNewCardLimit ?? DAILY_NEW_CARD_LIMIT;

  return {
    now: options.now ?? new Date(),
    reviewLogs: options.reviewLogs ?? [],
    dailyNewCardLimit: Number.isFinite(configuredLimit)
      ? Math.max(0, Math.floor(configuredLimit))
      : DAILY_NEW_CARD_LIMIT,
  };
}

function getIntroducedNewCardIdsByDeck(reviewLogs: ReviewLog[], now: Date) {
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfNextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const introducedCardIdsByDeck = new Map<string, Set<string>>();

  for (const log of reviewLogs) {
    if (log.previousState !== 'new') {
      continue;
    }

    const reviewedAt = new Date(log.reviewedAt);

    if (
      Number.isNaN(reviewedAt.getTime()) ||
      reviewedAt < startOfDay ||
      reviewedAt >= startOfNextDay
    ) {
      continue;
    }

    const cardIds = introducedCardIdsByDeck.get(log.deckId) ?? new Set<string>();
    cardIds.add(log.cardId);
    introducedCardIdsByDeck.set(log.deckId, cardIds);
  }

  return introducedCardIdsByDeck;
}

export function getIntroducedNewCardCount(deckId: string, options?: ReviewQueueOptions) {
  const { now, reviewLogs } = normalizeQueueOptions(options);
  return getIntroducedNewCardIdsByDeck(reviewLogs, now).get(deckId)?.size ?? 0;
}

export function getRemainingNewCardSlots(deckId: string, options?: ReviewQueueOptions) {
  const { now, reviewLogs, dailyNewCardLimit } = normalizeQueueOptions(options);
  const introducedToday = getIntroducedNewCardIdsByDeck(reviewLogs, now).get(deckId)?.size ?? 0;

  return Math.max(0, dailyNewCardLimit - introducedToday);
}

/**
 * Build a practical SRS queue:
 * 1. learning cards due now
 * 2. relearning cards due now
 * 3. review cards due now
 * 4. a limited number of new cards
 */
export function getReviewQueue(cards: Flashcard[], options?: ReviewQueueOptions): Flashcard[];
export function getReviewQueue(cards: Flashcard[], now?: Date): Flashcard[];
export function getReviewQueue(cards: Flashcard[], input?: ReviewQueueInput) {
  const { now, reviewLogs, dailyNewCardLimit } = normalizeQueueOptions(input);

  const dueLearning = cards
    .filter((card) => getCardState(card) === 'learning' && isCardDue(card, now))
    .sort((a, b) => dueTime(a) - dueTime(b));

  const dueRelearning = cards
    .filter((card) => getCardState(card) === 'relearning' && isCardDue(card, now))
    .sort((a, b) => dueTime(a) - dueTime(b));

  const dueReview = cards
    .filter((card) => getCardState(card) === 'review' && isCardDue(card, now))
    .sort((a, b) => dueTime(a) - dueTime(b));

  const newCardsByDeck = new Map<string, Flashcard[]>();

  for (const card of cards
    .filter((card) => getCardState(card) === 'new')
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))) {
    const deckCards = newCardsByDeck.get(card.deckId) ?? [];
    deckCards.push(card);
    newCardsByDeck.set(card.deckId, deckCards);
  }

  const introducedCardIdsByDeck = getIntroducedNewCardIdsByDeck(reviewLogs, now);
  const availableNewCards = Array.from(newCardsByDeck.entries()).flatMap(
    ([deckId, deckCards]) => {
      const introducedToday = introducedCardIdsByDeck.get(deckId)?.size ?? 0;
      const remainingNewSlots = Math.max(0, dailyNewCardLimit - introducedToday);
      return deckCards.slice(0, remainingNewSlots);
    },
  );

  availableNewCards.sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return [...dueLearning, ...dueRelearning, ...dueReview, ...availableNewCards];
}

export function getDueCards(cards: Flashcard[], options?: ReviewQueueOptions): Flashcard[];
export function getDueCards(cards: Flashcard[], now?: Date): Flashcard[];
export function getDueCards(cards: Flashcard[], input?: ReviewQueueInput) {
  if (input instanceof Date) {
    return getReviewQueue(cards, input);
  }

  return getReviewQueue(cards, input);
}
