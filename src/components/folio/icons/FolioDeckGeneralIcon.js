"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioDeckGeneralIcon = FolioDeckGeneralIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioDeckGeneralIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 44 : _b, _c = _a.color, color = _c === void 0 ? '#2F5FB8' : _c, _d = _a.secondaryColor, secondaryColor = _d === void 0 ? '#E8B747' : _d, _e = _a.strokeWidth, strokeWidth = _e === void 0 ? 2.6 : _e;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 64 64" fill="none">
      <react_native_svg_1.Path d="M20 14C28.5 12.5 38.6 12.9 47.5 15.2C48.8 25.3 48.3 37.3 46 48.6C37 50.7 27.1 50.2 18.4 47.4C17.1 36.9 17.6 24.5 20 14Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <react_native_svg_1.Path d="M27.6 22.4C31.8 22 36.2 22 40.4 22.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M27.5 30.7C32.7 30.2 37.7 30.4 42.3 30.9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M32.2 36.2L34.3 40.2L38.8 40.7L35.5 43.7L36.3 48.1L32.2 45.9L28.3 48.2L29.1 43.7L25.8 40.8L30.2 40.2L32.2 36.2Z" stroke={secondaryColor} strokeWidth={strokeWidth} strokeLinejoin="round"/>
    </react_native_svg_1.default>);
}
