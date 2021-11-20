"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const path_1 = require("path");
const __1 = require("../..");
const root = (0, path_1.join)(__dirname, "entry-points");
describe("Entry Points", () => {
    const app = new __1.Application();
    const tsconfig = (0, path_1.join)(root, "tsconfig.json");
    app.options.addReader(new __1.TSConfigReader());
    it("Supports expanding existing paths", () => {
        app.bootstrap({
            tsconfig,
            entryPoints: [root],
            entryPointStrategy: __1.EntryPointStrategy.Expand,
        });
        const entryPoints = app.getEntryPoints();
        (0, assert_1.ok)(entryPoints);
        (0, assert_1.deepStrictEqual)(entryPoints.length, 2, "There are two files, so both should be expanded");
    });
    it("Supports resolving directories", () => {
        app.bootstrap({
            tsconfig,
            entryPoints: [root],
            entryPointStrategy: __1.EntryPointStrategy.Resolve,
        });
        const entryPoints = app.getEntryPoints();
        (0, assert_1.ok)(entryPoints);
        (0, assert_1.deepStrictEqual)(entryPoints.length, 1, "entry-points/index.ts should have been the sole entry point");
    });
    it("Supports resolving packages", () => {
        const root = (0, path_1.join)(__dirname, "../packages/multi-package");
        app.bootstrap({
            tsconfig: root,
            entryPoints: [root],
            entryPointStrategy: __1.EntryPointStrategy.Packages,
        });
        const entryPoints = app.getEntryPoints();
        (0, assert_1.ok)(entryPoints);
        (0, assert_1.deepStrictEqual)(entryPoints.length, 3);
    });
});
//# sourceMappingURL=entry-point.test.js.map