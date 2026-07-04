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
exports.DeckReviewSession = DeckReviewSession;
/**
 * DeckReviewSession.
 *
 * PNG-driven review page implementation for the Folio mockup.
 *
 * The important design rule here is that the crayon / paper look comes from
 * the saved source-of-truth PNG assets under assets/folio-ui/review. React
 * Native still owns layout, data, accessibility, swipe animation, edit state,
 * and review scheduling callbacks.
 */
var expo_router_1 = require("expo-router");
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var BottomTabBar_1 = require("@/folio-review/BottomTabBar");
var DeckSummaryPanel_1 = require("@/folio-review/DeckSummaryPanel");
var FolioAssetButton_1 = require("@/folio-review/FolioAssetButton");
var folioReviewAssets_1 = require("@/folio-review/folioReviewAssets");
var GradeButtonRow_1 = require("@/folio-review/GradeButtonRow");
var folioFonts_1 = require("@/folio-review/folioFonts");
var TUTORIAL_IMAGE = require('../../../assets/tutorial/session-flow-tutorial.png');
var DEFAULT_SESSION_TOKENS = [
    'new',
    'new',
    'new',
    'again',
    'hard',
    'good',
    'good',
    'empty',
    'empty',
    'empty',
    'good',
    'easy',
    'again',
    'hard',
    'new',
];
var ACTIVE_TOKEN_INDEX = 6;
var browseAssets = {
    deckHeaderShell: require('../../../assets/folio-ui/browse/panels/deck_header_shell_round14.png'),
    matchesStripShell: require('../../../assets/folio-ui/browse/panels/matches_strip_shell_round14.png'),
    searchIcon: require('../../../assets/folio-ui/browse/panels/search_icon_round15.png'),
    previousButton: require('../../../assets/folio-ui/browse/controls/previous_button_round15.png'),
    flipButton: require('../../../assets/folio-ui/browse/controls/flip_button_round15.png'),
    nextButton: require('../../../assets/folio-ui/browse/controls/next_button_round15.png'),
    noteBar: require('../../../assets/folio-ui/browse/footer/browse_note_bar_round15.png'),
};
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
function getDeckSubtitle(deckName) {
    if (!deckName)
        return 'Master Deck';
    return /master deck/i.test(deckName) ? '' : 'Master Deck';
}
function getCardQuestion(currentCard, flipped) {
    return flipped ? currentCard.back : currentCard.front;
}
function getCardHint(flipped) {
    return flipped ? 'Tap to return to prompt' : 'Tap to reveal answer';
}
function NavigateButton(_a) {
    var label = _a.label, onPress = _a.onPress;
    return (<react_native_1.Pressable accessibilityRole="button" onPress={onPress} style={function (_a) {
        var pressed = _a.pressed;
        return [styles.browseButton, pressed && styles.pressed];
    }}>
      <react_native_1.Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8} style={styles.browseButtonText}>
        {label}
      </react_native_1.Text>
    </react_native_1.Pressable>);
}
function DeckReviewSession(_a) {
    var deckName = _a.deckName, totalDeckCards = _a.totalDeckCards, currentIndex = _a.currentIndex, cardsLength = _a.cardsLength, currentCard = _a.currentCard, flipped = _a.flipped, translateX = _a.translateX, panHandlers = _a.panHandlers, _b = _a.showGradeButtons, showGradeButtons = _b === void 0 ? true : _b, _c = _a.showUndoButton, showUndoButton = _c === void 0 ? false : _c, _d = _a.isEditing, isEditing = _d === void 0 ? false : _d, _e = _a.editFront, editFront = _e === void 0 ? '' : _e, _f = _a.editBack, editBack = _f === void 0 ? '' : _f, cardSearch = _a.cardSearch, onChangeEditFront = _a.onChangeEditFront, onChangeEditBack = _a.onChangeEditBack, onStartEdit = _a.onStartEdit, onCancelEdit = _a.onCancelEdit, onSaveEdit = _a.onSaveEdit, onPreviousCard = _a.onPreviousCard, onNextCard = _a.onNextCard, onToggleFlip = _a.onToggleFlip, onBack = _a.onBack, onUndo = _a.onUndo, onGrade = _a.onGrade;
    var router = (0, expo_router_1.useRouter)();
    var insets = (0, react_native_safe_area_context_1.useSafeAreaInsets)();
    var _g = (0, react_native_1.useWindowDimensions)(), width = _g.width, height = _g.height;
    var _h = react_1.default.useState(false), isTutorialOpen = _h[0], setIsTutorialOpen = _h[1];
    var pageWidth = Math.min(width - 18, 434);
    var isCompactHeight = height < 820;
    var isLandscape = width > height;
    var isBrowseMode = !showGradeButtons;
    var dueOrVisibleCount = Math.max(cardsLength - currentIndex, 0);
    var totalCardsForPanel = Math.max(totalDeckCards !== null && totalDeckCards !== void 0 ? totalDeckCards : cardsLength, cardsLength);
    var currentCardNumber = cardsLength > 0 ? currentIndex + 1 : 0;
    var cardNumberText = "".concat(currentCardNumber, " / ").concat(cardsLength || totalCardsForPanel || 0);
    var cardWidth = Math.min(pageWidth - 18, 404);
    var cardHeight = isLandscape
        ? clamp(height * 0.48, 250, 320)
        : clamp(Math.round(cardWidth * (isCompactHeight ? 0.82 : 0.86)), isCompactHeight ? 304 : 318, isCompactHeight ? 332 : 352);
    var stackWidth = cardWidth + 16;
    var stackHeight = cardHeight + 16;
    var browseFlipAnim = react_1.default.useRef(new react_native_1.Animated.Value(flipped ? 1 : 0)).current;
    react_1.default.useEffect(function () {
        react_native_1.Animated.spring(browseFlipAnim, {
            toValue: flipped ? 1 : 0,
            friction: 9,
            tension: 70,
            useNativeDriver: true,
        }).start();
    }, [browseFlipAnim, flipped]);
    var browseFrontRotation = browseFlipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
    var browseBackRotation = browseFlipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
    function navigateTab(tab) {
        if (tab === 'review')
            router.push('/review');
        if (tab === 'browse')
            router.push('/review/browse');
        if (tab === 'notes')
            router.push('/notes');
        if (tab === 'progress')
            router.push('/review/stats');
    }
    if (isBrowseMode) {
        var browseAvailableHeight = Math.max(height - insets.top - 8, 700);
        var browseHeaderHeight = 60;
        var browseTopPanelHeight = isCompactHeight ? 90 : 104;
        var browseStripHeight = isCompactHeight ? 68 : 76;
        var browseControlsHeight = isCompactHeight ? 54 : 60;
        var browseNoteHeight = isCompactHeight ? 50 : 54;
        var browseNavHeight = 64;
        var browseGapTotal = isCompactHeight ? 36 : 46;
        var browseCardHeight = clamp(Math.round(browseAvailableHeight -
            browseHeaderHeight -
            browseTopPanelHeight -
            browseStripHeight -
            browseControlsHeight -
            browseNoteHeight -
            browseNavHeight -
            browseGapTotal), isCompactHeight ? 266 : 286, isCompactHeight ? 304 : 322);
        var browseCardWidth = Math.min(pageWidth - 18, 404);
        var browseStackWidth = browseCardWidth + 16;
        var browseStackHeight = browseCardHeight + 16;
        var browseSearchLabel = (cardSearch === null || cardSearch === void 0 ? void 0 : cardSearch.trim()) || 'all cards';
        var browseTopTitle = deckName !== null && deckName !== void 0 ? deckName : 'Deck not found';
        var browseTopSubtitle = getDeckSubtitle(deckName) || 'Master Deck';
        return (<react_native_1.ImageBackground source={folioReviewAssets_1.folioReviewAssets.background.pagePaper} resizeMode="cover" style={styles.screen}>
        <react_native_1.View style={[styles.safeArea, { paddingTop: insets.top + 4 }]}> 
          <react_native_1.View style={[styles.browsePageFrame, { width: pageWidth }]}> 
            <react_native_1.View style={styles.headerRow}> 
              <FolioAssetButton_1.FolioAssetButton source={folioReviewAssets_1.folioReviewAssets.header.back} accessibilityLabel="Go back" onPress={onBack} style={styles.backButton}/>

              <react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.header.folioWordmark} resizeMode="contain" style={styles.wordmark}/>

              <react_native_1.View style={styles.browseHeaderActions}> 
                <FolioAssetButton_1.FolioAssetButton source={folioReviewAssets_1.folioReviewAssets.header.edit} accessibilityLabel="Edit current card" onPress={currentCard ? onStartEdit : undefined} disabled={!currentCard || !onStartEdit} style={styles.headerActionButton}/>
                <FolioAssetButton_1.FolioAssetButton source={folioReviewAssets_1.folioReviewAssets.header.help} accessibilityLabel="Open help" onPress={function () { return setIsTutorialOpen(true); }} style={styles.helpButton}/>
              </react_native_1.View>
            </react_native_1.View>

            <react_native_1.ImageBackground source={browseAssets.deckHeaderShell} resizeMode="stretch" style={[styles.browseDeckPanel, { height: browseTopPanelHeight }]} imageStyle={styles.panelImage}>
              <react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.deckPanel.brainCloud} resizeMode="contain" style={styles.browseDeckIcon}/>
              <react_native_1.View style={styles.browseDeckTextBlock}>
                <react_native_1.Text allowFontScaling={false} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.72} style={styles.browseDeckTitle}>{browseTopTitle}</react_native_1.Text>
                {browseTopSubtitle ? <react_native_1.Text allowFontScaling={false} numberOfLines={1} style={styles.browseDeckSubtitle}>{browseTopSubtitle}</react_native_1.Text> : null}
                <react_native_1.Text allowFontScaling={false} numberOfLines={1} style={styles.browseDeckModeText}>
                  <react_native_1.Text style={styles.browseDeckModeBlue}>Browse cards</react_native_1.Text>
                  <react_native_1.Text> • no scheduling changes</react_native_1.Text>
                </react_native_1.Text>
              </react_native_1.View>
            </react_native_1.ImageBackground>

            <react_native_1.ImageBackground source={browseAssets.matchesStripShell} resizeMode="stretch" style={[styles.browseMatchPanel, { height: browseStripHeight }]} imageStyle={styles.panelImage}>
              <react_native_1.Image source={browseAssets.searchIcon} resizeMode="contain" style={styles.browseSearchIcon}/>
              <react_native_1.View style={styles.browseMatchCopy}>
                <react_native_1.Text allowFontScaling={false} numberOfLines={1} style={styles.browseMatchTitle}>Showing matches only</react_native_1.Text>
                <react_native_1.Text allowFontScaling={false} numberOfLines={1} style={styles.browseMatchSearch}>Search: {browseSearchLabel}</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={styles.browseMiniFlow}>
                {['new', 'again', 'hard', 'good', 'good', 'empty', 'easy', 'again', 'new'].map(function (token, index) {
                var tokenSource = token === 'empty'
                    ? folioReviewAssets_1.folioReviewAssets.sessionFlow.emptyDashed
                    : token === 'again'
                        ? folioReviewAssets_1.folioReviewAssets.sessionFlow.again
                        : token === 'hard'
                            ? folioReviewAssets_1.folioReviewAssets.sessionFlow.hard
                            : token === 'good'
                                ? folioReviewAssets_1.folioReviewAssets.sessionFlow.good
                                : token === 'easy'
                                    ? folioReviewAssets_1.folioReviewAssets.sessionFlow.easy
                                    : folioReviewAssets_1.folioReviewAssets.sessionFlow.new;
                var active = index === 4;
                return (<react_native_1.View key={"".concat(token, "-").concat(index)} style={styles.browseMiniTokenWrap}>
                      {active ? <react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.sessionFlow.activeRays} resizeMode="contain" style={styles.browseMiniRays}/> : null}
                      <react_native_1.Image source={active ? folioReviewAssets_1.folioReviewAssets.sessionFlow.activeGood : tokenSource} resizeMode="contain" style={styles.browseMiniToken}/>
                      {active ? <react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.sessionFlow.activeTriangle} resizeMode="contain" style={styles.browseMiniTriangle}/> : null}
                    </react_native_1.View>);
            })}
              </react_native_1.View>
            </react_native_1.ImageBackground>

            <react_native_1.View style={[styles.cardStage, { minHeight: browseStackHeight }]}> 
              {currentCard && isEditing ? (<react_native_1.ImageBackground source={folioReviewAssets_1.folioReviewAssets.card.frontSurface} resizeMode="stretch" style={[styles.editPanel, { minHeight: browseCardHeight, width: browseCardWidth }]} imageStyle={styles.cardImage}>
                  <react_native_1.Text style={styles.editTitle}>Edit current card</react_native_1.Text>
                  <react_native_1.TextInput multiline value={editFront} onChangeText={onChangeEditFront} placeholder="Prompt / front" placeholderTextColor="#8A8177" textAlignVertical="top" style={[styles.editInput, styles.editFrontInput]}/>
                  <react_native_1.TextInput multiline value={editBack} onChangeText={onChangeEditBack} placeholder="Answer / back" placeholderTextColor="#8A8177" textAlignVertical="top" style={[styles.editInput, styles.editBackInput]}/>
                  <react_native_1.View style={styles.editActionRow}>
                    <react_native_1.Pressable accessibilityRole="button" onPress={onCancelEdit} style={function (_a) {
                var pressed = _a.pressed;
                return [styles.editSecondaryButton, pressed && styles.pressed];
            }}>
                      <react_native_1.Text style={styles.editSecondaryButtonText}>Cancel</react_native_1.Text>
                    </react_native_1.Pressable>
                    <react_native_1.Pressable accessibilityRole="button" onPress={onSaveEdit} style={function (_a) {
                var pressed = _a.pressed;
                return [styles.editPrimaryButton, pressed && styles.pressed];
            }}>
                      <react_native_1.Text style={styles.editPrimaryButtonText}>Save changes</react_native_1.Text>
                    </react_native_1.Pressable>
                  </react_native_1.View>
                </react_native_1.ImageBackground>) : currentCard ? (<react_native_1.View style={[styles.cardStackWrap, { height: browseStackHeight }]}> 
                  <react_native_1.Image pointerEvents="none" source={folioReviewAssets_1.folioReviewAssets.card.stackBackLayers} resizeMode="stretch" style={[styles.cardBackLayers, { height: browseStackHeight, width: browseStackWidth }]}/>
                  <react_native_1.Animated.View key={currentCard.id} {...panHandlers} style={[
                    styles.animatedCard,
                    {
                        height: browseCardHeight,
                        width: browseCardWidth,
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
                    <react_native_1.Animated.View style={[styles.browseFlipFace, styles.browseFrontFace, { transform: [{ perspective: 1100 }, { rotateY: browseFrontRotation }] }]}>
                      <react_native_1.ImageBackground source={folioReviewAssets_1.folioReviewAssets.card.frontSurface} resizeMode="stretch" style={styles.browseCardSurface} imageStyle={styles.cardImage}>
                        <react_native_1.View style={styles.cardTopRow}>
                          <react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.card.favoriteStar} resizeMode="contain" style={styles.favoriteStar}/>
                          <react_native_1.Text allowFontScaling={false} style={styles.cardProgress}>{cardNumberText}</react_native_1.Text>
                        </react_native_1.View>
                        <react_native_1.View style={styles.browseCardContent}> 
                          <react_native_1.Text adjustsFontSizeToFit allowFontScaling={false} minimumFontScale={0.72} numberOfLines={4} style={styles.browseCardText}>
                            {currentCard.front}
                          </react_native_1.Text>
                          <react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.card.questionUnderline} resizeMode="stretch" style={styles.questionUnderline}/>
                          <react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.card.retrievalGenerationIllustration} resizeMode="contain" style={styles.browseCardIllustration}/>
                        </react_native_1.View>
                        <react_native_1.Text allowFontScaling={false} numberOfLines={1} style={styles.tapHint}>{getCardHint(false)}</react_native_1.Text>
                      </react_native_1.ImageBackground>
                    </react_native_1.Animated.View>
                    <react_native_1.Animated.View style={[styles.browseFlipFace, styles.browseBackFace, { transform: [{ perspective: 1100 }, { rotateY: browseBackRotation }] }]}>
                      <react_native_1.ImageBackground source={folioReviewAssets_1.folioReviewAssets.card.frontSurface} resizeMode="stretch" style={styles.browseCardSurface} imageStyle={styles.cardImage}>
                        <react_native_1.View style={styles.cardTopRow}>
                          <react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.card.favoriteStar} resizeMode="contain" style={styles.favoriteStar}/>
                          <react_native_1.Text allowFontScaling={false} style={styles.cardProgress}>{cardNumberText}</react_native_1.Text>
                        </react_native_1.View>
                        <react_native_1.View style={styles.browseCardContent}> 
                          <react_native_1.Text adjustsFontSizeToFit allowFontScaling={false} minimumFontScale={0.72} numberOfLines={7} style={[styles.browseCardText, styles.answerText]}>
                            {currentCard.back}
                          </react_native_1.Text>
                          <react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.card.questionUnderline} resizeMode="stretch" style={styles.questionUnderline}/>
                        </react_native_1.View>
                        <react_native_1.Text allowFontScaling={false} numberOfLines={1} style={styles.tapHint}>{getCardHint(true)}</react_native_1.Text>
                      </react_native_1.ImageBackground>
                    </react_native_1.Animated.View>
                  </react_native_1.Animated.View>
                </react_native_1.View>) : (<react_native_1.ImageBackground source={folioReviewAssets_1.folioReviewAssets.card.frontSurface} resizeMode="stretch" style={[styles.emptyState, { minHeight: browseCardHeight }]} imageStyle={styles.cardImage}>
                  <react_native_1.Text style={styles.emptyTitle}>No cards in this deck</react_native_1.Text>
                  <react_native_1.Text style={styles.emptyText}>Go back home and add cards first.</react_native_1.Text>
                </react_native_1.ImageBackground>)}
            </react_native_1.View>

            {currentCard && !isEditing ? (<react_native_1.View style={[styles.browseCardControls, { height: browseControlsHeight }]}> 
                <react_native_1.Pressable accessibilityRole="button" accessibilityLabel="Previous card" onPress={onPreviousCard} style={function (_a) {
                var pressed = _a.pressed;
                return [styles.browseControlSide, pressed && styles.pressed];
            }}>
                  <react_native_1.Image source={browseAssets.previousButton} resizeMode="contain" style={styles.browseControlImage}/>
                </react_native_1.Pressable>
                <react_native_1.Pressable accessibilityRole="button" accessibilityLabel={flipped ? 'Show prompt' : 'Flip card'} onPress={onToggleFlip} style={function (_a) {
                var pressed = _a.pressed;
                return [styles.browseControlFlip, pressed && styles.pressed];
            }}>
                  <react_native_1.Image source={browseAssets.flipButton} resizeMode="contain" style={styles.browseControlImage}/>
                </react_native_1.Pressable>
                <react_native_1.Pressable accessibilityRole="button" accessibilityLabel="Next card" onPress={onNextCard} style={function (_a) {
                var pressed = _a.pressed;
                return [styles.browseControlSide, pressed && styles.pressed];
            }}>
                  <react_native_1.Image source={browseAssets.nextButton} resizeMode="contain" style={styles.browseControlImage}/>
                </react_native_1.Pressable>
              </react_native_1.View>) : null}

            <react_native_1.Image source={browseAssets.noteBar} resizeMode="stretch" style={[styles.browseNoteBar, { height: browseNoteHeight }]}/>
          </react_native_1.View>

          <react_native_1.View style={[styles.bottomNavWrap, { paddingBottom: react_native_1.Platform.OS === 'android' ? 0 : Math.max(insets.bottom, 4), width: pageWidth }]}> 
            <BottomTabBar_1.BottomTabBar activeTab="browse" onNavigateTab={navigateTab}/>
          </react_native_1.View>
        </react_native_1.View>

        <react_native_1.Modal visible={isTutorialOpen} animationType="fade" transparent onRequestClose={function () { return setIsTutorialOpen(false); }}>
          <react_native_1.View style={styles.tutorialOverlay}>
            <react_native_1.View style={styles.tutorialCard}>
              <react_native_1.View style={styles.tutorialHeader}>
                <react_native_1.View>
                  <react_native_1.Text style={styles.tutorialEyebrow}>Folio guide</react_native_1.Text>
                  <react_native_1.Text style={styles.tutorialTitle}>How review flow works</react_native_1.Text>
                </react_native_1.View>
                <react_native_1.Pressable accessibilityRole="button" onPress={function () { return setIsTutorialOpen(false); }} style={function (_a) {
            var pressed = _a.pressed;
            return [styles.tutorialCloseButton, pressed && styles.pressed];
        }}>
                  <react_native_1.Text style={styles.tutorialCloseText}>Close</react_native_1.Text>
                </react_native_1.Pressable>
              </react_native_1.View>
              <react_native_1.Image source={TUTORIAL_IMAGE} resizeMode="contain" style={styles.tutorialImage}/>
            </react_native_1.View>
          </react_native_1.View>
        </react_native_1.Modal>
      </react_native_1.ImageBackground>);
    }
    return (<react_native_1.ImageBackground source={folioReviewAssets_1.folioReviewAssets.background.pagePaper} resizeMode="cover" style={styles.screen}>
      <react_native_1.View style={[styles.safeArea, { paddingTop: insets.top + 4 }]}> 
        <react_native_1.View style={[styles.pageFrame, { width: pageWidth }]}> 
          <react_native_1.View style={styles.headerRow}> 
            <FolioAssetButton_1.FolioAssetButton source={folioReviewAssets_1.folioReviewAssets.header.back} accessibilityLabel="Go back" onPress={onBack} style={styles.backButton}/>

            <react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.header.folioWordmark} resizeMode="contain" style={styles.wordmark}/>

            <react_native_1.View style={styles.headerActions}> 
              <FolioAssetButton_1.FolioAssetButton source={folioReviewAssets_1.folioReviewAssets.header.undo} accessibilityLabel="Undo last review" onPress={showUndoButton ? onUndo : undefined} style={styles.headerActionButton}/>
              <FolioAssetButton_1.FolioAssetButton source={folioReviewAssets_1.folioReviewAssets.header.edit} accessibilityLabel="Edit current card" onPress={currentCard ? onStartEdit : undefined} disabled={!currentCard || !onStartEdit} style={styles.headerActionButton}/>
              <FolioAssetButton_1.FolioAssetButton source={folioReviewAssets_1.folioReviewAssets.header.help} accessibilityLabel="Open help" onPress={function () { return setIsTutorialOpen(true); }} style={styles.helpButton}/>
            </react_native_1.View>
          </react_native_1.View>

          <react_native_1.ScrollView alwaysBounceVertical={false} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} style={styles.scroll} contentContainerStyle={[
            styles.scrollContent,
            isCompactHeight && styles.scrollContentCompact,
            { paddingBottom: isCompactHeight ? 4 : 8 },
        ]}>
            <DeckSummaryPanel_1.DeckSummaryPanel deckTitle={deckName !== null && deckName !== void 0 ? deckName : 'Deck not found'} deckSubtitle={getDeckSubtitle(deckName)} dueCount={isBrowseMode ? cardsLength : dueOrVisibleCount} totalCards={totalCardsForPanel} cardsLeft={dueOrVisibleCount} tokens={DEFAULT_SESSION_TOKENS} activeTokenIndex={ACTIVE_TOKEN_INDEX}/>

            <react_native_1.View style={[styles.cardStage, { minHeight: stackHeight + 4 }]}> 
              {currentCard && isEditing ? (<react_native_1.ImageBackground source={folioReviewAssets_1.folioReviewAssets.card.frontSurface} resizeMode="stretch" style={[styles.editPanel, { minHeight: cardHeight }]} imageStyle={styles.cardImage}>
                  <react_native_1.Text style={styles.editTitle}>Edit current card</react_native_1.Text>
                  <react_native_1.TextInput multiline value={editFront} onChangeText={onChangeEditFront} placeholder="Prompt / front" placeholderTextColor="#8A8177" textAlignVertical="top" style={[styles.editInput, styles.editFrontInput]}/>
                  <react_native_1.TextInput multiline value={editBack} onChangeText={onChangeEditBack} placeholder="Answer / back" placeholderTextColor="#8A8177" textAlignVertical="top" style={[styles.editInput, styles.editBackInput]}/>
                  <react_native_1.View style={styles.editActionRow}>
                    <react_native_1.Pressable accessibilityRole="button" onPress={onCancelEdit} style={function (_a) {
            var pressed = _a.pressed;
            return [styles.editSecondaryButton, pressed && styles.pressed];
        }}>
                      <react_native_1.Text style={styles.editSecondaryButtonText}>Cancel</react_native_1.Text>
                    </react_native_1.Pressable>
                    <react_native_1.Pressable accessibilityRole="button" onPress={onSaveEdit} style={function (_a) {
            var pressed = _a.pressed;
            return [styles.editPrimaryButton, pressed && styles.pressed];
        }}>
                      <react_native_1.Text style={styles.editPrimaryButtonText}>Save changes</react_native_1.Text>
                    </react_native_1.Pressable>
                  </react_native_1.View>
                </react_native_1.ImageBackground>) : currentCard ? (<react_native_1.View style={[styles.cardStackWrap, { height: stackHeight }]}> 
                  <react_native_1.Image pointerEvents="none" source={folioReviewAssets_1.folioReviewAssets.card.stackBackLayers} resizeMode="stretch" style={[styles.cardBackLayers, { height: stackHeight, width: stackWidth }]}/>
                  <react_native_1.Animated.View key={currentCard.id} {...panHandlers} style={[
                styles.animatedCard,
                {
                    height: cardHeight,
                    width: cardWidth,
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
                    <react_native_1.ImageBackground source={folioReviewAssets_1.folioReviewAssets.card.frontSurface} resizeMode="stretch" style={styles.cardSurface} imageStyle={styles.cardImage}>
                      <react_native_1.View style={styles.cardTopRow}>
                        <react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.card.favoriteStar} resizeMode="contain" style={styles.favoriteStar}/>
                        <react_native_1.Text style={styles.cardProgress}>{cardNumberText}</react_native_1.Text>
                      </react_native_1.View>

                      <react_native_1.View style={styles.cardContent}> 
                        <react_native_1.Text adjustsFontSizeToFit minimumFontScale={0.72} numberOfLines={flipped ? 7 : 5} style={[styles.cardText, flipped && styles.answerText]}>
                          {getCardQuestion(currentCard, flipped)}
                        </react_native_1.Text>
                        <react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.card.questionUnderline} resizeMode="stretch" style={styles.questionUnderline}/>
                        {!flipped ? (<react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.card.retrievalGenerationIllustration} resizeMode="contain" style={styles.cardIllustration}/>) : null}
                      </react_native_1.View>

                      <react_native_1.Text numberOfLines={1} style={styles.tapHint}>{getCardHint(flipped)}</react_native_1.Text>
                    </react_native_1.ImageBackground>
                  </react_native_1.Animated.View>
                </react_native_1.View>) : (<react_native_1.ImageBackground source={folioReviewAssets_1.folioReviewAssets.card.frontSurface} resizeMode="stretch" style={[styles.emptyState, { minHeight: cardHeight }]} imageStyle={styles.cardImage}>
                  <react_native_1.Text style={styles.emptyTitle}>{showGradeButtons ? 'Nothing due right now' : 'No cards in this deck'}</react_native_1.Text>
                  <react_native_1.Text style={styles.emptyText}>
                    {showGradeButtons
                ? 'New, learning, and due review cards will appear here when they are ready.'
                : 'Go back home and add cards first.'}
                  </react_native_1.Text>
                </react_native_1.ImageBackground>)}
            </react_native_1.View>

            {currentCard && showGradeButtons && !isEditing ? <GradeButtonRow_1.GradeButtonRow onGrade={onGrade}/> : null}

            {currentCard && isBrowseMode && !isEditing ? (<react_native_1.View style={styles.browseControls}> 
                <NavigateButton label="‹ Previous" onPress={onPreviousCard}/>
                <NavigateButton label={flipped ? 'Prompt' : 'Flip card'} onPress={onToggleFlip}/>
                <NavigateButton label="Next ›" onPress={onNextCard}/>
                {(cardSearch === null || cardSearch === void 0 ? void 0 : cardSearch.trim()) ? <react_native_1.Text style={styles.browseSearchNote}>Search: {cardSearch.trim()}</react_native_1.Text> : null}
              </react_native_1.View>) : null}
          </react_native_1.ScrollView>
        </react_native_1.View>

        <react_native_1.View style={[styles.bottomNavWrap, { paddingBottom: react_native_1.Platform.OS === 'android' ? 0 : Math.max(insets.bottom, 4), width: pageWidth }]}> 
          <BottomTabBar_1.BottomTabBar activeTab="review" onNavigateTab={navigateTab}/>
        </react_native_1.View>
      </react_native_1.View>

      <react_native_1.Modal visible={isTutorialOpen} animationType="fade" transparent onRequestClose={function () { return setIsTutorialOpen(false); }}>
        <react_native_1.View style={styles.tutorialOverlay}>
          <react_native_1.View style={styles.tutorialCard}>
            <react_native_1.View style={styles.tutorialHeader}>
              <react_native_1.View>
                <react_native_1.Text style={styles.tutorialEyebrow}>Folio guide</react_native_1.Text>
                <react_native_1.Text style={styles.tutorialTitle}>How review flow works</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.Pressable accessibilityRole="button" onPress={function () { return setIsTutorialOpen(false); }} style={function (_a) {
        var pressed = _a.pressed;
        return [styles.tutorialCloseButton, pressed && styles.pressed];
    }}>
                <react_native_1.Text style={styles.tutorialCloseText}>Close</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>
            <react_native_1.Image source={TUTORIAL_IMAGE} resizeMode="contain" style={styles.tutorialImage}/>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.Modal>
    </react_native_1.ImageBackground>);
}
var styles = react_native_1.StyleSheet.create({
    screen: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        alignItems: 'center',
    },
    pageFrame: {
        flex: 1,
    },
    browsePageFrame: {
        flex: 1,
        gap: 7,
    },
    panelImage: {
        resizeMode: 'stretch',
    },
    browseHeaderActions: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 7,
        justifyContent: 'flex-end',
        marginRight: 4,
    },
    browseDeckPanel: {
        alignItems: 'center',
        flexDirection: 'row',
        overflow: 'visible',
        paddingHorizontal: 24,
    },
    browseDeckIcon: {
        height: 68,
        marginRight: 16,
        width: 68,
    },
    browseDeckTextBlock: {
        flex: 1,
        justifyContent: 'center',
        paddingRight: 10,
    },
    browseDeckTitle: {
        color: '#26211C',
        fontFamily: folioFonts_1.FOLIO_HAND_FONT,
        fontSize: 27,
        fontWeight: '400',
        lineHeight: 32,
    },
    browseDeckSubtitle: {
        color: '#26211C',
        fontFamily: folioFonts_1.FOLIO_HAND_FONT,
        fontSize: 24,
        fontWeight: '400',
        lineHeight: 28,
    },
    browseDeckModeText: {
        color: '#766F65',
        fontSize: 13.5,
        fontWeight: '800',
        lineHeight: 18,
        marginTop: 3,
    },
    browseDeckModeBlue: {
        color: '#0C73DB',
    },
    browseMatchPanel: {
        alignItems: 'center',
        flexDirection: 'row',
        overflow: 'visible',
        paddingHorizontal: 18,
    },
    browseSearchIcon: {
        height: 34,
        marginRight: 8,
        width: 34,
    },
    browseMatchCopy: {
        flex: 1.15,
        justifyContent: 'center',
        minWidth: 138,
    },
    browseMatchTitle: {
        color: '#0C73DB',
        fontFamily: folioFonts_1.FOLIO_HAND_FONT,
        fontSize: 14.5,
        fontWeight: '400',
        lineHeight: 18,
    },
    browseMatchSearch: {
        color: '#766F65',
        fontFamily: folioFonts_1.FOLIO_HAND_FONT,
        fontSize: 13.5,
        fontWeight: '400',
        lineHeight: 17,
    },
    browseMiniFlow: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    browseMiniTokenWrap: {
        alignItems: 'center',
        height: 38,
        justifyContent: 'center',
        marginLeft: -2,
        position: 'relative',
        width: 19,
    },
    browseMiniRays: {
        height: 12,
        position: 'absolute',
        top: -1,
        width: 15,
    },
    browseMiniToken: {
        height: 24,
        width: 15,
    },
    browseMiniTriangle: {
        bottom: 0,
        height: 8,
        position: 'absolute',
        width: 10,
    },
    browseFlipFace: __assign(__assign({}, react_native_1.StyleSheet.absoluteFillObject), { backfaceVisibility: 'hidden' }),
    browseFrontFace: {
        zIndex: 2,
    },
    browseBackFace: {
        zIndex: 1,
    },
    browseCardSurface: {
        flex: 1,
        paddingBottom: 14,
        paddingHorizontal: 26,
        paddingTop: 17,
    },
    browseCardContent: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 12,
    },
    browseCardText: {
        color: '#26211C',
        fontFamily: folioFonts_1.FOLIO_HAND_FONT,
        fontSize: 30,
        fontWeight: '400',
        lineHeight: 37,
        textAlign: 'center',
    },
    browseCardIllustration: {
        height: 72,
        marginTop: 5,
        width: '62%',
    },
    browseCardControls: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        overflow: 'visible',
    },
    browseControlSide: {
        flex: 1,
        height: '100%',
        overflow: 'visible',
    },
    browseControlFlip: {
        flex: 1.55,
        height: '100%',
        overflow: 'visible',
    },
    browseControlImage: {
        height: '100%',
        overflow: 'visible',
        width: '100%',
    },
    browseNoteBar: {
        marginTop: -2,
        width: '100%',
    },
    headerRow: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 60,
        justifyContent: 'space-between',
        width: '100%',
    },
    backButton: {
        height: 50,
        width: 50,
    },
    wordmark: {
        flex: 1,
        height: 52,
        marginHorizontal: 3,
        maxWidth: 134,
    },
    headerActions: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 2,
        justifyContent: 'flex-end',
        marginRight: 4,
    },
    headerActionButton: {
        height: 43,
        width: 43,
    },
    helpButton: {
        height: 43,
        width: 43,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        gap: 7,
    },
    scrollContentCompact: {
        gap: 6,
    },
    cardStage: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0,
    },
    cardStackWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
    },
    cardBackLayers: {
        bottom: 0,
        opacity: 1,
        position: 'absolute',
    },
    animatedCard: {
        alignSelf: 'center',
        overflow: 'visible',
        position: 'absolute',
        top: 0,
    },
    cardSurface: {
        flex: 1,
        paddingHorizontal: 26,
        paddingTop: 18,
        paddingBottom: 16,
    },
    cardImage: {
        resizeMode: 'stretch',
    },
    cardTopRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        minHeight: 36,
    },
    favoriteStar: {
        height: 32,
        width: 32,
    },
    cardProgress: {
        color: '#766F65',
        fontSize: 23,
        fontWeight: '800',
    },
    cardContent: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 14,
    },
    cardText: {
        color: '#26211C',
        fontFamily: folioFonts_1.FOLIO_HAND_FONT,
        fontSize: 31,
        fontWeight: '400',
        lineHeight: 38,
        textAlign: 'center',
    },
    answerText: {
        fontFamily: folioFonts_1.FOLIO_HAND_FONT,
        fontSize: 27,
        fontWeight: '400',
        lineHeight: 34,
    },
    questionUnderline: {
        height: 10,
        marginTop: 10,
        width: '58%',
    },
    cardIllustration: {
        height: 70,
        marginTop: 6,
        width: '62%',
    },
    tapHint: {
        color: '#8A8177',
        fontFamily: folioFonts_1.FOLIO_HAND_FONT,
        fontSize: 18,
        fontWeight: '400',
        lineHeight: 22,
        textAlign: 'center',
    },
    editPanel: {
        alignSelf: 'stretch',
        gap: 10,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 22,
    },
    editTitle: {
        color: '#2E6FB8',
        fontSize: 20,
        fontWeight: '900',
    },
    editInput: {
        backgroundColor: 'rgba(255, 252, 245, 0.82)',
        borderColor: '#D6CABB',
        borderRadius: 14,
        borderWidth: 1,
        color: '#26211C',
        fontSize: 16,
        lineHeight: 22,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    editFrontInput: {
        minHeight: 88,
    },
    editBackInput: {
        minHeight: 112,
    },
    editActionRow: {
        flexDirection: 'row',
        gap: 10,
    },
    editSecondaryButton: {
        alignItems: 'center',
        backgroundColor: '#FFF9EC',
        borderColor: '#D6CABB',
        borderRadius: 14,
        borderWidth: 1,
        flex: 1,
        justifyContent: 'center',
        minHeight: 44,
    },
    editSecondaryButtonText: {
        color: '#766F65',
        fontWeight: '800',
    },
    editPrimaryButton: {
        alignItems: 'center',
        backgroundColor: '#EAF6E4',
        borderColor: '#90B96F',
        borderRadius: 14,
        borderWidth: 1,
        flex: 1.3,
        justifyContent: 'center',
        minHeight: 44,
    },
    editPrimaryButtonText: {
        color: '#3E7E2D',
        fontWeight: '900',
    },
    emptyState: {
        alignItems: 'center',
        alignSelf: 'stretch',
        justifyContent: 'center',
        padding: 26,
    },
    emptyTitle: {
        color: '#26211C',
        fontFamily: folioFonts_1.FOLIO_HAND_FONT,
        fontSize: 28,
        fontWeight: '400',
        textAlign: 'center',
    },
    emptyText: {
        color: '#766F65',
        fontSize: 16,
        lineHeight: 22,
        marginTop: 8,
        textAlign: 'center',
    },
    browseControls: {
        gap: 8,
        marginTop: 6,
    },
    browseButton: {
        alignItems: 'center',
        backgroundColor: 'rgba(236, 246, 255, 0.72)',
        borderColor: '#65A6DE',
        borderRadius: 16,
        borderWidth: 1,
        justifyContent: 'center',
        minHeight: 44,
    },
    browseButtonText: {
        color: '#0C73DB',
        fontSize: 15,
        fontWeight: '900',
    },
    browseSearchNote: {
        color: '#766F65',
        fontSize: 13,
        fontWeight: '800',
        textAlign: 'center',
    },
    bottomNavWrap: {
        alignSelf: 'center',
        flexShrink: 0,
        marginTop: -4,
    },
    tutorialOverlay: {
        alignItems: 'center',
        backgroundColor: 'rgba(42, 36, 31, 0.34)',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 28,
    },
    tutorialCard: {
        backgroundColor: '#FFF9EC',
        borderColor: '#65A6DE',
        borderRadius: 24,
        borderWidth: 2,
        gap: 14,
        maxHeight: '92%',
        maxWidth: 520,
        padding: 16,
        width: '100%',
    },
    tutorialHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'space-between',
    },
    tutorialEyebrow: {
        color: '#0C73DB',
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    tutorialTitle: {
        color: '#26211C',
        fontSize: 22,
        fontWeight: '900',
    },
    tutorialCloseButton: {
        alignItems: 'center',
        backgroundColor: '#FFF4D8',
        borderColor: '#E7A93B',
        borderRadius: 14,
        borderWidth: 1,
        justifyContent: 'center',
        minHeight: 36,
        paddingHorizontal: 14,
    },
    tutorialCloseText: {
        color: '#D98200',
        fontWeight: '900',
    },
    tutorialImage: {
        height: 520,
        maxHeight: '82%',
        width: '100%',
    },
    pressed: {
        opacity: 0.88,
        transform: [{ scale: 0.98 }],
    },
});
