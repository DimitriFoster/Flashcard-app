/**
 * Spaced repetition review screen.
 *
 * This is the default Review page from Home. It focuses on cards that are due:
 * - new cards with no dueAt yet
 * - reviewed cards whose dueAt is now or in the past
 *
 * Use Browse Decks when the goal is to open any deck regardless of due status.
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
import { getDueCards } from '../../lib/review-queue';

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
  dueCards: Flashcard[];
  mostRecentDueCard?: Flashcard;
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
        const dueCards = getDueCards(deckCards);

        return {
          deck,
          cards: deckCards,
          dueCards,
          mostRecentDueCard: getMostRecentCard(dueCards),
        };
      }),
    [cards, decks]
  );

  /**
   * useFocusEffect runs each time this screen becomes active.
   * That matters because due counts change after grading cards.
   */
  useFocusEffect(
    useCallback(() => {
      setDecks(getDecks());
      setCards(getFlashcards());
    }, [])
  );

  /**
   * Open a focused review session in due-card mode.
   * The deck route uses the mode param to filter out cards scheduled for later.
   */
  function openDueDeck(deckId: string | undefined) {
    if (!deckId) {
      return;
    }

    router.push({
      pathname: '/review/[deckId]',
      params: { deckId, mode: 'due' },
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
        <Text style={styles.eyebrow}>Spaced repetition</Text>
        <Text style={styles.title}>Review due cards.</Text>
        <Text style={styles.subtitle}>
          These deck blocks focus on cards that are new or scheduled for review today.
        </Text>

        {renderRetentionNote()}

        <View style={styles.headerActionRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/')}
            style={({ pressed }) => [styles.createButton, pressed && styles.pressed]}>
            <CrayonFill tone="create" variant="tight" opacity={0.78} />
            <Text style={styles.createButtonText}>Create cards</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/review/browse')}
            style={({ pressed }) => [styles.reviewButton, pressed && styles.pressed]}>
            <CrayonFill tone="review" variant="tight" opacity={0.78} />
            <Text style={styles.reviewButtonText}>Browse decks</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/review/stats')}
            style={({ pressed }) => [styles.statsButton, pressed && styles.pressed]}>
            <CrayonFill tone="warning" variant="tight" opacity={0.62} />
            <Text style={styles.statsButtonText}>Stats</Text>
          </Pressable>
        </View>
      </View>

      {deckPreviews.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.deckCarousel}>
          {deckPreviews.map((item) => {
            const dueCount = item.dueCards.length;
            const totalCount = item.cards.length;

            return (
              <PreviewPanel
                key={item.deck.id}
                title={item.deck.name}
                helper={`${dueCount} due now · ${totalCount} ${totalCount === 1 ? 'card' : 'cards'} total.`}
                card={item.mostRecentDueCard}
                deck={item.deck}
                emptyText="Nothing due in this deck right now. Use Browse Decks if you still want to open it."
                deckId={dueCount > 0 ? item.deck.id : undefined}
                buttonLabel={dueCount > 0 ? 'Review this deck' : 'No due cards'}
                onOpenDeck={() => openDueDeck(dueCount > 0 ? item.deck.id : undefined)}
                style={{ width: panelWidth }}
              />
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.emptyDeckState}>
          <Text style={styles.emptyDeckTitle}>No decks yet</Text>
          <Text style={styles.emptyDeckText}>
            Create a deck first, then it will appear here as a spaced repetition block.
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
    gap: 10,
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
  headerActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    paddingTop: 4,
  },
  createButton: {
    position: 'relative',
    overflow: 'hidden',
    flex: 1,
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
  reviewButton: {
    position: 'relative',
    overflow: 'hidden',
    flex: 1,
    minHeight: 44,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.reviewSoft,
    borderColor: COLORS.reviewCrayon,
    borderWidth: 1,
  },
  reviewButtonText: {
    color: COLORS.reviewDeep,
    fontSize: 15,
    fontWeight: '800',
  },
  statsButton: {
    position: 'relative',
    overflow: 'hidden',
    flex: 0.75,
    minHeight: 44,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.warningSoft,
    borderColor: COLORS.warningCrayon,
    borderWidth: 1,
  },
  statsButtonText: {
    color: COLORS.warning,
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
