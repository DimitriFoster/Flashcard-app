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
exports.HomeNotesSection = HomeNotesSection;
var react_1 = require("react");
var react_native_1 = require("react-native");
var home_panel_fill_1 = require("@/components/home/home-panel-fill");
var design_1 = require("@/constants/design");
var notesIcon = require('../../../assets/folio-ui/home-page/home_notes_icon.png');
var homeArrowIcon = require('../../../assets/folio-ui/home-page/home_arrow_icon.png');
var notesPanelSwatch = require('../../../assets/folio-ui/home-page/swatches/home_notes_panel_swatch.png');
function HomeNotesSection(_a) {
    var onPressNotes = _a.onPressNotes;
    return (<react_native_1.Pressable accessibilityRole="button" onPress={onPressNotes} style={function (_a) {
        var pressed = _a.pressed;
        return [styles.section, pressed && styles.pressed];
    }}>
      <home_panel_fill_1.HomePanelFill source={notesPanelSwatch} opacity={1}/>

      <react_native_1.View style={styles.row}>
        <react_native_1.View style={styles.iconWrap}>
          <react_native_1.Image source={notesIcon} style={styles.icon} resizeMode="contain"/>
        </react_native_1.View>

        <react_native_1.View style={styles.textWrap}>
          <react_native_1.Text style={styles.title}>notes</react_native_1.Text>
          <react_native_1.Text style={styles.subtitle}>Open a fast lined notebook{"\n"}for loose thoughts.</react_native_1.Text>
        </react_native_1.View>

        <react_native_1.Image source={homeArrowIcon} style={[styles.arrow, { tintColor: design_1.COLORS.noteDeep }]} resizeMode="contain"/>
      </react_native_1.View>
    </react_native_1.Pressable>);
}
var styles = react_native_1.StyleSheet.create({
    section: __assign({ position: 'relative', overflow: 'hidden', minHeight: 118, borderRadius: design_1.RADIUS.md, paddingHorizontal: 18, paddingVertical: 14, backgroundColor: design_1.COLORS.notePaper, borderWidth: 1, borderColor: design_1.COLORS.noteCrayon, justifyContent: 'center' }, design_1.SHADOWS.card),
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconWrap: {
        width: 64,
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    icon: {
        width: 56,
        height: 56,
    },
    textWrap: {
        flex: 1,
        gap: 4,
    },
    title: {
        color: design_1.COLORS.noteDeep,
        fontSize: 20,
        fontWeight: '900',
    },
    subtitle: {
        color: '#4F4740',
        fontSize: 14,
        lineHeight: 19,
        fontWeight: '600',
    },
    arrow: {
        width: 26,
        height: 26,
        flexShrink: 0,
    },
    pressed: {
        opacity: 0.92,
        transform: [{ scale: 0.985 }],
    },
});
