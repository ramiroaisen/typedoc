"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const path_1 = require("path");
const __1 = require("..");
const exports_1 = require("../lib/validation/exports");
const programs_1 = require("./programs");
function expectWarning(typeName, file, referencingName, intentionallyNotExported = []) {
    const app = (0, programs_1.getConverter2App)();
    const program = (0, programs_1.getConverter2Program)();
    const sourceFile = program.getSourceFile((0, path_1.join)(__dirname, "converter2/validation", file));
    (0, assert_1.ok)(sourceFile, "Specified source file does not exist.");
    const project = app.converter.convert([
        {
            displayName: "validation",
            program,
            sourceFile,
        },
    ]);
    let sawWarning = false;
    const regex = /(.*?), defined at (.*?):\d+, is referenced by (.*?) but not included in the documentation\./;
    class LoggerCheck extends __1.Logger {
        log(message, level) {
            const match = message.match(regex);
            if (level === __1.LogLevel.Warn && match) {
                sawWarning = true;
                (0, assert_1.equal)(match[1], typeName, "Missing type name is different.");
                (0, assert_1.equal)(match[2], `dist/test/converter2/validation/${file}`, "Referencing file is different.");
                (0, assert_1.equal)(match[3], referencingName, "Referencing name is different");
            }
        }
    }
    (0, exports_1.validateExports)(project, new LoggerCheck(), intentionallyNotExported);
    (0, assert_1.ok)(sawWarning, `Expected warning message for ${typeName} to be reported.`);
}
function expectNoWarning(file, intentionallyNotExported = []) {
    const app = (0, programs_1.getConverter2App)();
    const program = (0, programs_1.getConverter2Program)();
    const sourceFile = program.getSourceFile((0, path_1.join)(__dirname, "converter2/validation", file));
    (0, assert_1.ok)(sourceFile, "Specified source file does not exist.");
    const project = app.converter.convert([
        {
            displayName: "validation",
            program,
            sourceFile,
        },
    ]);
    const regex = /(.*?), defined at (.*?):\d+, is referenced by (.*?) but not included in the documentation\./;
    class LoggerCheck extends __1.Logger {
        log(message, level) {
            const match = message.match(regex);
            if (level === __1.LogLevel.Warn && match) {
                (0, assert_1.fail)("Expected no warnings about missing exports");
            }
        }
    }
    (0, exports_1.validateExports)(project, new LoggerCheck(), intentionallyNotExported);
}
describe("validateExports", () => {
    it("Should warn if a variable type is missing", () => {
        expectWarning("Foo", "variable.ts", "foo");
    });
    it("Should warn if a type parameter clause is missing", () => {
        expectWarning("Foo", "typeParameter.ts", "Bar.T");
    });
    it("Should warn if an index signature type is missing", () => {
        expectWarning("Bar", "indexSignature.ts", "Foo.__index");
    });
    it("Should warn within object types", () => {
        expectWarning("Foo", "object.ts", "x.__type.foo");
    });
    it("Should warn if a get signature type is missing", () => {
        expectWarning("Bar", "getSignature.ts", "Foo.foo.foo");
    });
    it("Should warn if a set signature type is missing", () => {
        expectWarning("Bar", "setSignature.ts", "Foo.foo.foo._value");
    });
    it("Should warn if an implemented type is missing", () => {
        expectWarning("Bar", "implemented.ts", "Foo");
    });
    it("Should warn if a parameter type is missing", () => {
        expectWarning("Bar", "parameter.ts", "Foo.Foo.x");
    });
    it("Should warn if a return type is missing", () => {
        expectWarning("Bar", "return.ts", "foo.foo");
    });
    it("Should allow filtering warnings by file name", () => {
        expectNoWarning("variable.ts", ["variable.ts:Foo"]);
        expectNoWarning("variable.ts", ["validation/variable.ts:Foo"]);
        expectNoWarning("variable.ts", ["Foo"]);
    });
    it("Should not apply warnings filtered by file name to other files", () => {
        expectWarning("Foo", "variable.ts", "foo", ["notVariable.ts:Foo"]);
    });
    it("Should not produce warnings for types originating in node_modules", () => {
        expectNoWarning("externalType.ts");
    });
    it("Should warn if intentionallyNotExported contains unused values", () => {
        const app = (0, programs_1.getConverter2App)();
        const program = (0, programs_1.getConverter2Program)();
        const sourceFile = program.getSourceFile((0, path_1.join)(__dirname, "converter2/validation/variable.ts"));
        (0, assert_1.ok)(sourceFile, "Specified source file does not exist.");
        const project = app.converter.convert([
            {
                displayName: "validation",
                program,
                sourceFile,
            },
        ]);
        let sawWarning = false;
        class LoggerCheck extends __1.Logger {
            log(message, level) {
                if (level == __1.LogLevel.Warn &&
                    message.includes("intentionally not exported")) {
                    sawWarning = true;
                    (0, assert_1.ok)(message.includes("notDefined"), "Should have included a warning about notDefined");
                    (0, assert_1.ok)(!message.includes("Foo"), "Should not include a warn about Foo");
                }
            }
        }
        (0, exports_1.validateExports)(project, new LoggerCheck(), ["notDefined", "Foo"]);
        (0, assert_1.ok)(sawWarning, "Never saw warning.");
    });
});
//# sourceMappingURL=validation.test.js.map