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
exports.AnimatedSplashOverlay = AnimatedSplashOverlay;
exports.AnimatedIcon = AnimatedIcon;
/**
 * Native animated splash/icon overlay.
 */
var expo_image_1 = require("expo-image");
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_reanimated_1 = require("react-native-reanimated");
var react_native_worklets_1 = require("react-native-worklets");
var INITIAL_SCALE_FACTOR = react_native_1.Dimensions.get('screen').height / 90;
var DURATION = 600;
function AnimatedSplashOverlay() {
    var _a = (0, react_1.useState)(true), visible = _a[0], setVisible = _a[1];
    if (!visible)
        return null;
    var splashKeyframe = new react_native_reanimated_1.Keyframe({
        0: {
            transform: [{ scale: INITIAL_SCALE_FACTOR }],
            opacity: 1,
        },
        20: {
            opacity: 1,
        },
        70: {
            opacity: 0,
            easing: react_native_reanimated_1.Easing.elastic(0.7),
        },
        100: {
            opacity: 0,
            transform: [{ scale: 1 }],
            easing: react_native_reanimated_1.Easing.elastic(0.7),
        },
    });
    return (<react_native_reanimated_1.default.View entering={splashKeyframe.duration(DURATION).withCallback(function (finished) {
            'worklet';
            if (finished) {
                (0, react_native_worklets_1.scheduleOnRN)(setVisible, false);
            }
        })} style={styles.backgroundSolidColor}/>);
}
var keyframe = new react_native_reanimated_1.Keyframe({
    0: {
        transform: [{ scale: INITIAL_SCALE_FACTOR }],
    },
    100: {
        transform: [{ scale: 1 }],
        easing: react_native_reanimated_1.Easing.elastic(0.7),
    },
});
var logoKeyframe = new react_native_reanimated_1.Keyframe({
    0: {
        transform: [{ scale: 1.3 }],
        opacity: 0,
    },
    40: {
        transform: [{ scale: 1.3 }],
        opacity: 0,
        easing: react_native_reanimated_1.Easing.elastic(0.7),
    },
    100: {
        opacity: 1,
        transform: [{ scale: 1 }],
        easing: react_native_reanimated_1.Easing.elastic(0.7),
    },
});
var glowKeyframe = new react_native_reanimated_1.Keyframe({
    0: {
        transform: [{ rotateZ: '0deg' }],
    },
    100: {
        transform: [{ rotateZ: '7200deg' }],
    },
});
function AnimatedIcon() {
    return (<react_native_1.View style={styles.iconContainer}>
      <react_native_reanimated_1.default.View entering={glowKeyframe.duration(60 * 1000 * 4)} style={styles.glow}>
        <expo_image_1.Image style={styles.glow} source={require('@/assets/images/logo-glow.png')}/>
      </react_native_reanimated_1.default.View>

      <react_native_reanimated_1.default.View entering={keyframe.duration(DURATION)} style={styles.background}/>
      <react_native_reanimated_1.default.View style={styles.imageContainer} entering={logoKeyframe.duration(DURATION)}>
        <expo_image_1.Image style={styles.image} source={require('@/assets/images/expo-logo.png')}/>
      </react_native_reanimated_1.default.View>
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
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
        zIndex: 100,
    },
    image: {
        position: 'absolute',
        width: 76,
        height: 71,
    },
    background: {
        borderRadius: 40,
        experimental_backgroundImage: "linear-gradient(180deg, #3C9FFE, #0274DF)",
        width: 128,
        height: 128,
        position: 'absolute',
    },
    backgroundSolidColor: __assign(__assign({}, react_native_1.StyleSheet.absoluteFillObject), { backgroundColor: '#208AEF', zIndex: 1000 }),
});
