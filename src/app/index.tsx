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
import { HomeReviewSection } from '@/components/home/review-section';
import { addDeck, addFlashcard, getDecks, getFlashcards } from '@/storage/flashcards';
import type { Deck, Flashcard, NewFlashcard } from '@/types/flashcard';

/**
 * Local color constants keep this screen self-contained.
 * Longer term, these can be moved into a shared design-token file.
 */
const COLORS = {
  background: '#F7F8FB',
  ink: '#172033',
  muted: '#667085',
  review: '#375DFB',
};

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

  return (
    <ScrollView
      style={styles.screen}
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
      />

      {/* Navigation is handled here so the child component stays presentation-focused. */}
      <HomeReviewSection onPressReview={() => router.push('/review')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 18,
    gap: 18,
  },
  header: {
    gap: 8,
    maxWidth: 820,
  },
  eyebrow: {
    color: COLORS.review,
    fontSize: 13,
    fontWeight: '700',
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
