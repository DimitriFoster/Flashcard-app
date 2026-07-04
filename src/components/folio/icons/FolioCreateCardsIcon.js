"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioCreateCardsIcon = FolioCreateCardsIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioCreateCardsIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 44 : _b, _c = _a.color, color = _c === void 0 ? '#24725C' : _c, _d = _a.secondaryColor, secondaryColor = _d === void 0 ? '#83D3A6' : _d, _e = _a.strokeWidth, strokeWidth = _e === void 0 ? 2.7 : _e;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 64 64" fill="none">
      <react_native_svg_1.Path d="M19.2 17.8C28.2 15.8 38.2 16.4 46 19C46.9 28.8 46.3 39.9 43.8 47C35.3 48.4 25.1 48.1 17.5 45.7C16.1 37 16.5 26.3 19.2 17.8Z" stroke={secondaryColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <react_native_svg_1.Path d="M31.1 35.4C33.5 33.2 36.6 29.8 40.8 24.9C39.9 23.6 38.9 22.7 37.3 22.2C33.7 26.1 30.5 29.6 27.8 32.8C27.3 34.1 26.8 35.7 26.4 37.4C28.2 36.9 29.8 36.3 31.1 35.4Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <react_native_svg_1.Path d="M26.4 42.8C31.8 42.5 36.1 42.2 41.4 41.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </react_native_svg_1.default>);
}
