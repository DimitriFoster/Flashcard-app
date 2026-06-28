/**
 * CrayonFill.
 *
 * Textured pastel surface for the app's colored panels.
 *
 * This version uses static local PNG assets rather than SVG or repeated pattern
 * rendering. Each tone gets its own baked texture image so orientation stays
 * recognizable and mobile rendering remains simple.
 */
import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { COLORS } from '@/constants/design';

export type CrayonTone = 'create' | 'review' | 'note' | 'warning' | 'danger';
export type CrayonVariant = 'loose' | 'dense' | 'tight';

type CrayonFillProps = {
  tone?: CrayonTone;
  variant?: CrayonVariant;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
};

const TONES: Record<CrayonTone, string> = {
  create: COLORS.createPaper,
  review: COLORS.reviewPaper,
  note: COLORS.notePaper,
  warning: COLORS.warningSoft,
  danger: COLORS.dangerSoft,
};

const TEXTURES: Partial<Record<CrayonTone, ImageSourcePropType>> = {
  create: require('../../../assets/images/crayon/create-green-texture.png'),
  review: require('../../../assets/images/crayon/review-blue-texture.png'),
  note: require('../../../assets/images/crayon/notes-yellow-texture.png'),
};

const VARIANT_OPACITY: Record<CrayonVariant, number> = {
  loose: 0.92,
  dense: 0.98,
  tight: 0.86,
};

export function CrayonFill({
  tone = 'create',
  variant = 'loose',
  opacity = 1,
  style,
}: CrayonFillProps) {
  const source = TEXTURES[tone];
  const imageOpacity = Math.max(0, Math.min(1, opacity * VARIANT_OPACITY[variant]));

  return (
    <View
      pointerEvents="none"
      style={[
        styles.fill,
        style,
        {
          backgroundColor: TONES[tone],
        },
      ]}>
      {source ? (
        <Image
          source={source}
          resizeMode="cover"
          style={[
            styles.fill,
            {
              opacity: imageOpacity,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.fill,
            {
              backgroundColor: TONES[tone],
              opacity,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
});
