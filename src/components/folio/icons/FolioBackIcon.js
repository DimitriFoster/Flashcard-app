"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioBackIcon = FolioBackIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioBackIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 28 : _b, _c = _a.color, color = _c === void 0 ? '#2E281F' : _c, _d = _a.strokeWidth, strokeWidth = _d === void 0 ? 4.4 : _d;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 32 32" fill="none">
      <react_native_svg_1.Path d="M20.6 6.8C16.8 9.2 13.4 12.2 9.5 16C13.2 19.6 16.9 22.6 21.8 25.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <react_native_svg_1.Path d="M10.8 16.2C15.1 16.2 20.2 15.8 25.2 15.9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </react_native_svg_1.default>);
}
