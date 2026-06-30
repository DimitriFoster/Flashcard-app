/**
 * Home screen.
 *
 * This screen is the user's main workspace. It owns the top-level deck/card
 * arrays for the current render and passes behavior down into smaller UI
 * sections.
 *
 * Entry-level React note:
 * - State lives here because both the Create section and the Review shortcut
 *   need access to deck/card data.
 * - Storage calls are still kept in src/storage, so this screen does not know
 *   how MMKV works internally.
 */
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeCreateSection } from '@/components/home/create-section';
import { HomeNotesSection } from '@/components/home/notes-section';
import { HomeReviewSection } from '@/components/home/review-section';
import { COLORS, SPACING } from '@/constants/design';
import {
  addDeck,
  addFlashcard,
  deleteDeck,
  deleteFlashcard,
  exportAppBackupText,
  getDecks,
  getFlashcards,
  importAppBackupText,
  importParsedCards,
} from '@/storage/flashcards';
import type { Deck, Flashcard, NewFlashcard } from '@/types/flashcard';
import type { ImportCardsOptions } from '@/storage/flashcards';
import type { ParsedImportCard } from '@/lib/import-parser';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  /**
   * Decks and cards are loaded from local storage once the screen mounts.
   * They are then updated locally after create actions so the UI responds
   * immediately without waiting for a separate refresh.
   */
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);

  /**
   * This ID controls which deck receives newly created cards.
   * The actual Deck object is derived below with useMemo.
   */
  const [selectedDeckId, setSelectedDeckId] = useState('');

  /**
   * useMemo avoids re-searching decks unless decks or selectedDeckId changes.
   * This is not a heavy calculation yet, but it demonstrates a clean derived-state pattern.
   */
  const selectedDeck = useMemo(
    () => decks.find((deck) => deck.id === selectedDeckId),
    [decks, selectedDeckId]
  );

  useEffect(() => {
    const nextDecks = getDecks();

    setDecks(nextDecks);
    setCards(getFlashcards());

    /**
     * If a previously selected deck no longer exists, clear the selection.
     * This protects the card form from writing into a stale deck ID.
     */
    setSelectedDeckId((previousDeckId) =>
      nextDecks.some((deck) => deck.id === previousDeckId) ? previousDeckId : ''
    );
  }, []);

  /**
   * Creates a deck through the storage layer, then mirrors the result into
   * screen state so the deck picker updates instantly.
   */
  function createDeck(name: string) {
    const deck = addDeck({ name });

    setDecks((previousDecks) => [deck, ...previousDecks]);

    return deck;
  }

  /**
   * Creates a card through the storage layer, then updates this screen's list.
   * Keeping this as a callback makes HomeCreateSection easier to reuse/test.
   */
  function createCard(input: NewFlashcard) {
    const card = addFlashcard(input);

    setCards((previousCards) => [card, ...previousCards]);

    return card;
  }


  /**
   * Deletes a whole deck and every card inside it, then selects the next
   * available deck so the create form never points at deleted data.
   */
  function removeDeck(deckId: string) {
    const result = deleteDeck(deckId);

    if (!result) {
      return undefined;
    }

    setDecks(result.decks);
    setCards(result.flashcards);
    setSelectedDeckId(result.decks[0]?.id ?? '');

    return result;
  }

  /** Deletes one saved card and mirrors the storage change into local state. */
  function removeCard(cardId: string) {
    const card = cards.find((candidate) => candidate.id === cardId);

    if (!card || !deleteFlashcard(cardId)) {
      return undefined;
    }

    setCards((previousCards) => previousCards.filter((candidate) => candidate.id !== cardId));

    return card;
  }


  function importCards(cardsToImport: ParsedImportCard[], options: ImportCardsOptions) {
    const result = importParsedCards(cardsToImport, options);

    setDecks(result.decks);
    setCards(result.flashcards);

    if (result.createdDeck) {
      setSelectedDeckId(result.createdDeck.id);
    }

    return result;
  }

  function importBackup(rawText: string) {
    const result = importAppBackupText(rawText);

    if (!result) {
      return undefined;
    }

    setDecks(result.decks);
    setCards(result.flashcards);
    setSelectedDeckId(result.decks[0]?.id ?? '');

    return result;
  }

  return (
    <ScrollView
      style={styles.screen}
      directionalLockEnabled
      decelerationRate="fast"
      contentContainerStyle={[
        styles.content,
        {
          /**
           * Safe-area insets keep content away from notches, status bars,
           * gesture bars, and rounded screen corners.
           */
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 110,
        },
      ]}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Flashcard workspace</Text>
        <Text style={styles.title}>Create decks fast, then review with intent.</Text>
        <Text style={styles.subtitle}>
          Capture cards into focused decks, then jump to Review when you are ready to study.
        </Text>
      </View>

      <HomeCreateSection
        decks={decks}
        cards={cards}
        selectedDeck={selectedDeck}
        onSelectDeckId={setSelectedDeckId}
        onCreateDeck={createDeck}
        onCreateCard={createCard}
        onDeleteDeck={removeDeck}
        onDeleteCard={removeCard}
        onImportCards={importCards}
        onExportBackup={exportAppBackupText}
        onImportBackup={importBackup}
      />

      {/* Navigation is handled here so the child component stays presentation-focused. */}
      <HomeReviewSection onPressReview={() => router.push('/review')} />

      {/* Notes opens a focused notebook route for fast freeform capture. */}
      <HomeNotesSection onPressNotes={() => router.push('/notes')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.lg,
  },
  header: {
    gap: 8,
    maxWidth: 820,
  },
  eyebrow: {
    color: COLORS.review,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    color: COLORS.ink,
    fontSize: 34,
    lineHeight: 39,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 16,
    lineHeight: 23,
    maxWidth: 660,
  },
});
