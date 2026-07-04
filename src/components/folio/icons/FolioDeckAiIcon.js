"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioDeckAiIcon = FolioDeckAiIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioDeckAiIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 44 : _b, _c = _a.color, color = _c === void 0 ? '#2F5FB8' : _c, _d = _a.secondaryColor, secondaryColor = _d === void 0 ? '#91B8FF' : _d, _e = _a.strokeWidth, strokeWidth = _e === void 0 ? 2.6 : _e;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 64 64" fill="none">
      <react_native_svg_1.Path d="M14 18C25 17.2 38 17.5 50 18" stroke={secondaryColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M14 46C25 45.2 38 45.5 50 46" stroke={secondaryColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M19 32C27 31.8 37 31.9 45 32" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Circle cx="13" cy="18" r="4" fill={secondaryColor}/>
      <react_native_svg_1.Circle cx="51" cy="18" r="4" fill={secondaryColor}/>
      <react_native_svg_1.Circle cx="19" cy="46" r="4" fill={secondaryColor}/>
      <react_native_svg_1.Circle cx="45" cy="46" r="4" fill={secondaryColor}/>
      <react_native_svg_1.Text x="32" y="38" textAnchor="middle" fontSize="21" fontWeight="900" fill={color}>AI</react_native_svg_1.Text>
    </react_native_svg_1.default>);
}
