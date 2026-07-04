"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomePanelFill = HomePanelFill;
var react_1 = require("react");
var react_native_1 = require("react-native");
function HomePanelFill(_a) {
    var source = _a.source, _b = _a.opacity, opacity = _b === void 0 ? 1 : _b;
    return (<react_native_1.Image pointerEvents="none" source={source} resizeMode="cover" fadeDuration={0} style={[styles.fill, { opacity: opacity }]}/>);
}
var styles = react_native_1.StyleSheet.create({
    fill: __assign(__assign({}, react_native_1.StyleSheet.absoluteFillObject), { width: undefined, height: undefined }),
});
