import React from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { FolioSvgIcon, type FolioSvgIconName } from '@/components/folio/icons';

export type FolioImageSkinButtonProps = {
  backgroundSource: ImageSourcePropType;
  accessibilityLabel: string;
  onPress?: () => void;
  disabled?: boolean;
  iconName?: FolioSvgIconName;
  iconColor?: string;
  iconSize?: number;
  label?: string;
  hint?: string;
  labelStyle?: StyleProp<TextStyle>;
  hintStyle?: StyleProp<TextStyle>;
  shellStyle?: StyleProp<ViewStyle>;
  faceStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

export function FolioImageSkinButton({
  backgroundSource,
  accessibilityLabel,
  onPress,
  disabled = false,
  iconName,
  iconColor = '#2E281F',
  iconSize = 30,
  label,
  hint,
  labelStyle,
  hintStyle,
  shellStyle,
  faceStyle,
  contentStyle,
  imageStyle,
}: FolioImageSkinButtonProps) {
  const pressProgress = React.useRef(new Animated.Value(0)).current;

  const animateTo = React.useCallback(
    (toValue: number) => {
      Animated.spring(pressProgress, {
        toValue,
        speed: 34,
        bounciness: toValue === 1 ? 0 : 7,
        useNativeDriver: true,
      }).start();
    },
    [pressProgress]
  );

  const animatedStyle = React.useMemo(
    () => ({
      transform: [
        {
          translateY: pressProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 2],
          }),
        },
        {
          scale: pressProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.965],
          }),
        },
      ],
    }),
    [pressProgress]
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      android_disableSound
      disabled={disabled}
      hitSlop={6}
      onPress={onPress}
      onPressIn={() => animateTo(1)}
      onPressOut={() => animateTo(0)}
      style={[styles.shell, shellStyle, disabled && styles.disabled]}>
      <Animated.View style={[styles.lift, animatedStyle]}>
        <View style={[styles.face, faceStyle]}>
          <View pointerEvents="none" style={styles.backgroundLayer}>
            <Image
              source={backgroundSource}
              resizeMode="stretch"
              fadeDuration={0}
              style={[styles.backgroundImage as ImageStyle, imageStyle]}
            />
          </View>

          <View style={[styles.content, contentStyle]}>
            {iconName ? <FolioSvgIcon name={iconName} size={iconSize} color={iconColor} /> : null}

            {label ? (
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.78}
                style={[styles.label, { color: iconColor }, labelStyle]}>
                {label}
              </Text>
            ) : null}

            {hint ? (
              <Text numberOfLines={1} style={[styles.hint, { color: iconColor }, hintStyle]}>
                {hint}
              </Text>
            ) : null}
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: 'visible',
    shadowColor: '#2B2118',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  lift: {
    flex: 1,
  },
  face: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  } as ImageStyle,
  content: {
    position: 'relative',
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingHorizontal: 6,
  },
  label: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  hint: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '800',
    textAlign: 'center',
    opacity: 0.82,
  },
  disabled: {
    opacity: 0.52,
  },
});
