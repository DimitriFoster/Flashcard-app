"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioEditIcon = FolioEditIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioEditIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 28 : _b, _c = _a.color, color = _c === void 0 ? '#24725C' : _c, _d = _a.strokeWidth, strokeWidth = _d === void 0 ? 3 : _d;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 32 32" fill="none">
      <react_native_svg_1.Path d="M8.3 22.8C10.2 22.3 12.2 21.7 14.1 21.2C17.9 17.5 21.2 13.7 24.8 9.5C24 8.4 23.1 7.6 21.9 7.1C18.4 10.7 14.6 14.5 10.8 18.5C10 20 9.1 21.4 8.3 22.8Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <react_native_svg_1.Path d="M18.8 10.3C20.4 11.1 21.6 12.2 22.6 13.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M7.4 25.4C10.5 24.9 13.5 24.2 16.5 23.6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </react_native_svg_1.default>);
}
