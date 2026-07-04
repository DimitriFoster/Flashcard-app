"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioReviewScreen = FolioReviewScreen;
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var react_native_1 = require("react-native");
var AnimatedFlashcard_1 = require("./AnimatedFlashcard");
var BottomTabBar_1 = require("./BottomTabBar");
var DeckSummaryPanel_1 = require("./DeckSummaryPanel");
var FolioAssetButton_1 = require("./FolioAssetButton");
var folioReviewAssets_1 = require("./folioReviewAssets");
var GradeButtonRow_1 = require("./GradeButtonRow");
var use_android_immersive_navigation_1 = require("@/hooks/use-android-immersive-navigation");
var DEFAULT_TOKENS = [
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
function FolioReviewScreen(_a) {
    var deckTitle = _a.deckTitle, _b = _a.deckSubtitle, deckSubtitle = _b === void 0 ? 'Master Deck' : _b, dueCount = _a.dueCount, totalCards = _a.totalCards, cardsLeft = _a.cardsLeft, currentCardNumber = _a.currentCardNumber, sessionTotalCards = _a.sessionTotalCards, card = _a.card, _c = _a.sessionTokens, sessionTokens = _c === void 0 ? DEFAULT_TOKENS : _c, _d = _a.activeTokenIndex, activeTokenIndex = _d === void 0 ? 6 : _d, onBack = _a.onBack, onUndo = _a.onUndo, onEdit = _a.onEdit, onHelp = _a.onHelp, onGrade = _a.onGrade, onNavigateTab = _a.onNavigateTab;
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(function () {
        if (react_native_1.Platform.OS !== 'android') {
            return;
        }
        var delays = [0, 150, 500, 1200, 2500];
        var timers = delays.map(function (delay) {
            return setTimeout(function () {
                void (0, use_android_immersive_navigation_1.applyAndroidImmersiveNavigation)();
            }, delay);
        });
        return function () {
            timers.forEach(clearTimeout);
        };
    }, []));
    return (<react_native_1.ImageBackground source={folioReviewAssets_1.folioReviewAssets.background.pagePaper} resizeMode="cover" style={styles.screen} onLayout={function () { return void (0, use_android_immersive_navigation_1.applyAndroidImmersiveNavigation)(); }}>
      <react_native_1.SafeAreaView style={styles.safeArea}>
        <react_native_1.View style={styles.pageInner}>
          <react_native_1.View style={styles.headerRow}>
            <FolioAssetButton_1.FolioAssetButton source={folioReviewAssets_1.folioReviewAssets.header.back} accessibilityLabel="Back" onPress={onBack} style={styles.backButton}/>
            <react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.header.folioWordmark} resizeMode="contain" style={styles.wordmark}/>
            <react_native_1.View style={styles.headerActions}>
              <FolioAssetButton_1.FolioAssetButton source={folioReviewAssets_1.folioReviewAssets.header.undo} accessibilityLabel="Undo last answer" onPress={onUndo} style={styles.actionButton}/>
              <FolioAssetButton_1.FolioAssetButton source={folioReviewAssets_1.folioReviewAssets.header.edit} accessibilityLabel="Edit current card" onPress={onEdit} style={styles.actionButton}/>
              <FolioAssetButton_1.FolioAssetButton source={folioReviewAssets_1.folioReviewAssets.header.help} accessibilityLabel="Help" onPress={onHelp} style={styles.helpButton}/>
            </react_native_1.View>
          </react_native_1.View>

          <DeckSummaryPanel_1.DeckSummaryPanel deckTitle={deckTitle} deckSubtitle={deckSubtitle} dueCount={dueCount} totalCards={totalCards} cardsLeft={cardsLeft} tokens={sessionTokens} activeTokenIndex={activeTokenIndex}/>

          <AnimatedFlashcard_1.AnimatedFlashcard card={card} currentCardNumber={currentCardNumber} sessionTotalCards={sessionTotalCards}/>
          <GradeButtonRow_1.GradeButtonRow onGrade={onGrade}/>
          <react_native_1.View style={styles.navSpacer}/>
        </react_native_1.View>
        <react_native_1.View style={styles.navWrap}>
          <BottomTabBar_1.BottomTabBar onNavigateTab={onNavigateTab}/>
        </react_native_1.View>
      </react_native_1.SafeAreaView>
    </react_native_1.ImageBackground>);
}
var styles = react_native_1.StyleSheet.create({
    screen: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        paddingTop: react_native_1.Platform.OS === 'android' ? 30 : 0,
    },
    pageInner: {
        alignSelf: 'center',
        flex: 1,
        paddingHorizontal: 16,
        width: '100%',
        maxWidth: 430,
    },
    headerRow: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 72,
        justifyContent: 'space-between',
        width: '100%',
    },
    backButton: {
        height: 58,
        width: 58,
    },
    wordmark: {
        flex: 1,
        height: 62,
        marginHorizontal: 6,
        maxWidth: 132,
    },
    headerActions: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5,
    },
    actionButton: {
        height: 51,
        width: 51,
    },
    helpButton: {
        height: 52,
        width: 52,
    },
    navSpacer: {
        flex: 1,
        minHeight: 8,
    },
    navWrap: {
        alignSelf: 'center',
        marginBottom: react_native_1.Platform.OS === 'android' ? 8 : 0,
        paddingHorizontal: 8,
        width: '100%',
        maxWidth: 430,
    },
});
