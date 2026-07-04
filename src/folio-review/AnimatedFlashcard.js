"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimatedFlashcard = AnimatedFlashcard;
var react_1 = require("react");
var react_native_1 = require("react-native");
var folioReviewAssets_1 = require("./folioReviewAssets");
function AnimatedFlashcard(_a) {
    var card = _a.card, currentCardNumber = _a.currentCardNumber, sessionTotalCards = _a.sessionTotalCards;
    var flip = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    var _b = (0, react_1.useState)(false), revealed = _b[0], setRevealed = _b[1];
    var frontRotation = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
    var backRotation = flip.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
    var toggleReveal = function () {
        var next = revealed ? 0 : 1;
        setRevealed(!revealed);
        react_native_1.Animated.spring(flip, {
            toValue: next,
            friction: 9,
            tension: 70,
            useNativeDriver: true,
        }).start();
    };
    return (<react_native_1.View style={styles.wrap}>
      <react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.card.stackBackLayers} resizeMode="stretch" style={styles.stackLayers}/>

      <react_native_1.Animated.View style={[styles.cardFace, styles.frontFace, { transform: [{ perspective: 1100 }, { rotateY: frontRotation }] }]}>
        <CardSurface accessibilityLabel="Reveal answer" onPress={toggleReveal} progressText={"".concat(currentCardNumber, " / ").concat(sessionTotalCards)} mainText={card.question} footerText="Tap to reveal answer" showIllustration/>
      </react_native_1.Animated.View>

      <react_native_1.Animated.View style={[styles.cardFace, styles.backFace, { transform: [{ perspective: 1100 }, { rotateY: backRotation }] }]}>
        <CardSurface accessibilityLabel="Show question" onPress={toggleReveal} progressText={"".concat(currentCardNumber, " / ").concat(sessionTotalCards)} mainText={card.answer} footerText="Tap to return to question" showIllustration={false}/>
      </react_native_1.Animated.View>
    </react_native_1.View>);
}
function CardSurface(_a) {
    var accessibilityLabel = _a.accessibilityLabel, onPress = _a.onPress, progressText = _a.progressText, mainText = _a.mainText, footerText = _a.footerText, showIllustration = _a.showIllustration;
    return (<react_native_1.Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={styles.pressableFill}>
      <react_native_1.ImageBackground source={folioReviewAssets_1.folioReviewAssets.card.frontSurface} resizeMode="stretch" style={styles.surface} imageStyle={styles.surfaceImage}>
        <react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.card.favoriteStar} resizeMode="contain" style={styles.star}/>
        <react_native_1.Text style={styles.progress}>{progressText}</react_native_1.Text>
        <react_native_1.Text adjustsFontSizeToFit numberOfLines={showIllustration ? 4 : 7} style={[styles.mainText, !showIllustration && styles.answerText]}>
          {mainText}
        </react_native_1.Text>
        <react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.card.questionUnderline} resizeMode="stretch" style={styles.underline}/>
        {showIllustration ? <react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.card.retrievalGenerationIllustration} resizeMode="contain" style={styles.illustration}/> : null}
        <react_native_1.Text style={styles.footerText}>{footerText}</react_native_1.Text>
      </react_native_1.ImageBackground>
    </react_native_1.Pressable>);
}
var CARD_HEIGHT = 344;
var styles = react_native_1.StyleSheet.create({
    wrap: {
        alignSelf: 'center',
        height: CARD_HEIGHT + 18,
        marginTop: 16,
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
        fontFamily: react_native_1.Platform.select({ ios: 'Marker Felt', android: 'sans-serif', default: 'sans-serif' }),
        fontSize: 29,
        fontWeight: '800',
        lineHeight: 38,
        marginTop: 78,
        textAlign: 'center',
    },
    answerText: {
        fontSize: 22,
        lineHeight: 31,
        marginTop: 88,
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
        bottom: 31,
        color: '#8A8177',
        fontSize: 18,
        fontWeight: '800',
        left: 0,
        position: 'absolute',
        right: 0,
        textAlign: 'center',
    },
});
