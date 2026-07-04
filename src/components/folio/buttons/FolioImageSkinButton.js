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
exports.FolioImageSkinButton = FolioImageSkinButton;
var react_1 = require("react");
var react_native_1 = require("react-native");
var icons_1 = require("@/components/folio/icons");
function FolioImageSkinButton(_a) {
    var backgroundSource = _a.backgroundSource, accessibilityLabel = _a.accessibilityLabel, onPress = _a.onPress, _b = _a.disabled, disabled = _b === void 0 ? false : _b, iconName = _a.iconName, _c = _a.iconColor, iconColor = _c === void 0 ? '#2E281F' : _c, _d = _a.iconSize, iconSize = _d === void 0 ? 30 : _d, label = _a.label, hint = _a.hint, labelStyle = _a.labelStyle, hintStyle = _a.hintStyle, shellStyle = _a.shellStyle, faceStyle = _a.faceStyle, contentStyle = _a.contentStyle, imageStyle = _a.imageStyle;
    var pressProgress = react_1.default.useRef(new react_native_1.Animated.Value(0)).current;
    var animateTo = react_1.default.useCallback(function (toValue) {
        react_native_1.Animated.spring(pressProgress, {
            toValue: toValue,
            speed: 34,
            bounciness: toValue === 1 ? 0 : 7,
            useNativeDriver: true,
        }).start();
    }, [pressProgress]);
    var animatedStyle = react_1.default.useMemo(function () { return ({
        transform: [
            {
                translateY: pressProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 2],
                }),
            },
            {
                scale: pressProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.965],
                }),
            },
        ],
    }); }, [pressProgress]);
    return (<react_native_1.Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} accessibilityState={{ disabled: disabled }} android_disableSound disabled={disabled} hitSlop={6} onPress={onPress} onPressIn={function () { return animateTo(1); }} onPressOut={function () { return animateTo(0); }} style={[styles.shell, shellStyle, disabled && styles.disabled]}>
      <react_native_1.Animated.View style={[styles.lift, animatedStyle]}>
        <react_native_1.View style={[styles.face, faceStyle]}>
          <react_native_1.View pointerEvents="none" style={styles.backgroundLayer}>
            <react_native_1.Image source={backgroundSource} resizeMode="stretch" fadeDuration={0} style={[styles.backgroundImage, imageStyle]}/>
          </react_native_1.View>

          <react_native_1.View style={[styles.content, contentStyle]}>
            {iconName ? <icons_1.FolioSvgIcon name={iconName} size={iconSize} color={iconColor}/> : null}

            {label ? (<react_native_1.Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78} style={[styles.label, { color: iconColor }, labelStyle]}>
                {label}
              </react_native_1.Text>) : null}

            {hint ? (<react_native_1.Text numberOfLines={1} style={[styles.hint, { color: iconColor }, hintStyle]}>
                {hint}
              </react_native_1.Text>) : null}
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.Animated.View>
    </react_native_1.Pressable>);
}
var styles = react_native_1.StyleSheet.create({
    shell: {
        overflow: 'visible',
        shadowColor: '#2B2118',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    lift: {
        flex: 1,
    },
    face: {
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundLayer: __assign({}, react_native_1.StyleSheet.absoluteFillObject),
    backgroundImage: __assign({}, react_native_1.StyleSheet.absoluteFillObject),
    content: {
        position: 'relative',
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        paddingHorizontal: 6,
    },
    label: {
        fontSize: 18,
        lineHeight: 22,
        fontWeight: '900',
        textAlign: 'center',
    },
    hint: {
        fontSize: 12,
        lineHeight: 15,
        fontWeight: '800',
        textAlign: 'center',
        opacity: 0.82,
    },
    disabled: {
        opacity: 0.52,
    },
});
