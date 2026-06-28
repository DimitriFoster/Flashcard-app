/**
 * Styles for the focused deck review session.
 *
 * These styles support both portrait and landscape layouts. The layout choices
 * here are part of the product goal: review should feel full-screen, calm, and
 * touch-friendly.
 */
import { StyleSheet } from 'react-native';

import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/design';

export { COLORS };

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  header: {
    gap: SPACING.sm,
  },
  headerLandscape: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextGroup: {
    flex: 1,
    gap: 3,
  },
  headerButtonGroup: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 8,
  },
  backButton: {
    position: 'relative',
    overflow: 'hidden',
    alignSelf: 'flex-start',
    minHeight: 40,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.reviewSoft,
    borderColor: COLORS.reviewCrayon,
    borderWidth: 1,
  },
  backButtonText: {
    color: COLORS.reviewDeep,
    fontWeight: '800',
  },
  undoButton: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 40,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.warningSoft,
    borderColor: COLORS.warningCrayon,
    borderWidth: 1,
  },
  undoButtonText: {
    color: COLORS.warning,
    fontWeight: '800',
  },
  editButton: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 40,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.createSoft,
    borderColor: COLORS.createCrayon,
    borderWidth: 1,
  },
  editButtonText: {
    color: COLORS.createDeep,
    fontWeight: '800',
  },
  eyebrow: {
    color: COLORS.reviewDeep,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    color: COLORS.ink,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    fontWeight: '700',
  },
  stage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stageLandscape: {
    justifyContent: 'center',
  },
  cardStack: {
    position: 'relative',
    alignSelf: 'stretch',
  },
  stageCrayon: {
    top: -24,
    bottom: -24,
    left: -18,
    right: -18,
    borderRadius: RADIUS.xl,
  },
  cardStackLandscape: {
    width: '72%',
    alignSelf: 'center',
  },
  cardStackBack: {
    position: 'absolute',
    top: 22,
    left: 28,
    right: 28,
    bottom: -22,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.reviewPaper,
    opacity: 0.6,
    transform: [{ rotate: '-2deg' }],
  },
  cardStackMiddle: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    bottom: -12,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.reviewSoft,
    opacity: 0.9,
    transform: [{ rotate: '1.5deg' }],
  },
  cardShell: {
    alignSelf: 'stretch',
  },
  card: {
    minHeight: 390,
    borderRadius: RADIUS.xl,
    padding: 28,
    backgroundColor: COLORS.panel,
    borderColor: COLORS.reviewCrayon,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.lg,
    ...SHADOWS.card,
  },
  cardPressed: {
    transform: [{ scale: 0.995 }],
  },
  cardLandscape: {
    minHeight: 260,
  },
  cardSide: {
    color: COLORS.reviewDeep,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  cardText: {
    color: COLORS.ink,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '800',
    textAlign: 'center',
  },
  cardTextLandscape: {
    fontSize: 28,
    lineHeight: 36,
  },
  tapHint: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  gradeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gradeRowLandscape: {
    alignSelf: 'center',
    width: '72%',
  },
  gradeButton: {
    position: 'relative',
    overflow: 'hidden',
    flex: 1,
    minWidth: '45%',
    minHeight: 54,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    gap: 2,
  },
  gradeText: {
    fontSize: 14,
    fontWeight: '900',
  },
  gradeHint: {
    fontSize: 11,
    fontWeight: '800',
    opacity: 0.72,
    textTransform: 'uppercase',
  },
  againButton: {
    backgroundColor: COLORS.warningSoft,
    borderColor: COLORS.warningCrayon,
  },
  hardButton: {
    backgroundColor: COLORS.dangerSoft,
    borderColor: COLORS.dangerCrayon,
  },
  goodButton: {
    backgroundColor: COLORS.reviewSoft,
    borderColor: COLORS.reviewCrayon,
  },
  easyButton: {
    backgroundColor: COLORS.createSoft,
    borderColor: COLORS.createCrayon,
  },
  againText: {
    color: COLORS.warning,
  },
  hardText: {
    color: COLORS.danger,
  },
  goodText: {
    color: COLORS.reviewDeep,
  },
  easyText: {
    color: COLORS.createDeep,
  },
  editPanel: {
    position: 'relative',
    overflow: 'hidden',
    alignSelf: 'stretch',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    gap: SPACING.sm,
    backgroundColor: COLORS.panel,
    borderColor: COLORS.createCrayon,
    borderWidth: 1,
    ...SHADOWS.card,
  },
  editTitle: {
    color: COLORS.createDeep,
    fontSize: 17,
    fontWeight: '900',
  },
  editInput: {
    color: COLORS.ink,
    backgroundColor: COLORS.panel,
    borderColor: COLORS.line,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    lineHeight: 22,
  },
  editFrontInput: {
    minHeight: 96,
  },
  editBackInput: {
    minHeight: 126,
  },
  editActionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  editSecondaryButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.panelAlt,
    borderColor: COLORS.line,
    borderWidth: 1,
  },
  editSecondaryButtonText: {
    color: COLORS.muted,
    fontWeight: '800',
  },
  editPrimaryButton: {
    position: 'relative',
    overflow: 'hidden',
    flex: 1.4,
    minHeight: 46,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.createSoft,
    borderColor: COLORS.createCrayon,
    borderWidth: 1,
  },
  editPrimaryButtonText: {
    color: COLORS.createDeep,
    fontWeight: '900',
  },
  emptyState: {
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.panel,
    borderColor: COLORS.reviewCrayon,
    borderWidth: 1,
    padding: 22,
    alignItems: 'center',
    gap: 8,
    ...SHADOWS.soft,
  },
  emptyTitle: {
    color: COLORS.ink,
    fontSize: 22,
    fontWeight: '800',
  },
  emptyText: {
    color: COLORS.muted,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
