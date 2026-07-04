"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioDeckLanguageIcon = FolioDeckLanguageIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioDeckLanguageIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 44 : _b, _c = _a.color, color = _c === void 0 ? '#B97512' : _c, _d = _a.secondaryColor, secondaryColor = _d === void 0 ? '#2F5FB8' : _d, _e = _a.strokeWidth, strokeWidth = _e === void 0 ? 2.8 : _e;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 64 64" fill="none">
      <react_native_svg_1.Path d="M14 18C23.8 15.6 39.4 15.8 49 18.3C50.5 25.9 50.2 35.3 48.4 42.8C40.6 44.8 26 44.7 17.3 42.6C15.7 46.1 13.5 48.6 10.5 50.5C11.6 46.6 12.3 42.9 12.6 39.4C11.7 32.6 12 24.6 14 18Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <react_native_svg_1.Text x="31.5" y="36" textAnchor="middle" fontSize="17" fontWeight="900" fill={color}>hi</react_native_svg_1.Text>
      <react_native_svg_1.Path d="M43.4 24.6L43.7 24.6" stroke={secondaryColor} strokeWidth={strokeWidth + 1.2} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M43.6 30.3L43.6 38" stroke={secondaryColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </react_native_svg_1.default>);
}
