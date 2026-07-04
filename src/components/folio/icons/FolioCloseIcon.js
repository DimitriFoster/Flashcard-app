"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioCloseIcon = FolioCloseIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioCloseIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 24 : _b, _c = _a.color, color = _c === void 0 ? '#2E281F' : _c, _d = _a.strokeWidth, strokeWidth = _d === void 0 ? 3 : _d;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 32 32" fill="none">
      <react_native_svg_1.Path d="M8.4 8.8C13.1 13.4 18.2 18.2 23.4 23.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M23.4 8.9C18.8 13.5 14.1 18.1 8.7 23.3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </react_native_svg_1.default>);
}
