"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioSearchIcon = FolioSearchIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioSearchIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 26 : _b, _c = _a.color, color = _c === void 0 ? '#2F5FB8' : _c, _d = _a.strokeWidth, strokeWidth = _d === void 0 ? 3 : _d;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 32 32" fill="none">
      <react_native_svg_1.Circle cx="14.2" cy="14" r="6.5" stroke={color} strokeWidth={strokeWidth}/>
      <react_native_svg_1.Path d="M19.2 19.1C21.2 21 23.1 23.1 25 25.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </react_native_svg_1.default>);
}
