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
  TextInput,
  useWindowDimensions,
  View,
  type PanResponderInstance,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CrayonFill, type CrayonTone, type CrayonVariant } from '@/components/ui/crayon-fill';
import { COLORS, styles } from './deck-review-session.styles';
import type { Flashcard, ReviewGrade } from '@/types/flashcard';

type DeckReviewSessionProps = {
  deckName?: string;
  currentIndex: number;
  cardsLength: number;
  currentCard?: Flashcard;
  flipped: boolean;
  translateX: Animated.Value;
  panHandlers: PanResponderInstance['panHandlers'];
  showGradeButtons?: boolean;
  showUndoButton?: boolean;
  isEditing?: boolean;
  editFront?: string;
  editBack?: string;
  onChangeEditFront?: (value: string) => void;
  onChangeEditBack?: (value: string) => void;
  onStartEdit?: () => void;
  onCancelEdit?: () => void;
  onSaveEdit?: () => void;
  onBack: () => void;
  onUndo?: () => void;
  onGrade: (grade: ReviewGrade) => void;
};

const gradeButtons: {
  label: string;
  hint: string;
  grade: ReviewGrade;
  buttonStyle: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
  crayonTone: CrayonTone;
  crayonVariant: CrayonVariant;
}[] = [
  {
    label: 'Again',
    hint: 'soon',
    grade: 'again',
    buttonStyle: styles.againButton,
    textStyle: styles.againText,
    crayonTone: 'warning',
    crayonVariant: 'dense',
  },
  {
    label: 'Hard',
    hint: 'short',
    grade: 'hard',
    buttonStyle: styles.hardButton,
    textStyle: styles.hardText,
    crayonTone: 'danger',
    crayonVariant: 'dense',
  },
  {
    label: 'Good',
    hint: 'normal',
    grade: 'good',
    buttonStyle: styles.goodButton,
    textStyle: styles.goodText,
    crayonTone: 'review',
    crayonVariant: 'tight',
  },
  {
    label: 'Easy',
    hint: 'later',
    grade: 'easy',
    buttonStyle: styles.easyButton,
    textStyle: styles.easyText,
    crayonTone: 'create',
    crayonVariant: 'tight',
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
  showGradeButtons = true,
  showUndoButton = false,
  isEditing = false,
  editFront = '',
  editBack = '',
  onChangeEditFront,
  onChangeEditBack,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onBack,
  onUndo,
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
        <View style={styles.headerButtonGroup}>
          <Pressable
            accessibilityRole="button"
            onPress={onBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <CrayonFill tone="review" variant="tight" opacity={0.7} />
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>

          {showUndoButton && onUndo ? (
            <Pressable
              accessibilityRole="button"
              onPress={onUndo}
              style={({ pressed }) => [styles.undoButton, pressed && styles.pressed]}>
              <CrayonFill tone="warning" variant="tight" opacity={0.62} />
              <Text style={styles.undoButtonText}>Undo</Text>
            </Pressable>
          ) : null}

          {currentCard && onStartEdit ? (
            <Pressable
              accessibilityRole="button"
              onPress={onStartEdit}
              style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}>
              <CrayonFill tone="create" variant="tight" opacity={0.58} />
              <Text style={styles.editButtonText}>Edit</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.headerTextGroup}>
          <Text style={styles.eyebrow}>Deck Review</Text>
          <Text style={styles.title}>{deckName ?? 'Deck not found'}</Text>
          <Text style={styles.subtitle}>
            {cardsLength > 0
              ? `${currentIndex + 1} of ${cardsLength}`
              : showGradeButtons
                ? 'No cards due'
                : 'No cards yet'}
          </Text>
        </View>
      </View>

      <View style={[styles.stage, isLandscape && styles.stageLandscape]}>
        {currentCard && isEditing ? (
          <View style={[styles.editPanel, isLandscape && styles.cardStackLandscape]}>
            <CrayonFill tone="create" variant="loose" opacity={0.2} />
            <Text style={styles.editTitle}>Edit current card</Text>
            <TextInput
              multiline
              value={editFront}
              onChangeText={onChangeEditFront}
              placeholder="Prompt / front"
              placeholderTextColor={COLORS.muted}
              style={[styles.editInput, styles.editFrontInput]}
              textAlignVertical="top"
            />
            <TextInput
              multiline
              value={editBack}
              onChangeText={onChangeEditBack}
              placeholder="Answer / back"
              placeholderTextColor={COLORS.muted}
              style={[styles.editInput, styles.editBackInput]}
              textAlignVertical="top"
            />
            <View style={styles.editActionRow}>
              <Pressable
                accessibilityRole="button"
                onPress={onCancelEdit ?? (() => undefined)}
                style={({ pressed }) => [styles.editSecondaryButton, pressed && styles.pressed]}>
                <Text style={styles.editSecondaryButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={onSaveEdit ?? (() => undefined)}
                style={({ pressed }) => [styles.editPrimaryButton, pressed && styles.pressed]}>
                <CrayonFill tone="create" variant="tight" opacity={0.8} />
                <Text style={styles.editPrimaryButtonText}>Save changes</Text>
              </Pressable>
            </View>
          </View>
        ) : currentCard ? (
          <View style={[styles.cardStack, isLandscape && styles.cardStackLandscape]}>
            <CrayonFill tone="review" variant="loose" opacity={0.16} style={styles.stageCrayon} />
            <View pointerEvents="none" style={styles.cardStackBack} />
            <View pointerEvents="none" style={styles.cardStackMiddle} />
            <Animated.View
              key={currentCard.id}
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
              <View style={[styles.card, isLandscape && styles.cardLandscape]}>
                <Text style={styles.cardSide}>{flipped ? 'Answer' : 'Prompt'}</Text>
                <Text style={[styles.cardText, isLandscape && styles.cardTextLandscape]}>
                  {flipped ? currentCard.back : currentCard.front}
                </Text>
                <Text style={styles.tapHint}>Tap to flip · Swipe to browse</Text>
              </View>
            </Animated.View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {showGradeButtons ? 'Nothing due right now' : 'No cards in this deck'}
            </Text>
            <Text style={styles.emptyText}>
              {showGradeButtons
                ? 'New, learning, and due review cards will appear here when they are ready.'
                : 'Go back home and add cards first.'}
            </Text>
          </View>
        )}
      </View>

      {currentCard && showGradeButtons && !isEditing ? (
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
              <CrayonFill tone={button.crayonTone} variant={button.crayonVariant} opacity={0.7} />
              <Text style={[styles.gradeText, button.textStyle]}>{button.label}</Text>
              <Text style={[styles.gradeHint, button.textStyle]}>{button.hint}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
