// REVIEW_BUTTON_ART_SNIPPET.tsx
// Reference-only snippet for Codex. Adapt paths to the real project structure.

import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';

function useSnappyPressAnimation() {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const onPressIn = () => {
    scale.value = withTiming(0.965, { duration: 70 });
    translateY.value = withTiming(1.5, { duration: 70 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { stiffness: 380, damping: 24, mass: 0.9 });
    translateY.value = withSpring(0, { stiffness: 380, damping: 24, mass: 0.9 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return { onPressIn, onPressOut, animatedStyle };
}

export function ReviewBackButton({ onPress }: { onPress: () => void }) {
  const press = useSnappyPressAnimation();
  return (
    <Pressable
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={8}
      style={styles.backTouch}
    >
      <Animated.View style={press.animatedStyle}>
        <Image
          source={require('../assets/review-page-buttons/back_button_transparent.png')}
          resizeMode="contain"
          style={styles.backImage}
        />
      </Animated.View>
    </Pressable>
  );
}

export function ReviewGoodButton({ onPress }: { onPress: () => void }) {
  const press = useSnappyPressAnimation();
  return (
    <Pressable
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityRole="button"
      accessibilityLabel="Good, 15 minutes"
      hitSlop={8}
      style={styles.goodTouch}
    >
      <Animated.View style={press.animatedStyle}>
        <Image
          source={require('../assets/review-page-buttons/good_button_transparent.png')}
          resizeMode="contain"
          style={styles.goodImage}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backTouch: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  backImage: {
    width: 76,
    height: 76,
  },
  goodTouch: {
    width: 106,
    height: 146,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  goodImage: {
    width: 98,
    height: 138,
  },
});
