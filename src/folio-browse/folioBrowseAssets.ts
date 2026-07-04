import { folioReviewAssets } from '@/folio-review/folioReviewAssets';

export const folioBrowseAssets = {
  background: {
    pagePaper: folioReviewAssets.background.pagePaper,
  },
  header: {
    back: folioReviewAssets.header.back,
    folioWordmark: folioReviewAssets.header.folioWordmark,
    undo: folioReviewAssets.header.undo,
    edit: folioReviewAssets.header.edit,
    help: folioReviewAssets.header.help,
  },
  topPanel: require('../../assets/folio-ui/browse/panels/deck_header_panel_full.png'),
  matchesStrip: require('../../assets/folio-ui/browse/panels/matches_strip_full.png'),
  card: {
    stackBackLayers: folioReviewAssets.card.stackBackLayers,
    frontSurface: folioReviewAssets.card.frontSurface,
    favoriteStar: folioReviewAssets.card.favoriteStar,
    questionUnderline: folioReviewAssets.card.questionUnderline,
    retrievalGenerationIllustration: folioReviewAssets.card.retrievalGenerationIllustration,
  },
  controls: {
    previous: require('../../assets/folio-ui/browse/controls/previous_button.png'),
    flip: require('../../assets/folio-ui/browse/controls/flip_button.png'),
    next: require('../../assets/folio-ui/browse/controls/next_button.png'),
  },
  footer: {
    noteBar: require('../../assets/folio-ui/browse/footer/browse_note_bar.png'),
  },
} as const;
