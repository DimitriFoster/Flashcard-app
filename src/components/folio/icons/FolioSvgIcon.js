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
exports.FolioSvgIcon = FolioSvgIcon;
var react_1 = require("react");
var FolioAgainIcon_1 = require("./FolioAgainIcon");
var FolioBackIcon_1 = require("./FolioBackIcon");
var FolioBrowseSafeIcon_1 = require("./FolioBrowseSafeIcon");
var FolioCardStarIcon_1 = require("./FolioCardStarIcon");
var FolioCloseIcon_1 = require("./FolioCloseIcon");
var FolioCompletedSparkIcon_1 = require("./FolioCompletedSparkIcon");
var FolioCreateCardsIcon_1 = require("./FolioCreateCardsIcon");
var FolioDeckAiIcon_1 = require("./FolioDeckAiIcon");
var FolioDeckGeneralIcon_1 = require("./FolioDeckGeneralIcon");
var FolioDeckLanguageIcon_1 = require("./FolioDeckLanguageIcon");
var FolioDeckProgrammingIcon_1 = require("./FolioDeckProgrammingIcon");
var FolioEasyIcon_1 = require("./FolioEasyIcon");
var FolioEditIcon_1 = require("./FolioEditIcon");
var FolioFlipIcon_1 = require("./FolioFlipIcon");
var FolioGoodIcon_1 = require("./FolioGoodIcon");
var FolioHardIcon_1 = require("./FolioHardIcon");
var FolioHelpIcon_1 = require("./FolioHelpIcon");
var FolioNextIcon_1 = require("./FolioNextIcon");
var FolioNotesIcon_1 = require("./FolioNotesIcon");
var FolioPlusIcon_1 = require("./FolioPlusIcon");
var FolioPreviousIcon_1 = require("./FolioPreviousIcon");
var FolioReviewIcon_1 = require("./FolioReviewIcon");
var FolioSaveIcon_1 = require("./FolioSaveIcon");
var FolioSearchIcon_1 = require("./FolioSearchIcon");
var FolioSettingsIcon_1 = require("./FolioSettingsIcon");
var FolioStatsIcon_1 = require("./FolioStatsIcon");
var FolioTrashIcon_1 = require("./FolioTrashIcon");
var FolioUndoIcon_1 = require("./FolioUndoIcon");
function FolioSvgIcon(_a) {
    var name = _a.name, props = __rest(_a, ["name"]);
    switch (name) {
        case 'again':
            return <FolioAgainIcon_1.FolioAgainIcon {...props}/>;
        case 'back':
            return <FolioBackIcon_1.FolioBackIcon {...props}/>;
        case 'browse-safe':
            return <FolioBrowseSafeIcon_1.FolioBrowseSafeIcon {...props}/>;
        case 'card-star':
            return <FolioCardStarIcon_1.FolioCardStarIcon {...props}/>;
        case 'close':
            return <FolioCloseIcon_1.FolioCloseIcon {...props}/>;
        case 'completed-spark':
            return <FolioCompletedSparkIcon_1.FolioCompletedSparkIcon {...props}/>;
        case 'create-cards':
            return <FolioCreateCardsIcon_1.FolioCreateCardsIcon {...props}/>;
        case 'deck-ai':
            return <FolioDeckAiIcon_1.FolioDeckAiIcon {...props}/>;
        case 'deck-general':
            return <FolioDeckGeneralIcon_1.FolioDeckGeneralIcon {...props}/>;
        case 'deck-language':
            return <FolioDeckLanguageIcon_1.FolioDeckLanguageIcon {...props}/>;
        case 'deck-programming':
            return <FolioDeckProgrammingIcon_1.FolioDeckProgrammingIcon {...props}/>;
        case 'easy':
            return <FolioEasyIcon_1.FolioEasyIcon {...props}/>;
        case 'edit':
            return <FolioEditIcon_1.FolioEditIcon {...props}/>;
        case 'flip':
            return <FolioFlipIcon_1.FolioFlipIcon {...props}/>;
        case 'good':
            return <FolioGoodIcon_1.FolioGoodIcon {...props}/>;
        case 'hard':
            return <FolioHardIcon_1.FolioHardIcon {...props}/>;
        case 'help':
            return <FolioHelpIcon_1.FolioHelpIcon {...props}/>;
        case 'next':
            return <FolioNextIcon_1.FolioNextIcon {...props}/>;
        case 'notes':
            return <FolioNotesIcon_1.FolioNotesIcon {...props}/>;
        case 'plus':
            return <FolioPlusIcon_1.FolioPlusIcon {...props}/>;
        case 'previous':
            return <FolioPreviousIcon_1.FolioPreviousIcon {...props}/>;
        case 'review':
            return <FolioReviewIcon_1.FolioReviewIcon {...props}/>;
        case 'save':
            return <FolioSaveIcon_1.FolioSaveIcon {...props}/>;
        case 'search':
            return <FolioSearchIcon_1.FolioSearchIcon {...props}/>;
        case 'settings':
            return <FolioSettingsIcon_1.FolioSettingsIcon {...props}/>;
        case 'stats':
            return <FolioStatsIcon_1.FolioStatsIcon {...props}/>;
        case 'trash':
            return <FolioTrashIcon_1.FolioTrashIcon {...props}/>;
        case 'undo':
            return <FolioUndoIcon_1.FolioUndoIcon {...props}/>;
        default:
            return null;
    }
}
