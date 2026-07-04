"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioTrashIcon = FolioTrashIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioTrashIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 26 : _b, _c = _a.color, color = _c === void 0 ? '#D15A4C' : _c, _d = _a.strokeWidth, strokeWidth = _d === void 0 ? 2.8 : _d;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 32 32" fill="none">
      <react_native_svg_1.Path d="M8.4 10.2C13.8 9.9 19.1 9.9 24.2 10.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M13.1 8.4C15.1 7.8 17.1 7.8 19 8.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M10.6 12.7C10.9 17.3 11.2 21.6 11.7 25.2C14.6 26.1 18.3 26.1 21.1 25.2C21.7 21 22 16.6 22.4 12.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <react_native_svg_1.Path d="M15 14.6C15.1 17.2 15.1 19.9 15.2 22.4" stroke={color} strokeWidth={strokeWidth - 0.6} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M18.4 14.6C18.4 17.2 18.2 19.8 18.1 22.4" stroke={color} strokeWidth={strokeWidth - 0.6} strokeLinecap="round"/>
    </react_native_svg_1.default>);
}
