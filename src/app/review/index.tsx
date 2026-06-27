/**
 * Review index screen.
 *
 * This screen now works like a deck carousel:
 * - each existing deck gets its own horizontal preview block
 * - each block previews the newest card in that deck
 * - each block's button opens that exact deck's focused review session
 *
 * The previous "Most recently struggled" block was removed to keep the review
 * entry point simpler and deck-centered.
 */
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PreviewPanel } from '@/components/review/preview-panel';
import { CrayonFill } from '@/components/ui/crayon-fill';
import { COLORS, RADIUS, SPACING } from '@/constants/design';
import { getDecks, getFlashcards } from '@/storage/flashcards';
import type { Deck, Flashcard } from '@/types/flashcard';

/**
 * Returns the newest card by createdAt.
 * Copying the array prevents sort() from mutating React state.
 */
function getMostRecentCard(cards: Flashcard[]) {
  return [...cards].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
}

function getCardsForDeck(deckId: string, cards: Flashcard[]) {
  return cards.filter((card) => card.deckId === deckId);
}

type DeckPreview = {
  deck: Deck;
  cards: Flashcard[];
  mostRecentCard?: Flashcard;
};

export default function ReviewIndexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);

  const panelWidth = Math.min(Math.max(width - SPACING.lg * 2, 300), 430);

  const deckPreviews = useMemo<DeckPreview[]>(
    () =>
      decks.map((deck) => {
        const deckCards = getCardsForDeck(deck.id, cards);

        return {
          deck,
          cards: deckCards,
          mostRecentCard: getMostRecentCard(deckCards),
        };
      }),
    [cards, decks]
  );

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

  function renderRetentionNote() {
    return (
      <View style={styles.retentionNote}>
        <CrayonFill tone="warning" variant="dense" opacity={0.45} />
        <Text style={styles.noteTitle}>How to get the most from spaced repetition</Text>
        <Text style={styles.noteText}>
          Review due cards consistently, answer before revealing, and grade honestly. Missed cards
          return quickly; easy cards wait longer, focusing effort right before forgetting.
        </Text>
      </View>
    );
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
        <Text style={styles.title}>Choose a deck to review.</Text>
        <Text style={styles.subtitle}>
          Swipe through your current decks and open the one you want to study.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/')}
          style={({ pressed }) => [styles.createButton, pressed && styles.pressed]}>
          <CrayonFill tone="create" variant="tight" opacity={0.78} />
          <Text style={styles.createButtonText}>Create cards</Text>
        </Pressable>
      </View>

      {deckPreviews.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.deckCarousel}>
          {deckPreviews.map((item, index) => (
            <PreviewPanel
              key={item.deck.id}
              title={item.deck.name}
              helper={`${item.cards.length} ${item.cards.length === 1 ? 'card' : 'cards'} in this deck.`}
              card={item.mostRecentCard}
              deck={item.deck}
              emptyText="Add cards to this deck from the Create section, then come back here to review."
              footer={index === 0 ? renderRetentionNote() : undefined}
              deckId={item.deck.id}
              buttonLabel="Review this deck"
              onOpenDeck={() => openDeck(item.deck.id)}
              style={{ width: panelWidth }}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyDeckState}>
          <Text style={styles.emptyDeckTitle}>No decks yet</Text>
          <Text style={styles.emptyDeckText}>
            Create a deck first, then it will appear here as a review block.
          </Text>
        </View>
      )}
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
    color: COLORS.reviewDeep,
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
    position: 'relative',
    overflow: 'hidden',
    alignSelf: 'flex-start',
    minHeight: 44,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.createSoft,
    borderColor: COLORS.createCrayon,
    borderWidth: 1,
  },
  createButtonText: {
    color: COLORS.createDeep,
    fontSize: 15,
    fontWeight: '800',
  },
  deckCarousel: {
    gap: SPACING.md,
    paddingRight: SPACING.lg,
    paddingVertical: 4,
  },
  retentionNote: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: COLORS.warningSoft,
    borderColor: COLORS.warningCrayon,
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
  emptyDeckState: {
    backgroundColor: COLORS.panel,
    borderColor: COLORS.line,
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: 8,
  },
  emptyDeckTitle: {
    color: COLORS.ink,
    fontSize: 22,
    fontWeight: '800',
  },
  emptyDeckText: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 21,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
