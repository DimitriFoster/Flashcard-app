"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioHardIcon = FolioHardIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioHardIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 28 : _b, _c = _a.color, color = _c === void 0 ? '#D15A4C' : _c, _d = _a.strokeWidth, strokeWidth = _d === void 0 ? 3.4 : _d;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 32 32" fill="none">
      <react_native_svg_1.Path d="M7.4 11.3C11.5 10.6 15.7 9.8 20.2 9.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M10.5 16C15.1 15.2 19.8 14.4 24.4 14.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M8.2 20.8C12.8 21.1 17.3 20.7 22.3 19.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </react_native_svg_1.default>);
}
