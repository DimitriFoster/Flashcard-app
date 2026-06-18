/**
 * Styles for the focused deck review session.
 *
 * These styles support both portrait and landscape layouts. The layout choices
 * here are part of the product goal: review should feel full-screen, calm, and
 * touch-friendly.
 */
import { StyleSheet } from 'react-native';

export const COLORS = {
  background: '#F7F8FB',
  panel: '#FFFFFF',
  ink: '#172033',
  muted: '#667085',
  line: '#D8DEE8',
  review: '#375DFB',
  reviewSoft: '#E5EAFF',
  create: '#0E8F7E',
};

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 18,
    backgroundColor: COLORS.background,
  },
  header: {
    gap: 10,
  },
  headerLandscape: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextGroup: {
    flex: 1,
    gap: 3,
  },
  backButton: {
    alignSelf: 'flex-start',
    minHeight: 40,
    borderRadius: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.reviewSoft,
    borderColor: COLORS.review,
    borderWidth: 1,
  },
  backButtonText: {
    color: COLORS.review,
    fontWeight: '800',
  },
  eyebrow: {
    color: COLORS.review,
    fontSize: 13,
    fontWeight: '800',
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
  cardShell: {
    alignSelf: 'stretch',
  },
  cardShellLandscape: {
    width: '72%',
    alignSelf: 'center',
  },
  card: {
    minHeight: 360,
    borderRadius: 18,
    padding: 24,
    backgroundColor: COLORS.panel,
    borderColor: COLORS.line,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  cardLandscape: {
    minHeight: 250,
  },
  cardSide: {
    color: COLORS.review,
    fontSize: 13,
    fontWeight: '800',
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
    flex: 1,
    minWidth: '45%',
    minHeight: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  gradeText: {
    fontSize: 14,
    fontWeight: '800',
  },
  againButton: {
    backgroundColor: '#FFF4E5',
    borderColor: '#FEDF89',
  },
  hardButton: {
    backgroundColor: '#FEE4E2',
    borderColor: '#FECDCA',
  },
  goodButton: {
    backgroundColor: COLORS.reviewSoft,
    borderColor: COLORS.review,
  },
  easyButton: {
    backgroundColor: '#DCF8F2',
    borderColor: COLORS.create,
  },
  againText: {
    color: '#B54708',
  },
  hardText: {
    color: '#D92D20',
  },
  goodText: {
    color: COLORS.review,
  },
  easyText: {
    color: COLORS.create,
  },
  emptyState: {
    borderRadius: 16,
    backgroundColor: COLORS.panel,
    borderColor: COLORS.line,
    borderWidth: 1,
    padding: 22,
    alignItems: 'center',
    gap: 8,
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
    opacity: 0.72,
  },
});
