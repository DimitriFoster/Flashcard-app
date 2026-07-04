"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
/**
 * MMKV storage instance.
 *
 * react-native-mmkv provides fast local key/value storage. This app uses it as
 * an offline-first persistence layer for decks and flashcards.
 */
var react_native_mmkv_1 = require("react-native-mmkv");
/**
 * The id names this app's storage namespace.
 * Keeping it stable prevents data from disappearing between app launches.
 */
exports.storage = (0, react_native_mmkv_1.createMMKV)({
    id: 'flashcard-app-storage',
});
