"use strict";
// REVIEW_BUTTON_ART_SNIPPET.tsx
// Reference-only snippet for Codex. Adapt paths to the real project structure.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewBackButton = ReviewBackButton;
exports.ReviewGoodButton = ReviewGoodButton;
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_reanimated_1 = require("react-native-reanimated");
function useSnappyPressAnimation() {
    var scale = (0, react_native_reanimated_1.useSharedValue)(1);
    var translateY = (0, react_native_reanimated_1.useSharedValue)(0);
    var onPressIn = function () {
        scale.value = (0, react_native_reanimated_1.withTiming)(0.965, { duration: 70 });
        translateY.value = (0, react_native_reanimated_1.withTiming)(1.5, { duration: 70 });
    };
    var onPressOut = function () {
        scale.value = (0, react_native_reanimated_1.withSpring)(1, { stiffness: 380, damping: 24, mass: 0.9 });
        translateY.value = (0, react_native_reanimated_1.withSpring)(0, { stiffness: 380, damping: 24, mass: 0.9 });
    };
    var animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        transform: [{ scale: scale.value }, { translateY: translateY.value }],
    }); });
    return { onPressIn: onPressIn, onPressOut: onPressOut, animatedStyle: animatedStyle };
}
function ReviewBackButton(_a) {
    var onPress = _a.onPress;
    var press = useSnappyPressAnimation();
    return (<react_native_1.Pressable onPress={onPress} onPressIn={press.onPressIn} onPressOut={press.onPressOut} accessibilityRole="button" accessibilityLabel="Go back" hitSlop={8} style={styles.backTouch}>
      <react_native_reanimated_1.default.View style={press.animatedStyle}>
        <react_native_1.Image source={require('../assets/review-page-buttons/back_button_transparent.png')} resizeMode="contain" style={styles.backImage}/>
      </react_native_reanimated_1.default.View>
    </react_native_1.Pressable>);
}
function ReviewGoodButton(_a) {
    var onPress = _a.onPress;
    var press = useSnappyPressAnimation();
    return (<react_native_1.Pressable onPress={onPress} onPressIn={press.onPressIn} onPressOut={press.onPressOut} accessibilityRole="button" accessibilityLabel="Good, 15 minutes" hitSlop={8} style={styles.goodTouch}>
      <react_native_reanimated_1.default.View style={press.animatedStyle}>
        <react_native_1.Image source={require('../assets/review-page-buttons/good_button_transparent.png')} resizeMode="contain" style={styles.goodImage}/>
      </react_native_reanimated_1.default.View>
    </react_native_1.Pressable>);
}
var styles = react_native_1.StyleSheet.create({
    backTouch: {
        width: 88,
        height: 88,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        overflow: 'visible',
    },
    backImage: {
        width: 76,
        height: 76,
    },
    goodTouch: {
        width: 106,
        height: 146,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        overflow: 'visible',
    },
    goodImage: {
        width: 98,
        height: 138,
    },
});
