"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioAssetButton = FolioAssetButton;
var react_1 = require("react");
var react_native_1 = require("react-native");
function FolioAssetButton(_a) {
    var source = _a.source, accessibilityLabel = _a.accessibilityLabel, onPress = _a.onPress, style = _a.style, imageStyle = _a.imageStyle, disabled = _a.disabled;
    return (<react_native_1.Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} disabled={disabled} hitSlop={8} onPress={onPress} style={function (_a) {
            var pressed = _a.pressed;
            return [
                styles.pressable,
                style,
                pressed && !disabled ? styles.pressed : null,
                disabled ? styles.disabled : null,
            ];
        }}>
      <react_native_1.Image source={source} resizeMode="contain" style={[styles.image, imageStyle]}/>
    </react_native_1.Pressable>);
}
var styles = react_native_1.StyleSheet.create({
    pressable: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
    },
    image: {
        height: '100%',
        overflow: 'visible',
        width: '100%',
    },
    pressed: {
        transform: [{ scale: 0.97 }, { translateY: 1 }],
    },
    disabled: {
        opacity: 1,
    },
});
