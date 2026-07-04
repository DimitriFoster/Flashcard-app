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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemedView = ThemedView;
/**
 * ThemedView wraps React Native View with light/dark background colors.
 */
var react_native_1 = require("react-native");
var use_theme_1 = require("@/hooks/use-theme");
function ThemedView(_a) {
    var style = _a.style, lightColor = _a.lightColor, darkColor = _a.darkColor, type = _a.type, otherProps = __rest(_a, ["style", "lightColor", "darkColor", "type"]);
    var theme = (0, use_theme_1.useTheme)();
    return <react_native_1.View style={[{ backgroundColor: theme[type !== null && type !== void 0 ? type : 'background'] }, style]} {...otherProps}/>;
}
