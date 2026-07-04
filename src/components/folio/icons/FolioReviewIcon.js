"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioReviewIcon = FolioReviewIcon;
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
function FolioReviewIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 44 : _b, _c = _a.color, color = _c === void 0 ? '#2F5FB8' : _c, _d = _a.secondaryColor, secondaryColor = _d === void 0 ? '#91B8FF' : _d, _e = _a.strokeWidth, strokeWidth = _e === void 0 ? 2.7 : _e;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 64 64" fill="none">
      <react_native_svg_1.Path d="M22 18C29.9 15.5 40.6 16.7 46.2 23.2C52.1 30.1 49.4 41 41.5 45.4C34.1 49.5 24.3 46.8 20.2 39.3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <react_native_svg_1.Path d="M22 18C24.9 17.4 27.8 17.2 30.9 17.6C28.7 20.2 27.1 22.8 25.7 26" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <react_native_svg_1.Path d="M27.4 31.8C30.3 34.2 33.2 36.6 36 39.3C39.1 34.8 41.7 30.8 44.2 26.4" stroke={secondaryColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </react_native_svg_1.default>);
}
