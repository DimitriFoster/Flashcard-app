/**
 * PreviewPanel.
 *
 * Reusable deck preview block used by the Review index screen.
 * It displays one representative card and provides a deck-specific review action.
 */
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { CrayonFill } from '@/components/ui/crayon-fill';
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
  buttonLabel?: string;
  onOpenDeck: () => void;
  style?: StyleProp<ViewStyle>;
};

export function PreviewPanel({
  title,
  helper,
  card,
  deck,
  emptyText,
  footer,
  deckId,
  buttonLabel = 'Open this deck',
  onOpenDeck,
  style,
}: PreviewPanelProps) {
  return (
    <View style={[styles.previewPanel, style]}>
      <CrayonFill tone="review" variant="loose" opacity={0.38} />
      <View style={styles.previewHeader}>
        <View style={styles.previewTitleGroup}>
          <Text style={styles.previewHelper}>{helper}</Text>
        </View>
        {deck && (
          <View style={styles.deckBadge}>
            <CrayonFill tone="review" variant="tight" opacity={0.78} />
            <Text style={styles.deckBadgeText}>{deck.name}</Text>
          </View>
        )}
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
          <Text style={styles.emptyTitle}>No cards yet</Text>
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
        {deckId ? <CrayonFill tone="review" variant="tight" opacity={0.85} /> : null}
        <Text style={[styles.openDeckButtonText, !deckId && styles.disabledButtonText]}>
          {buttonLabel}
        </Text>
      </Pressable>

      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  previewPanel: {
    position: 'relative',
    overflow: 'hidden',
    flex: 1,
    minHeight: 420,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.reviewPaper,
    borderWidth: 1,
    borderColor: COLORS.reviewCrayon,
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
    justifyContent: 'center',
    gap: 3,
  },
  previewHelper: {
    color: COLORS.muted,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
  },
  deckBadge: {
    position: 'relative',
    overflow: 'hidden',
    maxWidth: '58%',
    backgroundColor: COLORS.reviewSoft,
    borderColor: COLORS.reviewCrayon,
    borderWidth: 1,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  deckBadgeText: {
    color: COLORS.reviewDeep,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    textAlign: 'center',
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
    color: COLORS.reviewDeep,
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
    position: 'relative',
    overflow: 'hidden',
    minHeight: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.reviewSoft,
    borderColor: COLORS.reviewCrayon,
    borderWidth: 1,
  },
  openDeckButtonText: {
    color: COLORS.reviewDeep,
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
