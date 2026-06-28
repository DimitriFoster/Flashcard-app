/**
 * Browse decks review screen.
 *
 * This page uses the same deck-card format as the spaced repetition screen,
 * but it shows all cards in each deck and removes the spaced repetition note.
 */
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
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

export default function BrowseDecksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const panelWidth = Math.min(Math.max(width - SPACING.lg * 2, 300), 430);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const deckPreviews = useMemo<DeckPreview[]>(
    () =>
      decks
        .map((deck) => {
          const deckCards = getCardsForDeck(deck.id, cards);
          const matchingCards = normalizedSearchQuery
            ? deckCards.filter(
                (card) =>
                  card.front.toLowerCase().includes(normalizedSearchQuery) ||
                  card.back.toLowerCase().includes(normalizedSearchQuery)
              )
            : deckCards;
          const deckMatches = normalizedSearchQuery
            ? deck.name.toLowerCase().includes(normalizedSearchQuery)
            : true;
          const visibleCards = deckMatches ? deckCards : matchingCards;

          return {
            deck,
            cards: visibleCards,
            mostRecentCard: getMostRecentCard(visibleCards),
          };
        })
        .filter((preview) => !normalizedSearchQuery || preview.cards.length > 0 || preview.deck.name.toLowerCase().includes(normalizedSearchQuery)),
    [cards, decks, normalizedSearchQuery]
  );

  useFocusEffect(
    useCallback(() => {
      setDecks(getDecks());
      setCards(getFlashcards());
    }, [])
  );

  /**
   * Browse mode opens the full deck. It does not filter out cards scheduled
   * for later, which makes it useful for checking/editing the shape of a deck.
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
        <Text style={styles.eyebrow}>Browse decks</Text>
        <Text style={styles.title}>Open any deck.</Text>
        <Text style={styles.subtitle}>
          Browse mode shows every deck, even when cards are not due yet.
        </Text>

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
            onPress={() => router.push('/review')}
            style={({ pressed }) => [styles.reviewButton, pressed && styles.pressed]}>
            <CrayonFill tone="review" variant="tight" opacity={0.78} />
            <Text style={styles.reviewButtonText}>Review due cards</Text>
          </Pressable>
        </View>

        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search decks, prompts, or answers"
          placeholderTextColor={COLORS.muted}
          style={styles.searchInput}
        />
      </View>

      {deckPreviews.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.deckCarousel}>
          {deckPreviews.map((item) => (
            <PreviewPanel
              key={item.deck.id}
              title={item.deck.name}
              helper={`${item.cards.length} ${item.cards.length === 1 ? 'card' : 'cards'} in this deck.`}
              card={item.mostRecentCard}
              deck={item.deck}
              emptyText="Add cards to this deck from the Create section, then come back here to review."
              deckId={item.cards.length > 0 ? item.deck.id : undefined}
              buttonLabel={item.cards.length > 0 ? 'Review this deck' : 'No cards yet'}
              onOpenDeck={() => openDeck(item.cards.length > 0 ? item.deck.id : undefined)}
              style={{ width: panelWidth }}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyDeckState}>
          <Text style={styles.emptyDeckTitle}>{searchQuery ? 'No matches' : 'No decks yet'}</Text>
          <Text style={styles.emptyDeckText}>
            {searchQuery
              ? 'Try searching for a different deck, prompt, or answer.'
              : 'Create a deck first, then it will appear here as a browse block.'}
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
  searchInput: {
    color: COLORS.ink,
    backgroundColor: COLORS.panel,
    borderColor: COLORS.reviewCrayon,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '700',
  },
  deckCarousel: {
    gap: SPACING.md,
    paddingRight: SPACING.lg,
    paddingVertical: 4,
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
