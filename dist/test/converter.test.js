"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const FS = require("fs");
const Path = require("path");
const __1 = require("..");
const utils_1 = require("../lib/utils");
const programs_1 = require("./programs");
describe("Converter", function () {
    const base = (0, programs_1.getConverterBase)();
    const app = (0, programs_1.getConverterApp)();
    it("Compiles", () => {
        (0, programs_1.getConverterProgram)();
    });
    const checks = [
        [
            "specs",
            () => {
                // nop
            },
            () => {
                // nop
            },
        ],
        [
            "specs-with-lump-categories",
            () => app.options.setValue("categorizeByGroup", false),
            () => app.options.setValue("categorizeByGroup", true),
        ],
        [
            "specs.nodoc",
            () => app.options.setValue("excludeNotDocumented", true),
            () => app.options.setValue("excludeNotDocumented", false),
        ],
    ];
    FS.readdirSync(base).forEach(function (directory) {
        const path = Path.join(base, directory);
        if (!FS.lstatSync(path).isDirectory()) {
            return;
        }
        describe(directory, function () {
            for (const [file, before, after] of checks) {
                const specsFile = Path.join(path, `${file}.json`);
                if (!FS.existsSync(specsFile)) {
                    continue;
                }
                let result;
                it(`[${file}] converts fixtures`, function () {
                    before();
                    (0, __1.resetReflectionID)();
                    const entryPoints = (0, utils_1.getExpandedEntryPointsForPaths)(app.logger, [path], app.options, [(0, programs_1.getConverterProgram)()]);
                    (0, assert_1.ok)(entryPoints, "Failed to get entry points");
                    result = app.converter.convert(entryPoints);
                    after();
                    (0, assert_1.ok)(result instanceof __1.ProjectReflection, "No reflection returned");
                });
                it(`[${file}] matches specs`, function () {
                    const specs = JSON.parse(FS.readFileSync(specsFile, "utf-8"));
                    let data = JSON.stringify(app.serializer.toObject(result), null, "  ");
                    data = data.split((0, __1.normalizePath)(base)).join("%BASE%");
                    (0, assert_1.deepStrictEqual)(JSON.parse(data), specs);
                });
            }
        });
    });
});
//# sourceMappingURL=converter.test.js.map