"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioCompletedSparkIcon = FolioCompletedSparkIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioCompletedSparkIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 30 : _b, _c = _a.color, color = _c === void 0 ? '#24725C' : _c, _d = _a.secondaryColor, secondaryColor = _d === void 0 ? '#83D3A6' : _d, _e = _a.strokeWidth, strokeWidth = _e === void 0 ? 2.6 : _e;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 32 32" fill="none">
      <react_native_svg_1.Path d="M16 5.8C15.8 10.1 16 14.1 16.1 18.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M8.2 16C12.8 15.7 17.1 15.9 21.6 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M11.1 10.9C13.6 13.2 16.1 15.9 18.5 18.7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M20.4 8.9C18.4 11.1 16.4 13.3 14.3 15.6" stroke={secondaryColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Circle cx="23.7" cy="22.6" r="2" fill={secondaryColor}/>
      <react_native_svg_1.Circle cx="7.5" cy="23.8" r="1.5" fill={secondaryColor}/>
    </react_native_svg_1.default>);
}
