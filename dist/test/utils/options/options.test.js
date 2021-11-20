"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../lib/utils");
const options_1 = require("../../../lib/utils/options");
const assert_1 = require("assert");
describe("Options", () => {
    const logger = new utils_1.Logger();
    const options = new utils_1.Options(logger);
    options.addDefaultDeclarations();
    options.addDeclaration({
        name: "mapped",
        type: utils_1.ParameterType.Map,
        map: { a: 1 },
        defaultValue: 2,
        help: "",
    });
    it("Errors on duplicate declarations", () => {
        logger.resetErrors();
        options.addDeclaration({
            name: "help",
            help: "",
            type: utils_1.ParameterType.Boolean,
        });
        (0, assert_1.deepStrictEqual)(logger.hasErrors(), true);
    });
    it("Does not throw if number declaration has no min and max values", () => {
        const declaration = {
            name: "test-number-declaration",
            help: "",
            type: utils_1.ParameterType.Number,
            defaultValue: 1,
        };
        options.addDeclaration(declaration);
        options.removeDeclarationByName(declaration.name);
    });
    it("Does not throw if default value is out of range for number declaration", () => {
        const declaration = {
            name: "test-number-declaration",
            help: "",
            type: utils_1.ParameterType.Number,
            minValue: 1,
            maxValue: 10,
            defaultValue: 0,
        };
        options.addDeclaration(declaration);
        options.removeDeclarationByName(declaration.name);
    });
    it("Does not throw if a map declaration has a default value that is not part of the map of possible values", () => {
        const declaration = {
            name: "testMapDeclarationWithForeignDefaultValue",
            help: "",
            type: utils_1.ParameterType.Map,
            map: new Map([
                ["a", 1],
                ["b", 2],
            ]),
            defaultValue: 0,
        };
        options.addDeclaration(declaration);
        options.removeDeclarationByName(declaration.name);
    });
    it("Supports removing a declaration by name", () => {
        options.addDeclaration({ name: "not-an-option", help: "" });
        options.removeDeclarationByName("not-an-option");
        (0, assert_1.deepStrictEqual)(options.getDeclaration("not-an-option"), undefined);
    });
    it("Ignores removal of non-existent declarations", () => {
        options.removeDeclarationByName("not-an-option");
        (0, assert_1.deepStrictEqual)(options.getDeclaration("not-an-option"), undefined);
    });
    it("Throws on attempt to get an undeclared option", () => {
        (0, assert_1.throws)(() => options.getValue("does-not-exist"));
    });
    it("Does not allow fetching compiler options through getValue", () => {
        (0, assert_1.throws)(() => options.getValue("target"));
    });
    it("Errors if converting a set value errors", () => {
        (0, assert_1.throws)(() => options.setValue("mapped", "nonsense"));
    });
    it("Errors if setting flags to an invalid value", () => {
        (0, assert_1.throws)(() => options.setValue("validation", "bad"));
        (0, assert_1.throws)(() => options.setValue("validation", void 0));
        (0, assert_1.throws)(() => options.setValue("validation", { notExported: "bad" }));
    });
    it("Errors if setting a flag which does not exist", () => {
        (0, assert_1.throws)(() => options.setValue("validation", { doesNotExist: true }));
    });
    it("Allows setting flag objects to true/false", () => {
        options.setValue("validation", true);
        (0, assert_1.deepStrictEqual)(options.getValue("validation"), {
            notExported: true,
            invalidLink: true,
        });
        options.setValue("validation", false);
        (0, assert_1.deepStrictEqual)(options.getValue("validation"), {
            notExported: false,
            invalidLink: false,
        });
    });
    it("Resets a flag to the default if set to null", () => {
        const options = new utils_1.Options(new utils_1.Logger());
        options.addDefaultDeclarations();
        options.setValue("validation", { notExported: true });
        options.setValue("validation", { notExported: null });
        (0, assert_1.deepStrictEqual)(options.getValue("validation").notExported, true);
        options.setValue("validation", { notExported: false });
        options.setValue("validation", { notExported: null });
        (0, assert_1.deepStrictEqual)(options.getValue("validation").notExported, true);
    });
    it("Handles mapped enums properly", () => {
        const options = new utils_1.Options(new utils_1.Logger());
        options.addDefaultDeclarations();
        (0, assert_1.deepStrictEqual)(options.getValue("logLevel"), utils_1.LogLevel.Info);
        options.setValue("logLevel", utils_1.LogLevel.Error);
        (0, assert_1.deepStrictEqual)(options.getValue("logLevel"), utils_1.LogLevel.Error);
        options.setValue("logLevel", "Verbose");
        (0, assert_1.deepStrictEqual)(options.getValue("logLevel"), utils_1.LogLevel.Verbose);
    });
    it("Supports directly getting values", () => {
        (0, assert_1.deepStrictEqual)(options.getRawValues().entryPoints, []);
    });
    it("Supports checking if an option is set", () => {
        const options = new utils_1.Options(new utils_1.Logger());
        options.addDefaultDeclarations();
        (0, assert_1.deepStrictEqual)(options.isSet("excludePrivate"), false);
        options.setValue("excludePrivate", false);
        (0, assert_1.deepStrictEqual)(options.isSet("excludePrivate"), true);
        options.reset();
        (0, assert_1.deepStrictEqual)(options.isSet("excludePrivate"), false);
        (0, assert_1.throws)(() => options.isSet("does not exist"));
    });
    it("Throws if frozen and a value is set", () => {
        const options = new utils_1.Options(new utils_1.Logger());
        options.addDefaultDeclarations();
        options.freeze();
        (0, assert_1.throws)(() => options.setValue("emit", true));
        (0, assert_1.throws)(() => options.setCompilerOptions([], {}, []));
    });
    it("Supports resetting values", () => {
        const options = new utils_1.Options(new utils_1.Logger());
        options.addDefaultDeclarations();
        options.setValue("entryPoints", ["x"]);
        options.setValue("excludeTags", ["x"]);
        options.reset();
        (0, assert_1.deepStrictEqual)(options.getValue("entryPoints"), []);
        (0, assert_1.deepStrictEqual)(options.getValue("excludeTags"), []);
    });
    it("Supports resetting a single value", () => {
        const options = new utils_1.Options(new utils_1.Logger());
        options.addDefaultDeclarations();
        options.setValue("name", "test");
        options.setValue("excludeTags", ["x"]);
        options.reset("excludeTags");
        (0, assert_1.deepStrictEqual)(options.getValue("name"), "test");
        (0, assert_1.deepStrictEqual)(options.getValue("excludeTags"), []);
    });
    it("Throws if resetting a single value which does not exist", () => {
        const options = new utils_1.Options(new utils_1.Logger());
        options.addDefaultDeclarations();
        (0, assert_1.throws)(() => options.reset("thisOptionDoesNotExist"));
    });
});
describe("BindOption", () => {
    class Container {
        constructor(options) {
            this.options = options;
        }
    }
    __decorate([
        (0, options_1.BindOption)("emit")
    ], Container.prototype, "emit", void 0);
    it("Supports fetching options", () => {
        const options = new utils_1.Options(new utils_1.Logger());
        options.addDefaultDeclarations();
        const container = new Container(options);
        (0, assert_1.deepStrictEqual)(container.emit, "docs");
    });
    it("Updates as option values change", () => {
        const options = new utils_1.Options(new utils_1.Logger());
        options.addDefaultDeclarations();
        const container = new Container(options);
        (0, assert_1.deepStrictEqual)(container.emit, "docs");
        options.setValue("emit", "both");
        (0, assert_1.deepStrictEqual)(container.emit, "both");
    });
    it("Caches set options when frozen", () => {
        const options = new utils_1.Options(new utils_1.Logger());
        options.addDefaultDeclarations();
        const container = new Container(options);
        options.setValue("emit", "both");
        options.freeze();
        (0, assert_1.deepStrictEqual)(container.emit, "both");
        const prop = Object.getOwnPropertyDescriptor(container, "emit");
        (0, assert_1.deepStrictEqual)(prop.get, void 0);
        (0, assert_1.deepStrictEqual)(prop.value, "both");
    });
});
//# sourceMappingURL=options.test.js.map