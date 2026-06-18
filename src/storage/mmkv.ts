/**
 * MMKV storage instance.
 *
 * react-native-mmkv provides fast local key/value storage. This app uses it as
 * an offline-first persistence layer for decks and flashcards.
 */
import { createMMKV } from 'react-native-mmkv';

/**
 * The id names this app's storage namespace.
 * Keeping it stable prevents data from disappearing between app launches.
 */
export const storage = createMMKV({
  id: 'flashcard-app-storage',
});
