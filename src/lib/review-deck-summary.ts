import type { Deck, Flashcard } from '@/types/flashcard';
import { getDueCards, type ReviewQueueOptions } from './review-queue';

export type DueDeck = { deck: Deck; dueCount: number };
export type ReviewDeckSummary = { decks: DueDeck[]; totalDue: number };

export function getReviewDeckSummary(
  decks: Deck[],
  cards: Flashcard[],
  options: ReviewQueueOptions = {},
): ReviewDeckSummary {
  // Use one instant for every deck, including when refreshing across midnight.
  const queueOptions = { ...options, now: options.now ?? new Date() };
  const cardsByDeck = new Map<string, Flashcard[]>();
  for (const card of cards) {
    const deckCards = cardsByDeck.get(card.deckId) ?? [];
    deckCards.push(card);
    cardsByDeck.set(card.deckId, deckCards);
  }
  const rows = decks.map((deck) => ({
    deck,
    dueCount: getDueCards(cardsByDeck.get(deck.id) ?? [], queueOptions).length,
  }));
  return { decks: rows, totalDue: rows.reduce((total, row) => total + row.dueCount, 0) };
}

export function getReviewStartAction(summary: ReviewDeckSummary):
  | { kind: 'none' }
  | { kind: 'deck'; deckId: string }
  | { kind: 'choose' } {
  const dueDecks = summary.decks.filter((row) => row.dueCount > 0);
  if (!dueDecks.length) return { kind: 'none' };
  if (dueDecks.length === 1) return { kind: 'deck', deckId: dueDecks[0].deck.id };
  return { kind: 'choose' };
}
