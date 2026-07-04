"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioPlusIcon = FolioPlusIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioPlusIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 26 : _b, _c = _a.color, color = _c === void 0 ? '#2F5FB8' : _c, _d = _a.strokeWidth, strokeWidth = _d === void 0 ? 3.5 : _d;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 32 32" fill="none">
      <react_native_svg_1.Path d="M16 7.2C16.1 13.1 15.9 18.9 16.2 24.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M7.3 16.2C13 15.8 18.9 16 24.7 15.9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </react_native_svg_1.default>);
}
