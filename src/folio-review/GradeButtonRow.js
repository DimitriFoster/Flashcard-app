"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeButtonRow = GradeButtonRow;
var react_1 = require("react");
var react_native_1 = require("react-native");
var FolioAssetButton_1 = require("./FolioAssetButton");
var folioReviewAssets_1 = require("./folioReviewAssets");
function GradeButtonRow(_a) {
    var onGrade = _a.onGrade;
    return (<react_native_1.View style={styles.row}>
      <FolioAssetButton_1.FolioAssetButton source={folioReviewAssets_1.folioReviewAssets.grade.again} accessibilityLabel="Again, less than one minute" onPress={function () { return onGrade === null || onGrade === void 0 ? void 0 : onGrade('again'); }} style={styles.button}/>
      <FolioAssetButton_1.FolioAssetButton source={folioReviewAssets_1.folioReviewAssets.grade.hard} accessibilityLabel="Hard, five minutes" onPress={function () { return onGrade === null || onGrade === void 0 ? void 0 : onGrade('hard'); }} style={styles.button}/>
      <FolioAssetButton_1.FolioAssetButton source={folioReviewAssets_1.folioReviewAssets.grade.good} accessibilityLabel="Good, fifteen minutes" onPress={function () { return onGrade === null || onGrade === void 0 ? void 0 : onGrade('good'); }} style={styles.button}/>
      <FolioAssetButton_1.FolioAssetButton source={folioReviewAssets_1.folioReviewAssets.grade.easy} accessibilityLabel="Easy, four days" onPress={function () { return onGrade === null || onGrade === void 0 ? void 0 : onGrade('easy'); }} style={styles.button}/>
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
        marginBottom: 8,
        marginTop: 10,
        paddingHorizontal: 20,
        width: '100%',
    },
    button: {
        aspectRatio: 1,
        flex: 1,
        maxWidth: 96,
    },
});
