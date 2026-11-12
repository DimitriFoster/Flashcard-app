import type { Deck, Flashcard, ReviewLog } from '@/types/flashcard';
import { getDueCards } from './review-queue';
import { getReviewDeckSummary, getReviewStartAction } from './review-deck-summary';

const NOW = new Date(2026, 9, 23, 14, 0);
const timestamp = new Date(2026, 9, 1, 10, 0).toISOString();
const decks: Deck[] = ['spanish', 'science', 'empty'].map((id) => ({
  id, name: id, createdAt: timestamp, updatedAt: timestamp,
}));
function cardsFor(deckId: string, count: number): Flashcard[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${deckId}-${i}`, deckId, front: `Question ${i}`, back: 'Answer',
    state: 'new', createdAt: timestamp, updatedAt: timestamp,
  }));
}
const logs: ReviewLog[] = Array.from({ length: 10 }, (_, i) => ({
  id: `log-${i}`, cardId: `introduced-${i}`, deckId: 'spanish', grade: 'good',
  previousState: 'new', nextState: 'learning', reviewedAt: NOW.toISOString(),
}));
function equal(actual: unknown, expected: unknown) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
  }
}

const tests = [
  () => {
    const cards = [...cardsFor('spanish', 15), ...cardsFor('science', 3)];
    const summary = getReviewDeckSummary(decks, cards, { now: NOW });
    equal(summary.decks.map((row) => row.dueCount), [10, 3, 0]);
    equal(summary.totalDue, getDueCards(cards, { now: NOW }).length);
    equal(summary.decks.map((row) => row.deck.id), decks.map((deck) => deck.id));
  },
  () => {
    const cards = [...cardsFor('spanish', 15), ...cardsFor('science', 3)];
    const summary = getReviewDeckSummary(decks, cards, { now: NOW, reviewLogs: logs });
    equal(summary.decks.map((row) => row.dueCount), [0, 3, 0]);
    equal(getReviewStartAction(summary), { kind: 'deck', deckId: 'science' });
  },
  () => {
    const card = { ...cardsFor('spanish', 1)[0], state: 'learning' as const, dueAt: NOW.toISOString() };
    equal(getReviewDeckSummary(decks, [card], { now: NOW, reviewLogs: logs }).totalDue, 1);
  },
  () => {
    const cards = cardsFor('spanish', 15);
    equal(getReviewDeckSummary(decks, cards, { now: NOW, reviewLogs: logs }).totalDue, 0);
    equal(getReviewDeckSummary(decks, cards, { now: NOW, reviewLogs: logs.slice(1) }).totalDue, 1);
  },
  () => {
    const due = new Date(NOW.getTime() + 30_000);
    const card = { ...cardsFor('spanish', 1)[0], state: 'learning' as const, dueAt: due.toISOString() };
    equal(getReviewStartAction(getReviewDeckSummary(decks, [card], { now: NOW })), { kind: 'none' });
    const refreshed = getReviewDeckSummary(decks, [card], { now: due });
    equal(refreshed.totalDue, 1);
    equal(getReviewStartAction(refreshed), { kind: 'deck', deckId: 'spanish' });
  },
  () => {
    const cards = cardsFor('spanish', 15);
    const midnight = new Date(2026, 9, 24);
    equal(getReviewDeckSummary(decks, cards, { now: midnight, reviewLogs: logs }).totalDue, 10);
  },
  () => {
    equal(getReviewStartAction(getReviewDeckSummary([], [], { now: NOW })), { kind: 'none' });
    equal(getReviewStartAction(getReviewDeckSummary(decks, [], { now: NOW })), { kind: 'none' });
  },
  () => {
    const cards = [...cardsFor('spanish', 1), ...cardsFor('science', 1)];
    equal(getReviewStartAction(getReviewDeckSummary(decks, cards, { now: NOW })), { kind: 'choose' });
  },
  () => {
    // A fresh snapshot, not the old displayed total, decides what Start Review does.
    const old = getReviewDeckSummary(decks, cardsFor('spanish', 1), { now: NOW });
    equal(getReviewStartAction(old), { kind: 'deck', deckId: 'spanish' });
    const fresh = getReviewDeckSummary(decks, [], { now: NOW });
    equal(getReviewStartAction(fresh), { kind: 'none' });
  },
  () => {
    const cards = [...cardsFor('missing-deck', 5), ...cardsFor('spanish', 2)];
    const before = JSON.stringify({ decks, cards, logs });
    equal(getReviewDeckSummary(decks, cards, { now: NOW, reviewLogs: [logs[0], logs[0]] }).totalDue, 2);
    equal(JSON.stringify({ decks, cards, logs }), before);
  },
];

export function runReviewDeckSummaryTests() {
  for (const test of tests) test();
  return tests.length;
}
