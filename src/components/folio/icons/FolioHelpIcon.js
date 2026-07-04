"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioHelpIcon = FolioHelpIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioHelpIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 30 : _b, _c = _a.color, color = _c === void 0 ? '#2F5FB8' : _c, _d = _a.strokeWidth, strokeWidth = _d === void 0 ? 3.4 : _d;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 32 32" fill="none">
      <react_native_svg_1.Path d="M10.4 11.1C11.1 7.9 13.5 6.2 16.7 6.3C20.3 6.4 22.4 8.5 22.1 11.5C21.8 14.6 18.8 15.5 17.2 17.4C16.2 18.6 16.1 19.5 16.1 20.7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <react_native_svg_1.Path d="M16 25.2L16.2 25.2" stroke={color} strokeWidth={strokeWidth + 1.2} strokeLinecap="round"/>
    </react_native_svg_1.default>);
}
