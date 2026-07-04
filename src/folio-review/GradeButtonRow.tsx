import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FolioAssetButton } from './FolioAssetButton';
import { folioReviewAssets } from './folioReviewAssets';
import { ReviewGrade } from './types';

type Props = {
  onGrade?: (grade: ReviewGrade) => void;
};

export function GradeButtonRow({ onGrade }: Props) {
  return (
    <View style={styles.row}>
      <FolioAssetButton source={folioReviewAssets.grade.again} accessibilityLabel="Again, less than one minute" onPress={() => onGrade?.('again')} style={styles.button} />
      <FolioAssetButton source={folioReviewAssets.grade.hard} accessibilityLabel="Hard, five minutes" onPress={() => onGrade?.('hard')} style={styles.button} />
      <FolioAssetButton source={folioReviewAssets.grade.good} accessibilityLabel="Good, fifteen minutes" onPress={() => onGrade?.('good')} style={styles.button} />
      <FolioAssetButton source={folioReviewAssets.grade.easy} accessibilityLabel="Easy, four days" onPress={() => onGrade?.('easy')} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 8,
    marginTop: 10,
    paddingHorizontal: 20,
    width: '100%',
  },
  button: {
    aspectRatio: 1,
    flex: 1,
    maxWidth: 96,
  },
});
