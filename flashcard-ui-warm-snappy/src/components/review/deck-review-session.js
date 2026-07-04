"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeckReviewSession = DeckReviewSession;
/**
 * DeckReviewSession.
 *
 * This is the visual component for a focused review session.
 *
 * It intentionally receives state and callbacks from src/app/review/[deckId].tsx.
 * That separation is useful for beginners to study:
 * - the route owns data and behavior
 * - this component owns layout and user-facing controls
 */
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var deck_review_session_styles_1 = require("./deck-review-session.styles");
var gradeButtons = [
    {
        label: 'Again',
        hint: 'soon',
        grade: 'again',
        buttonStyle: deck_review_session_styles_1.styles.againButton,
        textStyle: deck_review_session_styles_1.styles.againText,
    },
    {
        label: 'Hard',
        hint: 'short',
        grade: 'hard',
        buttonStyle: deck_review_session_styles_1.styles.hardButton,
        textStyle: deck_review_session_styles_1.styles.hardText,
    },
    {
        label: 'Good',
        hint: 'normal',
        grade: 'good',
        buttonStyle: deck_review_session_styles_1.styles.goodButton,
        textStyle: deck_review_session_styles_1.styles.goodText,
    },
    {
        label: 'Easy',
        hint: 'later',
        grade: 'easy',
        buttonStyle: deck_review_session_styles_1.styles.easyButton,
        textStyle: deck_review_session_styles_1.styles.easyText,
    },
];
function DeckReviewSession(_a) {
    var deckName = _a.deckName, currentIndex = _a.currentIndex, cardsLength = _a.cardsLength, currentCard = _a.currentCard, flipped = _a.flipped, translateX = _a.translateX, panHandlers = _a.panHandlers, onBack = _a.onBack, onToggleFlip = _a.onToggleFlip, onGrade = _a.onGrade;
    var insets = (0, react_native_safe_area_context_1.useSafeAreaInsets)();
    var _b = (0, react_native_1.useWindowDimensions)(), width = _b.width, height = _b.height;
    /**
     * The screen adapts to orientation without needing separate routes.
     * This is the first step toward a landscape-friendly review mode.
     */
    var isLandscape = width > height;
    return (<react_native_1.View style={[
            deck_review_session_styles_1.styles.screen,
            {
                paddingTop: insets.top + 18,
                paddingBottom: insets.bottom + 18,
            },
        ]}>
      <react_native_1.View style={[deck_review_session_styles_1.styles.header, isLandscape && deck_review_session_styles_1.styles.headerLandscape]}>
        <react_native_1.Pressable accessibilityRole="button" onPress={onBack} style={function (_a) {
        var pressed = _a.pressed;
        return [deck_review_session_styles_1.styles.backButton, pressed && deck_review_session_styles_1.styles.pressed];
    }}>
          <react_native_1.Text style={deck_review_session_styles_1.styles.backButtonText}>Back</react_native_1.Text>
        </react_native_1.Pressable>

        <react_native_1.View style={deck_review_session_styles_1.styles.headerTextGroup}>
          <react_native_1.Text style={deck_review_session_styles_1.styles.eyebrow}>Deck Review</react_native_1.Text>
          <react_native_1.Text style={deck_review_session_styles_1.styles.title}>{deckName !== null && deckName !== void 0 ? deckName : 'Deck not found'}</react_native_1.Text>
          <react_native_1.Text style={deck_review_session_styles_1.styles.subtitle}>
            {cardsLength > 0 ? "".concat(currentIndex + 1, " of ").concat(cardsLength) : 'No cards yet'}
          </react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>

      <react_native_1.View style={[deck_review_session_styles_1.styles.stage, isLandscape && deck_review_session_styles_1.styles.stageLandscape]}>
        {currentCard ? (<react_native_1.View style={[deck_review_session_styles_1.styles.cardStack, isLandscape && deck_review_session_styles_1.styles.cardStackLandscape]}>
            <react_native_1.View pointerEvents="none" style={deck_review_session_styles_1.styles.cardStackBack}/>
            <react_native_1.View pointerEvents="none" style={deck_review_session_styles_1.styles.cardStackMiddle}/>
            <react_native_1.Animated.View {...panHandlers} style={[
                deck_review_session_styles_1.styles.cardShell,
                {
                    /**
                     * translateX follows the user's finger while dragging.
                     * rotate adds a small physical card-like motion.
                     */
                    transform: [
                        { translateX: translateX },
                        {
                            rotate: translateX.interpolate({
                                inputRange: [-300, 0, 300],
                                outputRange: ['-8deg', '0deg', '8deg'],
                            }),
                        },
                    ],
                },
            ]}>
              <react_native_1.Pressable accessibilityRole="button" onPress={onToggleFlip} style={function (_a) {
                var pressed = _a.pressed;
                return [
                    deck_review_session_styles_1.styles.card,
                    isLandscape && deck_review_session_styles_1.styles.cardLandscape,
                    pressed && deck_review_session_styles_1.styles.cardPressed,
                ];
            }}>
                <react_native_1.Text style={deck_review_session_styles_1.styles.cardSide}>{flipped ? 'Answer' : 'Prompt'}</react_native_1.Text>
                <react_native_1.Text style={[deck_review_session_styles_1.styles.cardText, isLandscape && deck_review_session_styles_1.styles.cardTextLandscape]}>
                  {flipped ? currentCard.back : currentCard.front}
                </react_native_1.Text>
                <react_native_1.Text style={deck_review_session_styles_1.styles.tapHint}>Tap to flip · Swipe to browse</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.Animated.View>
          </react_native_1.View>) : (<react_native_1.View style={deck_review_session_styles_1.styles.emptyState}>
            <react_native_1.Text style={deck_review_session_styles_1.styles.emptyTitle}>No cards in this deck</react_native_1.Text>
            <react_native_1.Text style={deck_review_session_styles_1.styles.emptyText}>Go back home and add cards first.</react_native_1.Text>
          </react_native_1.View>)}
      </react_native_1.View>

      {currentCard ? (<react_native_1.View style={[deck_review_session_styles_1.styles.gradeRow, isLandscape && deck_review_session_styles_1.styles.gradeRowLandscape]}>
          {gradeButtons.map(function (button) { return (<react_native_1.Pressable key={button.grade} accessibilityRole="button" onPress={function () { return onGrade(button.grade); }} style={function (_a) {
                    var pressed = _a.pressed;
                    return [
                        deck_review_session_styles_1.styles.gradeButton,
                        button.buttonStyle,
                        pressed && deck_review_session_styles_1.styles.pressed,
                    ];
                }}>
              <react_native_1.Text style={[deck_review_session_styles_1.styles.gradeText, button.textStyle]}>{button.label}</react_native_1.Text>
              <react_native_1.Text style={[deck_review_session_styles_1.styles.gradeHint, button.textStyle]}>{button.hint}</react_native_1.Text>
            </react_native_1.Pressable>); })}
        </react_native_1.View>) : null}
    </react_native_1.View>);
}
