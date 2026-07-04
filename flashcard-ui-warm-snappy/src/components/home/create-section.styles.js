"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.styles = exports.COLORS = void 0;
/**
 * Styles for HomeCreateSection.
 *
 * Keeping this separate from create-section.tsx keeps the component file focused
 * on behavior and makes the layout easier to scan during code review.
 */
var react_native_1 = require("react-native");
var design_1 = require("@/constants/design");
Object.defineProperty(exports, "COLORS", { enumerable: true, get: function () { return design_1.COLORS; } });
exports.styles = react_native_1.StyleSheet.create({
    section: __assign({ borderRadius: design_1.RADIUS.lg, padding: design_1.SPACING.lg, gap: design_1.SPACING.md, backgroundColor: design_1.COLORS.panel, borderWidth: 1, borderColor: design_1.COLORS.line }, design_1.SHADOWS.soft),
    createSection: {
        borderTopColor: design_1.COLORS.create,
        borderTopWidth: 4,
    },
    createCollapsedSection: __assign({ backgroundColor: design_1.COLORS.create, borderColor: design_1.COLORS.create, minHeight: 132, justifyContent: 'center', alignItems: 'center', gap: 6 }, design_1.SHADOWS.card),
    sectionHeader: {
        gap: 4,
    },
    sectionLabel: {
        color: design_1.COLORS.create,
        fontSize: 28,
        fontWeight: '800',
    },
    createCollapsedLabel: {
        color: design_1.COLORS.white,
    },
    sectionKicker: {
        color: design_1.COLORS.muted,
        fontSize: 14,
        fontWeight: '600',
    },
    createCollapsedText: {
        color: design_1.COLORS.white,
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
    },
    dropdownToggleRow: {
        flexDirection: 'row',
        gap: design_1.SPACING.sm,
    },
    createBody: {
        gap: design_1.SPACING.md,
        paddingTop: design_1.SPACING.md,
    },
    destinationRow: {
        minHeight: 42,
        borderRadius: design_1.RADIUS.md,
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: design_1.COLORS.createSoft,
        borderColor: design_1.COLORS.create,
        borderWidth: 1,
        gap: 3,
    },
    destinationLabel: {
        color: design_1.COLORS.create,
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 0.7,
        textTransform: 'uppercase',
    },
    destinationValue: {
        color: design_1.COLORS.ink,
        fontSize: 15,
        fontWeight: '800',
    },
    compactToggle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 44,
        borderRadius: design_1.RADIUS.md,
        paddingHorizontal: 12,
        backgroundColor: design_1.COLORS.panelAlt,
        borderWidth: 1,
        borderColor: design_1.COLORS.line,
    },
    compactToggleNarrow: {
        flex: 0.9,
    },
    compactToggleWide: {
        flex: 1.1,
    },
    deckPickerToggleText: {
        color: design_1.COLORS.ink,
        fontSize: 15,
        fontWeight: '800',
    },
    deckPickerToggleChevron: {
        color: design_1.COLORS.muted,
        fontSize: 14,
        fontWeight: '800',
    },
    input: {
        color: design_1.COLORS.ink,
        backgroundColor: design_1.COLORS.panelAlt,
        borderColor: design_1.COLORS.line,
        borderWidth: 1,
        borderRadius: design_1.RADIUS.md,
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
        borderRadius: design_1.RADIUS.md,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: design_1.COLORS.createSoft,
        borderWidth: 1,
        borderColor: design_1.COLORS.create,
    },
    deckButtonText: {
        color: design_1.COLORS.create,
        fontSize: 14,
        fontWeight: '800',
    },
    deckPicker: {
        gap: design_1.SPACING.sm,
        paddingVertical: 2,
    },
    deckPickerPanel: {
        gap: design_1.SPACING.md,
        backgroundColor: design_1.COLORS.panel,
        borderRadius: design_1.RADIUS.md,
        borderWidth: 1,
        borderColor: design_1.COLORS.line,
        padding: 12,
        overflow: 'hidden',
    },
    newDeckPanel: {
        gap: design_1.SPACING.sm,
        backgroundColor: design_1.COLORS.panel,
        borderRadius: design_1.RADIUS.md,
        borderWidth: 1,
        borderColor: design_1.COLORS.line,
        padding: 12,
        overflow: 'hidden',
    },
    deckChip: {
        minWidth: 132,
        borderRadius: design_1.RADIUS.md,
        backgroundColor: design_1.COLORS.panelAlt,
        borderWidth: 1,
        borderColor: design_1.COLORS.line,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 3,
    },
    deckChipActive: {
        backgroundColor: design_1.COLORS.createSoft,
        borderColor: design_1.COLORS.create,
    },
    deckChipText: {
        color: design_1.COLORS.ink,
        fontSize: 15,
        fontWeight: '800',
    },
    deckChipTextActive: {
        color: design_1.COLORS.create,
    },
    deckChipCount: {
        color: design_1.COLORS.muted,
        fontSize: 12,
        fontWeight: '700',
    },
    primaryButton: {
        backgroundColor: design_1.COLORS.create,
        borderRadius: design_1.RADIUS.md,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonDisabled: {
        backgroundColor: design_1.COLORS.disabled,
    },
    primaryButtonText: {
        color: design_1.COLORS.white,
        fontSize: 16,
        fontWeight: '800',
    },
    primaryButtonTextDisabled: {
        color: design_1.COLORS.muted,
    },
    pressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    statusMessage: {
        alignSelf: 'flex-start',
        color: design_1.COLORS.create,
        backgroundColor: design_1.COLORS.createSoft,
        borderColor: design_1.COLORS.create,
        borderWidth: 1,
        borderRadius: design_1.RADIUS.pill,
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
        color: design_1.COLORS.create,
        fontSize: 22,
        fontWeight: '800',
    },
    metricLabel: {
        color: design_1.COLORS.muted,
        fontSize: 13,
        marginRight: 8,
    },
});
