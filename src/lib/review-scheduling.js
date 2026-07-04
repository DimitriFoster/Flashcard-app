"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCardState = getCardState;
exports.calculateNextReviewState = calculateNextReviewState;
var DEFAULT_EASE_FACTOR = 2.5;
var MIN_EASE_FACTOR = 1.3;
var LEARNING_STEPS_MINUTES = [1, 10];
var RELEARNING_STEPS_MINUTES = [10];
/** Return a new Date instead of mutating the original Date object. */
function addDays(date, days) {
    var nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
}
/** Return a new Date instead of mutating the original Date object. */
function addMinutes(date, minutes) {
    var nextDate = new Date(date);
    nextDate.setMinutes(nextDate.getMinutes() + minutes);
    return nextDate;
}
function clampEase(value) {
    return Math.max(MIN_EASE_FACTOR, value);
}
function getCardState(card) {
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
function calculateNextReviewState(flashcard, grade) {
    var _a, _b, _c, _d, _e;
    var now = new Date();
    var nowIso = now.toISOString();
    var state = getCardState(flashcard);
    var currentEase = (_a = flashcard.easeFactor) !== null && _a !== void 0 ? _a : DEFAULT_EASE_FACTOR;
    var currentInterval = (_b = flashcard.intervalDays) !== null && _b !== void 0 ? _b : 0;
    var currentRepetitions = (_c = flashcard.repetitions) !== null && _c !== void 0 ? _c : 0;
    var currentLapses = (_d = flashcard.lapses) !== null && _d !== void 0 ? _d : 0;
    var currentLearningStep = (_e = flashcard.learningStepIndex) !== null && _e !== void 0 ? _e : 0;
    if (state === 'suspended') {
        return {
            lastReviewedAt: flashcard.lastReviewedAt,
        };
    }
    if (state === 'new' || state === 'learning') {
        if (grade === 'again') {
            return {
                state: 'learning',
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
                state: 'learning',
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
            var intervalDays_1 = 4;
            return {
                state: 'review',
                learningStepIndex: 0,
                dueAt: addDays(now, intervalDays_1).toISOString(),
                intervalDays: intervalDays_1,
                easeFactor: clampEase(currentEase + 0.15),
                repetitions: currentRepetitions + 1,
                lapses: currentLapses,
                lastReviewedAt: nowIso,
                lastStruggledAt: flashcard.lastStruggledAt,
            };
        }
        var nextLearningStep = currentLearningStep + 1;
        if (nextLearningStep < LEARNING_STEPS_MINUTES.length) {
            return {
                state: 'learning',
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
        var intervalDays_2 = 1;
        return {
            state: 'review',
            learningStepIndex: 0,
            dueAt: addDays(now, intervalDays_2).toISOString(),
            intervalDays: intervalDays_2,
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
                state: 'relearning',
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
                state: 'relearning',
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
        var intervalDays_3 = grade === 'easy'
            ? Math.max(3, Math.round((currentInterval || 1) * 1.15))
            : Math.max(1, Math.round((currentInterval || 1) * 0.8));
        return {
            state: 'review',
            learningStepIndex: 0,
            dueAt: addDays(now, intervalDays_3).toISOString(),
            intervalDays: intervalDays_3,
            easeFactor: grade === 'easy' ? clampEase(currentEase + 0.1) : currentEase,
            repetitions: currentRepetitions + 1,
            lapses: currentLapses,
            lastReviewedAt: nowIso,
            lastStruggledAt: flashcard.lastStruggledAt,
        };
    }
    if (grade === 'again') {
        return {
            state: 'relearning',
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
    var easeDelta = grade === 'hard' ? -0.15 : grade === 'easy' ? 0.15 : 0;
    var easeFactor = clampEase(currentEase + easeDelta);
    var intervalDays = grade === 'hard'
        ? Math.max(1, Math.round((currentInterval || 1) * 1.2))
        : grade === 'easy'
            ? Math.max(4, Math.round((currentInterval || 1) * easeFactor * 1.3))
            : currentRepetitions === 0
                ? 1
                : currentRepetitions === 1
                    ? 3
                    : Math.max(2, Math.round((currentInterval || 1) * easeFactor));
    return {
        state: 'review',
        learningStepIndex: 0,
        dueAt: addDays(now, intervalDays).toISOString(),
        intervalDays: intervalDays,
        easeFactor: easeFactor,
        repetitions: currentRepetitions + 1,
        lapses: currentLapses,
        lastReviewedAt: nowIso,
        lastStruggledAt: grade === 'hard' ? nowIso : flashcard.lastStruggledAt,
    };
}
