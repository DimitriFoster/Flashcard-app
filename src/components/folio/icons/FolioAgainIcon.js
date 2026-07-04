"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioAgainIcon = FolioAgainIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioAgainIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 28 : _b, _c = _a.color, color = _c === void 0 ? '#B97512' : _c, _d = _a.strokeWidth, strokeWidth = _d === void 0 ? 3.1 : _d;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 32 32" fill="none">
      <react_native_svg_1.Path d="M21.9 8.8C18.3 7.1 13.4 7.8 10.8 11.1C8.3 14.2 8.7 19.4 11.7 22C14.3 24.2 18.6 24.4 21.7 22.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M21.6 8.7C19.7 8.4 18 8.5 16.1 8.9C17.5 10.2 18.7 11.5 19.8 13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </react_native_svg_1.default>);
}
