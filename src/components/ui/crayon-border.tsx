import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

type CrayonTone = 'blue' | 'yellow' | 'green' | 'peach' | 'red' | 'neutral';

const TONE_COLORS: Record<CrayonTone, string> = {
  blue: '#2E83D6',
  yellow: '#D59B1C',
  green: '#66A749',
  peach: '#D76F5F',
  red: '#C9584D',
  neutral: '#BCA98A',
};

type Props = {
  children?: React.ReactNode;
  tone?: CrayonTone;
  color?: string;
  borderWidth?: number;
  radius?: number;
  fillColor?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  dashed?: boolean;
};

/**
 * Reusable hand-drawn border wrapper.
 *
 * This intentionally uses plain React Native Views instead of a PNG shell, so it
 * can be dropped around buttons, search inputs, panels, rows, and other live UI
 * without baking layout into an image. The slight offset/opacity layers mimic a
 * crayon line that was drawn more than once.
 */
export function CrayonBorder({
  children,
  tone = 'neutral',
  color,
  borderWidth = 2,
  radius = 18,
  fillColor = 'transparent',
  style,
  contentStyle,
  dashed = false,
}: Props) {
  const strokeColor = color ?? TONE_COLORS[tone];
  const borderStyle = dashed ? 'dashed' : 'solid';

  return (
    <View
      style={[
        styles.shell,
        {
          borderRadius: radius,
          backgroundColor: fillColor,
        },
        style,
      ]}>
      <View style={[styles.content, contentStyle]}>{children}</View>

      <View
        pointerEvents="none"
        style={[
          styles.stroke,
          {
            borderColor: strokeColor,
            borderRadius: radius,
            borderStyle,
            borderWidth,
            opacity: 0.68,
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.stroke,
          {
            borderColor: strokeColor,
            borderRadius: radius + 1,
            borderStyle,
            borderWidth: Math.max(1, borderWidth - 0.4),
            opacity: 0.34,
            transform: [{ translateX: -1 }, { translateY: 0.6 }],
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.stroke,
          {
            borderColor: strokeColor,
            borderRadius: Math.max(0, radius - 1),
            borderStyle,
            borderWidth: Math.max(1, borderWidth - 0.7),
            opacity: 0.22,
            transform: [{ translateX: 1.2 }, { translateY: -0.8 }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'relative',
  },
  content: {
    flex: 1,
  },
  stroke: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
