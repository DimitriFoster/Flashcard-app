import type { ViewStyle } from 'react-native';

export const COLORS = {
  background: '#FFF8ED',
  panel: '#FFFEF8',
  panelAlt: '#F7EDDF',
  ink: '#2A241F',
  muted: '#7A6C5E',
  line: '#E7D7C4',

  create: '#5DBB8E',
  createSoft: '#E3F7EC',
  createPaper: '#DDF3E6',
  createCrayon: '#82CFA6',
  createDeep: '#2E755B',

  review: '#6F91EA',
  reviewSoft: '#E7EEFF',
  reviewPaper: '#DEE9FF',
  reviewCrayon: '#94AFF3',
  reviewDeep: '#405FB8',

  note: '#E7B94F',
  noteSoft: '#FFF5CF',
  notePaper: '#FFF1B8',
  noteCrayon: '#F0D172',
  noteDeep: '#8A6317',
  noteLine: '#E9DCA8',

  warning: '#B87524',
  warningSoft: '#FFF1D8',
  warningCrayon: '#F2C779',
  danger: '#D85B4A',
  dangerSoft: '#FDE9E4',
  dangerCrayon: '#F3A095',

  white: '#FFFFFF',
  disabled: '#E3D9CD',
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
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  } satisfies ViewStyle,
  soft: {
    shadowColor: '#000000',
    shadowOpacity: 0.045,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  } satisfies ViewStyle,
} as const;

export const MOTION = {
  fast: 180,
  base: 220,
} as const;
