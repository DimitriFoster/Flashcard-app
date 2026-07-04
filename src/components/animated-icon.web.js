"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimatedSplashOverlay = AnimatedSplashOverlay;
exports.AnimatedIcon = AnimatedIcon;
/**
 * Web version of the animated splash/icon overlay.
 */
var expo_image_1 = require("expo-image");
var react_native_1 = require("react-native");
var react_native_reanimated_1 = require("react-native-reanimated");
var animated_icon_module_css_1 = require("./animated-icon.module.css");
var DURATION = 300;
function AnimatedSplashOverlay() {
    return null;
}
var keyframe = new react_native_reanimated_1.Keyframe({
    0: {
        transform: [{ scale: 0 }],
    },
    60: {
        transform: [{ scale: 1.2 }],
        easing: react_native_reanimated_1.Easing.elastic(1.2),
    },
    100: {
        transform: [{ scale: 1 }],
        easing: react_native_reanimated_1.Easing.elastic(1.2),
    },
});
var logoKeyframe = new react_native_reanimated_1.Keyframe({
    0: {
        opacity: 0,
    },
    60: {
        transform: [{ scale: 1.2 }],
        opacity: 0,
        easing: react_native_reanimated_1.Easing.elastic(1.2),
    },
    100: {
        transform: [{ scale: 1 }],
        opacity: 1,
        easing: react_native_reanimated_1.Easing.elastic(1.2),
    },
});
var glowKeyframe = new react_native_reanimated_1.Keyframe((_a = {
        0: {
            transform: [{ rotateZ: '-180deg' }, { scale: 0.8 }],
            opacity: 0,
        }
    },
    _a[DURATION / 1000] = {
        transform: [{ rotateZ: '0deg' }, { scale: 1 }],
        opacity: 1,
        easing: react_native_reanimated_1.Easing.elastic(0.7),
    },
    _a[100] = {
        transform: [{ rotateZ: '7200deg' }],
    },
    _a));
function AnimatedIcon() {
    return (<react_native_1.View style={styles.iconContainer}>
      <react_native_reanimated_1.default.View entering={glowKeyframe.duration(60 * 1000 * 4)} style={styles.glow}>
        <expo_image_1.Image style={styles.glow} source={require('@/assets/images/logo-glow.png')}/>
      </react_native_reanimated_1.default.View>

      <react_native_reanimated_1.default.View style={styles.background} entering={keyframe.duration(DURATION)}>
        <div className={animated_icon_module_css_1.default.expoLogoBackground}/>
      </react_native_reanimated_1.default.View>

      <react_native_reanimated_1.default.View style={styles.imageContainer} entering={logoKeyframe.duration(DURATION)}>
        <expo_image_1.Image style={styles.image} source={require('@/assets/images/expo-logo.png')}/>
      </react_native_reanimated_1.default.View>
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        zIndex: 1000,
        position: 'absolute',
        top: 128 / 2 + 138,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    glow: {
        width: 201,
        height: 201,
        position: 'absolute',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 128,
        height: 128,
    },
    image: {
        position: 'absolute',
        width: 76,
        height: 71,
    },
    background: {
        width: 128,
        height: 128,
        position: 'absolute',
    },
});
