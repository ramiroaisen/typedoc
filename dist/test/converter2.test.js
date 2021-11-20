"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const fs_1 = require("fs");
const path_1 = require("path");
const behaviorTests_1 = require("./behaviorTests");
const issueTests_1 = require("./issueTests");
const programs_1 = require("./programs");
const base = (0, programs_1.getConverter2Base)();
const app = (0, programs_1.getConverter2App)();
function runTest(title, entry, check) {
    it(title, () => {
        const program = (0, programs_1.getConverter2Program)();
        const entryPoint = [
            (0, path_1.join)(base, `${entry}.ts`),
            (0, path_1.join)(base, `${entry}.d.ts`),
            (0, path_1.join)(base, `${entry}.tsx`),
            (0, path_1.join)(base, `${entry}.js`),
            (0, path_1.join)(base, entry, "index.ts"),
        ].find(fs_1.existsSync);
        (0, assert_1.ok)(entryPoint, `No entry point found for ${entry}`);
        const sourceFile = program.getSourceFile(entryPoint);
        (0, assert_1.ok)(sourceFile, `No source file found for ${entryPoint}`);
        const project = app.converter.convert([
            {
                displayName: entry,
                program,
                sourceFile,
            },
        ]);
        check(project);
    });
}
describe("Converter2", () => {
    it("Compiles", () => {
        (0, programs_1.getConverter2Program)();
    });
    for (const [entry, check] of Object.entries(issueTests_1.issueTests)) {
        const link = `https://github.com/TypeStrong/typedoc/issues/${entry.substr(2)}`;
        runTest(`Issue ${entry.substr(2).padEnd(4)} (${link})`, (0, path_1.join)("issues", entry), check);
    }
    for (const [entry, check] of Object.entries(behaviorTests_1.behaviorTests)) {
        const title = `Handles ${entry.replace(/([a-z][A-Z])/g, (x) => `${x[0]} ${x[1].toLowerCase()}`)}`;
        runTest(title, (0, path_1.join)("behavior", entry), check);
    }
});
//# sourceMappingURL=converter2.test.js.map