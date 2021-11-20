"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.behaviorTests = void 0;
const assert_1 = require("assert");
const models_1 = require("../lib/models");
function query(project, name) {
    const reflection = project.getChildByName(name);
    (0, assert_1.ok)(reflection instanceof models_1.DeclarationReflection, `Failed to find ${name}`);
    return reflection;
}
exports.behaviorTests = {
    asConstEnum(project) {
        const SomeEnumLike = query(project, "SomeEnumLike");
        (0, assert_1.deepStrictEqual)(SomeEnumLike.kind, models_1.ReflectionKind.Variable, "SomeEnumLike");
        const SomeEnumLikeTagged = query(project, "SomeEnumLikeTagged");
        (0, assert_1.deepStrictEqual)(SomeEnumLikeTagged.kind, models_1.ReflectionKind.Enum, "SomeEnumLikeTagged");
        const A = query(project, "SomeEnumLikeTagged.a");
        (0, assert_1.deepStrictEqual)(A.defaultValue, '"a"');
        const ManualEnum = query(project, "ManualEnum");
        (0, assert_1.deepStrictEqual)(ManualEnum.kind, models_1.ReflectionKind.Enum, "ManualEnum");
        const ManualWithoutHelper = query(project, "ManualEnumHelper");
        (0, assert_1.deepStrictEqual)(ManualWithoutHelper.kind, models_1.ReflectionKind.Enum, "ManualEnumHelper");
        const WithoutReadonly = query(project, "WithoutReadonly");
        (0, assert_1.deepStrictEqual)(WithoutReadonly.kind, models_1.ReflectionKind.Enum, "WithoutReadonly");
    },
    duplicateHeritageClauses(project) {
        var _a, _b, _c, _d;
        const b = query(project, "B");
        (0, assert_1.deepStrictEqual)((_a = b.extendedTypes) === null || _a === void 0 ? void 0 : _a.map(String), ["A"]);
        const c = query(project, "C");
        (0, assert_1.deepStrictEqual)((_b = c.extendedTypes) === null || _b === void 0 ? void 0 : _b.map(String), ["A"]);
        (0, assert_1.deepStrictEqual)((_c = c.implementedTypes) === null || _c === void 0 ? void 0 : _c.map(String), ["A"]);
        const d = query(project, "D");
        (0, assert_1.deepStrictEqual)((_d = d.extendedTypes) === null || _d === void 0 ? void 0 : _d.map(String), [
            'Record<"a", 1>',
            'Record<"b", 1>',
        ]);
    },
    overloads(project) {
        var _a, _b, _c, _d, _e, _f, _g;
        const foo = query(project, "foo");
        (0, assert_1.deepStrictEqual)((_a = foo.signatures) === null || _a === void 0 ? void 0 : _a.length, 2);
        (0, assert_1.deepStrictEqual)((_b = foo.signatures[0].comment) === null || _b === void 0 ? void 0 : _b.shortText, "Implementation comment");
        (0, assert_1.deepStrictEqual)((_c = foo.signatures[0].comment) === null || _c === void 0 ? void 0 : _c.tags, []);
        (0, assert_1.deepStrictEqual)((_d = foo.signatures[1].comment) === null || _d === void 0 ? void 0 : _d.shortText, "Overrides summary");
        (0, assert_1.deepStrictEqual)((_e = foo.signatures[1].comment) === null || _e === void 0 ? void 0 : _e.tags, []);
        (0, assert_1.deepStrictEqual)((_g = (_f = foo.signatures[1].parameters) === null || _f === void 0 ? void 0 : _f[0].comment) === null || _g === void 0 ? void 0 : _g.shortText.trim(), "docs for x");
        (0, assert_1.deepStrictEqual)(foo.comment, undefined);
    },
};
//# sourceMappingURL=behaviorTests.js.map