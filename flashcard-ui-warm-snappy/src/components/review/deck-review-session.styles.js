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
 * Styles for the focused deck review session.
 *
 * These styles support both portrait and landscape layouts. The layout choices
 * here are part of the product goal: review should feel full-screen, calm, and
 * touch-friendly.
 */
var react_native_1 = require("react-native");
var design_1 = require("@/constants/design");
Object.defineProperty(exports, "COLORS", { enumerable: true, get: function () { return design_1.COLORS; } });
exports.styles = react_native_1.StyleSheet.create({
    screen: {
        flex: 1,
        paddingHorizontal: design_1.SPACING.lg,
        backgroundColor: design_1.COLORS.background,
    },
    header: {
        gap: design_1.SPACING.sm,
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
        borderRadius: design_1.RADIUS.md,
        paddingHorizontal: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: design_1.COLORS.reviewSoft,
        borderColor: design_1.COLORS.review,
        borderWidth: 1,
    },
    backButtonText: {
        color: design_1.COLORS.review,
        fontWeight: '800',
    },
    eyebrow: {
        color: design_1.COLORS.review,
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
    },
    title: {
        color: design_1.COLORS.ink,
        fontSize: 28,
        lineHeight: 34,
        fontWeight: '800',
    },
    subtitle: {
        color: design_1.COLORS.muted,
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
        alignSelf: 'stretch',
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
        borderRadius: design_1.RADIUS.xl,
        backgroundColor: '#E6D9CA',
        opacity: 0.6,
        transform: [{ rotate: '-2deg' }],
    },
    cardStackMiddle: {
        position: 'absolute',
        top: 12,
        left: 16,
        right: 16,
        bottom: -12,
        borderRadius: design_1.RADIUS.xl,
        backgroundColor: '#F0E5D7',
        opacity: 0.9,
        transform: [{ rotate: '1.5deg' }],
    },
    cardShell: {
        alignSelf: 'stretch',
    },
    card: __assign({ minHeight: 390, borderRadius: design_1.RADIUS.xl, padding: 28, backgroundColor: design_1.COLORS.panel, borderColor: design_1.COLORS.line, borderWidth: 1, justifyContent: 'center', alignItems: 'center', gap: design_1.SPACING.lg }, design_1.SHADOWS.card),
    cardPressed: {
        transform: [{ scale: 0.995 }],
    },
    cardLandscape: {
        minHeight: 260,
    },
    cardSide: {
        color: design_1.COLORS.review,
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
    },
    cardText: {
        color: design_1.COLORS.ink,
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
        color: design_1.COLORS.muted,
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
        minHeight: 54,
        borderRadius: design_1.RADIUS.pill,
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
        backgroundColor: design_1.COLORS.warningSoft,
        borderColor: '#F2C47D',
    },
    hardButton: {
        backgroundColor: design_1.COLORS.dangerSoft,
        borderColor: '#F0A296',
    },
    goodButton: {
        backgroundColor: design_1.COLORS.reviewSoft,
        borderColor: design_1.COLORS.review,
    },
    easyButton: {
        backgroundColor: design_1.COLORS.createSoft,
        borderColor: design_1.COLORS.create,
    },
    againText: {
        color: design_1.COLORS.warning,
    },
    hardText: {
        color: design_1.COLORS.danger,
    },
    goodText: {
        color: design_1.COLORS.review,
    },
    easyText: {
        color: design_1.COLORS.create,
    },
    emptyState: __assign({ borderRadius: design_1.RADIUS.lg, backgroundColor: design_1.COLORS.panel, borderColor: design_1.COLORS.line, borderWidth: 1, padding: 22, alignItems: 'center', gap: 8 }, design_1.SHADOWS.soft),
    emptyTitle: {
        color: design_1.COLORS.ink,
        fontSize: 22,
        fontWeight: '800',
    },
    emptyText: {
        color: design_1.COLORS.muted,
        textAlign: 'center',
    },
    pressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
});
