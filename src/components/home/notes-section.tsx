/**
 * HomeNotesSection.
 *
 * A small presentational component for opening the quick notes workspace.
 * The navigation action is passed in from Home so this component stays focused
 * on layout and touch feedback.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CrayonFill } from '@/components/ui/crayon-fill';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/design';

type HomeNotesSectionProps = {
  onPressNotes: () => void;
};

export function HomeNotesSection({ onPressNotes }: HomeNotesSectionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPressNotes}
      style={({ pressed }) => [
        styles.section,
        styles.notesSection,
        pressed && styles.pressed,
      ]}>
      <CrayonFill tone="note" variant="loose" opacity={0.48} />
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionLabel, styles.notesSectionLabel]}>notes</Text>
        <Text style={styles.sectionKicker}>Open a fast lined notebook for loose thoughts.</Text>
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
  notesSection: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 132,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.notePaper,
    borderColor: COLORS.noteCrayon,
    borderTopColor: COLORS.note,
    borderTopWidth: 4,
  },
  notesSectionLabel: {
    color: COLORS.noteDeep,
  },
  sectionHeader: {
    position: 'relative',
    gap: 4,
    alignItems: 'center',
  },
  sectionLabel: {
    color: COLORS.noteDeep,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  sectionKicker: {
    color: COLORS.noteDeep,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
