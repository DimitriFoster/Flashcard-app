import type { CardState, Flashcard, ReviewLog } from '@/types/flashcard';
import { getReviewQueue } from './review-queue';
import {
  canRestartReviewSession,
  formatReviewCountdown,
  shouldShowSessionRecap,
  summarizeSessionRecap,
  type SessionRecapSection,
} from './session-recap';

const NOW = new Date(2026, 6, 13, 15, 30, 0);

function assertEqual<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${String(expected)}, received ${String(actual)}`);
  }
}

function assertIncludes(values: string[], expected: string, message: string) {
  if (!values.some((value) => value.includes(expected))) {
    throw new Error(`${message}: ${expected} was not included`);
  }
}

function makeCard(id: string, state: CardState = 'new', dueAt?: Date): Flashcard {
  const createdAt = new Date(2026, 6, 1, 9, 0, 0).toISOString();

  return {
    id,
    deckId: 'deck-a',
    front: `Front ${id}`,
    back: `Back ${id}`,
    createdAt,
    updatedAt: createdAt,
    state,
    dueAt: dueAt?.toISOString(),
  };
}

function makeLog(cardId: string, reviewedAt = new Date(2026, 6, 13, 10, 0, 0).toISOString()): ReviewLog {
  return {
    id: `log-${cardId}-${reviewedAt}`,
    cardId,
    deckId: 'deck-a',
    grade: 'good',
    reviewedAt,
    previousState: 'new',
    nextState: 'learning',
  };
}

function getSection(sections: SessionRecapSection[], key: SessionRecapSection['key']) {
  const section = sections.find((item) => item.key === key);

  if (!section) {
    throw new Error(`Missing recap section ${key}`);
  }

  return section;
}

type RecapTest = {
  name: string;
  run: () => void;
};

const tests: RecapTest[] = [
  {
    name: 'a completed due session enters recap after the final grade',
    run: () => {
      const before = getReviewQueue([makeCard('card-1', 'review', new Date(2026, 6, 13, 15, 0))], {
        now: NOW,
        reviewLogs: [],
      });
      const after = summarizeSessionRecap('deck-a', [makeCard('card-1', 'learning', new Date(2026, 6, 13, 15, 35))], {
        now: NOW,
        reviewLogs: [makeLog('card-1')],
      });

      assertEqual(before.length, 1, 'queue before final grade');
      assertEqual(after.currentDueCount, 0, 'queue after final grade');
      assertEqual(
        shouldShowSessionRecap({
          isDueMode: true,
          sessionStartedWithCards: true,
          sessionReviewedCount: 1,
          currentQueueLength: after.currentDueCount,
        }),
        true,
        'completed-session recap state',
      );
    },
  },
  {
    name: 'opening a deck with no due cards does not show recap',
    run: () => {
      assertEqual(
        shouldShowSessionRecap({
          isDueMode: true,
          sessionStartedWithCards: false,
          sessionReviewedCount: 0,
          currentQueueLength: 0,
        }),
        false,
        'initial empty state',
      );
    },
  },
  {
    name: 'Browse mode never shows the recap',
    run: () => {
      assertEqual(
        shouldShowSessionRecap({
          isDueMode: false,
          sessionStartedWithCards: true,
          sessionReviewedCount: 1,
          currentQueueLength: 0,
        }),
        false,
        'browse recap state',
      );
    },
  },
  {
    name: 'Now count matches the actual due queue',
    run: () => {
      const cards = [
        makeCard('due-review', 'review', new Date(2026, 6, 13, 14, 0)),
        makeCard('new-card'),
      ];
      const logs: ReviewLog[] = [];
      const queue = getReviewQueue(cards, { now: NOW, reviewLogs: logs });
      const summary = summarizeSessionRecap('deck-a', cards, { now: NOW, reviewLogs: logs });

      assertEqual(summary.currentDueCount, queue.length, 'live due count');
      assertEqual(getSection(summary.sections, 'now').count, queue.length, 'Now count');
    },
  },
  {
    name: 'new cards blocked by the daily limit appear in New, not Now',
    run: () => {
      const cards = [makeCard('new-1'), makeCard('new-2')];
      const logs = Array.from({ length: 10 }, (_, index) => makeLog(`introduced-${index}`));
      const summary = summarizeSessionRecap('deck-a', cards, { now: NOW, reviewLogs: logs });

      assertEqual(getSection(summary.sections, 'now').count, 0, 'blocked new cards in Now');
      assertEqual(getSection(summary.sections, 'new').count, 2, 'blocked new cards in New');
    },
  },
  {
    name: 'a learning card due in 5 minutes appears in Soon',
    run: () => {
      const summary = summarizeSessionRecap('deck-a', [makeCard('soon', 'learning', new Date(2026, 6, 13, 15, 35))], {
        now: NOW,
        reviewLogs: [],
      });

      assertEqual(getSection(summary.sections, 'soon').count, 1, 'Soon count');
      assertIncludes([getSection(summary.sections, 'soon').detail], 'Next in 5 min', 'Soon detail');
    },
  },
  {
    name: 'a card due later today appears in Later',
    run: () => {
      const summary = summarizeSessionRecap('deck-a', [makeCard('later', 'review', new Date(2026, 6, 13, 18, 20))], {
        now: NOW,
        reviewLogs: [],
      });

      assertEqual(getSection(summary.sections, 'later').count, 1, 'Later count');
    },
  },
  {
    name: 'a card due tomorrow appears in Far',
    run: () => {
      const summary = summarizeSessionRecap('deck-a', [makeCard('tomorrow', 'review', new Date(2026, 6, 14, 9, 0))], {
        now: NOW,
        reviewLogs: [],
      });

      assertEqual(getSection(summary.sections, 'far').count, 1, 'Far count');
      assertIncludes([getSection(summary.sections, 'far').detail], 'tomorrow at 9:00 AM', 'Far detail');
    },
  },
  {
    name: 'active cards appear in no more than one recap section',
    run: () => {
      const cards = [
        makeCard('new'),
        makeCard('learning-now', 'learning', new Date(2026, 6, 13, 15, 0)),
        makeCard('learning-soon', 'learning', new Date(2026, 6, 13, 15, 35)),
        makeCard('review-later', 'review', new Date(2026, 6, 13, 18, 20)),
        makeCard('review-far', 'review', new Date(2026, 6, 14, 9, 0)),
      ];
      const summary = summarizeSessionRecap('deck-a', cards, { now: NOW, reviewLogs: [] });
      const assignedIds = summary.sections.flatMap((section) => section.cardIds);

      assertEqual(new Set(assignedIds).size, assignedIds.length, 'section overlap');
      assertEqual(assignedIds.length, cards.length, 'active card assignment');
    },
  },
  {
    name: 'restart count uses fresh data instead of the old session array',
    run: () => {
      const oldSessionCards = [makeCard('old-1'), makeCard('old-2')];
      const freshCards = [makeCard('fresh-due', 'review', new Date(2026, 6, 13, 14, 0))];
      const summary = summarizeSessionRecap('deck-a', freshCards, { now: NOW, reviewLogs: [] });

      assertEqual(oldSessionCards.length, 2, 'old session fixture');
      assertEqual(summary.currentDueCount, 1, 'fresh restart due count');
    },
  },
  {
    name: 'positive restart count permits a fresh session with loaded cards',
    run: () => {
      const freshCards = [makeCard('fresh-due', 'review', new Date(2026, 6, 13, 14, 0))];
      const summary = summarizeSessionRecap('deck-a', freshCards, { now: NOW, reviewLogs: [] });

      assertEqual(canRestartReviewSession(summary.currentDueCount), true, 'positive restart');
      assertEqual(summary.sections.find((section) => section.key === 'now')?.cardIds[0], 'fresh-due', 'fresh session card');
      assertEqual(
        shouldShowSessionRecap({
          isDueMode: true,
          sessionStartedWithCards: true,
          sessionReviewedCount: 0,
          currentQueueLength: summary.currentDueCount,
        }),
        false,
        'fresh restarted session state',
      );
    },
  },
  {
    name: 'restart is disabled when the live due count is zero',
    run: () => {
      assertEqual(canRestartReviewSession(0), false, 'zero-card restart');
    },
  },
  {
    name: 'removing the final qualifying log updates queue and recap state',
    run: () => {
      const cards = [makeCard('new-1'), ...Array.from({ length: 10 }, (_, index) => makeCard(`new-${index + 2}`))];
      const logs = Array.from({ length: 10 }, (_, index) => makeLog(`introduced-${index}`));
      const completed = summarizeSessionRecap('deck-a', cards, { now: NOW, reviewLogs: logs });
      const afterUndo = summarizeSessionRecap('deck-a', cards, { now: NOW, reviewLogs: logs.slice(0, -1) });

      assertEqual(completed.currentDueCount, 0, 'completed queue before undo');
      assertEqual(afterUndo.currentDueCount, 1, 'queue after undo');
      assertEqual(
        shouldShowSessionRecap({
          isDueMode: true,
          sessionStartedWithCards: true,
          sessionReviewedCount: 9,
          currentQueueLength: afterUndo.currentDueCount,
        }),
        false,
        'recap after undo',
      );
    },
  },
  {
    name: 'local midnight separates Later from Far',
    run: () => {
      const lateNow = new Date(2026, 6, 13, 23, 55);
      const summary = summarizeSessionRecap(
        'deck-a',
        [
          makeCard('before-midnight', 'review', new Date(2026, 6, 13, 23, 59)),
          makeCard('at-midnight', 'review', new Date(2026, 6, 14, 0, 0)),
        ],
        { now: lateNow, reviewLogs: [] },
      );

      assertEqual(getSection(summary.sections, 'later').count, 1, 'pre-midnight Later count');
      assertEqual(getSection(summary.sections, 'far').count, 1, 'midnight Far count');
    },
  },
  {
    name: 'refresh summary moves a learning card into Now when it becomes due',
    run: () => {
      const card = makeCard('refresh-learning', 'learning', new Date(2026, 6, 13, 15, 35));
      const before = summarizeSessionRecap('deck-a', [card], { now: NOW, reviewLogs: [] });
      const after = summarizeSessionRecap('deck-a', [card], {
        now: new Date(2026, 6, 13, 15, 36),
        reviewLogs: [],
      });

      assertEqual(before.currentDueCount, 0, 'refresh count before due');
      assertEqual(after.currentDueCount, 1, 'refresh count after due');
      assertEqual(getSection(after.sections, 'now').count, 1, 'refreshed Now count');
      assertEqual(after.recommendedNextStudy, 'Now', 'refreshed recommendation');
      assertEqual(after.recommendedNextStudyCardCount, 1, 'refreshed recommendation count');
    },
  },
  {
    name: '30 seconds formats as less than one minute',
    run: () => {
      assertEqual(
        formatReviewCountdown(new Date(NOW.getTime() + 30_000), NOW),
        'In less than 1 min',
        '30-second countdown',
      );
    },
  },
  {
    name: 'five minutes formats as five minutes',
    run: () => {
      assertEqual(formatReviewCountdown(new Date(NOW.getTime() + 5 * 60_000), NOW), 'In 5 min', 'five-minute countdown');
    },
  },
  {
    name: 'one hour formats as one hour',
    run: () => {
      assertEqual(formatReviewCountdown(new Date(NOW.getTime() + 60 * 60_000), NOW), 'In 1 hr', 'one-hour countdown');
    },
  },
  {
    name: 'seventy-five minutes formats as one hour and fifteen minutes',
    run: () => {
      assertEqual(
        formatReviewCountdown(new Date(NOW.getTime() + 75 * 60_000), NOW),
        'In 1 hr 15 min',
        'seventy-five-minute countdown',
      );
    },
  },
  {
    name: 'six hours formats as six hours',
    run: () => {
      assertEqual(formatReviewCountdown(new Date(NOW.getTime() + 6 * 60 * 60_000), NOW), 'In 6 hr', 'six-hour countdown');
    },
  },
  {
    name: 'twenty-seven hours includes total hours and local tomorrow time',
    run: () => {
      const countdown = formatReviewCountdown(new Date(2026, 6, 14, 18, 30), NOW);
      assertIncludes([countdown], 'In 27 hr \u2014 tomorrow at', '27-hour countdown');
    },
  },
  {
    name: 'recommendation uses the earliest upcoming card',
    run: () => {
      const summary = summarizeSessionRecap(
        'deck-a',
        [
          makeCard('later', 'learning', new Date(2026, 6, 13, 16, 45)),
          makeCard('soonest', 'learning', new Date(2026, 6, 13, 16, 5)),
          makeCard('later-too', 'review', new Date(2026, 6, 13, 18, 0)),
        ],
        { now: NOW, reviewLogs: [] },
      );

      assertEqual(summary.recommendedNextStudy, 'In 35 min', 'earliest recommendation');
      assertEqual(summary.recommendedNextStudyCardCount, 1, 'earliest recommendation count');
    },
  },
  {
    name: 'exhausted new quota shows the actual local-midnight countdown',
    run: () => {
      const lateNow = new Date(2026, 6, 13, 15, 30);
      const logs = Array.from({ length: 10 }, (_, index) => makeLog(`introduced-${index}`));
      const summary = summarizeSessionRecap('deck-a', [makeCard('blocked-new')], {
        now: lateNow,
        reviewLogs: logs,
      });

      assertEqual(getSection(summary.sections, 'new').detail, 'Available in 8 hr 30 min', 'midnight availability');
      assertEqual(summary.recommendedNextStudy, 'In 8 hr 30 min', 'midnight recommendation');
      assertEqual(summary.recommendedNextStudyCardCount, 1, 'midnight recommendation count');
    },
  },
  {
    name: 'countdowns use elapsed local time across daylight saving changes',
    run: () => {
      const beforeSpringForward = new Date(2026, 2, 8, 1, 55);
      const afterSpringForward = new Date(2026, 2, 8, 3, 5);

      assertEqual(
        formatReviewCountdown(afterSpringForward, beforeSpringForward),
        'In 10 min',
        'daylight-saving countdown',
      );
    },
  },
];

export function runSessionRecapTests() {
  for (const test of tests) {
    test.run();
  }

  return tests.length;
}
