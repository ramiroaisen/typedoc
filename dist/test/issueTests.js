"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueTests = void 0;
const assert_1 = require("assert");
const models_1 = require("../lib/models");
function query(project, name) {
    const reflection = project.getChildByName(name);
    (0, assert_1.ok)(reflection instanceof models_1.DeclarationReflection, `Failed to find ${name}`);
    return reflection;
}
exports.issueTests = {
    gh869(project) {
        var _a, _b, _c, _d;
        const classFoo = (_a = project.children) === null || _a === void 0 ? void 0 : _a.find((r) => r.name === "Foo" && r.kind === models_1.ReflectionKind.Class);
        (0, assert_1.ok)(classFoo instanceof models_1.DeclarationReflection);
        (0, assert_1.deepStrictEqual)((_b = classFoo.children) === null || _b === void 0 ? void 0 : _b.find((r) => r.name === "x"), undefined);
        const nsFoo = (_c = project.children) === null || _c === void 0 ? void 0 : _c.find((r) => r.name === "Foo" && r.kind === models_1.ReflectionKind.Namespace);
        (0, assert_1.ok)(nsFoo instanceof models_1.DeclarationReflection);
        (0, assert_1.ok)((_d = nsFoo.children) === null || _d === void 0 ? void 0 : _d.find((r) => r.name === "x"));
    },
    gh1124(project) {
        var _a;
        (0, assert_1.deepStrictEqual)((_a = project.children) === null || _a === void 0 ? void 0 : _a.length, 1, "Namespace with type and value converted twice");
    },
    gh1150(project) {
        var _a;
        const refl = query(project, "IntersectFirst");
        (0, assert_1.deepStrictEqual)(refl === null || refl === void 0 ? void 0 : refl.kind, models_1.ReflectionKind.TypeAlias);
        (0, assert_1.deepStrictEqual)((_a = refl.type) === null || _a === void 0 ? void 0 : _a.type, "indexedAccess");
    },
    gh1164(project) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const refl = query(project, "gh1164");
        (0, assert_1.deepStrictEqual)((_e = (_d = (_c = (_b = (_a = refl.signatures) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.parameters) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.comment) === null || _e === void 0 ? void 0 : _e.shortText, "{@link CommentedClass} Test description.");
        (0, assert_1.deepStrictEqual)((_h = (_g = (_f = refl.signatures) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.comment) === null || _h === void 0 ? void 0 : _h.returns, "Test description.\n");
    },
    gh1215(project) {
        var _a;
        const foo = query(project, "Foo.bar");
        (0, assert_1.ok)(foo.setSignature instanceof models_1.SignatureReflection);
        (0, assert_1.deepStrictEqual)((_a = foo.setSignature.type) === null || _a === void 0 ? void 0 : _a.toString(), "void");
    },
    gh1255(project) {
        var _a;
        const foo = query(project, "C.foo");
        (0, assert_1.deepStrictEqual)((_a = foo.comment) === null || _a === void 0 ? void 0 : _a.shortText, "Docs!");
    },
    gh1330(project) {
        var _a;
        const example = query(project, "ExampleParam");
        (0, assert_1.deepStrictEqual)((_a = example === null || example === void 0 ? void 0 : example.type) === null || _a === void 0 ? void 0 : _a.type, "reference");
        (0, assert_1.deepStrictEqual)(example.type.toString(), "Example");
    },
    gh1366(project) {
        const foo = query(project, "GH1366.Foo");
        (0, assert_1.deepStrictEqual)(foo.kind, models_1.ReflectionKind.Reference);
    },
    gh1408(project) {
        var _a, _b, _c;
        const foo = query(project, "foo");
        const type = (_c = (_b = (_a = foo === null || foo === void 0 ? void 0 : foo.signatures) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.typeParameters) === null || _c === void 0 ? void 0 : _c[0].type;
        (0, assert_1.deepStrictEqual)(type === null || type === void 0 ? void 0 : type.type, "array");
        (0, assert_1.deepStrictEqual)(type === null || type === void 0 ? void 0 : type.toString(), "unknown[]");
    },
    gh1436(project) {
        var _a;
        (0, assert_1.deepStrictEqual)((_a = project.children) === null || _a === void 0 ? void 0 : _a.map((c) => c.name), ["gh1436"]);
    },
    gh1449(project) {
        var _a, _b, _c;
        const refl = (_a = query(project, "gh1449").signatures) === null || _a === void 0 ? void 0 : _a[0];
        (0, assert_1.deepStrictEqual)((_c = (_b = refl === null || refl === void 0 ? void 0 : refl.typeParameters) === null || _b === void 0 ? void 0 : _b[0].type) === null || _c === void 0 ? void 0 : _c.toString(), "[foo: any, bar?: any]");
    },
    gh1454(project) {
        var _a, _b, _c, _d;
        const foo = query(project, "foo");
        const fooRet = (_b = (_a = foo === null || foo === void 0 ? void 0 : foo.signatures) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.type;
        (0, assert_1.deepStrictEqual)(fooRet === null || fooRet === void 0 ? void 0 : fooRet.type, "reference");
        (0, assert_1.deepStrictEqual)(fooRet === null || fooRet === void 0 ? void 0 : fooRet.toString(), "Foo");
        const bar = query(project, "bar");
        const barRet = (_d = (_c = bar === null || bar === void 0 ? void 0 : bar.signatures) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.type;
        (0, assert_1.deepStrictEqual)(barRet === null || barRet === void 0 ? void 0 : barRet.type, "reference");
        (0, assert_1.deepStrictEqual)(barRet === null || barRet === void 0 ? void 0 : barRet.toString(), "Bar");
    },
    gh1462(project) {
        var _a, _b, _c, _d;
        const prop = query(project, "PROP");
        (0, assert_1.deepStrictEqual)((_a = prop.type) === null || _a === void 0 ? void 0 : _a.toString(), "number");
        // Would be nice to get this to work someday
        (0, assert_1.deepStrictEqual)((_b = prop.comment) === null || _b === void 0 ? void 0 : _b.shortText, void 0);
        const method = query(project, "METHOD");
        (0, assert_1.deepStrictEqual)((_d = (_c = method.signatures) === null || _c === void 0 ? void 0 : _c[0].comment) === null || _d === void 0 ? void 0 : _d.shortText, "method docs");
    },
    gh1481(project) {
        var _a, _b, _c;
        const signature = (_a = query(project, "GH1481.static").signatures) === null || _a === void 0 ? void 0 : _a[0];
        (0, assert_1.deepStrictEqual)((_b = signature === null || signature === void 0 ? void 0 : signature.comment) === null || _b === void 0 ? void 0 : _b.shortText, "static docs");
        (0, assert_1.deepStrictEqual)((_c = signature === null || signature === void 0 ? void 0 : signature.type) === null || _c === void 0 ? void 0 : _c.toString(), "void");
    },
    gh1483(project) {
        (0, assert_1.deepStrictEqual)(query(project, "gh1483.namespaceExport").kind, models_1.ReflectionKind.Function);
        (0, assert_1.deepStrictEqual)(query(project, "gh1483_2.staticMethod").kind, models_1.ReflectionKind.Method);
    },
    gh1490(project) {
        var _a, _b, _c;
        const refl = query(project, "GH1490.optionalMethod");
        (0, assert_1.deepStrictEqual)((_c = (_b = (_a = refl.signatures) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.comment) === null || _c === void 0 ? void 0 : _c.shortText, "With comment");
    },
    gh1509(project) {
        const pFoo = query(project, "PartialFoo.foo");
        (0, assert_1.deepStrictEqual)(pFoo.flags.isOptional, true);
        const rFoo = query(project, "ReadonlyFoo.foo");
        (0, assert_1.deepStrictEqual)(rFoo.flags.isReadonly, true);
        (0, assert_1.deepStrictEqual)(rFoo.flags.isOptional, true);
    },
    gh1514(project) {
        // Not ideal. Really we want to handle these names nicer...
        query(project, "ComputedUniqueName.[UNIQUE_SYMBOL]");
    },
    gh1522(project) {
        var _a;
        (0, assert_1.deepStrictEqual)((_a = project.groups) === null || _a === void 0 ? void 0 : _a.map((g) => { var _a; return (_a = g.categories) === null || _a === void 0 ? void 0 : _a.map((c) => c.title); }), [["cat"]]);
    },
    gh1524(project) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const nullableParam = (_c = (_b = (_a = query(project, "nullable").signatures) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.parameters) === null || _c === void 0 ? void 0 : _c[0];
        (0, assert_1.deepStrictEqual)((_d = nullableParam === null || nullableParam === void 0 ? void 0 : nullableParam.type) === null || _d === void 0 ? void 0 : _d.toString(), "null | string");
        const nonNullableParam = (_g = (_f = (_e = query(project, "nonNullable").signatures) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.parameters) === null || _g === void 0 ? void 0 : _g[0];
        (0, assert_1.deepStrictEqual)((_h = nonNullableParam === null || nonNullableParam === void 0 ? void 0 : nonNullableParam.type) === null || _h === void 0 ? void 0 : _h.toString(), "string");
    },
    gh1534(project) {
        var _a, _b, _c, _d, _e;
        const func = query(project, "gh1534");
        (0, assert_1.deepStrictEqual)((_e = (_d = (_c = (_b = (_a = func.signatures) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.parameters) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.type) === null || _e === void 0 ? void 0 : _e.toString(), "readonly [number, string]");
    },
    gh1547(project) {
        var _a;
        (0, assert_1.deepStrictEqual)((_a = project.children) === null || _a === void 0 ? void 0 : _a.map((c) => c.name), ["Test", "ThingA", "ThingB"]);
    },
    gh1552(project) {
        (0, assert_1.deepStrictEqual)(query(project, "emptyArr").defaultValue, "[]");
        (0, assert_1.deepStrictEqual)(query(project, "nonEmptyArr").defaultValue, "...");
        (0, assert_1.deepStrictEqual)(query(project, "emptyObj").defaultValue, "{}");
        (0, assert_1.deepStrictEqual)(query(project, "nonEmptyObj").defaultValue, "...");
    },
    gh1578(project) {
        (0, assert_1.ok)(query(project, "notIgnored"));
        (0, assert_1.ok)(!project.findReflectionByName("ignored"), "Symbol re-exported from ignored file is ignored.");
    },
    gh1580(project) {
        var _a, _b;
        (0, assert_1.ok)(query(project, "B.prop").hasComment(), "Overwritten property with no comment should be inherited");
        (0, assert_1.ok)((_b = (_a = query(project, "B.run").signatures) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.hasComment(), "Overwritten method with no comment should be inherited");
    },
    gh1624(project) {
        var _a, _b;
        (0, assert_1.ok)((_b = (_a = query(project, "Foo.baz").signatures) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.hasComment(), "Property methods declared in interface should still allow comment inheritance");
    },
    gh1626(project) {
        var _a, _b, _c, _d;
        const ctor = query(project, "Foo.constructor");
        (0, assert_1.deepStrictEqual)((_b = (_a = ctor.sources) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.line, 2);
        (0, assert_1.deepStrictEqual)((_d = (_c = ctor.sources) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.character, 4);
    },
    gh1660(project) {
        const alias = query(project, "SomeType");
        (0, assert_1.ok)(alias.type instanceof models_1.QueryType);
        (0, assert_1.deepStrictEqual)(alias.type.queryType.name, "m.SomeClass.someProp");
    },
    gh1733(project) {
        var _a, _b, _c, _d;
        const alias = query(project, "Foo");
        (0, assert_1.deepStrictEqual)((_b = (_a = alias.typeParameters) === null || _a === void 0 ? void 0 : _a[0].comment) === null || _b === void 0 ? void 0 : _b.shortText.trim(), "T docs");
        const cls = query(project, "Bar");
        (0, assert_1.deepStrictEqual)((_d = (_c = cls.typeParameters) === null || _c === void 0 ? void 0 : _c[0].comment) === null || _d === void 0 ? void 0 : _d.shortText.trim(), "T docs");
    },
    gh1734(project) {
        var _a;
        const alias = query(project, "Foo");
        const type = alias.type;
        (0, assert_1.ok)(type instanceof models_1.ReflectionType);
        const expectedComment = new models_1.Comment();
        expectedComment.returns = undefined;
        expectedComment.tags = [
            new models_1.CommentTag("asdf", void 0, "Some example text\n"),
        ];
        (0, assert_1.deepStrictEqual)((_a = type.declaration.signatures) === null || _a === void 0 ? void 0 : _a[0].comment, expectedComment);
    },
    gh1745(project) {
        var _a, _b, _c, _d, _e;
        const Foo = query(project, "Foo");
        (0, assert_1.ok)(Foo.type instanceof models_1.ReflectionType);
        const group = (_a = project.groups) === null || _a === void 0 ? void 0 : _a.find((g) => g.kind === models_1.ReflectionKind.TypeAlias);
        (0, assert_1.ok)(group);
        const cat = (_b = group.categories) === null || _b === void 0 ? void 0 : _b.find((cat) => cat.title === "My category");
        (0, assert_1.ok)(cat);
        (0, assert_1.ok)(cat.children.includes(Foo));
        (0, assert_1.ok)(!((_c = Foo.comment) === null || _c === void 0 ? void 0 : _c.hasTag("category")));
        (0, assert_1.ok)(!((_d = Foo.type.declaration.comment) === null || _d === void 0 ? void 0 : _d.hasTag("category")));
        (0, assert_1.ok)(!((_e = Foo.type.declaration.signatures) === null || _e === void 0 ? void 0 : _e.some((s) => { var _a; return (_a = s.comment) === null || _a === void 0 ? void 0 : _a.hasTag("category"); })));
    },
};
//# sourceMappingURL=issueTests.js.map