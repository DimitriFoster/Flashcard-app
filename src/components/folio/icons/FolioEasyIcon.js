"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioEasyIcon = FolioEasyIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioEasyIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 28 : _b, _c = _a.color, color = _c === void 0 ? '#24725C' : _c, _d = _a.strokeWidth, strokeWidth = _d === void 0 ? 3.2 : _d;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 32 32" fill="none">
      <react_native_svg_1.Path d="M16.1 5.8C15.9 12.3 16 18.7 16.1 25.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M6.4 16C13.1 15.9 19.2 16 25.6 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M9.2 9.2C13.4 13.2 18.5 18.5 22.8 22.9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M22.8 9.2C18.2 13.6 13.8 18.1 9.2 22.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </react_native_svg_1.default>);
}
