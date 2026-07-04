"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.DEFAULT_DECK_ID = void 0;
exports.getDecks = getDecks;
exports.addDeck = addDeck;
exports.getFlashcards = getFlashcards;
exports.getFlashcardsByDeck = getFlashcardsByDeck;
exports.addFlashcard = addFlashcard;
exports.updateFlashcard = updateFlashcard;
exports.getReviewLogs = getReviewLogs;
exports.getLastReviewUndo = getLastReviewUndo;
exports.reviewFlashcard = reviewFlashcard;
exports.undoLastReview = undoLastReview;
exports.importParsedCards = importParsedCards;
exports.exportAppBackup = exportAppBackup;
exports.exportAppBackupText = exportAppBackupText;
exports.importAppBackupText = importAppBackupText;
exports.deleteDeck = deleteDeck;
exports.deleteFlashcard = deleteFlashcard;
exports.clearFlashcards = clearFlashcards;
/**
 * Flashcard and deck storage helpers.
 *
 * This file is the app's local data access layer. Screens should call these
 * functions instead of reading/writing MMKV directly.
 */
var react_native_1 = require("react-native");
var review_scheduling_1 = require("@/lib/review-scheduling");
var mmkv_1 = require("./mmkv");
var FLASHCARDS_KEY = 'flashcards';
var DECKS_KEY = 'decks';
var REVIEW_LOGS_KEY = 'review-logs';
var LAST_REVIEW_UNDO_KEY = 'last-review-undo';
var NOTES_KEY = 'notes';
var NOTEBOOKS_KEY = 'note-notebooks';
/** Stable fallback deck used when the app starts with no saved decks. */
exports.DEFAULT_DECK_ID = 'default-deck';
/**
 * Safely parse an array from storage.
 * If storage has invalid JSON or the wrong shape, return an empty array instead
 * of crashing the app.
 */
function parseJsonArray(value) {
    if (!value) {
        return [];
    }
    try {
        var parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch (_a) {
        return [];
    }
}
function parseJsonObject(value) {
    if (!value) {
        return undefined;
    }
    try {
        var parsed = JSON.parse(value);
        return parsed && typeof parsed === 'object' ? parsed : undefined;
    }
    catch (_a) {
        return undefined;
    }
}
/**
 * Protects against storage reads during web/static rendering.
 * On native, MMKV is available. On web, window must exist first.
 */
function canUseStorage() {
    return react_native_1.Platform.OS !== 'web' || typeof window !== 'undefined';
}
/**
 * Simple local ID generator.
 * Good enough for offline local data; replace with UUIDs if sync is added later.
 */
function createId(prefix) {
    return "".concat(prefix, "-").concat(Date.now(), "-").concat(Math.random().toString(36).slice(2, 10));
}
function createDefaultDeck() {
    var now = new Date().toISOString();
    return {
        id: exports.DEFAULT_DECK_ID,
        name: 'Main Deck',
        createdAt: now,
        updatedAt: now,
    };
}
function saveFlashcards(flashcards) {
    mmkv_1.storage.set(FLASHCARDS_KEY, JSON.stringify(flashcards));
}
function saveDecks(decks) {
    mmkv_1.storage.set(DECKS_KEY, JSON.stringify(decks));
}
function saveReviewLogs(logs) {
    mmkv_1.storage.set(REVIEW_LOGS_KEY, JSON.stringify(logs));
}
function saveLastReviewUndo(value) {
    mmkv_1.storage.set(LAST_REVIEW_UNDO_KEY, JSON.stringify(value));
}
function clearLastReviewUndo() {
    mmkv_1.storage.remove(LAST_REVIEW_UNDO_KEY);
}
/**
 * Normalize cards loaded from storage.
 * This doubles as a lightweight migration layer if older cards are missing fields.
 */
function normalizeFlashcard(card) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var now = new Date().toISOString();
    var dueAt = card.dueAt;
    var state = (_a = card.state) !== null && _a !== void 0 ? _a : (dueAt ? 'review' : 'new');
    return {
        id: (_b = card.id) !== null && _b !== void 0 ? _b : createId('card'),
        deckId: (_c = card.deckId) !== null && _c !== void 0 ? _c : exports.DEFAULT_DECK_ID,
        front: (_d = card.front) !== null && _d !== void 0 ? _d : '',
        back: (_e = card.back) !== null && _e !== void 0 ? _e : '',
        createdAt: (_f = card.createdAt) !== null && _f !== void 0 ? _f : now,
        updatedAt: (_g = card.updatedAt) !== null && _g !== void 0 ? _g : now,
        state: state,
        learningStepIndex: (_h = card.learningStepIndex) !== null && _h !== void 0 ? _h : 0,
        dueAt: dueAt,
        intervalDays: (_j = card.intervalDays) !== null && _j !== void 0 ? _j : 0,
        easeFactor: (_k = card.easeFactor) !== null && _k !== void 0 ? _k : 2.5,
        repetitions: (_l = card.repetitions) !== null && _l !== void 0 ? _l : 0,
        lapses: (_m = card.lapses) !== null && _m !== void 0 ? _m : 0,
        lastReviewedAt: card.lastReviewedAt,
        lastStruggledAt: card.lastStruggledAt,
    };
}
/** Normalize decks loaded from storage or recovered from card deck IDs. */
function normalizeDeck(deck) {
    var _a, _b, _c, _d;
    var now = new Date().toISOString();
    return {
        id: (_a = deck.id) !== null && _a !== void 0 ? _a : createId('deck'),
        name: ((_b = deck.name) === null || _b === void 0 ? void 0 : _b.trim()) || 'Untitled Deck',
        createdAt: (_c = deck.createdAt) !== null && _c !== void 0 ? _c : now,
        updatedAt: (_d = deck.updatedAt) !== null && _d !== void 0 ? _d : now,
    };
}
function createReviewLog(previousCard, nextCard, grade) {
    var _a;
    return {
        id: createId('review-log'),
        cardId: previousCard.id,
        deckId: previousCard.deckId,
        grade: grade,
        reviewedAt: (_a = nextCard.lastReviewedAt) !== null && _a !== void 0 ? _a : new Date().toISOString(),
        previousState: (0, review_scheduling_1.getCardState)(previousCard),
        nextState: (0, review_scheduling_1.getCardState)(nextCard),
        previousDueAt: previousCard.dueAt,
        nextDueAt: nextCard.dueAt,
        previousIntervalDays: previousCard.intervalDays,
        nextIntervalDays: nextCard.intervalDays,
        previousEaseFactor: previousCard.easeFactor,
        nextEaseFactor: nextCard.easeFactor,
    };
}
function getDecks() {
    if (!canUseStorage()) {
        return [];
    }
    var flashcards = getFlashcards();
    var savedDecks = parseJsonArray(mmkv_1.storage.getString(DECKS_KEY)).map(normalizeDeck);
    var decks = savedDecks.length > 0 ? savedDecks : [createDefaultDeck()];
    /**
     * If flashcards reference decks that do not exist anymore, recover placeholder
     * decks so those cards remain reachable instead of becoming orphaned data.
     */
    var knownDeckIds = new Set(decks.map(function (deck) { return deck.id; }));
    var missingDeckIds = new Set(flashcards.map(function (flashcard) { return flashcard.deckId; }).filter(function (deckId) { return !knownDeckIds.has(deckId); }));
    var nextDecks = __spreadArray(__spreadArray([], decks, true), Array.from(missingDeckIds).map(function (deckId) {
        return normalizeDeck({
            id: deckId,
            name: deckId === exports.DEFAULT_DECK_ID ? 'Main Deck' : 'Recovered Deck',
        });
    }), true);
    if (nextDecks.length !== savedDecks.length) {
        saveDecks(nextDecks);
    }
    return nextDecks;
}
function addDeck(input) {
    if (!canUseStorage()) {
        throw new Error('Deck storage is only available on the client.');
    }
    var now = new Date().toISOString();
    var deck = {
        id: createId('deck'),
        name: input.name.trim(),
        createdAt: now,
        updatedAt: now,
    };
    var decks = __spreadArray([deck], getDecks(), true);
    saveDecks(decks);
    return deck;
}
function getFlashcards() {
    if (!canUseStorage()) {
        return [];
    }
    var rawCards = parseJsonArray(mmkv_1.storage.getString(FLASHCARDS_KEY));
    var flashcards = rawCards.map(normalizeFlashcard);
    /** If normalization filled missing SRS values, write the migrated data back. */
    var needsMigration = rawCards.some(function (card, index) {
        var normalized = flashcards[index];
        return (card.deckId !== normalized.deckId ||
            card.state !== normalized.state ||
            card.learningStepIndex !== normalized.learningStepIndex ||
            card.intervalDays !== normalized.intervalDays ||
            card.easeFactor !== normalized.easeFactor ||
            card.repetitions !== normalized.repetitions ||
            card.lapses !== normalized.lapses);
    });
    if (needsMigration) {
        saveFlashcards(flashcards);
    }
    return flashcards;
}
function getFlashcardsByDeck(deckId) {
    return getFlashcards().filter(function (flashcard) { return flashcard.deckId === deckId; });
}
function addFlashcard(input) {
    if (!canUseStorage()) {
        throw new Error('Flashcard storage is only available on the client.');
    }
    var now = new Date().toISOString();
    var flashcard = {
        id: createId('card'),
        deckId: input.deckId,
        front: input.front,
        back: input.back,
        createdAt: now,
        updatedAt: now,
        state: 'new',
        learningStepIndex: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        repetitions: 0,
        lapses: 0,
    };
    var flashcards = __spreadArray([flashcard], getFlashcards(), true);
    saveFlashcards(flashcards);
    return flashcard;
}
function updateFlashcard(id, input) {
    if (!canUseStorage()) {
        return undefined;
    }
    var now = new Date().toISOString();
    var updatedFlashcard;
    var flashcards = getFlashcards().map(function (flashcard) {
        if (flashcard.id !== id) {
            return flashcard;
        }
        updatedFlashcard = __assign(__assign(__assign({}, flashcard), input), { updatedAt: now });
        return updatedFlashcard;
    });
    if (updatedFlashcard) {
        saveFlashcards(flashcards);
    }
    return updatedFlashcard;
}
function getReviewLogs() {
    if (!canUseStorage()) {
        return [];
    }
    return parseJsonArray(mmkv_1.storage.getString(REVIEW_LOGS_KEY));
}
function getLastReviewUndo() {
    if (!canUseStorage()) {
        return undefined;
    }
    return parseJsonObject(mmkv_1.storage.getString(LAST_REVIEW_UNDO_KEY));
}
function reviewFlashcard(id, grade) {
    if (!canUseStorage()) {
        return undefined;
    }
    var now = new Date().toISOString();
    var reviewedFlashcard;
    var previousFlashcard;
    var flashcards = getFlashcards().map(function (flashcard) {
        if (flashcard.id !== id) {
            return flashcard;
        }
        previousFlashcard = flashcard;
        reviewedFlashcard = __assign(__assign(__assign({}, flashcard), (0, review_scheduling_1.calculateNextReviewState)(flashcard, grade)), { updatedAt: now });
        return reviewedFlashcard;
    });
    if (reviewedFlashcard && previousFlashcard) {
        var log = createReviewLog(previousFlashcard, reviewedFlashcard, grade);
        var logs = __spreadArray([log], getReviewLogs(), true);
        saveFlashcards(flashcards);
        saveReviewLogs(logs);
        saveLastReviewUndo({
            card: previousFlashcard,
            logId: log.id,
        });
    }
    return reviewedFlashcard;
}
function undoLastReview() {
    if (!canUseStorage()) {
        return undefined;
    }
    var undo = getLastReviewUndo();
    if (!undo) {
        return undefined;
    }
    var restoredCard;
    var flashcards = getFlashcards().map(function (flashcard) {
        if (flashcard.id !== undo.card.id) {
            return flashcard;
        }
        restoredCard = undo.card;
        return undo.card;
    });
    if (!restoredCard) {
        clearLastReviewUndo();
        return undefined;
    }
    saveFlashcards(flashcards);
    saveReviewLogs(getReviewLogs().filter(function (log) { return log.id !== undo.logId; }));
    clearLastReviewUndo();
    return restoredCard;
}
function createNewImportedFlashcard(input) {
    var now = new Date().toISOString();
    return {
        id: createId('card'),
        deckId: input.deckId,
        front: input.front,
        back: input.back,
        createdAt: now,
        updatedAt: now,
        state: 'new',
        learningStepIndex: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        repetitions: 0,
        lapses: 0,
    };
}
function importParsedCards(cards, options) {
    var _a;
    if (!canUseStorage()) {
        throw new Error('Flashcard import is only available on the client.');
    }
    var existingDecks = getDecks();
    var existingCards = getFlashcards();
    var decks = existingDecks;
    var createdDeck;
    var targetDeckId = options.existingDeckId;
    if (options.mode === 'newDeck') {
        createdDeck = addDeck({ name: ((_a = options.newDeckName) === null || _a === void 0 ? void 0 : _a.trim()) || 'Imported Deck' });
        decks = getDecks();
        targetDeckId = createdDeck.id;
    }
    if (!targetDeckId) {
        return {
            importedCards: 0,
            skippedDuplicates: 0,
            skippedRows: cards.length,
            createdDeck: createdDeck,
            decks: decks,
            flashcards: existingCards,
        };
    }
    var duplicateKeys = new Set(existingCards.map(function (card) { return "".concat(card.deckId, "::").concat(card.front.trim().toLowerCase(), "::").concat(card.back.trim().toLowerCase()); }));
    var skippedDuplicates = 0;
    var skippedRows = 0;
    var importedFlashcards = [];
    for (var _i = 0, cards_1 = cards; _i < cards_1.length; _i++) {
        var card = cards_1[_i];
        var front = card.front.trim();
        var back = card.back.trim();
        if (!front || !back) {
            skippedRows += 1;
            continue;
        }
        var deckId = targetDeckId;
        var duplicateKey = "".concat(deckId, "::").concat(front.toLowerCase(), "::").concat(back.toLowerCase());
        if (options.mode === 'existingDeck' && options.skipDuplicates && duplicateKeys.has(duplicateKey)) {
            skippedDuplicates += 1;
            continue;
        }
        duplicateKeys.add(duplicateKey);
        importedFlashcards.push(createNewImportedFlashcard({ deckId: deckId, front: front, back: back }));
    }
    var flashcards = __spreadArray(__spreadArray([], importedFlashcards, true), getFlashcards(), true);
    saveFlashcards(flashcards);
    clearLastReviewUndo();
    return {
        importedCards: importedFlashcards.length,
        skippedDuplicates: skippedDuplicates,
        skippedRows: skippedRows,
        createdDeck: createdDeck,
        decks: getDecks(),
        flashcards: getFlashcards(),
    };
}
function exportAppBackup() {
    if (!canUseStorage()) {
        return {
            version: 1,
            exportedAt: new Date().toISOString(),
            decks: [],
            flashcards: [],
            reviewLogs: [],
            notes: [],
            notebooks: [],
        };
    }
    return {
        version: 1,
        exportedAt: new Date().toISOString(),
        decks: getDecks(),
        flashcards: getFlashcards(),
        reviewLogs: getReviewLogs(),
        notes: parseJsonArray(mmkv_1.storage.getString(NOTES_KEY)),
        notebooks: parseJsonArray(mmkv_1.storage.getString(NOTEBOOKS_KEY)),
    };
}
function exportAppBackupText() {
    return JSON.stringify(exportAppBackup(), null, 2);
}
function importAppBackupText(rawText) {
    if (!canUseStorage()) {
        return undefined;
    }
    try {
        var parsed = JSON.parse(rawText);
        if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.decks) || !Array.isArray(parsed.flashcards)) {
            return undefined;
        }
        var decks = parsed.decks.map(normalizeDeck);
        var flashcards = parsed.flashcards.map(normalizeFlashcard);
        var reviewLogs = Array.isArray(parsed.reviewLogs) ? parsed.reviewLogs : [];
        var notes = Array.isArray(parsed.notes) ? parsed.notes : [];
        var notebooks = Array.isArray(parsed.notebooks) ? parsed.notebooks : [];
        saveDecks(decks.length > 0 ? decks : [createDefaultDeck()]);
        saveFlashcards(flashcards);
        saveReviewLogs(reviewLogs);
        mmkv_1.storage.set(NOTES_KEY, JSON.stringify(notes));
        mmkv_1.storage.set(NOTEBOOKS_KEY, JSON.stringify(notebooks));
        clearLastReviewUndo();
        return {
            decks: getDecks(),
            flashcards: getFlashcards(),
            reviewLogs: getReviewLogs(),
            notes: notes,
            notebooks: notebooks,
        };
    }
    catch (_a) {
        return undefined;
    }
}
function deleteDeck(id) {
    if (!canUseStorage()) {
        return undefined;
    }
    var decks = getDecks();
    var deckToDelete = decks.find(function (deck) { return deck.id === id; });
    if (!deckToDelete) {
        return undefined;
    }
    var flashcards = getFlashcards();
    var nextFlashcards = flashcards.filter(function (flashcard) { return flashcard.deckId !== id; });
    var remainingDecks = decks.filter(function (deck) { return deck.id !== id; });
    var nextDecks = remainingDecks.length > 0 ? remainingDecks : [createDefaultDeck()];
    var deletedCards = flashcards.length - nextFlashcards.length;
    saveDecks(nextDecks);
    saveFlashcards(nextFlashcards);
    saveReviewLogs(getReviewLogs().filter(function (log) { return log.deckId !== id; }));
    clearLastReviewUndo();
    return {
        deck: deckToDelete,
        deletedCards: deletedCards,
        decks: nextDecks,
        flashcards: nextFlashcards,
    };
}
function deleteFlashcard(id) {
    if (!canUseStorage()) {
        return false;
    }
    var flashcards = getFlashcards();
    var nextFlashcards = flashcards.filter(function (flashcard) { return flashcard.id !== id; });
    if (nextFlashcards.length === flashcards.length) {
        return false;
    }
    saveFlashcards(nextFlashcards);
    saveReviewLogs(getReviewLogs().filter(function (log) { return log.cardId !== id; }));
    clearLastReviewUndo();
    return true;
}
/** Development helper for resetting card data without deleting decks. */
function clearFlashcards() {
    if (!canUseStorage()) {
        return;
    }
    mmkv_1.storage.remove(FLASHCARDS_KEY);
    mmkv_1.storage.remove(REVIEW_LOGS_KEY);
    clearLastReviewUndo();
}
