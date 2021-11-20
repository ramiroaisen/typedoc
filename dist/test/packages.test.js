"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const fs_1 = require("fs");
const path_1 = require("path");
const utils_1 = require("../lib/utils");
const package_manifest_1 = require("../lib/utils/package-manifest");
describe("Packages support", () => {
    it("handles monorepos", () => {
        const base = (0, path_1.join)(__dirname, "packages", "multi-package");
        const logger = new utils_1.Logger();
        const packages = (0, package_manifest_1.expandPackages)(logger, ".", [base]);
        (0, assert_1.deepStrictEqual)(packages, [
            (0, path_1.join)(base, "packages/bar"),
            (0, path_1.join)(base, "packages/baz"),
            (0, path_1.join)(base, "packages/foo"),
        ].map(utils_1.normalizePath));
        const entries = packages.map((p) => {
            const packageJson = (0, path_1.join)(p, "package.json");
            return (0, package_manifest_1.getTsEntryPointForPackage)(logger, packageJson, JSON.parse((0, fs_1.readFileSync)(packageJson, "utf-8")));
        });
        (0, assert_1.deepStrictEqual)(entries, [
            (0, path_1.join)(base, "packages/bar/index.d.ts"),
            (0, path_1.join)(base, "packages/baz/index.ts"),
            (0, path_1.join)(base, "packages/foo/index.ts"),
        ]);
        (0, assert_1.ok)(!logger.hasErrors() && !logger.hasWarnings());
    });
    it("handles single packages", () => {
        const base = (0, path_1.join)(__dirname, "packages", "single-package");
        const logger = new utils_1.Logger();
        const packages = (0, package_manifest_1.expandPackages)(logger, ".", [base]);
        (0, assert_1.deepStrictEqual)(packages, [(0, utils_1.normalizePath)(base)]);
    });
});
//# sourceMappingURL=packages.test.js.map