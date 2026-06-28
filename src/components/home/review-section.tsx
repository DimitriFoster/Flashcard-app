/**
 * HomeReviewSection.
 *
 * A small presentational component for the Review call-to-action on the Home screen.
 * It does not know about Expo Router; instead, it receives onPressReview from its parent.
 * This makes the component easy to reuse and keeps navigation decisions in route files.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CrayonFill } from '@/components/ui/crayon-fill';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/design';

type HomeReviewSectionProps = {
  onPressReview: () => void;
};

export function HomeReviewSection({ onPressReview }: HomeReviewSectionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPressReview}
      style={({ pressed }) => [styles.section, styles.reviewSection, pressed && styles.pressed]}>
      <CrayonFill tone="review" variant="loose" opacity={0.44} />
      <View style={styles.sectionHeader}>
        <Text style={styles.reviewSectionLabel}>review</Text>
        <Text style={styles.sectionKicker}>Jump into spaced repetition when you’re ready.</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    ...SHADOWS.soft,
  },
  reviewSection: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: COLORS.reviewPaper,
    borderColor: COLORS.reviewCrayon,
    borderTopColor: COLORS.review,
    borderTopWidth: 4,
    minHeight: 132,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewSectionLabel: {
    color: COLORS.reviewDeep,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  sectionHeader: {
    position: 'relative',
    gap: 4,
    alignItems: 'center',
  },
  sectionKicker: {
    color: COLORS.reviewDeep,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
