"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flashcard = Flashcard;
/**
 * Generic flashcard display component.
 *
 * This is a reusable card UI for showing the front or back of a flashcard.
 * The focused review screen currently uses a custom card layout, but this
 * component is useful for simpler previews or future lists.
 */
var react_native_1 = require("react-native");
var themed_text_1 = require("@/components/themed-text");
var themed_view_1 = require("@/components/themed-view");
var theme_1 = require("@/constants/theme");
function Flashcard(_a) {
    var flashcard = _a.flashcard, _b = _a.flipped, flipped = _b === void 0 ? false : _b, style = _a.style, pressableProps = __rest(_a, ["flashcard", "flipped", "style"]);
    var label = flipped ? 'Back' : 'Front';
    var content = flipped ? flashcard.back : flashcard.front;
    return (<react_native_1.Pressable accessibilityRole="button" accessibilityLabel={"Flashcard ".concat(label.toLowerCase())} style={function (_a) {
        var pressed = _a.pressed;
        return [styles.pressable, pressed && styles.pressed, style];
    }} {...pressableProps}>
      <themed_view_1.ThemedView type="backgroundElement" style={styles.card}>
        <themed_text_1.ThemedText type="code" themeColor="textSecondary" style={styles.label}>
          {label}
        </themed_text_1.ThemedText>
        <themed_text_1.ThemedText type="subtitle" style={styles.content}>
          {content}
        </themed_text_1.ThemedText>
      </themed_view_1.ThemedView>
    </react_native_1.Pressable>);
}
var styles = react_native_1.StyleSheet.create({
    pressable: {
        alignSelf: 'stretch',
    },
    pressed: {
        opacity: 0.82,
    },
    card: {
        minHeight: 180,
        justifyContent: 'center',
        gap: theme_1.Spacing.three,
        padding: theme_1.Spacing.four,
        borderRadius: theme_1.Spacing.two,
    },
    label: {
        textTransform: 'uppercase',
    },
    content: {
        textAlign: 'center',
    },
});
