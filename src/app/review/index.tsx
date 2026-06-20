/**
 * Review index screen.
 *
 * This screen helps the user choose what to review next. It currently shows two
 * high-value entry points:
 * - the newest card created
 * - the most recently struggled card
 *
 * This is deliberately simpler than a full dashboard. The goal is to keep the
 * review workflow fast and easy to understand.
 */
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PreviewPanel } from '@/components/review/preview-panel';
import { COLORS, RADIUS, SPACING } from '@/constants/design';
import { getDecks, getFlashcards } from '@/storage/flashcards';
import type { Deck, Flashcard } from '@/types/flashcard';

/** Find the deck object for a card's deckId. */
function findDeck(deckId: string, decks: Deck[]) {
  return decks.find((deck) => deck.id === deckId);
}

/**
 * Returns the newest card by createdAt.
 * Copying the array prevents sort() from mutating React state.
 */
function getMostRecentCard(cards: Flashcard[]) {
  return [...cards].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
}

/**
 * Returns the latest card that the user marked as difficult.
 * Cards only enter this list after a review action sets lastStruggledAt.
 */
function getMostRecentlyStruggledCard(cards: Flashcard[]) {
  return [...cards]
    .filter((card) => card.lastStruggledAt)
    .sort((a, b) => (b.lastStruggledAt ?? '').localeCompare(a.lastStruggledAt ?? ''))[0];
}

export default function ReviewIndexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);

  /**
   * Simple responsive breakpoint. On wider screens and landscape tablets, the
   * preview panels sit beside each other instead of stacking vertically.
   */
  const twoColumn = width >= 820;

  const mostRecentCard = useMemo(() => getMostRecentCard(cards), [cards]);
  const mostStruggledCard = useMemo(() => getMostRecentlyStruggledCard(cards), [cards]);
  const mostRecentDeck = mostRecentCard ? findDeck(mostRecentCard.deckId, decks) : undefined;
  const mostStruggledDeck = mostStruggledCard ? findDeck(mostStruggledCard.deckId, decks) : undefined;

  /**
   * useFocusEffect runs each time this screen becomes active.
   * That matters because the user may create cards on Home, come here, review,
   * go back, and expect the preview data to be fresh.
   */
  useFocusEffect(
    useCallback(() => {
      setDecks(getDecks());
      setCards(getFlashcards());
    }, [])
  );

  /**
   * Navigate to the focused review session for the chosen deck.
   * The dynamic route /review/[deckId] reads the deckId with useLocalSearchParams.
   */
  function openDeck(deckId: string | undefined) {
    if (!deckId) {
      return;
    }

    router.push({
      pathname: '/review/[deckId]',
      params: { deckId },
    });
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 22,
          paddingBottom: insets.bottom + 110,
        },
      ]}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Review</Text>
        <Text style={styles.title}>Choose a deck to Review.</Text>
        <Text style={styles.subtitle}>Open either deck to start a focused review session.</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/')}
          style={({ pressed }) => [styles.createButton, pressed && styles.pressed]}>
          <Text style={styles.createButtonText}>Create cards</Text>
        </Pressable>
      </View>

      <View style={[styles.previewGrid, twoColumn && styles.previewGridWide]}>
        <PreviewPanel
          title="Most recent card"
          helper="The newest prompt you created."
          card={mostRecentCard}
          deck={mostRecentDeck}
          emptyText="Create a card first, then its deck will be available here."
          deckId={mostRecentDeck?.id}
          onOpenDeck={() => openDeck(mostRecentDeck?.id)}
        />

        <PreviewPanel
          title="Most recently struggled"
          helper="The last card marked Again or Hard."
          card={mostStruggledCard}
          deck={mostStruggledDeck}
          emptyText="Use retention mode and rate a card Again or Hard to populate this preview."
          footer={
            <View style={styles.retentionNote}>
              <Text style={styles.noteTitle}>How to get the most from spaced repetition</Text>
              <Text style={styles.noteText}>
                Review due cards consistently, answer before revealing, and grade honestly. Missed
                cards return quickly; easy cards wait longer, focusing effort right before
                forgetting.
              </Text>
            </View>
          }
          deckId={mostStruggledDeck?.id}
          onOpenDeck={() => openDeck(mostStruggledDeck?.id)}
        />
      </View>
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
    gap: SPACING.md,
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
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 16,
    lineHeight: 23,
  },
  createButton: {
    alignSelf: 'flex-start',
    minHeight: 44,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.reviewSoft,
    borderColor: COLORS.review,
    borderWidth: 1,
  },
  createButtonText: {
    color: COLORS.review,
    fontSize: 15,
    fontWeight: '800',
  },
  previewGrid: {
    gap: SPACING.md,
  },
  previewGridWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  retentionNote: {
    backgroundColor: COLORS.warningSoft,
    borderColor: '#F2C47D',
    borderWidth: 1,
    borderRadius: RADIUS.md,
    padding: 12,
    gap: 5,
  },
  noteTitle: {
    color: COLORS.warning,
    fontSize: 15,
    fontWeight: '800',
  },
  noteText: {
    color: COLORS.ink,
    fontSize: 13,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
