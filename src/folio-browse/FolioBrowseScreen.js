"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioBrowseScreen = FolioBrowseScreen;
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var react_native_1 = require("react-native");
var use_android_immersive_navigation_1 = require("@/hooks/use-android-immersive-navigation");
var BottomTabBar_1 = require("@/folio-review/BottomTabBar");
var FolioAssetButton_1 = require("@/folio-review/FolioAssetButton");
var BrowseFlashcard_1 = require("./BrowseFlashcard");
var folioBrowseAssets_1 = require("./folioBrowseAssets");
function FolioBrowseScreen(_a) {
    var answer = _a.answer, currentCardNumber = _a.currentCardNumber, onBack = _a.onBack, onEdit = _a.onEdit, onHelp = _a.onHelp, onNavigateTab = _a.onNavigateTab, onNext = _a.onNext, onPrevious = _a.onPrevious, onToggleReveal = _a.onToggleReveal, onUndo = _a.onUndo, question = _a.question, revealed = _a.revealed, totalCards = _a.totalCards;
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(function () {
        var delays = [0, 150, 500, 1200];
        var timers = delays.map(function (delay) {
            return setTimeout(function () {
                void (0, use_android_immersive_navigation_1.applyAndroidImmersiveNavigation)();
            }, delay);
        });
        return function () {
            timers.forEach(clearTimeout);
        };
    }, []));
    return (<react_native_1.ImageBackground source={folioBrowseAssets_1.folioBrowseAssets.background.pagePaper} resizeMode="cover" style={styles.screen} onLayout={function () { return void (0, use_android_immersive_navigation_1.applyAndroidImmersiveNavigation)(); }}>
      <react_native_1.SafeAreaView style={styles.safeArea}>
        <react_native_1.ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <react_native_1.View style={styles.pageInner}>
          <react_native_1.View style={styles.headerRow}>
            <FolioAssetButton_1.FolioAssetButton source={folioBrowseAssets_1.folioBrowseAssets.header.back} accessibilityLabel="Back" onPress={onBack} style={styles.backButton}/>
            <react_native_1.Image source={folioBrowseAssets_1.folioBrowseAssets.header.folioWordmark} resizeMode="contain" style={styles.wordmark}/>
            <react_native_1.View style={styles.headerActions}>
              <FolioAssetButton_1.FolioAssetButton source={folioBrowseAssets_1.folioBrowseAssets.header.undo} accessibilityLabel="Undo" onPress={onUndo} style={styles.actionButton}/>
              <FolioAssetButton_1.FolioAssetButton source={folioBrowseAssets_1.folioBrowseAssets.header.edit} accessibilityLabel="Edit" onPress={onEdit} style={styles.actionButton}/>
              <FolioAssetButton_1.FolioAssetButton source={folioBrowseAssets_1.folioBrowseAssets.header.help} accessibilityLabel="Help" onPress={onHelp} style={styles.helpButton}/>
            </react_native_1.View>
          </react_native_1.View>

          <react_native_1.Image source={folioBrowseAssets_1.folioBrowseAssets.topPanel} resizeMode="stretch" style={styles.topPanel}/>
          <react_native_1.Image source={folioBrowseAssets_1.folioBrowseAssets.matchesStrip} resizeMode="stretch" style={styles.matchesStrip}/>

          <BrowseFlashcard_1.BrowseFlashcard answer={answer} currentCardNumber={currentCardNumber} onToggleReveal={onToggleReveal} question={question} revealed={revealed} totalCards={totalCards}/>

          <react_native_1.View style={styles.controlsRow}>
            <react_native_1.Pressable accessibilityLabel="Previous card" accessibilityRole="button" onPress={onPrevious} style={function (_a) {
        var pressed = _a.pressed;
        return [styles.sideControl, pressed && styles.pressed];
    }}>
              <react_native_1.Image source={folioBrowseAssets_1.folioBrowseAssets.controls.previous} resizeMode="stretch" style={styles.sideControlImage}/>
            </react_native_1.Pressable>
            <react_native_1.Pressable accessibilityLabel={revealed ? 'Show prompt' : 'Flip card'} accessibilityRole="button" onPress={onToggleReveal} style={function (_a) {
        var pressed = _a.pressed;
        return [styles.flipControl, pressed && styles.pressed];
    }}>
              <react_native_1.Image source={folioBrowseAssets_1.folioBrowseAssets.controls.flip} resizeMode="stretch" style={styles.flipControlImage}/>
            </react_native_1.Pressable>
            <react_native_1.Pressable accessibilityLabel="Next card" accessibilityRole="button" onPress={onNext} style={function (_a) {
        var pressed = _a.pressed;
        return [styles.sideControl, pressed && styles.pressed];
    }}>
              <react_native_1.Image source={folioBrowseAssets_1.folioBrowseAssets.controls.next} resizeMode="stretch" style={styles.sideControlImage}/>
            </react_native_1.Pressable>
          </react_native_1.View>

          <react_native_1.Image source={folioBrowseAssets_1.folioBrowseAssets.footer.noteBar} resizeMode="stretch" style={styles.noteBar}/>
          <react_native_1.View style={styles.bottomNavWrap}>
            <BottomTabBar_1.BottomTabBar activeTab="browse" onNavigateTab={onNavigateTab}/>
          </react_native_1.View>
        </react_native_1.View>
        </react_native_1.ScrollView>
      </react_native_1.SafeAreaView>
    </react_native_1.ImageBackground>);
}
var styles = react_native_1.StyleSheet.create({
    screen: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        paddingTop: 30,
    },
    scrollContent: {
        paddingBottom: 18,
    },
    pageInner: {
        alignSelf: 'center',
        maxWidth: 430,
        paddingHorizontal: 16,
        width: '100%',
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
    topPanel: {
        height: 118,
        marginTop: 6,
        width: '100%',
    },
    matchesStrip: {
        height: 86,
        marginTop: 10,
        width: '100%',
    },
    controlsRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 14,
        justifyContent: 'space-between',
        marginTop: 12,
    },
    sideControl: {
        flex: 1,
        height: 70,
        overflow: 'visible',
    },
    sideControlImage: {
        height: '100%',
        overflow: 'visible',
        width: '100%',
    },
    flipControl: {
        flex: 1.58,
        height: 74,
        overflow: 'visible',
    },
    flipControlImage: {
        height: '100%',
        overflow: 'visible',
        width: '100%',
    },
    noteBar: {
        height: 56,
        marginTop: 14,
        width: '100%',
    },
    bottomNavWrap: {
        marginTop: 10,
        width: '100%',
    },
    pressed: {
        opacity: 0.92,
        transform: [{ scale: 0.985 }],
    },
});
