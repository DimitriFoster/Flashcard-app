"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioCardStarIcon = FolioCardStarIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioCardStarIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 28 : _b, _c = _a.color, color = _c === void 0 ? '#91B8FF' : _c, _d = _a.strokeWidth, strokeWidth = _d === void 0 ? 3.1 : _d;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 32 32" fill="none">
      <react_native_svg_1.Path d="M16 5.8C15.9 12.6 16 19 16.2 25.7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M6.8 16.1C12.8 15.9 19.3 16.1 25.3 15.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M9.8 9.1C13.8 13.1 18.4 18.2 22.5 22.9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M22.5 9.2C18.5 13.7 13.8 18.2 9.5 22.7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </react_native_svg_1.default>);
}
