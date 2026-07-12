import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FolioAssetButton } from './FolioAssetButton';
import { folioReviewAssets } from './folioReviewAssets';
import { ReviewGrade } from './types';

type Props = {
  onGrade?: (grade: ReviewGrade) => void;
  layoutScale?: number;
};

export function GradeButtonRow({ onGrade, layoutScale = 1 }: Props) {
  const scale = Math.max(0.74, Math.min(layoutScale, 1));
  const buttonHeight = Math.round(88 * scale);

  return (
    <View style={[styles.row, { gap: Math.round(8 * scale), marginBottom: Math.round(8 * scale), marginTop: Math.round(10 * scale), paddingHorizontal: Math.round(8 * scale) }]}>
      <FolioAssetButton source={folioReviewAssets.grade.again} accessibilityLabel="Again, less than one minute" testID="grade-again" onPress={() => onGrade?.('again')} style={[styles.button, { minHeight: buttonHeight, maxWidth: Math.round(112 * scale) }]} />
      <FolioAssetButton source={folioReviewAssets.grade.hard} accessibilityLabel="Hard, five minutes" testID="grade-hard" onPress={() => onGrade?.('hard')} style={[styles.button, { minHeight: buttonHeight, maxWidth: Math.round(112 * scale) }]} />
      <FolioAssetButton source={folioReviewAssets.grade.good} accessibilityLabel="Good, fifteen minutes" testID="grade-good" onPress={() => onGrade?.('good')} style={[styles.button, { minHeight: buttonHeight, maxWidth: Math.round(112 * scale) }]} />
      <FolioAssetButton source={folioReviewAssets.grade.easy} accessibilityLabel="Easy, four days" testID="grade-easy" onPress={() => onGrade?.('easy')} style={[styles.button, { minHeight: buttonHeight, maxWidth: Math.round(112 * scale) }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 8,
    marginTop: 10,
    paddingHorizontal: 8,
    width: '100%',
  },
  button: {
    aspectRatio: 1,
    flex: 1,
    minHeight: 88,
    maxWidth: 112,
  },
});
