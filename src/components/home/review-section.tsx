/**
 * HomeReviewSection.
 *
 * A small presentational component for the Review call-to-action on the Home screen.
 * It does not know about Expo Router; instead, it receives onPressReview from its parent.
 * This makes the component easy to reuse and keeps navigation decisions in route files.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const COLORS = {
  review: '#375DFB',
  reviewSoft: '#E5EAFF',
};

type HomeReviewSectionProps = {
  onPressReview: () => void;
};

export function HomeReviewSection({ onPressReview }: HomeReviewSectionProps) {
  return (
    <View style={[styles.section, styles.reviewSection]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionLabel, styles.reviewSectionLabel]}>review</Text>
        <Text style={styles.sectionKicker}>Jump into spaced repetition when you’re ready.</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onPressReview}
        style={({ pressed }) => [styles.reviewButton, pressed && styles.pressed]}>
        <Text style={styles.reviewButtonText}>Review</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 8,
    padding: 16,
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8DEE8',
  },
  reviewSection: {
    borderTopColor: COLORS.review,
    borderTopWidth: 4,
  },
  reviewSectionLabel: {
    color: COLORS.review,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionLabel: {
    color: COLORS.review,
    fontSize: 28,
    fontWeight: '800',
  },
  sectionKicker: {
    color: '#667085',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewButton: {
    backgroundColor: COLORS.reviewSoft,
    borderColor: COLORS.review,
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewButtonText: {
    color: COLORS.review,
    fontSize: 16,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.78,
  },
});
