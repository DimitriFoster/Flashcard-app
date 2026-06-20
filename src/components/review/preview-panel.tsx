/**
 * PreviewPanel.
 *
 * Reusable card preview used by the Review index screen.
 * It displays a single candidate card and provides an "Open this deck" action.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/design';
import type { Deck, Flashcard } from '@/types/flashcard';

/**
 * Convert a card's dueAt date into a friendly label.
 * This is UI formatting only; the scheduling logic lives in src/lib.
 */
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

type PreviewPanelProps = {
  title: string;
  helper: string;
  card?: Flashcard;
  deck?: Deck;
  emptyText: string;
  footer?: React.ReactNode;
  deckId?: string;
  onOpenDeck: () => void;
};

export function PreviewPanel({
  title,
  helper,
  card,
  deck,
  emptyText,
  footer,
  deckId,
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
        disabled={!deckId}
        onPress={onOpenDeck}
        style={({ pressed }) => [
          styles.openDeckButton,
          !deckId && styles.disabledButton,
          pressed && deckId && styles.pressed,
        ]}>
        <Text style={[styles.openDeckButtonText, !deckId && styles.disabledButtonText]}>
          Open this deck
        </Text>
      </Pressable>

      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  previewPanel: {
    flex: 1,
    minHeight: 420,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: SPACING.md,
    gap: SPACING.md,
    ...SHADOWS.soft,
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
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: '800',
  },
  previewCard: {
    flex: 1,
    minHeight: 180,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.panelAlt,
    borderColor: COLORS.line,
    borderWidth: 1,
    padding: SPACING.md,
    justifyContent: 'center',
    gap: 8,
  },
  cardSide: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
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
    borderRadius: RADIUS.lg,
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
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.review,
  },
  openDeckButtonText: {
    color: COLORS.white,
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
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
