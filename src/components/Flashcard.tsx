import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { Flashcard as FlashcardItem } from '@/types/flashcard';

type FlashcardProps = Omit<PressableProps, 'children' | 'style'> & {
  flashcard: FlashcardItem;
  flipped?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Flashcard({ flashcard, flipped = false, style, ...pressableProps }: FlashcardProps) {
  const label = flipped ? 'Back' : 'Front';
  const content = flipped ? flashcard.back : flashcard.front;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Flashcard ${label.toLowerCase()}`}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed, style]}
      {...pressableProps}>
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="code" themeColor="textSecondary" style={styles.label}>
          {label}
        </ThemedText>
        <ThemedText type="subtitle" style={styles.content}>
          {content}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'stretch',
  },
  pressed: {
    opacity: 0.82,
  },
  card: {
    minHeight: 180,
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Spacing.two,
  },
  label: {
    textTransform: 'uppercase',
  },
  content: {
    textAlign: 'center',
  },
});
