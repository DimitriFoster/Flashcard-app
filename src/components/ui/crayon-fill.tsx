/**
 * CrayonFill.
 *
 * Uses actual transparent PNG texture assets instead of pseudo-generated View
 * strokes. This makes the colored areas feel hand-filled rather than
 * decorated with a few overlay lines.
 */
import React from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';

import { COLORS } from '@/constants/design';

export type CrayonTone = 'create' | 'review' | 'note' | 'warning' | 'danger';
export type CrayonVariant = 'loose' | 'dense' | 'tight';

type CrayonFillProps = {
  tone?: CrayonTone;
  variant?: CrayonVariant;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
};

const TONES: Record<CrayonTone, { wash: string }> = {
  create: { wash: COLORS.createPaper },
  review: { wash: COLORS.reviewPaper },
  note: { wash: COLORS.notePaper },
  warning: { wash: COLORS.warningSoft },
  danger: { wash: COLORS.dangerSoft },
};

const TEXTURES: Record<CrayonTone, Record<CrayonVariant, ImageSourcePropType>> = {
  create: {
    loose: require('../../../assets/images/crayon/create-loose.png'),
    tight: require('../../../assets/images/crayon/create-tight.png'),
    dense: require('../../../assets/images/crayon/create-dense.png'),
  },
  review: {
    loose: require('../../../assets/images/crayon/review-loose.png'),
    tight: require('../../../assets/images/crayon/review-tight.png'),
    dense: require('../../../assets/images/crayon/review-dense.png'),
  },
  note: {
    loose: require('../../../assets/images/crayon/warning-loose.png'),
    tight: require('../../../assets/images/crayon/warning-tight.png'),
    dense: require('../../../assets/images/crayon/warning-dense.png'),
  },
  warning: {
    loose: require('../../../assets/images/crayon/warning-loose.png'),
    tight: require('../../../assets/images/crayon/warning-tight.png'),
    dense: require('../../../assets/images/crayon/warning-dense.png'),
  },
  danger: {
    loose: require('../../../assets/images/crayon/danger-loose.png'),
    tight: require('../../../assets/images/crayon/danger-tight.png'),
    dense: require('../../../assets/images/crayon/danger-dense.png'),
  },
};

function getDefaultVariant(tone: CrayonTone): CrayonVariant {
  switch (tone) {
    case 'note':
    case 'warning':
    case 'danger':
      return 'dense';
    case 'review':
      return 'tight';
    case 'create':
    default:
      return 'loose';
  }
}

export function CrayonFill({ tone = 'create', variant, opacity = 1, style }: CrayonFillProps) {
  const resolvedVariant = variant ?? getDefaultVariant(tone);

  return (
    <View pointerEvents="none" style={[styles.fill, style]}>
      <View style={[styles.wash, { backgroundColor: TONES[tone].wash }]} />
      <Image
        source={TEXTURES[tone][resolvedVariant]}
        resizeMode="repeat"
        fadeDuration={0}
        style={[styles.texture, { opacity }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  wash: {
    ...StyleSheet.absoluteFillObject,
  },
  texture: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
});
