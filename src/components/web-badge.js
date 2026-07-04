"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebBadge = WebBadge;
/**
 * Small Expo badge shown on web/template screens.
 */
var package_json_1 = require("expo/package.json");
var expo_image_1 = require("expo-image");
var react_1 = require("react");
var react_native_1 = require("react-native");
var themed_text_1 = require("./themed-text");
var themed_view_1 = require("./themed-view");
var theme_1 = require("@/constants/theme");
function WebBadge() {
    var scheme = (0, react_native_1.useColorScheme)();
    return (<themed_view_1.ThemedView style={styles.container}>
      <themed_text_1.ThemedText type="code" themeColor="textSecondary" style={styles.versionText}>
        v{package_json_1.version}
      </themed_text_1.ThemedText>
      <expo_image_1.Image source={scheme === 'dark'
            ? require('@/assets/images/expo-badge-white.png')
            : require('@/assets/images/expo-badge.png')} style={styles.badgeImage}/>
    </themed_view_1.ThemedView>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        padding: theme_1.Spacing.five,
        alignItems: 'center',
        gap: theme_1.Spacing.two,
    },
    versionText: {
        textAlign: 'center',
    },
    badgeImage: {
        width: 123,
        aspectRatio: 123 / 24,
    },
});
