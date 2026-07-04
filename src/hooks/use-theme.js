"use strict";
/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTheme = useTheme;
var theme_1 = require("@/constants/theme");
var use_color_scheme_1 = require("@/hooks/use-color-scheme");
function useTheme() {
    var scheme = (0, use_color_scheme_1.useColorScheme)();
    var theme = scheme === 'unspecified' ? 'light' : scheme;
    return theme_1.Colors[theme];
}
