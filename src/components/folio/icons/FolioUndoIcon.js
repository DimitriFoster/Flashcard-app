"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioUndoIcon = FolioUndoIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioUndoIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 28 : _b, _c = _a.color, color = _c === void 0 ? '#7651B2' : _c, _d = _a.strokeWidth, strokeWidth = _d === void 0 ? 3.2 : _d;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 32 32" fill="none">
      <react_native_svg_1.Path d="M13.4 8.1C9.8 9.2 7.4 12.1 7.2 15.8C6.9 20.6 10.5 24.1 15.6 24.1C19.2 24.1 22.3 22.3 23.7 19.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <react_native_svg_1.Path d="M13.3 8.2C11.9 7.8 10.5 7.6 8.9 7.6C9.8 9.1 10.6 10.5 11.4 12.1" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </react_native_svg_1.default>);
}
