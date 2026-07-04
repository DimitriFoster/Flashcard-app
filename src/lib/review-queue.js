"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAILY_NEW_CARD_LIMIT = void 0;
exports.isCardDue = isCardDue;
exports.getReviewQueue = getReviewQueue;
exports.getDueCards = getDueCards;
var review_scheduling_1 = require("./review-scheduling");
exports.DAILY_NEW_CARD_LIMIT = 10;
function dueTime(card) {
    return card.dueAt ? new Date(card.dueAt).getTime() : 0;
}
/**
 * New cards are reviewable, but getReviewQueue caps how many new cards are
 * introduced at once. Scheduled cards are due when their dueAt timestamp is now
 * or in the past.
 */
function isCardDue(card, now) {
    if (now === void 0) { now = new Date(); }
    var state = (0, review_scheduling_1.getCardState)(card);
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
function getReviewQueue(cards, now) {
    if (now === void 0) { now = new Date(); }
    var dueLearning = cards
        .filter(function (card) { return (0, review_scheduling_1.getCardState)(card) === 'learning' && isCardDue(card, now); })
        .sort(function (a, b) { return dueTime(a) - dueTime(b); });
    var dueRelearning = cards
        .filter(function (card) { return (0, review_scheduling_1.getCardState)(card) === 'relearning' && isCardDue(card, now); })
        .sort(function (a, b) { return dueTime(a) - dueTime(b); });
    var dueReview = cards
        .filter(function (card) { return (0, review_scheduling_1.getCardState)(card) === 'review' && isCardDue(card, now); })
        .sort(function (a, b) { return dueTime(a) - dueTime(b); });
    var newCards = cards
        .filter(function (card) { return (0, review_scheduling_1.getCardState)(card) === 'new'; })
        .sort(function (a, b) { return a.createdAt.localeCompare(b.createdAt); })
        .slice(0, exports.DAILY_NEW_CARD_LIMIT);
    return __spreadArray(__spreadArray(__spreadArray(__spreadArray([], dueLearning, true), dueRelearning, true), dueReview, true), newCards, true);
}
function getDueCards(cards, now) {
    if (now === void 0) { now = new Date(); }
    return getReviewQueue(cards, now);
}
