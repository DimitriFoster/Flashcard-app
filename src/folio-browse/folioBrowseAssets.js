"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.folioBrowseAssets = void 0;
var folioReviewAssets_1 = require("@/folio-review/folioReviewAssets");
exports.folioBrowseAssets = {
    background: {
        pagePaper: folioReviewAssets_1.folioReviewAssets.background.pagePaper,
    },
    header: {
        back: folioReviewAssets_1.folioReviewAssets.header.back,
        folioWordmark: folioReviewAssets_1.folioReviewAssets.header.folioWordmark,
        undo: folioReviewAssets_1.folioReviewAssets.header.undo,
        edit: folioReviewAssets_1.folioReviewAssets.header.edit,
        help: folioReviewAssets_1.folioReviewAssets.header.help,
    },
    topPanel: require('../../assets/folio-ui/browse/panels/deck_header_panel_full.png'),
    matchesStrip: require('../../assets/folio-ui/browse/panels/matches_strip_full.png'),
    card: {
        stackBackLayers: folioReviewAssets_1.folioReviewAssets.card.stackBackLayers,
        frontSurface: folioReviewAssets_1.folioReviewAssets.card.frontSurface,
        favoriteStar: folioReviewAssets_1.folioReviewAssets.card.favoriteStar,
        questionUnderline: folioReviewAssets_1.folioReviewAssets.card.questionUnderline,
        retrievalGenerationIllustration: folioReviewAssets_1.folioReviewAssets.card.retrievalGenerationIllustration,
    },
    controls: {
        previous: require('../../assets/folio-ui/browse/controls/previous_button.png'),
        flip: require('../../assets/folio-ui/browse/controls/flip_button.png'),
        next: require('../../assets/folio-ui/browse/controls/next_button.png'),
    },
    footer: {
        noteBar: require('../../assets/folio-ui/browse/footer/browse_note_bar.png'),
    },
};
