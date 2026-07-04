"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionFlowStrip = SessionFlowStrip;
var react_1 = require("react");
var react_native_1 = require("react-native");
var folioReviewAssets_1 = require("./folioReviewAssets");
var folioFonts_1 = require("./folioFonts");
var tokenSourceMap = {
    new: folioReviewAssets_1.folioReviewAssets.sessionFlow.new,
    again: folioReviewAssets_1.folioReviewAssets.sessionFlow.again,
    hard: folioReviewAssets_1.folioReviewAssets.sessionFlow.hard,
    good: folioReviewAssets_1.folioReviewAssets.sessionFlow.good,
    easy: folioReviewAssets_1.folioReviewAssets.sessionFlow.easy,
    empty: folioReviewAssets_1.folioReviewAssets.sessionFlow.emptyDashed,
};
function SessionFlowStrip(_a) {
    var tokens = _a.tokens, activeIndex = _a.activeIndex;
    return (<react_native_1.View style={styles.wrap}>
      <react_native_1.View style={styles.tokenRow}>
        {tokens.map(function (status, index) {
            var isActive = index === activeIndex;
            return (<react_native_1.View key={"".concat(status, "-").concat(index)} style={styles.tokenSlot}>
              {isActive ? <react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.sessionFlow.activeRays} resizeMode="contain" style={styles.rays}/> : null}
              <react_native_1.Image source={isActive ? folioReviewAssets_1.folioReviewAssets.sessionFlow.activeGood : tokenSourceMap[status]} resizeMode="contain" style={isActive ? styles.activeToken : styles.token}/>
              {isActive ? <react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.sessionFlow.activeTriangle} resizeMode="contain" style={styles.triangle}/> : null}
            </react_native_1.View>);
        })}
      </react_native_1.View>

      <react_native_1.View style={styles.legendRow}>
        <LegendItem source={folioReviewAssets_1.folioReviewAssets.sessionFlow.new} label="New"/>
        <LegendItem source={folioReviewAssets_1.folioReviewAssets.sessionFlow.again} label="Again"/>
        <LegendItem source={folioReviewAssets_1.folioReviewAssets.sessionFlow.hard} label="Hard"/>
        <LegendItem source={folioReviewAssets_1.folioReviewAssets.sessionFlow.good} label="Good"/>
        <LegendItem source={folioReviewAssets_1.folioReviewAssets.sessionFlow.easy} label="Easy"/>
      </react_native_1.View>
    </react_native_1.View>);
}
function LegendItem(_a) {
    var source = _a.source, label = _a.label;
    return (<react_native_1.View style={styles.legendItem}>
      <react_native_1.Image source={source} resizeMode="contain" style={styles.legendToken}/>
      <react_native_1.Text allowFontScaling={false} style={styles.legendText}>{label}</react_native_1.Text>
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    wrap: {
        width: '100%',
    },
    tokenRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        minHeight: 36,
    },
    tokenSlot: {
        alignItems: 'center',
        height: 38,
        justifyContent: 'center',
        marginHorizontal: 1,
        width: 20,
    },
    token: {
        height: 24,
        width: 15,
    },
    activeToken: {
        height: 30,
        width: 22,
    },
    rays: {
        height: 12,
        position: 'absolute',
        top: 0,
        width: 24,
    },
    triangle: {
        bottom: 0,
        height: 9,
        position: 'absolute',
        width: 12,
    },
    legendRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: -3,
        paddingHorizontal: 4,
    },
    legendItem: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 4,
    },
    legendToken: {
        height: 17,
        width: 11,
    },
    legendText: {
        color: '#766F65',
        fontFamily: folioFonts_1.FOLIO_HAND_FONT,
        fontSize: 12.5,
        fontWeight: '400',
    },
});
