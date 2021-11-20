"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const utils_1 = require("../../../../lib/utils");
const readers_1 = require("../../../../lib/utils/options/readers");
const options_1 = require("../../../../lib/utils/options");
const path_1 = require("path");
describe("Options - ArgumentsReader", () => {
    const logger = new utils_1.Logger();
    // Note: We lie about the type of Options here since we want the less strict
    // behavior for tests. If TypeDoc ever gets a numeric option, then we can
    // exclusively use the builtin options for tests and this cast can go away.
    const options = new utils_1.Options(logger);
    options.addDefaultDeclarations();
    options.addDeclaration({
        name: "numOption",
        help: "",
        type: options_1.ParameterType.Number,
    });
    options.addDeclaration({
        name: "mapped",
        type: options_1.ParameterType.Map,
        help: "",
        map: { a: 1, b: 2 },
        defaultValue: 3,
    });
    function test(name, args, cb) {
        it(name, () => {
            const reader = new readers_1.ArgumentsReader(1, args);
            logger.resetErrors();
            logger.resetWarnings();
            options.reset();
            options.addReader(reader);
            options.read(logger);
            cb();
            options.removeReaderByName(reader.name);
        });
    }
    test("Puts arguments with no flag into inputFiles", ["foo", "bar"], () => {
        (0, assert_1.deepStrictEqual)(options.getValue("entryPoints"), [
            (0, path_1.join)(process.cwd(), "foo"),
            (0, path_1.join)(process.cwd(), "bar"),
        ]);
    });
    test("Works with string options", ["--out", "outDir"], () => {
        (0, assert_1.deepStrictEqual)(options.getValue("out"), (0, path_1.join)(process.cwd(), "outDir"));
    });
    test("Works with number options", ["-numOption", "123"], () => {
        (0, assert_1.deepStrictEqual)(options.getValue("numOption"), 123);
    });
    test("Works with boolean options", ["--includeVersion"], () => {
        (0, assert_1.deepStrictEqual)(options.getValue("includeVersion"), true);
    });
    test("Allows setting boolean options with a value", ["--includeVersion", "TrUE"], () => {
        (0, assert_1.deepStrictEqual)(options.getValue("includeVersion"), true);
        (0, assert_1.deepStrictEqual)(options.getValue("entryPoints"), []);
    });
    test("Allows setting boolean options to false with a value", ["--includeVersion", "FALse"], () => {
        (0, assert_1.deepStrictEqual)(options.getValue("includeVersion"), false);
        (0, assert_1.deepStrictEqual)(options.getValue("entryPoints"), []);
    });
    test("Bool options do not improperly consume arguments", ["--includeVersion", "foo"], () => {
        (0, assert_1.deepStrictEqual)(options.getValue("includeVersion"), true);
        (0, assert_1.deepStrictEqual)(options.getValue("entryPoints"), [
            (0, path_1.join)(process.cwd(), "foo"),
        ]);
    });
    test("Works with map options", ["--mapped", "b"], () => {
        (0, assert_1.deepStrictEqual)(options.getValue("mapped"), 2);
    });
    test("Works with mixed options", ["--logger", "word"], () => {
        (0, assert_1.deepStrictEqual)(options.getValue("logger"), "word");
    });
    test("Works with array options", ["--exclude", "a"], () => {
        (0, assert_1.deepStrictEqual)(options.getValue("exclude"), [(0, path_1.resolve)("a")]);
    });
    test("Works with array options passed multiple times", ["--exclude", "a", "--exclude", "b"], () => {
        (0, assert_1.deepStrictEqual)(options.getValue("exclude"), [(0, path_1.resolve)("a"), (0, path_1.resolve)("b")]);
    });
    it("Errors if given an unknown option", () => {
        let check = false;
        class TestLogger extends utils_1.Logger {
            error(msg) {
                (0, assert_1.deepStrictEqual)(msg, "Unknown option: --badOption");
                check = true;
            }
        }
        const reader = new readers_1.ArgumentsReader(1, ["--badOption"]);
        options.reset();
        options.addReader(reader);
        options.read(new TestLogger());
        options.removeReaderByName(reader.name);
        (0, assert_1.deepStrictEqual)(check, true, "Reader did not report an error.");
    });
    it("Warns if option is expecting a value but no value is provided", () => {
        let check = false;
        class TestLogger extends utils_1.Logger {
            warn(msg) {
                (0, assert_1.ok)(msg.includes("--out"));
                check = true;
            }
        }
        const reader = new readers_1.ArgumentsReader(1, ["--out"]);
        options.reset();
        options.addReader(reader);
        options.read(new TestLogger());
        options.removeReaderByName(reader.name);
        (0, assert_1.deepStrictEqual)(check, true, "Reader did not report an error.");
    });
    test("Works with flag values without specifying a value", ["--validation.invalidLink"], () => {
        (0, assert_1.deepStrictEqual)(logger.hasErrors(), false);
        (0, assert_1.deepStrictEqual)(logger.hasWarnings(), false);
        (0, assert_1.deepStrictEqual)(options.getValue("validation"), {
            notExported: true,
            invalidLink: true,
        });
    });
    test("Works with flag values with specifying a value", [
        "--validation.invalidLink",
        "true",
        "--validation.notExported",
        "false",
    ], () => {
        (0, assert_1.deepStrictEqual)(logger.hasErrors(), false);
        (0, assert_1.deepStrictEqual)(logger.hasWarnings(), false);
        (0, assert_1.deepStrictEqual)(options.getValue("validation"), {
            notExported: false,
            invalidLink: true,
        });
    });
    test("Works with flag values without specifying a specific flag", ["--validation"], () => {
        (0, assert_1.deepStrictEqual)(logger.hasErrors(), false);
        (0, assert_1.deepStrictEqual)(logger.hasWarnings(), false);
        (0, assert_1.deepStrictEqual)(options.getValue("validation"), {
            notExported: true,
            invalidLink: true,
        });
    });
    test("Works with flag values without specifying a specific flag and setting true", ["--validation", "true"], () => {
        (0, assert_1.deepStrictEqual)(logger.hasErrors(), false);
        (0, assert_1.deepStrictEqual)(logger.hasWarnings(), false);
        (0, assert_1.deepStrictEqual)(options.getValue("validation"), {
            notExported: true,
            invalidLink: true,
        });
    });
    test("Works with flag values without specifying a specific flag and setting false", ["--validation", "false"], () => {
        (0, assert_1.deepStrictEqual)(logger.hasErrors(), false);
        (0, assert_1.deepStrictEqual)(logger.hasWarnings(), false);
        (0, assert_1.deepStrictEqual)(options.getValue("validation"), {
            notExported: false,
            invalidLink: false,
        });
    });
});
//# sourceMappingURL=arguments.test.js.map