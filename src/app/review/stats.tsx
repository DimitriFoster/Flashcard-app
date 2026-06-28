/**
 * Scheduler stats screen.
 *
 * This is intentionally simple. It reveals what the SRS engine thinks is going
 * on so the user can trust the queue: new, learning, due, review, relearning,
 * suspended, reviewed today, and accuracy today.
 */
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CrayonFill } from '@/components/ui/crayon-fill';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/design';
import { getCardState } from '@/lib/review-scheduling';
import { getReviewQueue, isCardDue } from '@/lib/review-queue';
import { getDecks, getFlashcards, getReviewLogs } from '@/storage/flashcards';
import type { Deck, Flashcard, ReviewLog } from '@/types/flashcard';

type StatCard = {
  label: string;
  value: string | number;
  helper: string;
};

function isToday(value: string) {
  const date = new Date(value);
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function getDeckName(deckId: string, decks: Deck[]) {
  return decks.find((deck) => deck.id === deckId)?.name ?? 'Recovered Deck';
}

function getDeckDueCount(deckId: string, cards: Flashcard[]) {
  return cards.filter((card) => card.deckId === deckId && isCardDue(card)).length;
}

export default function ReviewStatsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [reviewLogs, setReviewLogs] = useState<ReviewLog[]>([]);

  useFocusEffect(
    useCallback(() => {
      setDecks(getDecks());
      setCards(getFlashcards());
      setReviewLogs(getReviewLogs());
    }, [])
  );

  const stats = useMemo(() => {
    const newCards = cards.filter((card) => getCardState(card) === 'new');
    const learningCards = cards.filter((card) => getCardState(card) === 'learning');
    const reviewCards = cards.filter((card) => getCardState(card) === 'review');
    const relearningCards = cards.filter((card) => getCardState(card) === 'relearning');
    const suspendedCards = cards.filter((card) => getCardState(card) === 'suspended');
    const dueCards = getReviewQueue(cards);
    const todayLogs = reviewLogs.filter((log) => isToday(log.reviewedAt));
    const passedToday = todayLogs.filter((log) => log.grade === 'good' || log.grade === 'easy').length;
    const accuracy = todayLogs.length > 0 ? Math.round((passedToday / todayLogs.length) * 100) : 0;

    const statCards: StatCard[] = [
      { label: 'Due now', value: dueCards.length, helper: 'Cards in the active review queue.' },
      { label: 'New', value: newCards.length, helper: 'Cards not started yet.' },
      { label: 'Learning', value: learningCards.length, helper: 'New cards in short-term steps.' },
      { label: 'Review', value: reviewCards.length, helper: 'Long-term scheduled cards.' },
      { label: 'Relearning', value: relearningCards.length, helper: 'Failed review cards being repaired.' },
      { label: 'Suspended', value: suspendedCards.length, helper: 'Hidden from due reviews.' },
      { label: 'Reviewed today', value: todayLogs.length, helper: 'Grades recorded today.' },
      { label: 'Accuracy today', value: `${accuracy}%`, helper: 'Good/Easy divided by all grades today.' },
    ];

    return { statCards, todayLogs };
  }, [cards, reviewLogs]);

  const decksWithDueCounts = decks
    .map((deck) => ({ deck, dueCount: getDeckDueCount(deck.id, cards) }))
    .sort((a, b) => b.dueCount - a.dueCount);

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
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/review')}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <CrayonFill tone="review" variant="tight" opacity={0.7} />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Text style={styles.eyebrow}>Scheduler stats</Text>
        <Text style={styles.title}>What the review engine sees.</Text>
        <Text style={styles.subtitle}>
          This page explains why cards do or do not appear in spaced repetition.
        </Text>
      </View>

      <View style={styles.statGrid}>
        {stats.statCards.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <CrayonFill tone="review" variant="loose" opacity={0.18} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statHelper}>{stat.helper}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionPanel}>
        <Text style={styles.sectionTitle}>Due by deck</Text>
        {decksWithDueCounts.length > 0 ? (
          decksWithDueCounts.map(({ deck, dueCount }) => (
            <View key={deck.id} style={styles.deckRow}>
              <Text style={styles.deckName}>{getDeckName(deck.id, decks)}</Text>
              <Text style={styles.deckCount}>{dueCount} due</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No decks yet.</Text>
        )}
      </View>

      <View style={styles.sectionPanel}>
        <Text style={styles.sectionTitle}>Recent grades today</Text>
        {stats.todayLogs.length > 0 ? (
          stats.todayLogs.slice(0, 12).map((log) => (
            <View key={log.id} style={styles.deckRow}>
              <Text style={styles.deckName}>{log.grade}</Text>
              <Text style={styles.deckCount}>{new Date(log.reviewedAt).toLocaleTimeString()}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No reviews logged today.</Text>
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
    paddingHorizontal: SPACING.lg,
    gap: SPACING.lg,
  },
  header: {
    gap: 8,
  },
  backButton: {
    position: 'relative',
    overflow: 'hidden',
    alignSelf: 'flex-start',
    minHeight: 40,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.reviewSoft,
    borderColor: COLORS.reviewCrayon,
    borderWidth: 1,
  },
  backButtonText: {
    color: COLORS.reviewDeep,
    fontWeight: '800',
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
    fontSize: 31,
    lineHeight: 37,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  statCard: {
    position: 'relative',
    overflow: 'hidden',
    width: '48%',
    minHeight: 132,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.panel,
    borderColor: COLORS.reviewCrayon,
    borderWidth: 1,
    padding: SPACING.md,
    gap: 4,
    ...SHADOWS.soft,
  },
  statValue: {
    color: COLORS.reviewDeep,
    fontSize: 28,
    fontWeight: '900',
  },
  statLabel: {
    color: COLORS.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  statHelper: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
  },
  sectionPanel: {
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.panel,
    borderColor: COLORS.line,
    borderWidth: 1,
    padding: SPACING.md,
    gap: SPACING.sm,
    ...SHADOWS.soft,
  },
  sectionTitle: {
    color: COLORS.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  deckRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.panelAlt,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  deckName: {
    flex: 1,
    color: COLORS.ink,
    fontWeight: '800',
  },
  deckCount: {
    color: COLORS.reviewDeep,
    fontWeight: '900',
  },
  emptyText: {
    color: COLORS.muted,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
