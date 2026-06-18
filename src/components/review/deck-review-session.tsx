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
          <Animated.View
            {...panHandlers}
            style={[
              styles.cardShell,
              isLandscape && styles.cardShellLandscape,
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
              style={[styles.card, isLandscape && styles.cardLandscape]}>
              <Text style={styles.cardSide}>{flipped ? 'Answer' : 'Prompt'}</Text>
              <Text style={[styles.cardText, isLandscape && styles.cardTextLandscape]}>
                {flipped ? currentCard.back : currentCard.front}
              </Text>
              <Text style={styles.tapHint}>Tap to flip. Swipe left or right.</Text>
            </Pressable>
          </Animated.View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No cards in this deck</Text>
            <Text style={styles.emptyText}>Go back home and add cards first.</Text>
          </View>
        )}
      </View>

      {currentCard ? (
        <View style={[styles.gradeRow, isLandscape && styles.gradeRowLandscape]}>
          {/*
            The labels intentionally use plain-language difficulty choices.
            They map to ReviewGrade values in the route file.
          */}
          <Pressable
            accessibilityRole="button"
            onPress={() => onGrade('again')}
            style={({ pressed }) => [
              styles.gradeButton,
              styles.againButton,
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.gradeText, styles.againText]}>Again</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => onGrade('hard')}
            style={({ pressed }) => [
              styles.gradeButton,
              styles.hardButton,
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.gradeText, styles.hardText]}>Hard</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => onGrade('good')}
            style={({ pressed }) => [
              styles.gradeButton,
              styles.goodButton,
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.gradeText, styles.goodText]}>Good</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => onGrade('easy')}
            style={({ pressed }) => [
              styles.gradeButton,
              styles.easyButton,
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.gradeText, styles.easyText]}>Easy</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
