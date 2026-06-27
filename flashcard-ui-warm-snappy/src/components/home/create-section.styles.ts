/**
 * Styles for HomeCreateSection.
 *
 * Keeping this separate from create-section.tsx keeps the component file focused
 * on behavior and makes the layout easier to scan during code review.
 */
import { StyleSheet } from 'react-native';

import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/design';

export { COLORS };

export const styles = StyleSheet.create({
  section: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    ...SHADOWS.soft,
  },
  createSection: {
    borderTopColor: COLORS.create,
    borderTopWidth: 4,
  },
  createCollapsedSection: {
    backgroundColor: COLORS.create,
    borderColor: COLORS.create,
    minHeight: 132,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    ...SHADOWS.card,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionLabel: {
    color: COLORS.create,
    fontSize: 28,
    fontWeight: '800',
  },
  createCollapsedLabel: {
    color: COLORS.white,
  },
  sectionKicker: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  createCollapsedText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  dropdownToggleRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  createBody: {
    gap: SPACING.md,
    paddingTop: SPACING.md,
  },
  destinationRow: {
    minHeight: 42,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.createSoft,
    borderColor: COLORS.create,
    borderWidth: 1,
    gap: 3,
  },
  destinationLabel: {
    color: COLORS.create,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  destinationValue: {
    color: COLORS.ink,
    fontSize: 15,
    fontWeight: '800',
  },
  compactToggle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    backgroundColor: COLORS.panelAlt,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  compactToggleNarrow: {
    flex: 0.9,
  },
  compactToggleWide: {
    flex: 1.1,
  },
  deckPickerToggleText: {
    color: COLORS.ink,
    fontSize: 15,
    fontWeight: '800',
  },
  deckPickerToggleChevron: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: '800',
  },
  input: {
    color: COLORS.ink,
    backgroundColor: COLORS.panelAlt,
    borderColor: COLORS.line,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
  frontInput: {
    minHeight: 92,
  },
  backInput: {
    minHeight: 112,
  },
  deckNameInput: {
    flex: 1,
    minHeight: 48,
  },
  deckButton: {
    minHeight: 48,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.createSoft,
    borderWidth: 1,
    borderColor: COLORS.create,
  },
  deckButtonText: {
    color: COLORS.create,
    fontSize: 14,
    fontWeight: '800',
  },
  deckPicker: {
    gap: SPACING.sm,
    paddingVertical: 2,
  },
  deckPickerPanel: {
    gap: SPACING.md,
    backgroundColor: COLORS.panel,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 12,
    overflow: 'hidden',
  },
  newDeckPanel: {
    gap: SPACING.sm,
    backgroundColor: COLORS.panel,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 12,
    overflow: 'hidden',
  },
  deckChip: {
    minWidth: 132,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.panelAlt,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 3,
  },
  deckChipActive: {
    backgroundColor: COLORS.createSoft,
    borderColor: COLORS.create,
  },
  deckChipText: {
    color: COLORS.ink,
    fontSize: 15,
    fontWeight: '800',
  },
  deckChipTextActive: {
    color: COLORS.create,
  },
  deckChipCount: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: COLORS.create,
    borderRadius: RADIUS.md,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  primaryButtonTextDisabled: {
    color: COLORS.muted,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  statusMessage: {
    alignSelf: 'flex-start',
    color: COLORS.create,
    backgroundColor: COLORS.createSoft,
    borderColor: COLORS.create,
    borderWidth: 1,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 13,
    fontWeight: '800',
  },
  deckSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    paddingTop: 4,
  },
  metric: {
    color: COLORS.create,
    fontSize: 22,
    fontWeight: '800',
  },
  metricLabel: {
    color: COLORS.muted,
    fontSize: 13,
    marginRight: 8,
  },
});
