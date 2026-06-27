/**
 * DeckReviewSession.
 *
 * This is the visual component for a focused review session.
 *
 * It intentionally receives state and callbacks from src/app/review/[deckId].tsx.
 * That separation is useful for beginners to study:
 * - the route owns data and behavior
 * - this component owns layout and user-facing controls
 */
import React from 'react';
import {
  Animated,
  Pressable,
  Text,
  useWindowDimensions,
  View,
  type PanResponderInstance,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from './deck-review-session.styles';
import type { Flashcard, ReviewGrade } from '@/types/flashcard';

type DeckReviewSessionProps = {
  deckName?: string;
  currentIndex: number;
  cardsLength: number;
  currentCard?: Flashcard;
  flipped: boolean;
  translateX: Animated.Value;
  panHandlers: PanResponderInstance['panHandlers'];
  onBack: () => void;
  onToggleFlip: () => void;
  onGrade: (grade: ReviewGrade) => void;
};

const gradeButtons: Array<{
  label: string;
  hint: string;
  grade: ReviewGrade;
  buttonStyle: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
}> = [
  {
    label: 'Again',
    hint: 'soon',
    grade: 'again',
    buttonStyle: styles.againButton,
    textStyle: styles.againText,
  },
  {
    label: 'Hard',
    hint: 'short',
    grade: 'hard',
    buttonStyle: styles.hardButton,
    textStyle: styles.hardText,
  },
  {
    label: 'Good',
    hint: 'normal',
    grade: 'good',
    buttonStyle: styles.goodButton,
    textStyle: styles.goodText,
  },
  {
    label: 'Easy',
    hint: 'later',
    grade: 'easy',
    buttonStyle: styles.easyButton,
    textStyle: styles.easyText,
  },
];

export function DeckReviewSession({
  deckName,
  currentIndex,
  cardsLength,
  currentCard,
  flipped,
  translateX,
  panHandlers,
  onBack,
  onToggleFlip,
  onGrade,
}: DeckReviewSessionProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  /**
   * The screen adapts to orientation without needing separate routes.
   * This is the first step toward a landscape-friendly review mode.
   */
  const isLandscape = width > height;

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: insets.top + 18,
          paddingBottom: insets.bottom + 18,
        },
      ]}>
      <View style={[styles.header, isLandscape && styles.headerLandscape]}>
        <Pressable
          accessibilityRole="button"
          onPress={onBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        <View style={styles.headerTextGroup}>
          <Text style={styles.eyebrow}>Deck Review</Text>
          <Text style={styles.title}>{deckName ?? 'Deck not found'}</Text>
          <Text style={styles.subtitle}>
            {cardsLength > 0 ? `${currentIndex + 1} of ${cardsLength}` : 'No cards yet'}
          </Text>
        </View>
      </View>

      <View style={[styles.stage, isLandscape && styles.stageLandscape]}>
        {currentCard ? (
          <View style={[styles.cardStack, isLandscape && styles.cardStackLandscape]}>
            <View pointerEvents="none" style={styles.cardStackBack} />
            <View pointerEvents="none" style={styles.cardStackMiddle} />
            <Animated.View
              {...panHandlers}
              style={[
                styles.cardShell,
                {
                  /**
                   * translateX follows the user's finger while dragging.
                   * rotate adds a small physical card-like motion.
                   */
                  transform: [
                    { translateX },
                    {
                      rotate: translateX.interpolate({
                        inputRange: [-300, 0, 300],
                        outputRange: ['-8deg', '0deg', '8deg'],
                      }),
                    },
                  ],
                },
              ]}>
              <Pressable
                accessibilityRole="button"
                onPress={onToggleFlip}
                style={({ pressed }) => [
                  styles.card,
                  isLandscape && styles.cardLandscape,
                  pressed && styles.cardPressed,
                ]}>
                <Text style={styles.cardSide}>{flipped ? 'Answer' : 'Prompt'}</Text>
                <Text style={[styles.cardText, isLandscape && styles.cardTextLandscape]}>
                  {flipped ? currentCard.back : currentCard.front}
                </Text>
                <Text style={styles.tapHint}>Tap to flip · Swipe to browse</Text>
              </Pressable>
            </Animated.View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No cards in this deck</Text>
            <Text style={styles.emptyText}>Go back home and add cards first.</Text>
          </View>
        )}
      </View>

      {currentCard ? (
        <View style={[styles.gradeRow, isLandscape && styles.gradeRowLandscape]}>
          {gradeButtons.map((button) => (
            <Pressable
              key={button.grade}
              accessibilityRole="button"
              onPress={() => onGrade(button.grade)}
              style={({ pressed }) => [
                styles.gradeButton,
                button.buttonStyle,
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.gradeText, button.textStyle]}>{button.label}</Text>
              <Text style={[styles.gradeHint, button.textStyle]}>{button.hint}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
