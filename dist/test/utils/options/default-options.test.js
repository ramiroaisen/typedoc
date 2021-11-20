"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const shiki_1 = require("shiki");
const utils_1 = require("../../../lib/utils");
describe("Default Options", () => {
    const opts = new utils_1.Options(new utils_1.Logger());
    opts.addDefaultDeclarations();
    describe("Highlighting theme", () => {
        it("Errors if an invalid theme is provided", () => {
            (0, assert_1.throws)(() => opts.setValue("lightHighlightTheme", "randomTheme"));
            opts.setValue("lightHighlightTheme", shiki_1.BUNDLED_THEMES[0]);
            (0, assert_1.strictEqual)(opts.getValue("lightHighlightTheme"), shiki_1.BUNDLED_THEMES[0]);
            (0, assert_1.throws)(() => opts.setValue("darkHighlightTheme", "randomTheme"));
            opts.setValue("darkHighlightTheme", shiki_1.BUNDLED_THEMES[0]);
            (0, assert_1.strictEqual)(opts.getValue("darkHighlightTheme"), shiki_1.BUNDLED_THEMES[0]);
        });
    });
    describe("sort", () => {
        it("Errors if an invalid sort version is provided", () => {
            (0, assert_1.throws)(() => opts.setValue("sort", ["random", "alphabetical"]));
        });
        it("Reports which sort option(s) was invalid", () => {
            try {
                opts.setValue("sort", [
                    "random",
                    "alphabetical",
                    "foo",
                ]);
            }
            catch (e) {
                (0, assert_1.ok)(e instanceof Error);
                (0, assert_1.ok)(e.message.includes("random"));
                (0, assert_1.ok)(e.message.includes("foo"));
            }
        });
    });
    describe("markedOptions", () => {
        it("Errors if given a non-object", () => {
            (0, assert_1.throws)(() => opts.setValue("markedOptions", null));
            (0, assert_1.throws)(() => opts.setValue("markedOptions", "bad"));
            (0, assert_1.throws)(() => opts.setValue("markedOptions", []));
        });
    });
});
//# sourceMappingURL=default-options.test.js.map