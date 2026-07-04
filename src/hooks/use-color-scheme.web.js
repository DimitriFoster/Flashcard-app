"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useColorScheme = useColorScheme;
/**
 * Web-specific color scheme hook.
 *
 * This avoids hydration mismatches by returning light mode until the browser has
 * mounted and React can safely read the actual system color scheme.
 */
var react_1 = require("react");
var react_native_1 = require("react-native");
/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
function useColorScheme() {
    var _a = (0, react_1.useState)(false), hasHydrated = _a[0], setHasHydrated = _a[1];
    (0, react_1.useEffect)(function () {
        setHasHydrated(true);
    }, []);
    var colorScheme = (0, react_native_1.useColorScheme)();
    if (hasHydrated) {
        return colorScheme;
    }
    return 'light';
}
