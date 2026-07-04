"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HintRow = HintRow;
/**
 * Small helper row used for short hint/instruction text.
 */
var react_1 = require("react");
var react_native_1 = require("react-native");
var themed_text_1 = require("./themed-text");
var themed_view_1 = require("./themed-view");
var theme_1 = require("@/constants/theme");
function HintRow(_a) {
    var _b = _a.title, title = _b === void 0 ? 'Try editing' : _b, _c = _a.hint, hint = _c === void 0 ? 'app/index.tsx' : _c;
    return (<react_native_1.View style={styles.stepRow}>
      <themed_text_1.ThemedText type="small">{title}</themed_text_1.ThemedText>
      <themed_view_1.ThemedView type="backgroundSelected" style={styles.codeSnippet}>
        <themed_text_1.ThemedText themeColor="textSecondary">{hint}</themed_text_1.ThemedText>
      </themed_view_1.ThemedView>
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    stepRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    codeSnippet: {
        borderRadius: theme_1.Spacing.two,
        paddingVertical: theme_1.Spacing.half,
        paddingHorizontal: theme_1.Spacing.two,
    },
});
