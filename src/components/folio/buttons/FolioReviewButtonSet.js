"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FOLIO_REVIEW_BUTTON_SKINS = void 0;
exports.FolioReviewToolbarButtons = FolioReviewToolbarButtons;
exports.FolioReviewGradeButtonRow = FolioReviewGradeButtonRow;
var react_1 = require("react");
var react_native_1 = require("react-native");
var FolioImageSkinButton_1 = require("./FolioImageSkinButton");
var BUTTON_SKINS = {
    toolbarBack: require('../../../../assets/images/review-button-skins/toolbar-back-yellow.png'),
    toolbarUndo: require('../../../../assets/images/review-button-skins/toolbar-undo-lavender.png'),
    toolbarEdit: require('../../../../assets/images/review-button-skins/toolbar-edit-green.png'),
    toolbarHelp: require('../../../../assets/images/review-button-skins/toolbar-help-blue.png'),
    gradeAgain: require('../../../../assets/images/review-button-skins/grade-again-yellow.png'),
    gradeHard: require('../../../../assets/images/review-button-skins/grade-hard-red.png'),
    gradeGood: require('../../../../assets/images/review-button-skins/grade-good-blue.png'),
    gradeEasy: require('../../../../assets/images/review-button-skins/grade-easy-green.png'),
};
exports.FOLIO_REVIEW_BUTTON_SKINS = BUTTON_SKINS;
var COLORS = {
    ink: '#2E281F',
    orange: '#B97512',
    coral: '#D15A4C',
    blue: '#2F5FB8',
    green: '#24725C',
    purple: '#7651B2',
};
function FolioReviewToolbarButtons(_a) {
    var onBack = _a.onBack, onUndo = _a.onUndo, onEdit = _a.onEdit, onHelp = _a.onHelp, _b = _a.showUndoButton, showUndoButton = _b === void 0 ? true : _b;
    return (<>
      <FolioImageSkinButton_1.FolioImageSkinButton accessibilityLabel="Go back" backgroundSource={BUTTON_SKINS.toolbarBack} iconColor={COLORS.ink} iconName="back" iconSize={32} onPress={onBack} shellStyle={styles.toolbarPrimaryButton}/>

      <react_native_1.View style={styles.toolbarActionGroup}>
        {onUndo ? (<FolioImageSkinButton_1.FolioImageSkinButton accessibilityLabel="Undo" backgroundSource={BUTTON_SKINS.toolbarUndo} disabled={!showUndoButton} iconColor={COLORS.purple} iconName="undo" iconSize={24} label="Undo" onPress={onUndo} shellStyle={styles.toolbarSecondaryButton}/>) : null}

        {onEdit ? (<FolioImageSkinButton_1.FolioImageSkinButton accessibilityLabel="Edit current card" backgroundSource={BUTTON_SKINS.toolbarEdit} iconColor={COLORS.green} iconName="edit" iconSize={25} label="Edit" onPress={onEdit} shellStyle={styles.toolbarSecondaryButton}/>) : null}

        <FolioImageSkinButton_1.FolioImageSkinButton accessibilityLabel="Open help" backgroundSource={BUTTON_SKINS.toolbarHelp} iconColor={COLORS.blue} iconName="help" iconSize={34} onPress={onHelp} shellStyle={styles.toolbarHelpButton}/>
      </react_native_1.View>
    </>);
}
var gradeButtons = [
    {
        grade: 'again',
        label: 'Again',
        hint: '< 1 min',
        iconName: 'again',
        iconColor: COLORS.orange,
        backgroundSource: BUTTON_SKINS.gradeAgain,
    },
    {
        grade: 'hard',
        label: 'Hard',
        hint: '5 min',
        iconName: 'hard',
        iconColor: COLORS.coral,
        backgroundSource: BUTTON_SKINS.gradeHard,
    },
    {
        grade: 'good',
        label: 'Good',
        hint: '15 min',
        iconName: 'good',
        iconColor: COLORS.blue,
        backgroundSource: BUTTON_SKINS.gradeGood,
    },
    {
        grade: 'easy',
        label: 'Easy',
        hint: '4 d',
        iconName: 'easy',
        iconColor: COLORS.green,
        backgroundSource: BUTTON_SKINS.gradeEasy,
    },
];
function FolioReviewGradeButtonRow(_a) {
    var onGrade = _a.onGrade;
    return (<react_native_1.View style={styles.gradeRow}>
      {gradeButtons.map(function (button) { return (<FolioImageSkinButton_1.FolioImageSkinButton key={button.grade} accessibilityLabel={"".concat(button.label, ", ").concat(button.hint)} backgroundSource={button.backgroundSource} iconColor={button.iconColor} iconName={button.iconName} iconSize={30} label={button.label} hint={button.hint} onPress={function () { return onGrade(button.grade); }} shellStyle={styles.gradeButton} labelStyle={styles.gradeLabel} hintStyle={styles.gradeHint} contentStyle={styles.gradeContent}/>); })}
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    toolbarActionGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 8,
        minWidth: 188,
    },
    toolbarPrimaryButton: {
        width: 58,
        height: 58,
    },
    toolbarSecondaryButton: {
        width: 56,
        height: 56,
    },
    toolbarHelpButton: {
        width: 58,
        height: 58,
    },
    gradeRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
    },
    gradeButton: {
        flex: 1,
        minWidth: 0,
        minHeight: 96,
        maxHeight: 122,
        aspectRatio: 0.8,
    },
    gradeContent: {
        paddingTop: 8,
        gap: 2,
    },
    gradeLabel: {
        fontSize: 18,
        lineHeight: 22,
    },
    gradeHint: {
        fontSize: 12,
        lineHeight: 15,
    },
});
