"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collapsible = Collapsible;
/**
 * Generic collapsible section component.
 *
 * This is a template-style utility component that demonstrates local open/close
 * state and a small enter animation.
 */
var expo_symbols_1 = require("expo-symbols");
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_reanimated_1 = require("react-native-reanimated");
var themed_text_1 = require("@/components/themed-text");
var themed_view_1 = require("@/components/themed-view");
var theme_1 = require("@/constants/theme");
var use_theme_1 = require("@/hooks/use-theme");
function Collapsible(_a) {
    var children = _a.children, title = _a.title;
    var _b = (0, react_1.useState)(false), isOpen = _b[0], setIsOpen = _b[1];
    var theme = (0, use_theme_1.useTheme)();
    return (<themed_view_1.ThemedView>
      <react_native_1.Pressable style={function (_a) {
        var pressed = _a.pressed;
        return [styles.heading, pressed && styles.pressedHeading];
    }} onPress={function () { return setIsOpen(function (value) { return !value; }); }}>
        <themed_view_1.ThemedView type="backgroundElement" style={styles.button}>
          <expo_symbols_1.SymbolView name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} size={14} weight="bold" tintColor={theme.text} style={{ transform: [{ rotate: isOpen ? '-90deg' : '90deg' }] }}/>
        </themed_view_1.ThemedView>

        <themed_text_1.ThemedText type="small">{title}</themed_text_1.ThemedText>
      </react_native_1.Pressable>
      {isOpen && (<react_native_reanimated_1.default.View entering={react_native_reanimated_1.FadeIn.duration(200)}>
          <themed_view_1.ThemedView type="backgroundElement" style={styles.content}>
            {children}
          </themed_view_1.ThemedView>
        </react_native_reanimated_1.default.View>)}
    </themed_view_1.ThemedView>);
}
var styles = react_native_1.StyleSheet.create({
    heading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme_1.Spacing.two,
    },
    pressedHeading: {
        opacity: 0.7,
    },
    button: {
        width: theme_1.Spacing.four,
        height: theme_1.Spacing.four,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        marginTop: theme_1.Spacing.three,
        borderRadius: theme_1.Spacing.three,
        marginLeft: theme_1.Spacing.four,
        padding: theme_1.Spacing.four,
    },
});
