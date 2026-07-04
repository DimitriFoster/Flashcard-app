"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioDeckProgrammingIcon = FolioDeckProgrammingIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioDeckProgrammingIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 44 : _b, _c = _a.color, color = _c === void 0 ? '#24725C' : _c, _d = _a.secondaryColor, secondaryColor = _d === void 0 ? '#91B8FF' : _d, _e = _a.strokeWidth, strokeWidth = _e === void 0 ? 2.8 : _e;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 64 64" fill="none">
      <react_native_svg_1.Path d="M14 14C24.5 12.8 39.6 13.1 50 14.5C51.5 25.3 51.2 39.2 49.7 49.8C38.8 51.1 25.2 51.2 14.3 49.7C12.8 38.9 12.9 25.3 14 14Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <react_native_svg_1.Text x="32" y="39" textAnchor="middle" fontSize="18" fontWeight="900" fill={color}>{'<>'}</react_native_svg_1.Text>
      <react_native_svg_1.Path d="M20.5 22.4C27.5 21.8 36.2 21.9 43.4 22.4" stroke={secondaryColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </react_native_svg_1.default>);
}
