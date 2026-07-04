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
 * This redesign follows the Folio paper-and-crayon direction:
 * - cream paper background
 * - blue deck/session accents
 * - crayon-colored toolbar buttons
 * - large stacked card surface
 * - explicit session-flow visualization
 */
var react_native_1 = require("react-native");
var design_1 = require("@/constants/design");
Object.defineProperty(exports, "COLORS", { enumerable: true, get: function () { return design_1.COLORS; } });
exports.styles = react_native_1.StyleSheet.create({
    screen: {
        flex: 1,
        paddingHorizontal: design_1.SPACING.md,
        backgroundColor: design_1.COLORS.background,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        gap: 12,
        paddingBottom: design_1.SPACING.md,
    },
    scrollContentCompact: {
        gap: 10,
    },
    scrollContentLandscape: {
        alignItems: 'center',
    },
    lowOpacityTexture: {
        opacity: 0.22,
    },
    topBar: {
        minHeight: 62,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 7,
        marginBottom: design_1.SPACING.sm,
    },
    topBarLandscape: {
        width: '86%',
        minHeight: 54,
    },
    appTitle: {
        flex: 1,
        minWidth: 86,
        color: design_1.COLORS.ink,
        fontSize: 30,
        lineHeight: 34,
        fontWeight: '900',
        textAlign: 'center',
        includeFontPadding: false,
    },
    topActionGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 8,
        minWidth: 188,
        flexShrink: 0,
    },
    artButtonTouch: {
        overflow: 'visible',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    artButtonPressLayer: {
        overflow: 'visible',
    },
    artButtonImage: {
        width: '100%',
        height: '100%',
    },
    artButtonDisabled: {
        opacity: 0.72,
    },
    backButtonTouch: {
        width: 72,
        height: 72,
    },
    backButtonImage: {
        width: 72,
        height: 72,
    },
    toolButtonTouch: {
        width: 72,
        height: 72,
    },
    toolButtonImage: {
        width: 72,
        height: 72,
    },
    deckHero: __assign({ position: 'relative', overflow: 'hidden', flexDirection: 'row', alignItems: 'center', borderRadius: design_1.RADIUS.xl, borderColor: design_1.COLORS.reviewCrayon, borderWidth: 1, backgroundColor: design_1.COLORS.reviewSoft, paddingHorizontal: design_1.SPACING.md, paddingVertical: 9, gap: 11 }, design_1.SHADOWS.soft),
    deckTopicIcon: {
        width: 60,
        minHeight: 60,
        borderRadius: design_1.RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: design_1.COLORS.panel,
        borderWidth: 1,
        gap: 4,
    },
    deckTopicIconBlue: {
        borderColor: design_1.COLORS.reviewCrayon,
    },
    deckTopicIconWarm: {
        borderColor: design_1.COLORS.warningCrayon,
    },
    deckTopicIconGreen: {
        borderColor: design_1.COLORS.createCrayon,
    },
    deckTopicIconNeutral: {
        borderColor: design_1.COLORS.line,
    },
    deckHeroTextGroup: {
        flex: 1,
        gap: 5,
    },
    deckTitle: {
        color: design_1.COLORS.ink,
        fontSize: 21,
        lineHeight: 27,
        fontWeight: '900',
    },
    deckMeta: {
        color: design_1.COLORS.muted,
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '800',
    },
    deckMetaBlue: {
        color: design_1.COLORS.reviewDeep,
        fontWeight: '900',
    },
    flowPanel: __assign({ position: 'relative', overflow: 'hidden', borderRadius: design_1.RADIUS.lg, borderColor: design_1.COLORS.reviewCrayon, borderWidth: 1, backgroundColor: design_1.COLORS.reviewSoft, paddingHorizontal: design_1.SPACING.sm, paddingVertical: 8, gap: 5 }, design_1.SHADOWS.soft),
    browseFlowPanel: {
        gap: 7,
    },
    flowHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: design_1.SPACING.sm,
    },
    flowTitleGroup: {
        flexShrink: 0,
        gap: 2,
    },
    flowTitle: {
        color: design_1.COLORS.ink,
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '900',
    },
    flowTitleUnderline: {
        width: 62,
        height: 2,
        borderRadius: design_1.RADIUS.pill,
        backgroundColor: design_1.COLORS.reviewDeep,
    },
    flowSubtitle: {
        flex: 1,
        color: design_1.COLORS.muted,
        fontSize: 11,
        lineHeight: 15,
        fontWeight: '700',
        textAlign: 'center',
    },
    flowSearchText: {
        color: design_1.COLORS.reviewDeep,
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '800',
        textAlign: 'center',
    },
    flowCount: {
        color: design_1.COLORS.reviewDeep,
        fontSize: 13,
        lineHeight: 17,
        fontWeight: '900',
        textAlign: 'right',
    },
    flowRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 3,
        minHeight: 34,
    },
    flowCardWrap: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: 14,
        gap: 1,
    },
    flowMarkerSpacer: {
        height: 9,
    },
    flowSparkRow: {
        height: 9,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 2,
    },
    flowSparkLine: {
        width: 2,
        height: 6,
        borderRadius: design_1.RADIUS.pill,
        backgroundColor: design_1.COLORS.reviewDeep,
    },
    flowSparkLineTall: {
        height: 9,
    },
    flowPointer: {
        width: 0,
        height: 0,
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderBottomWidth: 6,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: design_1.COLORS.reviewDeep,
    },
    flowPointerSpacer: {
        height: 6,
    },
    flowCard: {
        width: 12,
        height: 24,
        borderRadius: 5,
        borderWidth: 1,
    },
    flowCardNew: {
        backgroundColor: design_1.COLORS.panel,
        borderColor: design_1.COLORS.line,
    },
    flowCardAgain: {
        backgroundColor: design_1.COLORS.warningSoft,
        borderColor: design_1.COLORS.warningCrayon,
    },
    flowCardHard: {
        backgroundColor: design_1.COLORS.dangerSoft,
        borderColor: design_1.COLORS.dangerCrayon,
    },
    flowCardGood: {
        backgroundColor: design_1.COLORS.reviewSoft,
        borderColor: design_1.COLORS.reviewCrayon,
    },
    flowCardEasy: {
        backgroundColor: design_1.COLORS.createSoft,
        borderColor: design_1.COLORS.createCrayon,
    },
    flowCardGhost: {
        backgroundColor: 'transparent',
        borderColor: design_1.COLORS.reviewCrayon,
        borderStyle: 'dashed',
    },
    flowCardHighlighted: {
        borderColor: design_1.COLORS.reviewDeep,
        borderWidth: 2,
    },
    flowLegendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: 5,
        paddingHorizontal: 2,
    },
    flowLegendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    flowLegendText: {
        color: design_1.COLORS.muted,
        fontSize: 10,
        fontWeight: '800',
    },
    browseScheduleNote: {
        color: design_1.COLORS.reviewDeep,
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '800',
        textAlign: 'center',
    },
    stage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    stageLandscape: {
        width: '86%',
    },
    cardStack: {
        position: 'relative',
        alignSelf: 'stretch',
        paddingBottom: 12,
    },
    cardStackLandscape: {
        width: '72%',
        alignSelf: 'center',
    },
    cardStackBack: {
        position: 'absolute',
        top: 24,
        left: 22,
        right: 22,
        bottom: 0,
        borderRadius: design_1.RADIUS.xl,
        backgroundColor: design_1.COLORS.panelAlt,
        borderColor: design_1.COLORS.line,
        borderWidth: 1,
        opacity: 0.58,
    },
    cardStackMiddle: {
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        bottom: 6,
        borderRadius: design_1.RADIUS.xl,
        backgroundColor: design_1.COLORS.panel,
        borderColor: design_1.COLORS.line,
        borderWidth: 1,
        opacity: 0.86,
    },
    cardShell: {
        alignSelf: 'stretch',
    },
    card: __assign({ minHeight: 250, borderRadius: design_1.RADIUS.xl, overflow: 'hidden', padding: 22, backgroundColor: design_1.COLORS.panel, borderColor: design_1.COLORS.line, borderWidth: 1, justifyContent: 'space-between', alignItems: 'center', gap: design_1.SPACING.md }, design_1.SHADOWS.card),
    cardBrowse: {
        minHeight: 235,
    },
    cardCompact: {
        minHeight: 245,
        padding: 18,
    },
    cardLandscape: {
        minHeight: 250,
    },
    cardTopRow: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardProgress: {
        color: design_1.COLORS.muted,
        fontSize: 20,
        lineHeight: 24,
        fontWeight: '800',
    },
    cardContentGroup: {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        gap: design_1.SPACING.md,
    },
    cardText: {
        color: design_1.COLORS.ink,
        fontSize: 28,
        lineHeight: 36,
        fontWeight: '900',
        textAlign: 'center',
    },
    cardTextCompact: {
        fontSize: 24,
        lineHeight: 33,
    },
    cardTextLandscape: {
        fontSize: 24,
        lineHeight: 32,
    },
    blueUnderline: {
        width: '48%',
        height: 2,
        borderRadius: design_1.RADIUS.pill,
        backgroundColor: design_1.COLORS.reviewCrayon,
    },
    cardDoodle: {
        minWidth: 118,
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    cardDoodleText: {
        color: design_1.COLORS.reviewDeep,
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    tapHint: {
        color: design_1.COLORS.muted,
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '800',
        textAlign: 'center',
    },
    gradeRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
        paddingBottom: 22,
    },
    gradeRowLandscape: {
        alignSelf: 'center',
        width: '72%',
    },
    gradeButtonTouch: {
        width: 82,
        height: 116,
    },
    gradeButtonImage: {
        width: 82,
        height: 116,
    },
    goodButtonImage: {
        width: 82,
        height: 116,
    },
    browseControlGroup: {
        gap: design_1.SPACING.sm,
        paddingBottom: 34,
    },
    browseNavRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: design_1.SPACING.sm,
    },
    browseNavButton: __assign({ position: 'relative', overflow: 'hidden', flex: 1, minHeight: 58, borderRadius: design_1.RADIUS.md, alignItems: 'center', justifyContent: 'center', backgroundColor: design_1.COLORS.reviewSoft, borderColor: design_1.COLORS.reviewCrayon, borderWidth: 1, paddingHorizontal: 8 }, design_1.SHADOWS.soft),
    browseNavButtonText: {
        color: design_1.COLORS.reviewDeep,
        fontSize: 15,
        lineHeight: 19,
        fontWeight: '900',
        textAlign: 'center',
    },
    flipButton: __assign({ position: 'relative', overflow: 'hidden', flex: 1.4, minHeight: 64, borderRadius: design_1.RADIUS.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: design_1.COLORS.panel, borderColor: design_1.COLORS.reviewDeep, borderWidth: 1, paddingHorizontal: 8 }, design_1.SHADOWS.soft),
    flipButtonText: {
        color: design_1.COLORS.reviewDeep,
        fontSize: 17,
        lineHeight: 22,
        fontWeight: '900',
        textAlign: 'center',
    },
    browseModeNote: {
        position: 'relative',
        overflow: 'hidden',
        flexDirection: 'row',
        gap: 8,
        minHeight: 44,
        borderRadius: design_1.RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: design_1.COLORS.panel,
        borderColor: design_1.COLORS.line,
        borderWidth: 1,
        paddingHorizontal: design_1.SPACING.sm,
        paddingVertical: 10,
        marginBottom: 26,
    },
    browseModeNoteText: {
        color: design_1.COLORS.muted,
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '800',
        textAlign: 'center',
        opacity: 1,
    },
    tutorialOverlay: {
        flex: 1,
        backgroundColor: 'rgba(42, 36, 31, 0.34)',
        paddingHorizontal: design_1.SPACING.md,
        paddingVertical: design_1.SPACING.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tutorialCard: __assign({ position: 'relative', overflow: 'hidden', width: '100%', maxWidth: 520, maxHeight: '92%', borderRadius: design_1.RADIUS.xl, borderColor: design_1.COLORS.reviewCrayon, borderWidth: 2, backgroundColor: design_1.COLORS.panel, padding: design_1.SPACING.md, gap: design_1.SPACING.md }, design_1.SHADOWS.card),
    tutorialHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: design_1.SPACING.md,
    },
    tutorialEyebrow: {
        color: design_1.COLORS.reviewDeep,
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    tutorialTitle: {
        color: design_1.COLORS.ink,
        fontSize: 22,
        lineHeight: 28,
        fontWeight: '800',
    },
    tutorialCloseButton: {
        position: 'relative',
        overflow: 'hidden',
        minHeight: 44,
        borderRadius: design_1.RADIUS.md,
        borderColor: design_1.COLORS.warningCrayon,
        borderWidth: 1,
        backgroundColor: design_1.COLORS.warningSoft,
        paddingHorizontal: design_1.SPACING.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tutorialCloseText: {
        color: design_1.COLORS.warning,
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '900',
    },
    tutorialImage: {
        width: '100%',
        height: 520,
        maxHeight: '82%',
    },
    editPanel: __assign({ position: 'relative', overflow: 'hidden', alignSelf: 'stretch', borderRadius: design_1.RADIUS.xl, padding: design_1.SPACING.md, gap: design_1.SPACING.sm, backgroundColor: design_1.COLORS.panel, borderColor: design_1.COLORS.createCrayon, borderWidth: 1 }, design_1.SHADOWS.card),
    editTitle: {
        color: design_1.COLORS.createDeep,
        fontSize: 17,
        fontWeight: '900',
    },
    editInput: {
        color: design_1.COLORS.ink,
        backgroundColor: design_1.COLORS.panel,
        borderColor: design_1.COLORS.line,
        borderWidth: 1,
        borderRadius: design_1.RADIUS.md,
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
        gap: design_1.SPACING.sm,
    },
    editSecondaryButton: {
        flex: 1,
        minHeight: 46,
        borderRadius: design_1.RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: design_1.COLORS.panelAlt,
        borderColor: design_1.COLORS.line,
        borderWidth: 1,
    },
    editSecondaryButtonText: {
        color: design_1.COLORS.muted,
        fontWeight: '800',
    },
    editPrimaryButton: {
        position: 'relative',
        overflow: 'hidden',
        flex: 1.4,
        minHeight: 46,
        borderRadius: design_1.RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: design_1.COLORS.createSoft,
        borderColor: design_1.COLORS.createCrayon,
        borderWidth: 1,
    },
    editPrimaryButtonText: {
        color: design_1.COLORS.createDeep,
        fontWeight: '900',
    },
    emptyState: __assign({ borderRadius: design_1.RADIUS.lg, backgroundColor: design_1.COLORS.panel, borderColor: design_1.COLORS.reviewCrayon, borderWidth: 1, padding: 22, alignItems: 'center', gap: 8 }, design_1.SHADOWS.soft),
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
