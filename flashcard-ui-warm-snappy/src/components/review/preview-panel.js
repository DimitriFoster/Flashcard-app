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
exports.PreviewPanel = PreviewPanel;
/**
 * PreviewPanel.
 *
 * Reusable card preview used by the Review index screen.
 * It displays a single candidate card and provides an "Open this deck" action.
 */
var react_1 = require("react");
var react_native_1 = require("react-native");
var design_1 = require("@/constants/design");
/**
 * Convert a card's dueAt date into a friendly label.
 * This is UI formatting only; the scheduling logic lives in src/lib.
 */
function formatDue(card) {
    if (!card.dueAt) {
        return 'new';
    }
    var dueTime = new Date(card.dueAt).getTime();
    var diffDays = Math.ceil((dueTime - Date.now()) / 86400000);
    if (diffDays <= 0) {
        return 'due';
    }
    return diffDays === 1 ? 'tomorrow' : "in ".concat(diffDays, " days");
}
function PreviewPanel(_a) {
    var _b;
    var title = _a.title, helper = _a.helper, card = _a.card, deck = _a.deck, emptyText = _a.emptyText, footer = _a.footer, deckId = _a.deckId, onOpenDeck = _a.onOpenDeck;
    return (<react_native_1.View style={styles.previewPanel}>
      <react_native_1.View style={styles.previewHeader}>
        <react_native_1.View style={styles.previewTitleGroup}>
          <react_native_1.Text style={styles.previewTitle}>{title}</react_native_1.Text>
          <react_native_1.Text style={styles.previewHelper}>{helper}</react_native_1.Text>
        </react_native_1.View>
        {deck && <react_native_1.Text style={styles.deckBadge}>{deck.name}</react_native_1.Text>}
      </react_native_1.View>

      {card ? (<react_native_1.View style={styles.previewCard}>
          <react_native_1.Text style={styles.cardSide}>Prompt</react_native_1.Text>
          <react_native_1.Text style={styles.previewPrompt}>{card.front}</react_native_1.Text>
          <react_native_1.Text style={styles.previewAnswer}>{card.back}</react_native_1.Text>
          <react_native_1.Text style={styles.previewMeta}>
            {formatDue(card)} - interval {(_b = card.intervalDays) !== null && _b !== void 0 ? _b : 0}d
          </react_native_1.Text>
        </react_native_1.View>) : (<react_native_1.View style={styles.previewEmpty}>
          <react_native_1.Text style={styles.emptyTitle}>Nothing to preview yet</react_native_1.Text>
          <react_native_1.Text style={styles.emptyText}>{emptyText}</react_native_1.Text>
        </react_native_1.View>)}

      <react_native_1.Pressable accessibilityRole="button" disabled={!deckId} onPress={onOpenDeck} style={function (_a) {
            var pressed = _a.pressed;
            return [
                styles.openDeckButton,
                !deckId && styles.disabledButton,
                pressed && deckId && styles.pressed,
            ];
        }}>
        <react_native_1.Text style={[styles.openDeckButtonText, !deckId && styles.disabledButtonText]}>
          Open this deck
        </react_native_1.Text>
      </react_native_1.Pressable>

      {footer}
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    previewPanel: __assign({ flex: 1, minHeight: 420, borderRadius: design_1.RADIUS.lg, backgroundColor: design_1.COLORS.panel, borderWidth: 1, borderColor: design_1.COLORS.line, padding: design_1.SPACING.md, gap: design_1.SPACING.md }, design_1.SHADOWS.soft),
    previewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 10,
    },
    previewTitleGroup: {
        flex: 1,
        gap: 3,
    },
    previewTitle: {
        color: design_1.COLORS.ink,
        fontSize: 20,
        fontWeight: '800',
    },
    previewHelper: {
        color: design_1.COLORS.muted,
        fontSize: 13,
        lineHeight: 18,
    },
    deckBadge: {
        color: design_1.COLORS.review,
        backgroundColor: design_1.COLORS.reviewSoft,
        borderRadius: design_1.RADIUS.pill,
        overflow: 'hidden',
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 12,
        fontWeight: '800',
    },
    previewCard: {
        flex: 1,
        minHeight: 180,
        borderRadius: design_1.RADIUS.lg,
        backgroundColor: design_1.COLORS.panelAlt,
        borderColor: design_1.COLORS.line,
        borderWidth: 1,
        padding: design_1.SPACING.md,
        justifyContent: 'center',
        gap: 8,
    },
    cardSide: {
        color: design_1.COLORS.muted,
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    previewPrompt: {
        color: design_1.COLORS.ink,
        fontSize: 22,
        lineHeight: 28,
        fontWeight: '800',
    },
    previewAnswer: {
        color: design_1.COLORS.muted,
        fontSize: 15,
        lineHeight: 22,
    },
    previewMeta: {
        color: design_1.COLORS.review,
        fontSize: 12,
        fontWeight: '800',
    },
    previewEmpty: {
        flex: 1,
        minHeight: 180,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: 12,
        borderRadius: design_1.RADIUS.lg,
        backgroundColor: design_1.COLORS.panelAlt,
        borderColor: design_1.COLORS.line,
        borderWidth: 1,
    },
    emptyTitle: {
        color: design_1.COLORS.ink,
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
    },
    emptyText: {
        color: design_1.COLORS.muted,
        textAlign: 'center',
        lineHeight: 22,
    },
    openDeckButton: {
        minHeight: 44,
        borderRadius: design_1.RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: design_1.COLORS.review,
    },
    openDeckButtonText: {
        color: design_1.COLORS.white,
        fontSize: 15,
        fontWeight: '800',
    },
    disabledButton: {
        backgroundColor: design_1.COLORS.panelAlt,
        borderWidth: 1,
        borderColor: design_1.COLORS.line,
    },
    disabledButtonText: {
        color: design_1.COLORS.muted,
    },
    pressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
});
