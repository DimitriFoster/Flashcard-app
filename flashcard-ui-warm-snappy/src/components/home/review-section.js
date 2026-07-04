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
exports.HomeReviewSection = HomeReviewSection;
/**
 * HomeReviewSection.
 *
 * A small presentational component for the Review call-to-action on the Home screen.
 * It does not know about Expo Router; instead, it receives onPressReview from its parent.
 * This makes the component easy to reuse and keeps navigation decisions in route files.
 */
var react_1 = require("react");
var react_native_1 = require("react-native");
var design_1 = require("@/constants/design");
function HomeReviewSection(_a) {
    var onPressReview = _a.onPressReview;
    return (<react_native_1.View style={[styles.section, styles.reviewSection]}>
      <react_native_1.View style={styles.sectionHeader}>
        <react_native_1.Text style={[styles.sectionLabel, styles.reviewSectionLabel]}>review</react_native_1.Text>
        <react_native_1.Text style={styles.sectionKicker}>Jump into spaced repetition when you’re ready.</react_native_1.Text>
      </react_native_1.View>

      <react_native_1.Pressable accessibilityRole="button" onPress={onPressReview} style={function (_a) {
        var pressed = _a.pressed;
        return [styles.reviewButton, pressed && styles.pressed];
    }}>
        <react_native_1.Text style={styles.reviewButtonText}>Review</react_native_1.Text>
      </react_native_1.Pressable>
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    section: __assign({ borderRadius: design_1.RADIUS.lg, padding: design_1.SPACING.lg, gap: design_1.SPACING.md, backgroundColor: design_1.COLORS.panel, borderWidth: 1, borderColor: design_1.COLORS.line }, design_1.SHADOWS.soft),
    reviewSection: {
        borderTopColor: design_1.COLORS.review,
        borderTopWidth: 4,
    },
    reviewSectionLabel: {
        color: design_1.COLORS.review,
    },
    sectionHeader: {
        gap: 4,
    },
    sectionLabel: {
        color: design_1.COLORS.review,
        fontSize: 28,
        fontWeight: '800',
    },
    sectionKicker: {
        color: design_1.COLORS.muted,
        fontSize: 14,
        fontWeight: '600',
    },
    reviewButton: {
        backgroundColor: design_1.COLORS.reviewSoft,
        borderColor: design_1.COLORS.review,
        borderWidth: 1,
        borderRadius: design_1.RADIUS.md,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reviewButtonText: {
        color: design_1.COLORS.review,
        fontSize: 16,
        fontWeight: '800',
    },
    pressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
});
