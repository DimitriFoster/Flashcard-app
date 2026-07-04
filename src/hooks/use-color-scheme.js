"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useColorScheme = void 0;
/**
 * Native color scheme hook.
 *
 * Re-exporting from React Native lets the rest of the app import from one
 * project-local path while still allowing a web-specific implementation.
 */
var react_native_1 = require("react-native");
Object.defineProperty(exports, "useColorScheme", { enumerable: true, get: function () { return react_native_1.useColorScheme; } });
