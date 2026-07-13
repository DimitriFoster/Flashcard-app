import type { CardState, Flashcard, ReviewLog } from '@/types/flashcard';
import { getReviewQueue } from './review-queue';

const NOW = new Date(2026, 6, 13, 15, 30, 0);

function assertEqual(actual: number, expected: number, message: string) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, received ${actual}`);
  }
}

function assertIncludes(values: string[], expected: string, message: string) {
  if (!values.includes(expected)) {
    throw new Error(`${message}: ${expected} was not included`);
  }
}

function makeCard(
  id: string,
  deckId = 'deck-a',
  state: CardState = 'new',
  createdAt = new Date(2026, 6, 1, 9, 0, 0).toISOString(),
): Flashcard {
  return {
    id,
    deckId,
    front: `Front ${id}`,
    back: `Back ${id}`,
    createdAt,
    updatedAt: createdAt,
    state,
    dueAt: state === 'new' ? undefined : new Date(NOW.getTime() - 60_000).toISOString(),
  };
}

function makeNewCards(count: number, deckId = 'deck-a') {
  return Array.from({ length: count }, (_, index) =>
    makeCard(`new-${deckId}-${index}`, deckId, 'new', new Date(2026, 6, 1, 9, index, 0).toISOString()),
  );
}

function makeLog(
  cardId: string,
  deckId = 'deck-a',
  reviewedAt = new Date(2026, 6, 13, 10, 0, 0).toISOString(),
  previousState: CardState = 'new',
): ReviewLog {
  return {
    id: `log-${cardId}-${reviewedAt}-${previousState}`,
    cardId,
    deckId,
    grade: 'good',
    reviewedAt,
    previousState,
    nextState: 'learning',
  };
}

function newCardCount(cards: Flashcard[]) {
  return cards.filter((card) => card.state === 'new').length;
}

function newCardCountForDeck(cards: Flashcard[], deckId: string) {
  return newCardCount(cards.filter((card) => card.deckId === deckId));
}

type QueueTest = {
  name: string;
  run: () => void;
};

const tests: QueueTest[] = [
  {
    name: '15 new cards with no logs returns 10 new cards',
    run: () => {
      assertEqual(newCardCount(getReviewQueue(makeNewCards(15), { now: NOW, reviewLogs: [] })), 10, 'initial new-card queue');
    },
  },
  {
    name: 'one unique new card reviewed today leaves 9 new slots',
    run: () => {
      const cards = [makeCard('introduced', 'deck-a', 'learning'), ...makeNewCards(15)];
      const queue = getReviewQueue(cards, { now: NOW, reviewLogs: [makeLog('introduced')] });
      assertEqual(newCardCount(queue), 9, 'remaining new-card queue');
    },
  },
  {
    name: '10 unique new cards reviewed today consume the new-card quota',
    run: () => {
      const introducedCards = Array.from({ length: 10 }, (_, index) =>
        makeCard(`introduced-${index}`, 'deck-a', 'learning'),
      );
      const logs = introducedCards.map((card) => makeLog(card.id));
      const queue = getReviewQueue([...introducedCards, ...makeNewCards(15)], { now: NOW, reviewLogs: logs });
      assertEqual(newCardCount(queue), 0, 'quota-exhausted new-card queue');
    },
  },
  {
    name: 'due review cards remain after all new-card slots are consumed',
    run: () => {
      const reviewCard = makeCard('review-due', 'deck-a', 'review');
      const logs = Array.from({ length: 10 }, (_, index) => makeLog(`introduced-${index}`));
      const queue = getReviewQueue([reviewCard, ...makeNewCards(15)], { now: NOW, reviewLogs: logs });
      assertIncludes(queue.map((card) => card.id), reviewCard.id, 'due review card');
      assertEqual(newCardCount(queue), 0, 'new cards after review quota');
    },
  },
  {
    name: 'due learning cards remain after all new-card slots are consumed',
    run: () => {
      const learningCard = makeCard('learning-due', 'deck-a', 'learning');
      const logs = Array.from({ length: 10 }, (_, index) => makeLog(`introduced-${index}`));
      const queue = getReviewQueue([learningCard, ...makeNewCards(15)], { now: NOW, reviewLogs: logs });
      assertIncludes(queue.map((card) => card.id), learningCard.id, 'due learning card');
      assertEqual(newCardCount(queue), 0, 'new cards after learning quota');
    },
  },
  {
    name: 'multiple logs for the same card count once',
    run: () => {
      const logs = [makeLog('introduced'), makeLog('introduced', 'deck-a', new Date(2026, 6, 13, 11, 0, 0).toISOString())];
      const queue = getReviewQueue(makeNewCards(15), { now: NOW, reviewLogs: logs });
      assertEqual(newCardCount(queue), 9, 'duplicate-log quota');
    },
  },
  {
    name: 'a log from yesterday does not consume today quota',
    run: () => {
      const yesterday = new Date(2026, 6, 12, 23, 59, 0).toISOString();
      const queue = getReviewQueue(makeNewCards(15), { now: NOW, reviewLogs: [makeLog('yesterday', 'deck-a', yesterday)] });
      assertEqual(newCardCount(queue), 10, 'yesterday quota');
    },
  },
  {
    name: 'a log from another deck does not consume this deck quota',
    run: () => {
      const queue = getReviewQueue(makeNewCards(15, 'deck-a'), {
        now: NOW,
        reviewLogs: [makeLog('other-deck-card', 'deck-b')],
      });
      assertEqual(newCardCount(queue), 10, 'other-deck quota');
    },
  },
  {
    name: 'the new-card quota is independent for each deck',
    run: () => {
      const queue = getReviewQueue(
        [...makeNewCards(15, 'deck-a'), ...makeNewCards(15, 'deck-b')],
        {
          now: NOW,
          reviewLogs: Array.from({ length: 10 }, (_, index) => makeLog(`introduced-${index}`, 'deck-a')),
        },
      );
      assertEqual(newCardCountForDeck(queue, 'deck-a'), 0, 'deck-a quota');
      assertEqual(newCardCountForDeck(queue, 'deck-b'), 10, 'deck-b quota');
    },
  },
  {
    name: 'the new-card quota resets on the next local calendar day',
    run: () => {
      const nextDay = new Date(2026, 6, 14, 9, 0, 0);
      const logs = Array.from({ length: 10 }, (_, index) => makeLog(`introduced-${index}`));
      const queue = getReviewQueue(makeNewCards(15), { now: nextDay, reviewLogs: logs });
      assertEqual(newCardCount(queue), 10, 'next-day quota');
    },
  },
  {
    name: 'non-new previous states do not consume new-card quota',
    run: () => {
      const logs = (['learning', 'review', 'relearning'] as CardState[]).map((state, index) =>
        makeLog(`not-new-${index}`, 'deck-a', new Date(2026, 6, 13, 10 + index, 0, 0).toISOString(), state),
      );
      const queue = getReviewQueue(makeNewCards(15), { now: NOW, reviewLogs: logs });
      assertEqual(newCardCount(queue), 10, 'non-new previous-state quota');
    },
  },
  {
    name: 'empty or missing logs preserve the initial 10-card behavior',
    run: () => {
      assertEqual(newCardCount(getReviewQueue(makeNewCards(15), { now: NOW, reviewLogs: [] })), 10, 'empty logs');
      assertEqual(newCardCount(getReviewQueue(makeNewCards(15), { now: NOW })), 10, 'missing logs');
    },
  },
  {
    name: 'removing the qualifying log restores the new-card slot',
    run: () => {
      const cards = makeNewCards(15);
      const log = makeLog('introduced');
      const withLog = getReviewQueue(cards, { now: NOW, reviewLogs: [log] });
      const afterUndo = getReviewQueue(cards, { now: NOW, reviewLogs: [] });
      assertEqual(newCardCount(withLog), 9, 'queue before undo');
      assertEqual(newCardCount(afterUndo), 10, 'queue after undo');
    },
  },
];

export function runReviewQueueTests() {
  for (const test of tests) {
    test.run();
  }

  return tests.length;
}
