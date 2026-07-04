"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioSettingsIcon = FolioSettingsIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioSettingsIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 28 : _b, _c = _a.color, color = _c === void 0 ? '#756B5E' : _c, _d = _a.strokeWidth, strokeWidth = _d === void 0 ? 2.6 : _d;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 32 32" fill="none">
      <react_native_svg_1.Circle cx="16" cy="16" r="3.4" stroke={color} strokeWidth={strokeWidth}/>
      <react_native_svg_1.Path d="M16 6.4L16.2 9.4M16 22.6L16.1 25.6M6.4 16L9.5 16.1M22.5 15.9L25.6 16M9.2 9.3L11.3 11.4M20.8 20.7L23 22.8M22.7 9.3L20.6 11.3M11.4 20.7L9.1 22.9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </react_native_svg_1.default>);
}
