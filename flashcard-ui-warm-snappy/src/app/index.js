"use strict";
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
exports.default = HomeScreen;
/**
 * Home screen.
 *
 * This screen is the user's main workspace. It owns the top-level deck/card
 * arrays for the current render and passes behavior down into smaller UI
 * sections.
 *
 * Entry-level React note:
 * - State lives here because both the Create section and the Review shortcut
 *   need access to deck/card data.
 * - Storage calls are still kept in src/storage, so this screen does not know
 *   how MMKV works internally.
 */
var expo_router_1 = require("expo-router");
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var create_section_1 = require("@/components/home/create-section");
var review_section_1 = require("@/components/home/review-section");
var design_1 = require("@/constants/design");
var flashcards_1 = require("@/storage/flashcards");
function HomeScreen() {
    var router = (0, expo_router_1.useRouter)();
    var insets = (0, react_native_safe_area_context_1.useSafeAreaInsets)();
    /**
     * Decks and cards are loaded from local storage once the screen mounts.
     * They are then updated locally after create actions so the UI responds
     * immediately without waiting for a separate refresh.
     */
    var _a = (0, react_1.useState)([]), decks = _a[0], setDecks = _a[1];
    var _b = (0, react_1.useState)([]), cards = _b[0], setCards = _b[1];
    /**
     * This ID controls which deck receives newly created cards.
     * The actual Deck object is derived below with useMemo.
     */
    var _c = (0, react_1.useState)(''), selectedDeckId = _c[0], setSelectedDeckId = _c[1];
    /**
     * useMemo avoids re-searching decks unless decks or selectedDeckId changes.
     * This is not a heavy calculation yet, but it demonstrates a clean derived-state pattern.
     */
    var selectedDeck = (0, react_1.useMemo)(function () { return decks.find(function (deck) { return deck.id === selectedDeckId; }); }, [decks, selectedDeckId]);
    (0, react_1.useEffect)(function () {
        var nextDecks = (0, flashcards_1.getDecks)();
        setDecks(nextDecks);
        setCards((0, flashcards_1.getFlashcards)());
        /**
         * If a previously selected deck no longer exists, clear the selection.
         * This protects the card form from writing into a stale deck ID.
         */
        setSelectedDeckId(function (previousDeckId) {
            return nextDecks.some(function (deck) { return deck.id === previousDeckId; }) ? previousDeckId : '';
        });
    }, []);
    /**
     * Creates a deck through the storage layer, then mirrors the result into
     * screen state so the deck picker updates instantly.
     */
    function createDeck(name) {
        var deck = (0, flashcards_1.addDeck)({ name: name });
        setDecks(function (previousDecks) { return __spreadArray([deck], previousDecks, true); });
        return deck;
    }
    /**
     * Creates a card through the storage layer, then updates this screen's list.
     * Keeping this as a callback makes HomeCreateSection easier to reuse/test.
     */
    function createCard(input) {
        var card = (0, flashcards_1.addFlashcard)(input);
        setCards(function (previousCards) { return __spreadArray([card], previousCards, true); });
        return card;
    }
    return (<react_native_1.ScrollView style={styles.screen} contentContainerStyle={[
            styles.content,
            {
                /**
                 * Safe-area insets keep content away from notches, status bars,
                 * gesture bars, and rounded screen corners.
                 */
                paddingTop: insets.top + 24,
                paddingBottom: insets.bottom + 110,
            },
        ]}>
      <react_native_1.View style={styles.header}>
        <react_native_1.Text style={styles.eyebrow}>Flashcard workspace</react_native_1.Text>
        <react_native_1.Text style={styles.title}>Create decks fast, then review with intent.</react_native_1.Text>
        <react_native_1.Text style={styles.subtitle}>
          Capture cards into focused decks, then jump to Review when you are ready to study.
        </react_native_1.Text>
      </react_native_1.View>

      <create_section_1.HomeCreateSection decks={decks} cards={cards} selectedDeck={selectedDeck} onSelectDeckId={setSelectedDeckId} onCreateDeck={createDeck} onCreateCard={createCard}/>

      {/* Navigation is handled here so the child component stays presentation-focused. */}
      <review_section_1.HomeReviewSection onPressReview={function () { return router.push('/review'); }}/>
    </react_native_1.ScrollView>);
}
var styles = react_native_1.StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: design_1.COLORS.background,
    },
    content: {
        paddingHorizontal: design_1.SPACING.lg,
        gap: design_1.SPACING.lg,
    },
    header: {
        gap: 8,
        maxWidth: 820,
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
        fontSize: 34,
        lineHeight: 39,
        fontWeight: '800',
    },
    subtitle: {
        color: design_1.COLORS.muted,
        fontSize: 16,
        lineHeight: 23,
        maxWidth: 660,
    },
});
