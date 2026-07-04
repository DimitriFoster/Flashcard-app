"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioStatsIcon = FolioStatsIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioStatsIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 44 : _b, _c = _a.color, color = _c === void 0 ? '#A36B10' : _c, _d = _a.strokeWidth, strokeWidth = _d === void 0 ? 2.8 : _d;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 64 64" fill="none">
      <react_native_svg_1.Path d="M15 50C26.7 50.7 38.6 50.6 50.2 49.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M21 44C21.3 38.9 21.4 33.4 21.1 28.6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M32 44C32.1 34.4 32.2 25.9 32 17.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M43 44C43.3 37 43.2 30.3 43 24.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </react_native_svg_1.default>);
}
