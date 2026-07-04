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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReviewIndexScreen;
/**
 * Spaced repetition review landing page.
 *
 * Round 37 experiment: use the raw crayon swatches as live ImageBackground
 * fills instead of baked PNG shells. This is intentionally a layout/material
 * experiment so we can compare the raw-background approach against the
 * round-32 baked-shell process.
 */
var native_1 = require("@react-navigation/native");
var expo_router_1 = require("expo-router");
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var design_1 = require("@/constants/design");
var flashcards_1 = require("@/storage/flashcards");
var review_queue_1 = require("../../lib/review-queue");
var reviewDueAssets = {
    calendarIcon: require('../../../assets/folio-ui/review-due-page/calendar_icon_shell.png'),
};
var crayonSwatches = {
    blue: require('../../../assets/folio-ui/browse-selection/textures/crayon_texture_blue.png'),
    green: require('../../../assets/folio-ui/browse-selection/textures/crayon_texture_green.png'),
    yellow: require('../../../assets/folio-ui/browse-selection/textures/crayon_texture_yellow.png'),
    peach: require('../../../assets/folio-ui/browse-selection/textures/crayon_texture_peach.png'),
    purple: require('../../../assets/folio-ui/browse-selection/textures/crayon_texture_purple.png'),
    mint: require('../../../assets/folio-ui/browse-selection/textures/crayon_texture_mint.png'),
};
var deckSwatchSequence = [
    crayonSwatches.blue,
    crayonSwatches.green,
    crayonSwatches.yellow,
    crayonSwatches.peach,
    crayonSwatches.purple,
    crayonSwatches.mint,
];
function getMostRecentCard(cards) {
    return __spreadArray([], cards, true).sort(function (a, b) { return b.createdAt.localeCompare(a.createdAt); })[0];
}
function getCardsForDeck(deckId, cards) {
    return cards.filter(function (card) { return card.deckId === deckId; });
}
function formatDueMeta(card) {
    var _a;
    if (!card) {
        return 'due - interval 0d';
    }
    return "due - interval ".concat((_a = card.intervalDays) !== null && _a !== void 0 ? _a : 0, "d");
}
function ActionTextureButton(_a) {
    var source = _a.source, icon = _a.icon, label = _a.label, labelColor = _a.labelColor, borderColor = _a.borderColor, onPress = _a.onPress, width = _a.width, _b = _a.numberOfLines, numberOfLines = _b === void 0 ? 2 : _b;
    return (<react_native_1.Pressable accessibilityRole="button" onPress={onPress} style={function (_a) {
        var pressed = _a.pressed;
        return [styles.actionPressable, { width: width }, pressed && styles.pressed];
    }}>
      <react_native_1.ImageBackground source={source} resizeMode="stretch" style={[styles.actionButtonTexture, { borderColor: borderColor }]} imageStyle={styles.textureImage}>
        <react_native_1.Text allowFontScaling={false} style={[styles.actionIcon, { color: labelColor }]}>
          {icon}
        </react_native_1.Text>
        <react_native_1.Text allowFontScaling={false} numberOfLines={numberOfLines} style={[styles.actionButtonLabel, { color: labelColor }]}>
          {label}
        </react_native_1.Text>
      </react_native_1.ImageBackground>
    </react_native_1.Pressable>);
}
function ReviewIndexScreen() {
    var router = (0, expo_router_1.useRouter)();
    var insets = (0, react_native_safe_area_context_1.useSafeAreaInsets)();
    var _a = (0, react_native_1.useWindowDimensions)(), width = _a.width, height = _a.height;
    var _b = (0, react_1.useState)([]), decks = _b[0], setDecks = _b[1];
    var _c = (0, react_1.useState)([]), cards = _c[0], setCards = _c[1];
    var pageWidth = Math.min(width - design_1.SPACING.lg * 2, 430);
    var availableHeight = Math.max(height - insets.top - insets.bottom, 680);
    var topSectionHeight = Math.round(availableHeight * 0.49);
    var deckCarouselHeight = Math.round(availableHeight * 0.46);
    var createButtonWidth = Math.floor(pageWidth * 0.31);
    var browseButtonWidth = Math.floor(pageWidth * 0.31);
    var statsButtonWidth = pageWidth - createButtonWidth - browseButtonWidth - design_1.SPACING.xs * 2;
    var carouselCardWidth = pageWidth - 8;
    var deckPreviews = (0, react_1.useMemo)(function () {
        return decks.map(function (deck) {
            var deckCards = getCardsForDeck(deck.id, cards);
            var dueCards = (0, review_queue_1.getDueCards)(deckCards);
            return {
                deck: deck,
                cards: deckCards,
                dueCards: dueCards,
                mostRecentDueCard: getMostRecentCard(dueCards),
            };
        });
    }, [cards, decks]);
    var dueDeckPreviews = (0, react_1.useMemo)(function () {
        var onlyDue = deckPreviews.filter(function (item) { return item.dueCards.length > 0; });
        return onlyDue.length > 0 ? onlyDue : deckPreviews;
    }, [deckPreviews]);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(function () {
        setDecks((0, flashcards_1.getDecks)());
        setCards((0, flashcards_1.getFlashcards)());
    }, []));
    function openDueDeck(deckId) {
        if (!deckId) {
            return;
        }
        router.push({
            pathname: '/review/[deckId]',
            params: { deckId: deckId, mode: 'due' },
        });
    }
    return (<react_native_1.ScrollView scrollEnabled={false} style={styles.screen} contentContainerStyle={[
            styles.content,
            {
                paddingTop: insets.top + 6,
                paddingBottom: insets.bottom + 12,
            },
        ]}>
      <react_native_1.View style={[styles.page, { width: pageWidth }]}>
        <react_native_1.View style={[styles.topSection, { minHeight: topSectionHeight }]}>
          <react_native_1.View style={styles.heroRow}>
            <react_native_1.View style={styles.heroTextColumn}>
              <react_native_1.Text style={styles.eyebrow}>Spaced repetition</react_native_1.Text>
              <react_native_1.Text style={styles.title}>Review due cards.</react_native_1.Text>
              <react_native_1.Text style={styles.subtitle}>
                These deck blocks focus on cards that are new or scheduled for review today.
              </react_native_1.Text>
            </react_native_1.View>

            <react_native_1.Image source={reviewDueAssets.calendarIcon} resizeMode="contain" style={styles.calendarIcon}/>
          </react_native_1.View>

          <react_native_1.ImageBackground source={crayonSwatches.yellow} resizeMode="stretch" style={[styles.retentionNoteTexture, styles.yellowBorder]} imageStyle={styles.textureImage}>
            <react_native_1.Text allowFontScaling={false} style={styles.noteIcon}>♢</react_native_1.Text>
            <react_native_1.View style={styles.noteTextBlock}>
              <react_native_1.Text style={styles.noteTitle}>How to get the most from spaced repetition</react_native_1.Text>
              <react_native_1.Text style={styles.noteText}>
                Review due cards consistently, answer before revealing, and grade honestly. Missed cards return
                quickly; easy cards wait longer, focusing effort right before forgetting.
              </react_native_1.Text>
            </react_native_1.View>
          </react_native_1.ImageBackground>

          <react_native_1.View style={styles.actionRow}>
            <ActionTextureButton source={crayonSwatches.green} icon="✎" label={'Create\ncards'} labelColor={design_1.COLORS.createDeep} borderColor="#63B982" onPress={function () { return router.push('/'); }} width={createButtonWidth}/>

            <ActionTextureButton source={crayonSwatches.blue} icon="▭" label={'Browse\ndecks'} labelColor={design_1.COLORS.reviewDeep} borderColor="#79A7F4" onPress={function () { return router.push('/review/browse'); }} width={browseButtonWidth}/>

            <ActionTextureButton source={crayonSwatches.yellow} icon="▥" label="Stats" labelColor={design_1.COLORS.warning} borderColor="#E2AE38" onPress={function () { return router.push('/review/stats'); }} width={statsButtonWidth} numberOfLines={1}/>
          </react_native_1.View>
        </react_native_1.View>

        {dueDeckPreviews.length > 0 ? (<react_native_1.View style={[styles.deckSection, { height: deckCarouselHeight }]}>
            <react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} decelerationRate="fast" snapToInterval={carouselCardWidth + design_1.SPACING.md} contentContainerStyle={[styles.deckCarouselContent, { minHeight: deckCarouselHeight }]}>
              {dueDeckPreviews.map(function (item, index) {
                var _a, _b, _c, _d;
                var dueCount = item.dueCards.length;
                var totalCount = item.cards.length;
                var front = ((_b = (_a = item.mostRecentDueCard) === null || _a === void 0 ? void 0 : _a.front) === null || _b === void 0 ? void 0 : _b.trim()) || 'No cards due right now';
                var back = ((_d = (_c = item.mostRecentDueCard) === null || _c === void 0 ? void 0 : _c.back) === null || _d === void 0 ? void 0 : _d.trim()) || 'Use Browse Decks to open the full deck.';
                var deckSwatch = deckSwatchSequence[index % deckSwatchSequence.length];
                return (<react_native_1.ImageBackground key={item.deck.id} source={deckSwatch} resizeMode="stretch" style={[
                        styles.deckPanelTexture,
                        { width: carouselCardWidth, minHeight: deckCarouselHeight - 4 },
                        index === dueDeckPreviews.length - 1 && styles.deckPanelLast,
                    ]} imageStyle={styles.textureImage}>
                    <react_native_1.View style={styles.deckPanelTopRow}>
                      <react_native_1.Text style={styles.deckCountText}>
                        {dueCount} due now · {totalCount} {totalCount === 1 ? 'card' : 'cards'} total.
                      </react_native_1.Text>

                      <react_native_1.Pressable accessibilityRole="button" accessibilityLabel={"Open ".concat(item.deck.name)} onPress={function () { return openDueDeck(item.deck.id); }} style={function (_a) {
                    var pressed = _a.pressed;
                    return [styles.deckBadgePressable, pressed && styles.pressed];
                }}>
                        <react_native_1.ImageBackground source={deckSwatch} resizeMode="stretch" style={styles.deckBadgeTexture} imageStyle={styles.textureImage}>
                          <react_native_1.Text numberOfLines={3} style={styles.deckBadgeText}>
                            {item.deck.name}
                          </react_native_1.Text>
                          <react_native_1.Text allowFontScaling={false} style={styles.deckBadgeArrow}>→</react_native_1.Text>
                        </react_native_1.ImageBackground>
                      </react_native_1.Pressable>
                    </react_native_1.View>

                    <react_native_1.Pressable accessibilityRole="button" accessibilityLabel={"Review due cards from ".concat(item.deck.name)} onPress={function () { return openDueDeck(item.deck.id); }} style={function (_a) {
                    var pressed = _a.pressed;
                    return [styles.previewCard, pressed && styles.pressed];
                }}>
                      <react_native_1.Text style={styles.previewCardSide}>Prompt</react_native_1.Text>
                      <react_native_1.Text numberOfLines={3} style={styles.previewPrompt}>
                        {front}
                      </react_native_1.Text>
                      <react_native_1.Text numberOfLines={3} style={styles.previewAnswer}>
                        {back}
                      </react_native_1.Text>
                      <react_native_1.Text style={styles.previewMeta}>{formatDueMeta(item.mostRecentDueCard)}</react_native_1.Text>
                    </react_native_1.Pressable>
                  </react_native_1.ImageBackground>);
            })}
            </react_native_1.ScrollView>
          </react_native_1.View>) : (<react_native_1.View style={styles.emptyDeckState}>
            <react_native_1.Text style={styles.emptyDeckTitle}>No decks yet</react_native_1.Text>
            <react_native_1.Text style={styles.emptyDeckText}>
              Create a deck first, then it will appear here as a spaced repetition block.
            </react_native_1.Text>
          </react_native_1.View>)}
      </react_native_1.View>
    </react_native_1.ScrollView>);
}
var styles = react_native_1.StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: design_1.COLORS.background,
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: design_1.SPACING.lg,
    },
    page: {
        gap: 10,
    },
    topSection: {
        justifyContent: 'space-between',
    },
    textureImage: {
        borderRadius: 20,
    },
    heroRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: design_1.SPACING.md,
    },
    heroTextColumn: {
        flex: 1,
        gap: 6,
        paddingTop: 0,
    },
    eyebrow: {
        color: design_1.COLORS.reviewDeep,
        fontSize: 13,
        lineHeight: 16,
        fontWeight: '800',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
    },
    title: {
        color: design_1.COLORS.ink,
        fontSize: 30,
        lineHeight: 34,
        fontWeight: '900',
    },
    subtitle: {
        color: design_1.COLORS.ink,
        opacity: 0.76,
        fontSize: 14,
        lineHeight: 20,
        maxWidth: 290,
    },
    calendarIcon: {
        width: 114,
        height: 88,
        marginTop: 10,
        marginRight: -2,
    },
    retentionNoteTexture: {
        minHeight: 124,
        marginTop: -4,
        marginHorizontal: -3,
        borderRadius: 20,
        borderWidth: 1.5,
        overflow: 'hidden',
        paddingTop: 13,
        paddingRight: 20,
        paddingBottom: 13,
        paddingLeft: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    yellowBorder: {
        borderColor: '#E2AE38',
    },
    noteIcon: {
        width: 38,
        color: design_1.COLORS.warning,
        fontSize: 30,
        lineHeight: 34,
        textAlign: 'center',
        fontWeight: '900',
    },
    noteTextBlock: {
        flex: 1,
        gap: 5,
    },
    noteTitle: {
        color: design_1.COLORS.warning,
        fontSize: 13,
        lineHeight: 17,
        fontWeight: '900',
        paddingRight: 20,
        maxWidth: '96%',
    },
    noteText: {
        color: design_1.COLORS.ink,
        fontSize: 12,
        lineHeight: 17,
        paddingRight: 10,
        maxWidth: '96%',
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: design_1.SPACING.xs,
        marginTop: -2,
    },
    actionPressable: {
        flexShrink: 0,
    },
    actionButtonTexture: {
        height: 60,
        borderRadius: 18,
        borderWidth: 1.5,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        gap: 7,
    },
    actionIcon: {
        fontSize: 22,
        lineHeight: 26,
        fontWeight: '900',
    },
    actionButtonLabel: {
        fontSize: 12.5,
        lineHeight: 14,
        fontWeight: '900',
        textAlign: 'left',
    },
    deckSection: {
        marginHorizontal: -2,
        overflow: 'visible',
    },
    deckCarouselContent: {
        alignItems: 'stretch',
        paddingRight: design_1.SPACING.md,
    },
    deckPanelTexture: __assign({ borderRadius: 22, borderWidth: 1.5, borderColor: '#73A6F4', overflow: 'hidden', paddingTop: 14, paddingHorizontal: 16, paddingBottom: 14, marginRight: design_1.SPACING.md }, design_1.SHADOWS.soft),
    deckPanelLast: {
        marginRight: 0,
    },
    deckPanelTopRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 8,
        minHeight: 92,
    },
    deckCountText: {
        flex: 1,
        maxWidth: '30%',
        color: '#5B5148',
        fontSize: 13.5,
        lineHeight: 20,
        fontWeight: '900',
        paddingTop: 6,
    },
    deckBadgePressable: {
        width: '68%',
    },
    deckBadgeTexture: {
        minHeight: 86,
        borderRadius: 36,
        borderWidth: 1.5,
        borderColor: '#568BE8',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 36,
        paddingVertical: 8,
    },
    deckBadgeText: {
        color: design_1.COLORS.reviewDeep,
        fontSize: 12.5,
        lineHeight: 16,
        fontWeight: '900',
        textAlign: 'center',
    },
    deckBadgeArrow: {
        position: 'absolute',
        right: 14,
        top: 24,
        color: design_1.COLORS.reviewDeep,
        fontSize: 28,
        lineHeight: 34,
        fontWeight: '900',
    },
    previewCard: {
        flex: 1,
        backgroundColor: '#FFF8E8',
        borderColor: '#E1C891',
        borderWidth: 1.2,
        borderRadius: 22,
        overflow: 'hidden',
        marginTop: 10,
        marginHorizontal: 14,
        marginBottom: 10,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 14,
        justifyContent: 'flex-start',
        gap: 8,
    },
    previewCardSide: {
        color: '#7D6C59',
        fontSize: 12,
        lineHeight: 14,
        fontWeight: '800',
        letterSpacing: 0.7,
        textTransform: 'uppercase',
    },
    previewPrompt: {
        color: design_1.COLORS.ink,
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '900',
    },
    previewAnswer: {
        color: design_1.COLORS.muted,
        fontSize: 14,
        lineHeight: 20,
    },
    previewMeta: {
        marginTop: 2,
        color: design_1.COLORS.reviewDeep,
        fontSize: 13,
        lineHeight: 16,
        fontWeight: '900',
    },
    emptyDeckState: {
        backgroundColor: design_1.COLORS.panel,
        borderColor: design_1.COLORS.line,
        borderWidth: 1,
        borderRadius: design_1.RADIUS.lg,
        padding: design_1.SPACING.lg,
        gap: 8,
    },
    emptyDeckTitle: {
        color: design_1.COLORS.ink,
        fontSize: 22,
        fontWeight: '800',
    },
    emptyDeckText: {
        color: design_1.COLORS.muted,
        fontSize: 15,
        lineHeight: 21,
    },
    pressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
});
