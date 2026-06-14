import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getDecks, getFlashcardsByDeck } from '@/storage/flashcards';
import type { Deck, Flashcard } from '@/types/flashcard';

const COLORS = {
  background: '#F7F8FB',
  panel: '#FFFFFF',
  panelAlt: '#EEF2F7',
  ink: '#172033',
  muted: '#667085',
  line: '#D8DEE8',
  review: '#375DFB',
  reviewSoft: '#E5EAFF',
};

function findDeck(deckId: string, decks: Deck[]) {
  return decks.find((deck) => deck.id === deckId);
}

function formatDue(card: Flashcard) {
  if (!card.dueAt) {
    return 'new';
  }

  const dueTime = new Date(card.dueAt).getTime();
  const diffDays = Math.ceil((dueTime - Date.now()) / 86_400_000);

  if (diffDays <= 0) {
    return 'due';
  }

  return diffDays === 1 ? 'tomorrow' : `in ${diffDays} days`;
}

export default function DeckCardsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ deckId?: string }>();
  const deckId = Array.isArray(params.deckId) ? params.deckId[0] : params.deckId;
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);

  const selectedDeck = useMemo(
    () => (deckId ? findDeck(deckId, decks) : undefined),
    [deckId, decks]
  );

  useEffect(() => {
    setDecks(getDecks());
    setCards(deckId ? getFlashcardsByDeck(deckId) : []);
  }, [deckId]);

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
        <Text style={styles.title}>{selectedDeck?.name ?? 'Deck not found'}</Text>
        <Text style={styles.subtitle}>{cards.length} flashcards in this deck.</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/review' as Href)}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <Text style={styles.backButtonText}>Back to Review</Text>
        </Pressable>
      </View>

      <View style={styles.listSection}>
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <View key={card.id} style={styles.cardRow}>
              <View style={styles.cardNumberPill}>
                <Text style={styles.cardNumber}>{index + 1}</Text>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.cardMetaRow}>
                  <Text style={styles.cardSide}>Prompt</Text>
                  <Text style={styles.cardMeta}>{formatDue(card)}</Text>
                </View>
                <Text style={styles.cardFront}>{card.front}</Text>
                <Text style={styles.cardAnswer}>{card.back}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No cards in this deck</Text>
            <Text style={styles.emptyText}>Add cards on the home page, then open this deck again.</Text>
          </View>
        )}
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
    paddingHorizontal: 18,
    gap: 16,
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
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 16,
    lineHeight: 23,
  },
  backButton: {
    alignSelf: 'flex-start',
    minHeight: 44,
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.reviewSoft,
    borderColor: COLORS.review,
    borderWidth: 1,
  },
  backButtonText: {
    color: COLORS.review,
    fontSize: 15,
    fontWeight: '800',
  },
  listSection: {
    gap: 12,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 10,
    borderRadius: 8,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 12,
  },
  cardNumberPill: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: COLORS.reviewSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  cardNumber: {
    color: COLORS.review,
    fontSize: 14,
    fontWeight: '800',
  },
  cardBody: {
    flex: 1,
    gap: 8,
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  cardSide: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cardMeta: {
    color: COLORS.review,
    fontSize: 12,
    fontWeight: '800',
  },
  cardFront: {
    color: COLORS.ink,
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '800',
  },
  cardAnswer: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  emptyState: {
    minHeight: 220,
    borderRadius: 8,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    color: COLORS.ink,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyText: {
    color: COLORS.muted,
    lineHeight: 22,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.78,
  },
});
