import type { ViewStyle } from 'react-native';

export const COLORS = {
  background: '#F8F3EA',
  panel: '#FFFDF8',
  panelAlt: '#F1E8DC',
  ink: '#241F1A',
  muted: '#776B5F',
  line: '#E2D3C3',

  create: '#138A72',
  createSoft: '#DDF5EC',
  createDeep: '#0C5F4F',

  review: '#3457D5',
  reviewSoft: '#E8EDFF',
  reviewDeep: '#243A96',

  warning: '#B86A12',
  warningSoft: '#FFF2D9',
  danger: '#D94A38',
  dangerSoft: '#FDE8E3',

  white: '#FFFFFF',
  disabled: '#DED6CB',
} as const;

export const RADIUS = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const SPACING = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
} as const;

export const SHADOWS = {
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  } satisfies ViewStyle,
  soft: {
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  } satisfies ViewStyle,
} as const;

export const MOTION = {
  fast: 180,
  base: 220,
} as const;
