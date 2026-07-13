import type { Flashcard, ReviewGrade, ReviewLog } from '@/types/flashcard';
import {
  getRemainingNewCardSlots,
  getReviewQueue,
  type ReviewQueueOptions,
} from './review-queue';
import { getCardState } from './review-scheduling';

export type SessionRecapSectionKey = 'now' | 'new' | 'soon' | 'later' | 'far';

export type SessionRecapSection = {
  key: SessionRecapSectionKey;
  label: string;
  count: number;
  detail: string;
  cardIds: string[];
};

export type SessionRecapSummary = {
  currentDueCount: number;
  sections: SessionRecapSection[];
  recommendedNextStudy: string;
  recommendedNextStudyCardCount: number;
};

export type SessionRecapOptions = {
  now?: Date;
  reviewLogs?: ReviewLog[];
  dailyNewCardLimit?: number;
};

export type ReviewGradeCounts = Record<ReviewGrade, number>;

export type SessionCompletionInput = {
  isDueMode: boolean;
  sessionStartedWithCards: boolean;
  sessionReviewedCount: number;
  currentQueueLength: number;
};

const MINUTE_MS = 60_000;
const SOON_WINDOW_MINUTES = 10;
const TIME_SEPARATOR = ' \u2014 ';

function startOfLocalDay(now: Date) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function formatClock(value: Date) {
  return value.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatFriendlyDueDate(value: Date, now: Date) {
  const today = startOfLocalDay(now);
  const dueDay = startOfLocalDay(value);
  const todayCalendar = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const dueCalendar = Date.UTC(dueDay.getFullYear(), dueDay.getMonth(), dueDay.getDate());
  const daysUntil = Math.round((dueCalendar - todayCalendar) / 86_400_000);

  if (daysUntil === 1) {
    return `tomorrow at ${formatClock(value)}`;
  }

  if (daysUntil > 1 && daysUntil < 7) {
    return `${value.toLocaleDateString(undefined, { weekday: 'long' })} at ${formatClock(value)}`;
  }

  return `${value.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at ${formatClock(value)}`;
}

/** Format the real elapsed time until a card's dueAt in the device's local time. */
export function formatReviewCountdown(dueAt: Date | string, now: Date): string {
  const dueDate = typeof dueAt === 'string' ? new Date(dueAt) : dueAt;
  const dueTime = dueDate.getTime();
  const nowTime = now.getTime();

  if (Number.isNaN(dueTime) || Number.isNaN(nowTime)) {
    return 'No review scheduled';
  }

  if (dueTime <= nowTime) {
    return 'Now';
  }

  const wholeMinutes = Math.floor((dueTime - nowTime) / MINUTE_MS);

  if (wholeMinutes < 1) {
    return 'In less than 1 min';
  }

  if (wholeMinutes < 60) {
    return `In ${wholeMinutes} min`;
  }

  const hours = Math.floor(wholeMinutes / 60);
  const minutes = wholeMinutes % 60;

  if (wholeMinutes < 24 * 60) {
    return minutes > 0 ? `In ${hours} hr ${minutes} min` : `In ${hours} hr`;
  }

  if (wholeMinutes < 48 * 60) {
    return `In ${hours} hr${TIME_SEPARATOR}${formatFriendlyDueDate(dueDate, now)}`;
  }

  const days = Math.floor(wholeMinutes / (24 * 60));
  const dayLabel = days === 1 ? 'day' : 'days';
  return `In ${days} ${dayLabel}${TIME_SEPARATOR}${formatFriendlyDueDate(dueDate, now)}`;
}

function lowercaseFirst(value: string) {
  return value.length > 0 ? `${value[0].toLowerCase()}${value.slice(1)}` : value;
}

function createSection(
  key: SessionRecapSectionKey,
  label: string,
  cardIds: string[],
  detail: string,
): SessionRecapSection {
  return {
    key,
    label,
    count: cardIds.length,
    detail,
    cardIds,
  };
}

function getEarliestDueAt(cardIds: string[], cardsById: Map<string, Flashcard>) {
  const dueDates = cardIds
    .map((cardId) => cardsById.get(cardId)?.dueAt)
    .filter((dueAt): dueAt is string => Boolean(dueAt))
    .map((dueAt) => new Date(dueAt))
    .filter((dueAt) => !Number.isNaN(dueAt.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  return dueDates[0];
}

function getScheduledCardState(card: Flashcard) {
  const state = getCardState(card);
  return state === 'learning' || state === 'relearning' || state === 'review';
}

function getNextDetail(
  cardIds: string[],
  cardsById: Map<string, Flashcard>,
  now: Date,
  includeClock = false,
  includeDate = false,
) {
  const earliest = getEarliestDueAt(cardIds, cardsById);

  if (!earliest) {
    return 'No cards in this window';
  }

  const countdown = formatReviewCountdown(earliest, now);
  const clockSuffix = includeClock ? `${TIME_SEPARATOR}${formatClock(earliest)}` : '';
  const dateSuffix = includeDate && !countdown.includes(TIME_SEPARATOR)
    ? `${TIME_SEPARATOR}${formatFriendlyDueDate(earliest, now)}`
    : '';
  return `Next ${lowercaseFirst(countdown)}${dateSuffix || clockSuffix}`;
}

type FutureReviewCandidate = {
  dueAt: Date;
  count: number;
};

function getEarliestFutureReview(
  cards: Flashcard[],
  now: Date,
  newCardIds: string[],
  remainingNewSlots: number,
  nextLocalMidnight: Date,
): FutureReviewCandidate | undefined {
  const candidates: FutureReviewCandidate[] = [];
  const dueTimes = new Map<number, number>();

  for (const card of cards) {
    if (!getScheduledCardState(card) || !card.dueAt) {
      continue;
    }

    const dueAt = new Date(card.dueAt);

    if (Number.isNaN(dueAt.getTime()) || dueAt.getTime() <= now.getTime()) {
      continue;
    }

    dueTimes.set(dueAt.getTime(), (dueTimes.get(dueAt.getTime()) ?? 0) + 1);
  }

  for (const [time, count] of dueTimes) {
    candidates.push({ dueAt: new Date(time), count });
  }

  if (remainingNewSlots === 0 && newCardIds.length > 0) {
    candidates.push({ dueAt: nextLocalMidnight, count: newCardIds.length });
  }

  if (candidates.length === 0) {
    return undefined;
  }

  const earliestTime = Math.min(...candidates.map((candidate) => candidate.dueAt.getTime()));
  return candidates
    .filter((candidate) => candidate.dueAt.getTime() === earliestTime)
    .reduce(
      (earliest, candidate) => ({
        dueAt: earliest.dueAt,
        count: earliest.count + candidate.count,
      }),
    );
}

/**
 * Summarize active cards into the same live queue and future scheduling windows
 * shown by the completed-session recap.
 */
export function summarizeSessionRecap(
  deckId: string,
  cards: Flashcard[],
  options: SessionRecapOptions = {},
): SessionRecapSummary {
  const now = options.now ?? new Date();
  const reviewLogs = options.reviewLogs ?? [];
  const queueOptions: ReviewQueueOptions = {
    now,
    reviewLogs,
    dailyNewCardLimit: options.dailyNewCardLimit,
  };
  const queue = getReviewQueue(cards, queueOptions);
  const nowCardIds = new Set(queue.map((card) => card.id));
  const cardsById = new Map(cards.map((card) => [card.id, card]));
  const newCardIds: string[] = [];
  const soonCardIds: string[] = [];
  const laterCardIds: string[] = [];
  const farCardIds: string[] = [];
  const soonWindowEnd = new Date(now.getTime() + SOON_WINDOW_MINUTES * MINUTE_MS);
  const nextLocalMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  for (const card of cards) {
    if (nowCardIds.has(card.id)) {
      continue;
    }

    const state = getCardState(card);

    if (state === 'new') {
      newCardIds.push(card.id);
      continue;
    }

    if (state === 'suspended' || !getScheduledCardState(card) || !card.dueAt) {
      continue;
    }

    const dueAt = new Date(card.dueAt);

    if (Number.isNaN(dueAt.getTime()) || dueAt.getTime() <= now.getTime()) {
      continue;
    }

    if (
      (state === 'learning' || state === 'relearning') &&
      dueAt.getTime() <= soonWindowEnd.getTime()
    ) {
      soonCardIds.push(card.id);
    } else if (dueAt.getTime() < nextLocalMidnight.getTime()) {
      laterCardIds.push(card.id);
    } else {
      farCardIds.push(card.id);
    }
  }

  const remainingNewSlots = getRemainingNewCardSlots(deckId, queueOptions);
  const sections = [
    createSection('now', 'Now', [...nowCardIds], 'Ready now'),
    createSection(
      'new',
      'New',
      newCardIds,
      newCardIds.length === 0
        ? 'No cards in this window'
        : remainingNewSlots > 0
        ? 'Available now'
        : `Available ${lowercaseFirst(formatReviewCountdown(nextLocalMidnight, now))}`,
    ),
    createSection('soon', 'Soon', soonCardIds, getNextDetail(soonCardIds, cardsById, now)),
    createSection('later', 'Later', laterCardIds, getNextDetail(laterCardIds, cardsById, now, true)),
    createSection('far', 'Far', farCardIds, getNextDetail(farCardIds, cardsById, now, false, true)),
  ];

  const futureReview =
    queue.length > 0
      ? { dueAt: now, count: queue.length }
      : getEarliestFutureReview(cards, now, newCardIds, remainingNewSlots, nextLocalMidnight);

  return {
    currentDueCount: queue.length,
    sections,
    recommendedNextStudy: futureReview
      ? formatReviewCountdown(futureReview.dueAt, now)
      : 'No more reviews scheduled',
    recommendedNextStudyCardCount: futureReview?.count ?? 0,
  };
}

export function shouldShowSessionRecap({
  isDueMode,
  sessionStartedWithCards,
  sessionReviewedCount,
  currentQueueLength,
}: SessionCompletionInput) {
  return (
    isDueMode &&
    sessionStartedWithCards &&
    sessionReviewedCount > 0 &&
    currentQueueLength === 0
  );
}

export function canRestartReviewSession(currentDueCount: number) {
  return currentDueCount > 0;
}
