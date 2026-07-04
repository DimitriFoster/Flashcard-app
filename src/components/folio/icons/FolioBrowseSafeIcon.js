"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioBrowseSafeIcon = FolioBrowseSafeIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioBrowseSafeIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 26 : _b, _c = _a.color, color = _c === void 0 ? '#24725C' : _c, _d = _a.strokeWidth, strokeWidth = _d === void 0 ? 2.8 : _d;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 32 32" fill="none">
      <react_native_svg_1.Path d="M8.1 17.1C10.3 19.2 12.5 21.1 14.7 23.2C18.4 18.3 21.6 13.8 24.6 8.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <react_native_svg_1.Path d="M7.9 23.4C13.3 25.4 19.6 25.1 24.4 22.8" stroke={color} strokeWidth={strokeWidth - 0.6} strokeLinecap="round" opacity={0.55}/>
    </react_native_svg_1.default>);
}
