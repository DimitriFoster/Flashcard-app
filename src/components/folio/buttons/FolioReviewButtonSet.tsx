import React from 'react';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';

import type { ReviewGrade } from '@/types/flashcard';

import { FolioImageSkinButton } from './FolioImageSkinButton';

const BUTTON_SKINS = {
  toolbarBack: require('../../../../assets/images/review-button-skins/toolbar-back-yellow.png') as ImageSourcePropType,
  toolbarUndo: require('../../../../assets/images/review-button-skins/toolbar-undo-lavender.png') as ImageSourcePropType,
  toolbarEdit: require('../../../../assets/images/review-button-skins/toolbar-edit-green.png') as ImageSourcePropType,
  toolbarHelp: require('../../../../assets/images/review-button-skins/toolbar-help-blue.png') as ImageSourcePropType,
  gradeAgain: require('../../../../assets/images/review-button-skins/grade-again-yellow.png') as ImageSourcePropType,
  gradeHard: require('../../../../assets/images/review-button-skins/grade-hard-red.png') as ImageSourcePropType,
  gradeGood: require('../../../../assets/images/review-button-skins/grade-good-blue.png') as ImageSourcePropType,
  gradeEasy: require('../../../../assets/images/review-button-skins/grade-easy-green.png') as ImageSourcePropType,
} as const;

const COLORS = {
  ink: '#2E281F',
  orange: '#B97512',
  coral: '#D15A4C',
  blue: '#2F5FB8',
  green: '#24725C',
  purple: '#7651B2',
} as const;

export function FolioReviewToolbarButtons({
  onBack,
  onUndo,
  onEdit,
  onHelp,
  showUndoButton = true,
}: {
  onBack: () => void;
  onUndo?: () => void;
  onEdit?: () => void;
  onHelp: () => void;
  showUndoButton?: boolean;
}) {
  return (
    <>
      <FolioImageSkinButton
        accessibilityLabel="Go back"
        backgroundSource={BUTTON_SKINS.toolbarBack}
        iconColor={COLORS.ink}
        iconName="back"
        iconSize={32}
        onPress={onBack}
        shellStyle={styles.toolbarPrimaryButton}
      />

      <View style={styles.toolbarActionGroup}>
        {onUndo ? (
          <FolioImageSkinButton
            accessibilityLabel="Undo"
            backgroundSource={BUTTON_SKINS.toolbarUndo}
            disabled={!showUndoButton}
            iconColor={COLORS.purple}
            iconName="undo"
            iconSize={24}
            label="Undo"
            onPress={onUndo}
            shellStyle={styles.toolbarSecondaryButton}
          />
        ) : null}

        {onEdit ? (
          <FolioImageSkinButton
            accessibilityLabel="Edit current card"
            backgroundSource={BUTTON_SKINS.toolbarEdit}
            iconColor={COLORS.green}
            iconName="edit"
            iconSize={25}
            label="Edit"
            onPress={onEdit}
            shellStyle={styles.toolbarSecondaryButton}
          />
        ) : null}

        <FolioImageSkinButton
          accessibilityLabel="Open help"
          backgroundSource={BUTTON_SKINS.toolbarHelp}
          iconColor={COLORS.blue}
          iconName="help"
          iconSize={34}
          onPress={onHelp}
          shellStyle={styles.toolbarHelpButton}
        />
      </View>
    </>
  );
}

const gradeButtons: {
  grade: ReviewGrade;
  label: string;
  hint: string;
  iconName: 'again' | 'hard' | 'good' | 'easy';
  iconColor: string;
  backgroundSource: ImageSourcePropType;
}[] = [
  {
    grade: 'again',
    label: 'Again',
    hint: '< 1 min',
    iconName: 'again',
    iconColor: COLORS.orange,
    backgroundSource: BUTTON_SKINS.gradeAgain,
  },
  {
    grade: 'hard',
    label: 'Hard',
    hint: '5 min',
    iconName: 'hard',
    iconColor: COLORS.coral,
    backgroundSource: BUTTON_SKINS.gradeHard,
  },
  {
    grade: 'good',
    label: 'Good',
    hint: '15 min',
    iconName: 'good',
    iconColor: COLORS.blue,
    backgroundSource: BUTTON_SKINS.gradeGood,
  },
  {
    grade: 'easy',
    label: 'Easy',
    hint: '4 d',
    iconName: 'easy',
    iconColor: COLORS.green,
    backgroundSource: BUTTON_SKINS.gradeEasy,
  },
];

export function FolioReviewGradeButtonRow({
  onGrade,
}: {
  onGrade: (grade: ReviewGrade) => void;
}) {
  return (
    <View style={styles.gradeRow}>
      {gradeButtons.map((button) => (
        <FolioImageSkinButton
          key={button.grade}
          accessibilityLabel={`${button.label}, ${button.hint}`}
          backgroundSource={button.backgroundSource}
          iconColor={button.iconColor}
          iconName={button.iconName}
          iconSize={30}
          label={button.label}
          hint={button.hint}
          onPress={() => onGrade(button.grade)}
          shellStyle={styles.gradeButton}
          labelStyle={styles.gradeLabel}
          hintStyle={styles.gradeHint}
          contentStyle={styles.gradeContent}
        />
      ))}
    </View>
  );
}

export { BUTTON_SKINS as FOLIO_REVIEW_BUTTON_SKINS };

const styles = StyleSheet.create({
  toolbarActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    minWidth: 188,
  },
  toolbarPrimaryButton: {
    width: 58,
    height: 58,
  },
  toolbarSecondaryButton: {
    width: 56,
    height: 56,
  },
  toolbarHelpButton: {
    width: 58,
    height: 58,
  },
  gradeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  gradeButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 96,
    maxHeight: 122,
    aspectRatio: 0.8,
  },
  gradeContent: {
    paddingTop: 8,
    gap: 2,
  },
  gradeLabel: {
    fontSize: 18,
    lineHeight: 22,
  },
  gradeHint: {
    fontSize: 12,
    lineHeight: 15,
  },
});
