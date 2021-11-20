"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConverter2Program = exports.getConverter2App = exports.getConverter2Base = exports.getConverterProgram = exports.getConverterApp = exports.getConverterBase = void 0;
const assert_1 = require("assert");
const path_1 = require("path");
const ts = require("typescript");
const __1 = require("..");
let converterApp;
let converterProgram;
let converter2App;
let converter2Program;
function getConverterBase() {
    return (0, path_1.join)(__dirname, "converter");
}
exports.getConverterBase = getConverterBase;
function getConverterApp() {
    if (!converterApp) {
        converterApp = new __1.Application();
        converterApp.options.addReader(new __1.TSConfigReader());
        converterApp.bootstrap({
            logger: "none",
            name: "typedoc",
            excludeExternals: true,
            disableSources: true,
            tsconfig: (0, path_1.join)(getConverterBase(), "tsconfig.json"),
            externalPattern: ["**/node_modules/**"],
            plugin: [],
            entryPointStrategy: __1.EntryPointStrategy.Expand,
        });
    }
    return converterApp;
}
exports.getConverterApp = getConverterApp;
function getConverterProgram() {
    if (!converterProgram) {
        const app = getConverterApp();
        converterProgram = ts.createProgram(app.options.getFileNames(), app.options.getCompilerOptions());
        const errors = ts.getPreEmitDiagnostics(converterProgram);
        (0, assert_1.deepStrictEqual)(errors, []);
    }
    return converterProgram;
}
exports.getConverterProgram = getConverterProgram;
function getConverter2Base() {
    return (0, path_1.join)(__dirname, "converter2");
}
exports.getConverter2Base = getConverter2Base;
function getConverter2App() {
    if (!converter2App) {
        converter2App = new __1.Application();
        converter2App.options.addReader(new __1.TSConfigReader());
        converter2App.bootstrap({
            name: "typedoc",
            excludeExternals: true,
            tsconfig: (0, path_1.join)(getConverter2Base(), "tsconfig.json"),
            plugin: [],
        });
        converter2App.options.freeze();
    }
    return converter2App;
}
exports.getConverter2App = getConverter2App;
function getConverter2Program() {
    if (!converter2Program) {
        const app = getConverter2App();
        converter2Program = ts.createProgram(app.options.getFileNames(), app.options.getCompilerOptions());
        const errors = ts.getPreEmitDiagnostics(converter2Program);
        (0, assert_1.deepStrictEqual)(errors, []);
    }
    return converter2Program;
}
exports.getConverter2Program = getConverter2Program;
//# sourceMappingURL=programs.js.map