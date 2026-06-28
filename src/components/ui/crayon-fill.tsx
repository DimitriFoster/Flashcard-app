/**
 * CrayonFill.
 *
 * Mobile-safe fallback.
 *
 * The image-based crayon texture caused a blank screen on mobile, so this
 * component intentionally avoids Image assets, SVG, Canvas, and new native
 * dependencies. It keeps the pastel surface treatment stable while the real
 * crayon-fill effect is handed off to Codex with device logs.
 */
import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

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

export function CrayonFill({ tone = 'create', opacity = 1, style }: CrayonFillProps) {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.fill,
        style,
        {
          backgroundColor: TONES[tone],
          opacity,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
});
