/**
 * Review queue helpers.
 *
 * These functions keep the UI honest about what "due" means without mixing
 * date logic into every screen.
 */
import type { Flashcard } from '@/types/flashcard';
import { getCardState } from './review-scheduling';

export const DAILY_NEW_CARD_LIMIT = 10;

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

/**
 * Build a practical SRS queue:
 * 1. learning cards due now
 * 2. relearning cards due now
 * 3. review cards due now
 * 4. a limited number of new cards
 */
export function getReviewQueue(cards: Flashcard[], now = new Date()) {
  const dueLearning = cards
    .filter((card) => getCardState(card) === 'learning' && isCardDue(card, now))
    .sort((a, b) => dueTime(a) - dueTime(b));

  const dueRelearning = cards
    .filter((card) => getCardState(card) === 'relearning' && isCardDue(card, now))
    .sort((a, b) => dueTime(a) - dueTime(b));

  const dueReview = cards
    .filter((card) => getCardState(card) === 'review' && isCardDue(card, now))
    .sort((a, b) => dueTime(a) - dueTime(b));

  const newCards = cards
    .filter((card) => getCardState(card) === 'new')
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .slice(0, DAILY_NEW_CARD_LIMIT);

  return [...dueLearning, ...dueRelearning, ...dueReview, ...newCards];
}

export function getDueCards(cards: Flashcard[], now = new Date()) {
  return getReviewQueue(cards, now);
}
