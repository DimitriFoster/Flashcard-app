/**
 * Styles for HomeCreateSection.
 *
 * Keeping this separate from create-section.tsx keeps the component file focused
 * on behavior and makes the layout easier to scan during code review.
 */
import { StyleSheet } from 'react-native';

export const COLORS = {
  panel: '#FFFFFF',
  panelAlt: '#EEF2F7',
  ink: '#172033',
  muted: '#667085',
  line: '#D8DEE8',
  create: '#0E8F7E',
  createSoft: '#DCF8F2',
};

export const styles = StyleSheet.create({
  section: {
    borderRadius: 8,
    padding: 16,
    gap: 14,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
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
    color: '#FFFFFF',
  },
  sectionKicker: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  createCollapsedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  dropdownToggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  createBody: {
    gap: 14,
    paddingTop: 14,
  },
  compactToggle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 42,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.panelAlt,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  compactToggleNarrow: {
    flex: 0.88,
  },
  compactToggleWide: {
    flex: 1.12,
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
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
  deckNameInput: {
    flex: 1,
    minHeight: 48,
  },
  deckButton: {
    minHeight: 48,
    borderRadius: 8,
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
    gap: 10,
    paddingVertical: 2,
  },
  deckPickerPanel: {
    gap: 12,
    backgroundColor: COLORS.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 12,
    overflow: 'hidden',
  },
  newDeckPanel: {
    gap: 10,
    backgroundColor: COLORS.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 12,
    overflow: 'hidden',
  },
  deckChip: {
    minWidth: 132,
    borderRadius: 8,
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
    borderRadius: 8,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#D5DBE5',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  primaryButtonTextDisabled: {
    color: COLORS.muted,
  },
  pressed: {
    opacity: 0.78,
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
