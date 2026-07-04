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
var react_native_1 = require("react-native");
var design_1 = require("@/constants/design");
Object.defineProperty(exports, "COLORS", { enumerable: true, get: function () { return design_1.COLORS; } });
exports.styles = react_native_1.StyleSheet.create({
    panelShell: __assign({ position: 'relative', overflow: 'hidden', borderRadius: design_1.RADIUS.lg, borderWidth: 1, borderColor: design_1.COLORS.createCrayon, backgroundColor: design_1.COLORS.createPaper }, design_1.SHADOWS.card),
    collapsedSection: __assign({ position: 'relative', overflow: 'hidden', minHeight: 118, borderRadius: design_1.RADIUS.md, borderWidth: 1, borderColor: design_1.COLORS.createCrayon, paddingHorizontal: 18, paddingVertical: 14, justifyContent: 'center', backgroundColor: design_1.COLORS.createPaper }, design_1.SHADOWS.card),
    headerPressable: {
        paddingHorizontal: 18,
        paddingTop: 16,
        paddingBottom: 14,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    topIconWrap: {
        width: 68,
        height: 68,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    topIcon: {
        width: 60,
        height: 60,
    },
    topTextWrap: {
        flex: 1,
        gap: 2,
    },
    topTitle: {
        color: '#0E6F20',
        fontSize: 20,
        lineHeight: 22,
        fontWeight: '900',
    },
    topSubtitle: {
        color: design_1.COLORS.ink,
        fontSize: 14,
        lineHeight: 19,
        fontWeight: '600',
    },
    topArrow: {
        width: 26,
        height: 26,
        flexShrink: 0,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(97, 157, 88, 0.42)',
    },
    caretWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 6,
    },
    caretIcon: {
        width: 26,
        height: 14,
    },
    body: {
        paddingHorizontal: 18,
        paddingBottom: 18,
    },
    sectionHeading: {
        color: '#0E6F20',
        fontSize: 20,
        lineHeight: 24,
        fontWeight: '900',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    sectionIntro: {
        marginTop: 8,
        color: design_1.COLORS.ink,
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
    },
    optionRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 14,
    },
    optionCard: {
        flex: 1,
        minWidth: 0,
        backgroundColor: 'rgba(255,255,255,0.54)',
        borderWidth: 1,
        borderColor: 'rgba(97, 157, 88, 0.58)',
        borderRadius: 18,
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 14,
        alignItems: 'center',
    },
    optionCardActive: {
        backgroundColor: 'rgba(255,255,255,0.74)',
        borderColor: '#5AAB62',
        shadowColor: '#000000',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    optionIcon: {
        width: 86,
        height: 86,
        marginBottom: 8,
    },
    optionTitle: {
        color: '#0E6F20',
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '900',
        textAlign: 'center',
    },
    optionSubtitle: {
        marginTop: 6,
        color: design_1.COLORS.ink,
        fontSize: 12,
        lineHeight: 17,
        fontWeight: '500',
        textAlign: 'center',
    },
    bodyDivider: {
        height: 1,
        backgroundColor: 'rgba(97, 157, 88, 0.35)',
        marginTop: 18,
        marginBottom: 18,
    },
    fieldLabel: {
        color: '#0E6F20',
        fontSize: 18,
        lineHeight: 22,
        fontWeight: '900',
    },
    inputWrap: {
        marginTop: 10,
        minHeight: 52,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(97, 157, 88, 0.6)',
        backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center',
        paddingLeft: 16,
        paddingRight: 52,
    },
    input: {
        color: design_1.COLORS.ink,
        fontSize: 16,
        lineHeight: 22,
        paddingVertical: 11,
    },
    inputIcon: {
        position: 'absolute',
        right: 15,
        width: 24,
        height: 24,
    },
    helperText: {
        marginTop: 10,
        color: '#4F4740',
        fontSize: 13,
        lineHeight: 19,
        fontWeight: '500',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 14,
    },
    createButton: {
        minHeight: 56,
        minWidth: 190,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(97, 157, 88, 0.66)',
        backgroundColor: 'rgba(255,255,255,0.64)',
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    createButtonText: {
        color: '#0E6F20',
        fontSize: 18,
        lineHeight: 22,
        fontWeight: '900',
    },
    createButtonIcon: {
        width: 34,
        height: 34,
    },
    statusMessage: {
        marginTop: 14,
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: design_1.RADIUS.pill,
        backgroundColor: 'rgba(255,255,255,0.66)',
        borderWidth: 1,
        borderColor: 'rgba(97, 157, 88, 0.45)',
    },
    statusMessageText: {
        color: '#0E6F20',
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '700',
    },
    pressed: {
        opacity: 0.93,
        transform: [{ scale: 0.988 }],
    },
});
