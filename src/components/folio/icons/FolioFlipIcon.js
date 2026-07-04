"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioFlipIcon = FolioFlipIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioFlipIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 26 : _b, _c = _a.color, color = _c === void 0 ? '#2F5FB8' : _c, _d = _a.strokeWidth, strokeWidth = _d === void 0 ? 2.8 : _d;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 32 32" fill="none">
      <react_native_svg_1.Path d="M10.2 10.5C13.8 7.5 19.5 8.1 22.1 11.7C23.8 14.1 23.8 17.3 22.5 19.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M21.2 20.9C17.6 24 11.8 23.4 9.3 19.7C7.7 17.2 7.7 14.4 9.1 11.9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M10 10.4C12.1 10.1 13.6 9.8 15.4 9.1C14.3 10.9 13.5 12.5 12.7 14.3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <react_native_svg_1.Path d="M21.4 21.1C19.4 21.4 17.8 21.8 16.1 22.5C17.1 20.9 17.9 19.2 18.8 17.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </react_native_svg_1.default>);
}
