"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioGoodIcon = FolioGoodIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioGoodIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 28 : _b, _c = _a.color, color = _c === void 0 ? '#2F5FB8' : _c, _d = _a.strokeWidth, strokeWidth = _d === void 0 ? 2.7 : _d;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 32 32" fill="none">
      <react_native_svg_1.Circle cx="16" cy="16" r="10" stroke={color} strokeWidth={strokeWidth}/>
      <react_native_svg_1.Path d="M11.7 14.3L11.9 14.3" stroke={color} strokeWidth={strokeWidth + 0.8} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M20.1 14.3L20.3 14.3" stroke={color} strokeWidth={strokeWidth + 0.8} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M11.8 19.2C14.2 21.3 18 21.4 20.6 19.1" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </react_native_svg_1.default>);
}
