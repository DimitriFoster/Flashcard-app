import React from 'react';
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';

const art = {
  back: require('../assets/review-page-buttons/back_button.png'),
  undo: require('../assets/review-page-buttons/undo_button.png'),
  edit: require('../assets/review-page-buttons/edit_button.png'),
  help: require('../assets/review-page-buttons/help_button.png'),
  again: require('../assets/review-page-buttons/again_button.png'),
  hard: require('../assets/review-page-buttons/hard_button.png'),
  good: require('../assets/review-page-buttons/good_button.png'),
  easy: require('../assets/review-page-buttons/easy_button.png'),
};

type SkinButtonProps = {
  source: any;
  width: number;
  height: number;
  accessibilityLabel: string;
  onPress?: () => void;
};

function SkinButton({ source, width, height, accessibilityLabel, onPress }: SkinButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.shell,
        { width, height },
        pressed && styles.shellPressed,
      ]}
    >
      <ImageBackground
        source={source}
        resizeMode="stretch"
        style={styles.fill}
      />
    </Pressable>
  );
}

export function ReviewHeaderExample() {
  return (
    <View style={styles.topRow}>
      <SkinButton source={art.back} width={72} height={72} accessibilityLabel="Back" />
      <View style={{ flex: 1 }} />
      <SkinButton source={art.undo} width={72} height={72} accessibilityLabel="Undo" />
      <SkinButton source={art.edit} width={72} height={72} accessibilityLabel="Edit current card" />
      <SkinButton source={art.help} width={72} height={72} accessibilityLabel="Open help" />
    </View>
  );
}

export function DifficultyRowExample() {
  return (
    <View style={styles.bottomRow}>
      <SkinButton source={art.again} width={82} height={116} accessibilityLabel="Again" />
      <SkinButton source={art.hard} width={82} height={116} accessibilityLabel="Hard" />
      <SkinButton source={art.good} width={82} height={116} accessibilityLabel="Good" />
      <SkinButton source={art.easy} width={82} height={116} accessibilityLabel="Easy" />
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    columnGap: 10,
  },
  shell: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    transform: [{ scale: 1 }, { translateY: 0 }],
  },
  shellPressed: {
    transform: [{ scale: 0.97 }, { translateY: 1 }],
    shadowOpacity: 0.08,
    elevation: 3,
  },
  fill: {
    width: '100%',
    height: '100%',
  },
});
