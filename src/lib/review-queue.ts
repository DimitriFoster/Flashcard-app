/**
 * Review queue helpers.
 *
 * These functions keep the UI honest about what "due" means without mixing
 * date logic into every screen.
 */
import type { Flashcard } from '@/types/flashcard';

/**
 * New cards do not have a dueAt yet, so they are treated as reviewable.
 * Reviewed cards are due when their dueAt timestamp is now or in the past.
 */
export function isCardDue(card: Flashcard, now = new Date()) {
  if (!card.dueAt) {
    return true;
  }

  return new Date(card.dueAt).getTime() <= now.getTime();
}

export function getDueCards(cards: Flashcard[], now = new Date()) {
  return cards.filter((card) => isCardDue(card, now));
}
