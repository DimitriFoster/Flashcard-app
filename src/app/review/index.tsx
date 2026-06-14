import { type Href, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getDecks, getFlashcards } from '@/storage/flashcards';
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
  warning: '#B54708',
  warningSoft: '#FFF4E5',
};

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

function findDeck(deckId: string, decks: Deck[]) {
  return decks.find((deck) => deck.id === deckId);
}

function getMostRecentCard(cards: Flashcard[]) {
  return [...cards].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
}

function getMostRecentlyStruggledCard(cards: Flashcard[]) {
  return [...cards]
    .filter((card) => card.lastStruggledAt)
    .sort((a, b) => (b.lastStruggledAt ?? '').localeCompare(a.lastStruggledAt ?? ''))[0];
}

type PreviewPanelProps = {
  title: string;
  helper: string;
  card?: Flashcard;
  deck?: Deck;
  emptyText: string;
  footer?: React.ReactNode;
  deckHref?: Href;
  onOpenDeck: () => void;
};

function PreviewPanel({
  title,
  helper,
  card,
  deck,
  emptyText,
  footer,
  deckHref,
  onOpenDeck,
}: PreviewPanelProps) {
  return (
    <View style={styles.previewPanel}>
      <View style={styles.previewHeader}>
        <View style={styles.previewTitleGroup}>
          <Text style={styles.previewTitle}>{title}</Text>
          <Text style={styles.previewHelper}>{helper}</Text>
        </View>
        {deck && <Text style={styles.deckBadge}>{deck.name}</Text>}
      </View>

      {card ? (
        <View style={styles.previewCard}>
          <Text style={styles.cardSide}>Prompt</Text>
          <Text style={styles.previewPrompt}>{card.front}</Text>
          <Text style={styles.previewAnswer}>{card.back}</Text>
          <Text style={styles.previewMeta}>
            {formatDue(card)} - interval {card.intervalDays ?? 0}d
          </Text>
        </View>
      ) : (
        <View style={styles.previewEmpty}>
          <Text style={styles.emptyTitle}>Nothing to preview yet</Text>
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      )}

      <Pressable
        accessibilityRole="button"
        disabled={!deckHref}
        onPress={onOpenDeck}
        style={({ pressed }) => [
          styles.openDeckButton,
          !deckHref && styles.disabledButton,
          pressed && styles.pressed,
        ]}>
        <Text style={[styles.openDeckButtonText, !deckHref && styles.disabledButtonText]}>
          Open this deck
        </Text>
      </Pressable>

      {footer}
    </View>
  );
}

export default function ReviewIndexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const twoColumn = width >= 820;

  const mostRecentCard = useMemo(() => getMostRecentCard(cards), [cards]);
  const mostStruggledCard = useMemo(() => getMostRecentlyStruggledCard(cards), [cards]);
  const mostRecentDeck = mostRecentCard ? findDeck(mostRecentCard.deckId, decks) : undefined;
  const mostStruggledDeck = mostStruggledCard ? findDeck(mostStruggledCard.deckId, decks) : undefined;

  useEffect(() => {
    setDecks(getDecks());
    setCards(getFlashcards());
  }, []);

  function getDeckHref(deckId: string | undefined) {
    if (!deckId) {
      return undefined;
    }

    return `/review/${encodeURIComponent(deckId)}` as Href;
  }

  function openDeck(deckId: string | undefined) {
    const deckHref = getDeckHref(deckId);

    if (!deckHref) {
      return;
    }

    router.push(deckHref);
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
          deckHref={getDeckHref(mostRecentDeck?.id)}
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
          deckHref={getDeckHref(mostStruggledDeck?.id)}
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
  createButton: {
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
  createButtonText: {
    color: COLORS.review,
    fontSize: 15,
    fontWeight: '800',
  },
  previewGrid: {
    gap: 14,
  },
  previewGridWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  previewPanel: {
    flex: 1,
    minHeight: 420,
    borderRadius: 8,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 14,
    gap: 12,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  previewTitleGroup: {
    flex: 1,
    gap: 3,
  },
  previewTitle: {
    color: COLORS.ink,
    fontSize: 20,
    fontWeight: '800',
  },
  previewHelper: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  deckBadge: {
    color: COLORS.review,
    backgroundColor: COLORS.reviewSoft,
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: '800',
  },
  previewCard: {
    flex: 1,
    minHeight: 180,
    borderRadius: 8,
    backgroundColor: COLORS.panelAlt,
    borderColor: COLORS.line,
    borderWidth: 1,
    padding: 14,
    justifyContent: 'center',
    gap: 8,
  },
  cardSide: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  previewPrompt: {
    color: COLORS.ink,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
  },
  previewAnswer: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  previewMeta: {
    color: COLORS.review,
    fontSize: 12,
    fontWeight: '800',
  },
  previewEmpty: {
    flex: 1,
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.panelAlt,
    borderColor: COLORS.line,
    borderWidth: 1,
  },
  emptyTitle: {
    color: COLORS.ink,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyText: {
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  openDeckButton: {
    minHeight: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.review,
  },
  openDeckButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  disabledButton: {
    backgroundColor: COLORS.panelAlt,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  disabledButtonText: {
    color: COLORS.muted,
  },
  retentionNote: {
    backgroundColor: COLORS.warningSoft,
    borderColor: '#FEDF89',
    borderWidth: 1,
    borderRadius: 8,
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
    opacity: 0.78,
  },
});
