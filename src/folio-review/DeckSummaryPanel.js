"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeckSummaryPanel = DeckSummaryPanel;
var react_1 = require("react");
var react_native_1 = require("react-native");
var folioReviewAssets_1 = require("./folioReviewAssets");
var folioFonts_1 = require("./folioFonts");
var SessionFlowStrip_1 = require("./SessionFlowStrip");
function DeckSummaryPanel(_a) {
    var deckTitle = _a.deckTitle, _b = _a.deckSubtitle, deckSubtitle = _b === void 0 ? 'Master Deck' : _b, dueCount = _a.dueCount, totalCards = _a.totalCards, cardsLeft = _a.cardsLeft, tokens = _a.tokens, activeTokenIndex = _a.activeTokenIndex;
    return (<react_native_1.ImageBackground source={folioReviewAssets_1.folioReviewAssets.deckPanel.shell} resizeMode="stretch" style={styles.shell} imageStyle={styles.shellImage}>
      <react_native_1.View style={styles.deckSection}>
        <react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.deckPanel.brainCloud} resizeMode="contain" style={styles.brainIcon}/>
        <react_native_1.View style={styles.deckTextBlock}>
          <react_native_1.Text allowFontScaling={false} numberOfLines={2} ellipsizeMode="tail" style={styles.deckTitle}>{deckTitle}</react_native_1.Text>
          <react_native_1.Text allowFontScaling={false} numberOfLines={1} style={styles.deckSubtitle}>{deckSubtitle}</react_native_1.Text>
          <react_native_1.Text allowFontScaling={false} style={styles.countsLine}>
            <react_native_1.Text style={styles.blueCount}>{dueCount} due</react_native_1.Text>
            <react_native_1.Text style={styles.dot}>  •  </react_native_1.Text>
            <react_native_1.Text>{totalCards} total cards</react_native_1.Text>
          </react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>

      <react_native_1.View style={styles.flowSection}>
        <react_native_1.View style={styles.flowHeaderRow}>
          <react_native_1.View>
            <react_native_1.Text allowFontScaling={false} style={styles.flowTitle}>Session flow</react_native_1.Text>
            <react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.deckPanel.sessionFlowUnderline} resizeMode="stretch" style={styles.flowUnderline}/>
          </react_native_1.View>
          <react_native_1.Text allowFontScaling={false} style={styles.cardsLeft}><react_native_1.Text style={styles.blueCount}>{cardsLeft}</react_native_1.Text> cards left</react_native_1.Text>
        </react_native_1.View>
        <SessionFlowStrip_1.SessionFlowStrip tokens={tokens} activeIndex={activeTokenIndex}/>
      </react_native_1.View>
    </react_native_1.ImageBackground>);
}
var styles = react_native_1.StyleSheet.create({
    shell: {
        alignSelf: 'center',
        height: 190,
        marginTop: 3,
        overflow: 'hidden',
        width: '100%',
    },
    shellImage: {
        resizeMode: 'stretch',
    },
    deckSection: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 101,
        paddingHorizontal: 39,
        paddingTop: 8,
    },
    brainIcon: {
        height: 50,
        marginRight: 16,
        width: 50,
    },
    deckTextBlock: {
        flex: 1,
        minWidth: 0,
    },
    deckTitle: {
        color: '#26211C',
        fontFamily: folioFonts_1.FOLIO_HAND_FONT,
        fontSize: 21,
        fontWeight: '400',
        lineHeight: 23,
    },
    deckSubtitle: {
        color: '#26211C',
        fontFamily: folioFonts_1.FOLIO_HAND_FONT,
        fontSize: 21,
        fontWeight: '400',
        lineHeight: 23,
    },
    countsLine: {
        color: '#766F65',
        fontSize: 13.7,
        fontWeight: '700',
        lineHeight: 16,
        marginTop: -1,
    },
    blueCount: {
        color: '#0C73DB',
        fontWeight: '900',
    },
    dot: {
        color: '#766F65',
    },
    flowSection: {
        flex: 1,
        paddingHorizontal: 35,
        paddingTop: 5,
    },
    flowHeaderRow: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 0,
    },
    flowTitle: {
        color: '#26211C',
        fontFamily: folioFonts_1.FOLIO_HAND_FONT,
        fontSize: 16,
        fontWeight: '400',
    },
    flowUnderline: {
        height: 9,
        marginTop: -1,
        width: 92,
    },
    cardsLeft: {
        color: '#6F6860',
        fontSize: 13,
        fontWeight: '800',
        marginTop: 2,
    },
});
