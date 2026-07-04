"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BottomTabBar = BottomTabBar;
var react_1 = require("react");
var react_native_1 = require("react-native");
var folioReviewAssets_1 = require("./folioReviewAssets");
var TAB_ITEMS = [
    { tab: 'review', label: 'Review', inactiveIcon: folioReviewAssets_1.folioReviewAssets.bottomNav.reviewIconInactive, activeIcon: folioReviewAssets_1.folioReviewAssets.bottomNav.reviewActiveIcon },
    { tab: 'notes', label: 'Notes', inactiveIcon: folioReviewAssets_1.folioReviewAssets.bottomNav.notesIconInactive },
    { tab: 'progress', label: 'Progress', inactiveIcon: folioReviewAssets_1.folioReviewAssets.bottomNav.progressIconInactive },
    { tab: 'browse', label: 'Browse', inactiveIcon: folioReviewAssets_1.folioReviewAssets.bottomNav.browseIconInactive, activeIcon: folioReviewAssets_1.folioReviewAssets.bottomNav.browseIconActive },
];
function BottomTabBar(_a) {
    var _b = _a.activeTab, activeTab = _b === void 0 ? 'review' : _b, onNavigateTab = _a.onNavigateTab;
    return (<react_native_1.ImageBackground source={folioReviewAssets_1.folioReviewAssets.bottomNav.shell} resizeMode="stretch" style={styles.shell} imageStyle={styles.shellImage}>
      {TAB_ITEMS.map(function (item) {
            var _a;
            var active = item.tab === activeTab;
            return (<TabItem active={active} icon={active ? (_a = item.activeIcon) !== null && _a !== void 0 ? _a : item.inactiveIcon : item.inactiveIcon} key={item.tab} label={item.label} onPress={function () { return onNavigateTab === null || onNavigateTab === void 0 ? void 0 : onNavigateTab(item.tab); }}/>);
        })}
    </react_native_1.ImageBackground>);
}
function TabItem(_a) {
    var active = _a.active, label = _a.label, icon = _a.icon, onPress = _a.onPress;
    return (<react_native_1.Pressable accessibilityRole="tab" accessibilityState={{ selected: !!active }} accessibilityLabel={label} onPress={onPress} style={styles.tab}>
      <react_native_1.Image source={icon} resizeMode="contain" style={styles.icon}/>
      <react_native_1.Text allowFontScaling={false} style={[styles.label, active ? styles.activeLabel : null]}>{label}</react_native_1.Text>
      {active ? <react_native_1.Image source={folioReviewAssets_1.folioReviewAssets.bottomNav.reviewActiveUnderline} resizeMode="stretch" style={styles.underline}/> : <react_native_1.View style={styles.underlineSpacer}/>}
    </react_native_1.Pressable>);
}
var styles = react_native_1.StyleSheet.create({
    shell: {
        alignItems: 'flex-end',
        flexDirection: 'row',
        height: 64,
        justifyContent: 'space-around',
        paddingBottom: 5,
        paddingHorizontal: 10,
        width: '100%',
    },
    shellImage: {
        resizeMode: 'stretch',
    },
    tab: {
        alignItems: 'center',
        flex: 1,
        overflow: 'visible',
    },
    icon: {
        height: 27,
        width: 32,
    },
    label: {
        color: '#766F65',
        fontSize: 11.5,
        fontWeight: '800',
        marginTop: 0,
    },
    activeLabel: {
        color: '#0C73DB',
    },
    underline: {
        height: 5,
        marginTop: 2,
        width: 50,
    },
    underlineSpacer: {
        height: 8,
    },
});
