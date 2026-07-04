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
exports.CrayonFill = CrayonFill;
/**
 * CrayonFill.
 *
 * Uses actual transparent PNG texture assets instead of pseudo-generated View
 * strokes. This makes the colored areas feel hand-filled rather than
 * decorated with a few overlay lines.
 */
var react_1 = require("react");
var react_native_1 = require("react-native");
var design_1 = require("@/constants/design");
var TONES = {
    create: { wash: design_1.COLORS.createPaper },
    review: { wash: design_1.COLORS.reviewPaper },
    note: { wash: design_1.COLORS.notePaper },
    warning: { wash: design_1.COLORS.warningSoft },
    danger: { wash: design_1.COLORS.dangerSoft },
};
var TEXTURES = {
    create: {
        loose: require('../../../assets/images/crayon/create-loose.png'),
        tight: require('../../../assets/images/crayon/create-tight.png'),
        dense: require('../../../assets/images/crayon/create-dense.png'),
    },
    review: {
        loose: require('../../../assets/images/crayon/review-loose.png'),
        tight: require('../../../assets/images/crayon/review-tight.png'),
        dense: require('../../../assets/images/crayon/review-dense.png'),
    },
    note: {
        loose: require('../../../assets/images/crayon/warning-loose.png'),
        tight: require('../../../assets/images/crayon/warning-tight.png'),
        dense: require('../../../assets/images/crayon/warning-dense.png'),
    },
    warning: {
        loose: require('../../../assets/images/crayon/warning-loose.png'),
        tight: require('../../../assets/images/crayon/warning-tight.png'),
        dense: require('../../../assets/images/crayon/warning-dense.png'),
    },
    danger: {
        loose: require('../../../assets/images/crayon/danger-loose.png'),
        tight: require('../../../assets/images/crayon/danger-tight.png'),
        dense: require('../../../assets/images/crayon/danger-dense.png'),
    },
};
function getDefaultVariant(tone) {
    switch (tone) {
        case 'note':
        case 'warning':
        case 'danger':
            return 'dense';
        case 'review':
            return 'tight';
        case 'create':
        default:
            return 'loose';
    }
}
function CrayonFill(_a) {
    var _b = _a.tone, tone = _b === void 0 ? 'create' : _b, variant = _a.variant, _c = _a.opacity, opacity = _c === void 0 ? 1 : _c, style = _a.style;
    var resolvedVariant = variant !== null && variant !== void 0 ? variant : getDefaultVariant(tone);
    return (<react_native_1.View pointerEvents="none" style={[styles.fill, style]}>
      <react_native_1.View style={[styles.wash, { backgroundColor: TONES[tone].wash }]}/>
      <react_native_1.Image source={TEXTURES[tone][resolvedVariant]} resizeMode="repeat" fadeDuration={0} style={[styles.texture, { opacity: opacity }]}/>
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    fill: __assign(__assign({}, react_native_1.StyleSheet.absoluteFillObject), { overflow: 'hidden' }),
    wash: __assign({}, react_native_1.StyleSheet.absoluteFillObject),
    texture: __assign(__assign({}, react_native_1.StyleSheet.absoluteFillObject), { width: undefined, height: undefined }),
});
