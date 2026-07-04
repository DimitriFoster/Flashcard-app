"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemedText = ThemedText;
/**
 * ThemedText wraps React Native Text with app typography presets.
 *
 * This is useful for shared template components and any future screens that need
 * light/dark-aware text without repeating style logic.
 */
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var use_theme_1 = require("@/hooks/use-theme");
function ThemedText(_a) {
    var style = _a.style, _b = _a.type, type = _b === void 0 ? 'default' : _b, themeColor = _a.themeColor, rest = __rest(_a, ["style", "type", "themeColor"]);
    var theme = (0, use_theme_1.useTheme)();
    return (<react_native_1.Text style={[
            { color: theme[themeColor !== null && themeColor !== void 0 ? themeColor : 'text'] },
            type === 'default' && styles.default,
            type === 'title' && styles.title,
            type === 'small' && styles.small,
            type === 'smallBold' && styles.smallBold,
            type === 'subtitle' && styles.subtitle,
            type === 'link' && styles.link,
            type === 'linkPrimary' && styles.linkPrimary,
            type === 'code' && styles.code,
            style,
        ]} {...rest}/>);
}
var styles = react_native_1.StyleSheet.create({
    small: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: 500,
    },
    smallBold: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: 700,
    },
    default: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: 500,
    },
    title: {
        fontSize: 48,
        fontWeight: 600,
        lineHeight: 52,
    },
    subtitle: {
        fontSize: 32,
        lineHeight: 44,
        fontWeight: 600,
    },
    link: {
        lineHeight: 30,
        fontSize: 14,
    },
    linkPrimary: {
        lineHeight: 30,
        fontSize: 14,
        color: '#3c87f7',
    },
    code: {
        fontFamily: theme_1.Fonts.mono,
        fontWeight: (_a = react_native_1.Platform.select({ android: 700 })) !== null && _a !== void 0 ? _a : 500,
        fontSize: 12,
    },
});
