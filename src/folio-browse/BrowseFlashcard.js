"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowseFlashcard = BrowseFlashcard;
var react_1 = require("react");
var react_native_1 = require("react-native");
var folioFonts_1 = require("@/folio-review/folioFonts");
var folioBrowseAssets_1 = require("./folioBrowseAssets");
function BrowseFlashcard(_a) {
    var question = _a.question, answer = _a.answer, currentCardNumber = _a.currentCardNumber, totalCards = _a.totalCards, revealed = _a.revealed, onToggleReveal = _a.onToggleReveal;
    var flip = (0, react_1.useRef)(new react_native_1.Animated.Value(revealed ? 1 : 0)).current;
    (0, react_1.useEffect)(function () {
        react_native_1.Animated.spring(flip, {
            toValue: revealed ? 1 : 0,
            friction: 9,
            tension: 70,
            useNativeDriver: true,
        }).start();
    }, [flip, revealed]);
    var frontRotation = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
    var backRotation = flip.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
    return (<react_native_1.View style={styles.wrap}>
      <react_native_1.Image source={folioBrowseAssets_1.folioBrowseAssets.card.stackBackLayers} resizeMode="stretch" style={styles.stackLayers}/>

      <react_native_1.Animated.View style={[styles.cardFace, styles.frontFace, { transform: [{ perspective: 1100 }, { rotateY: frontRotation }] }]}>
        <CardSurface accessibilityLabel="Reveal answer" footerText="Tap to reveal answer" mainText={question} onPress={onToggleReveal} progressText={"".concat(currentCardNumber, " / ").concat(totalCards)} showIllustration/>
      </react_native_1.Animated.View>

      <react_native_1.Animated.View style={[styles.cardFace, styles.backFace, { transform: [{ perspective: 1100 }, { rotateY: backRotation }] }]}>
        <CardSurface accessibilityLabel="Show question" footerText="Tap to reveal prompt" mainText={answer} onPress={onToggleReveal} progressText={"".concat(currentCardNumber, " / ").concat(totalCards)} showIllustration={false}/>
      </react_native_1.Animated.View>
    </react_native_1.View>);
}
function CardSurface(_a) {
    var accessibilityLabel = _a.accessibilityLabel, footerText = _a.footerText, mainText = _a.mainText, onPress = _a.onPress, progressText = _a.progressText, showIllustration = _a.showIllustration;
    return (<react_native_1.Pressable accessibilityLabel={accessibilityLabel} accessibilityRole="button" onPress={onPress} style={styles.pressableFill}>
      <react_native_1.ImageBackground source={folioBrowseAssets_1.folioBrowseAssets.card.frontSurface} resizeMode="stretch" style={styles.surface} imageStyle={styles.surfaceImage}>
        <react_native_1.Image source={folioBrowseAssets_1.folioBrowseAssets.card.favoriteStar} resizeMode="contain" style={styles.star}/>
        <react_native_1.Text allowFontScaling={false} style={styles.progress}>{progressText}</react_native_1.Text>
        <react_native_1.Text adjustsFontSizeToFit allowFontScaling={false} minimumFontScale={0.72} numberOfLines={showIllustration ? 4 : 7} style={[styles.mainText, !showIllustration ? styles.answerText : null]}>
          {mainText}
        </react_native_1.Text>
        <react_native_1.Image source={folioBrowseAssets_1.folioBrowseAssets.card.questionUnderline} resizeMode="stretch" style={styles.underline}/>
        {showIllustration ? (<react_native_1.Image source={folioBrowseAssets_1.folioBrowseAssets.card.retrievalGenerationIllustration} resizeMode="contain" style={styles.illustration}/>) : null}
        <react_native_1.Text allowFontScaling={false} style={styles.footerText}>{footerText}</react_native_1.Text>
      </react_native_1.ImageBackground>
    </react_native_1.Pressable>);
}
var CARD_HEIGHT = 344;
var styles = react_native_1.StyleSheet.create({
    wrap: {
        alignSelf: 'center',
        height: CARD_HEIGHT + 18,
        marginTop: 14,
        width: '100%',
    },
    stackLayers: {
        height: CARD_HEIGHT,
        left: 0,
        position: 'absolute',
        top: 0,
        width: '100%',
    },
    cardFace: {
        height: CARD_HEIGHT,
        left: 0,
        position: 'absolute',
        top: 0,
        width: '100%',
    },
    frontFace: {
        backfaceVisibility: 'hidden',
        zIndex: 2,
    },
    backFace: {
        backfaceVisibility: 'hidden',
        zIndex: 1,
    },
    pressableFill: {
        flex: 1,
    },
    surface: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 34,
    },
    surfaceImage: {
        resizeMode: 'stretch',
    },
    star: {
        height: 36,
        left: 25,
        position: 'absolute',
        top: 28,
        width: 36,
    },
    progress: {
        color: '#766F65',
        fontSize: 24,
        fontWeight: '800',
        position: 'absolute',
        right: 30,
        top: 34,
    },
    mainText: {
        color: '#26211C',
        fontFamily: folioFonts_1.FOLIO_HAND_FONT,
        fontSize: 28,
        lineHeight: 38,
        marginTop: 78,
        textAlign: 'center',
    },
    answerText: {
        fontSize: 22,
        lineHeight: 30,
        marginTop: 86,
    },
    underline: {
        alignSelf: 'center',
        height: 12,
        marginTop: 14,
        width: '58%',
    },
    illustration: {
        alignSelf: 'center',
        height: 88,
        marginTop: 10,
        width: '62%',
    },
    footerText: {
        bottom: react_native_1.Platform.OS === 'android' ? 28 : 31,
        color: '#8A8177',
        fontSize: 17,
        fontWeight: '800',
        left: 0,
        position: 'absolute',
        right: 0,
        textAlign: 'center',
    },
});
