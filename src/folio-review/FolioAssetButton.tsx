import React from 'react';
import {
  GestureResponderEvent,
  Image,
  ImageStyle,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

type Props = {
  source: ImageSourcePropType;
  accessibilityLabel: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  disabled?: boolean;
  testID?: string;
};

export function FolioAssetButton({
  source,
  accessibilityLabel,
  onPress,
  style,
  imageStyle,
  disabled,
  testID,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      disabled={disabled}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        style,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      <Image source={source} resizeMode="contain" style={[styles.image, imageStyle]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  image: {
    height: '100%',
    overflow: 'visible',
    width: '100%',
  },
  pressed: {
    transform: [{ scale: 0.97 }, { translateY: 1 }],
  },
  disabled: {
    opacity: 1,
  },
});
