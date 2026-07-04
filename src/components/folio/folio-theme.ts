import type { CrayonTone, CrayonVariant } from '@/components/ui/crayon-fill';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/design';
import type { FolioSvgIconName } from './icons';

export type FolioTone =
  | 'cream'
  | 'create'
  | 'review'
  | 'browse'
  | 'note'
  | 'warning'
  | 'danger'
  | 'undo'
  | 'edit'
  | 'easy'
  | 'help';

export type FolioIconName = FolioSvgIconName;

export const FOLIO = {
  colors: {
    paper: COLORS.background,
    card: '#FFFDF6',
    cardWarm: '#FFF9E8',
    ink: COLORS.ink,
    inkSoft: '#3A332C',
    muted: COLORS.muted,
    border: COLORS.line,
    blue: COLORS.review,
    blueSoft: COLORS.reviewSoft,
    bluePaper: COLORS.reviewPaper,
    blueCrayon: COLORS.reviewCrayon,
    blueDeep: COLORS.reviewDeep,
    greenSoft: COLORS.createSoft,
    greenCrayon: COLORS.createCrayon,
    greenDeep: COLORS.createDeep,
    yellowSoft: COLORS.noteSoft,
    yellowCrayon: COLORS.noteCrayon,
    yellowDeep: COLORS.noteDeep,
    orange: COLORS.warning,
    orangeSoft: COLORS.warningSoft,
    orangeCrayon: COLORS.warningCrayon,
    coral: COLORS.danger,
    coralSoft: COLORS.dangerSoft,
    coralCrayon: COLORS.dangerCrayon,
    purple: '#7651B2',
    purpleSoft: '#F1E9FF',
    purpleCrayon: '#CEB9F2',
  },
  spacing: SPACING,
  radius: RADIUS,
  shadows: SHADOWS,
} as const;

export const FOLIO_TONES: Record<
  FolioTone,
  {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    crayonTone: CrayonTone;
    variant: CrayonVariant;
    opacity: number;
  }
> = {
  cream: {
    backgroundColor: FOLIO.colors.card,
    borderColor: FOLIO.colors.border,
    textColor: FOLIO.colors.ink,
    crayonTone: 'warning',
    variant: 'loose',
    opacity: 0.08,
  },
  create: {
    backgroundColor: FOLIO.colors.greenSoft,
    borderColor: FOLIO.colors.greenCrayon,
    textColor: FOLIO.colors.greenDeep,
    crayonTone: 'create',
    variant: 'tight',
    opacity: 0.62,
  },
  edit: {
    backgroundColor: FOLIO.colors.greenSoft,
    borderColor: FOLIO.colors.greenCrayon,
    textColor: FOLIO.colors.greenDeep,
    crayonTone: 'create',
    variant: 'tight',
    opacity: 0.58,
  },
  easy: {
    backgroundColor: FOLIO.colors.greenSoft,
    borderColor: FOLIO.colors.greenCrayon,
    textColor: FOLIO.colors.greenDeep,
    crayonTone: 'create',
    variant: 'tight',
    opacity: 0.62,
  },
  review: {
    backgroundColor: FOLIO.colors.blueSoft,
    borderColor: FOLIO.colors.blueCrayon,
    textColor: FOLIO.colors.blueDeep,
    crayonTone: 'review',
    variant: 'tight',
    opacity: 0.58,
  },
  browse: {
    backgroundColor: FOLIO.colors.blueSoft,
    borderColor: FOLIO.colors.blueCrayon,
    textColor: FOLIO.colors.blueDeep,
    crayonTone: 'review',
    variant: 'tight',
    opacity: 0.48,
  },
  help: {
    backgroundColor: FOLIO.colors.card,
    borderColor: FOLIO.colors.blueCrayon,
    textColor: FOLIO.colors.blueDeep,
    crayonTone: 'review',
    variant: 'loose',
    opacity: 0.24,
  },
  note: {
    backgroundColor: FOLIO.colors.yellowSoft,
    borderColor: FOLIO.colors.yellowCrayon,
    textColor: FOLIO.colors.yellowDeep,
    crayonTone: 'note',
    variant: 'tight',
    opacity: 0.42,
  },
  warning: {
    backgroundColor: FOLIO.colors.orangeSoft,
    borderColor: FOLIO.colors.orangeCrayon,
    textColor: FOLIO.colors.orange,
    crayonTone: 'warning',
    variant: 'tight',
    opacity: 0.62,
  },
  danger: {
    backgroundColor: FOLIO.colors.coralSoft,
    borderColor: FOLIO.colors.coralCrayon,
    textColor: FOLIO.colors.coral,
    crayonTone: 'danger',
    variant: 'tight',
    opacity: 0.58,
  },
  undo: {
    backgroundColor: FOLIO.colors.purpleSoft,
    borderColor: FOLIO.colors.purpleCrayon,
    textColor: FOLIO.colors.purple,
    crayonTone: 'review',
    variant: 'loose',
    opacity: 0.18,
  },
} as const;
