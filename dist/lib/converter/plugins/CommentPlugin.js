"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CommentPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentPlugin = void 0;
const ts = require("typescript");
const index_1 = require("../../models/comments/index");
const index_2 = require("../../models/reflections/index");
const components_1 = require("../components");
const comment_1 = require("../factories/comment");
const converter_1 = require("../converter");
const models_1 = require("../../models");
const utils_1 = require("../../utils");
/**
 * These tags are not useful to display in the generated documentation.
 * They should be ignored when parsing comments. Any relevant type information
 * (for JS users) will be consumed by TypeScript and need not be preserved
 * in the comment.
 *
 * Note that param/arg/argument/return/returns are not present.
 * These tags will have their type information stripped when parsing, but still
 * provide useful information for documentation.
 */
const TAG_BLACKLIST = [
    "augments",
    "callback",
    "class",
    "constructor",
    "enum",
    "extends",
    "this",
    "type",
    "typedef",
];
/**
 * A handler that parses TypeDoc comments and attaches {@link Comment} instances to
 * the generated reflections.
 */
let CommentPlugin = CommentPlugin_1 = class CommentPlugin extends components_1.ConverterComponent {
    /**
     * Create a new CommentPlugin instance.
     */
    initialize() {
        this.listenTo(this.owner, {
            [converter_1.Converter.EVENT_CREATE_DECLARATION]: this.onDeclaration,
            [converter_1.Converter.EVENT_CREATE_SIGNATURE]: this.onDeclaration,
            [converter_1.Converter.EVENT_CREATE_TYPE_PARAMETER]: this.onCreateTypeParameter,
            [converter_1.Converter.EVENT_RESOLVE_BEGIN]: this.onBeginResolve,
            [converter_1.Converter.EVENT_RESOLVE]: this.onResolve,
        });
    }
    /**
     * Apply all comment tag modifiers to the given reflection.
     *
     * @param reflection  The reflection the modifiers should be applied to.
     * @param comment  The comment that should be searched for modifiers.
     */
    applyModifiers(reflection, comment) {
        var _a, _b, _c;
        if (comment.hasTag("private")) {
            reflection.setFlag(index_2.ReflectionFlag.Private);
            if (reflection.kindOf(index_2.ReflectionKind.CallSignature)) {
                (_a = reflection.parent) === null || _a === void 0 ? void 0 : _a.setFlag(index_2.ReflectionFlag.Private);
            }
            comment.removeTags("private");
        }
        if (comment.hasTag("protected")) {
            reflection.setFlag(index_2.ReflectionFlag.Protected);
            if (reflection.kindOf(index_2.ReflectionKind.CallSignature)) {
                (_b = reflection.parent) === null || _b === void 0 ? void 0 : _b.setFlag(index_2.ReflectionFlag.Protected);
            }
            comment.removeTags("protected");
        }
        if (comment.hasTag("public")) {
            reflection.setFlag(index_2.ReflectionFlag.Public);
            if (reflection.kindOf(index_2.ReflectionKind.CallSignature)) {
                (_c = reflection.parent) === null || _c === void 0 ? void 0 : _c.setFlag(index_2.ReflectionFlag.Public);
            }
            comment.removeTags("public");
        }
        if (comment.hasTag("event")) {
            if (reflection.kindOf(index_2.ReflectionKind.CallSignature)) {
                if (reflection.parent) {
                    reflection.parent.kind = index_2.ReflectionKind.Event;
                }
            }
            reflection.kind = index_2.ReflectionKind.Event;
            comment.removeTags("event");
        }
        if (reflection.kindOf(index_2.ReflectionKind.Module | index_2.ReflectionKind.Namespace) ||
            reflection.kind === index_2.ReflectionKind.Project) {
            comment.removeTags("module");
            comment.removeTags("packagedocumentation");
        }
    }
    /**
     * Triggered when the converter has created a type parameter reflection.
     *
     * @param context  The context object describing the current state the converter is in.
     * @param reflection  The reflection that is currently processed.
     */
    onCreateTypeParameter(_context, reflection, node) {
        if (node && ts.isJSDocTemplateTag(node.parent)) {
            const comment = (0, comment_1.getJsDocCommentText)(node.parent.comment);
            if (comment) {
                reflection.comment = new index_1.Comment(comment);
            }
        }
        const comment = reflection.parent && reflection.parent.comment;
        if (comment) {
            let tag = comment.getTag("typeparam", reflection.name);
            if (!tag) {
                tag = comment.getTag("template", reflection.name);
            }
            if (!tag) {
                tag = comment.getTag("param", `<${reflection.name}>`);
            }
            if (!tag) {
                tag = comment.getTag("param", reflection.name);
            }
            if (tag) {
                reflection.comment = new index_1.Comment(tag.text);
                (0, utils_1.removeIfPresent)(comment.tags, tag);
            }
        }
    }
    /**
     * Triggered when the converter has created a declaration or signature reflection.
     *
     * Invokes the comment parser.
     *
     * @param context  The context object describing the current state the converter is in.
     * @param reflection  The reflection that is currently processed.
     * @param node  The node that is currently processed if available.
     */
    onDeclaration(context, reflection, node) {
        var _a, _b;
        if (reflection.kindOf(index_2.ReflectionKind.FunctionOrMethod)) {
            // We only want a comment on functions/methods if this is a set of overloaded functions.
            // In that case, TypeDoc lets you put a comment on the implementation, and will copy it over to
            // the available signatures so that you can avoid documenting things multiple times.
            // Once TypeDoc has proper support for TSDoc, this will go away since the same thing will be
            // possible by using a @inheritDoc tag to specify that docs should be copied from a specific signature.
            let specialOverloadCase = false;
            if (node &&
                (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node))) {
                const symbol = node.name && context.checker.getSymbolAtLocation(node.name);
                if (symbol && symbol.declarations) {
                    const declarations = symbol.declarations.filter((d) => ts.isFunctionDeclaration(d) ||
                        ts.isMethodDeclaration(d));
                    if (declarations.length > 1 &&
                        "body" in declarations[declarations.length - 1]) {
                        node = declarations[declarations.length - 1];
                        specialOverloadCase = true;
                    }
                }
            }
            if (!specialOverloadCase)
                return;
        }
        // Clean this up in 0.23. We should really accept a ts.Symbol so we don't need exportSymbol on Context
        const exportNode = (_b = (_a = context.exportSymbol) === null || _a === void 0 ? void 0 : _a.getDeclarations()) === null || _b === void 0 ? void 0 : _b[0];
        let rawComment = exportNode && (0, comment_1.getRawComment)(exportNode, this.application.logger);
        rawComment !== null && rawComment !== void 0 ? rawComment : (rawComment = node && (0, comment_1.getRawComment)(node, this.application.logger));
        if (!rawComment) {
            return;
        }
        const comment = (0, comment_1.parseComment)(rawComment, reflection.comment);
        if (reflection.kindOf(index_2.ReflectionKind.Module)) {
            const tag = comment.getTag("module");
            if (tag) {
                // If no name is specified, this is a flag to mark a comment as a module comment
                // and should not result in a reflection rename.
                const newName = tag.text.trim();
                if (newName.length) {
                    reflection.name = newName;
                }
                (0, utils_1.removeIfPresent)(comment.tags, tag);
            }
        }
        this.applyModifiers(reflection, comment);
        this.removeExcludedTags(comment);
        reflection.comment = comment;
    }
    /**
     * Triggered when the converter begins resolving a project.
     *
     * @param context  The context object describing the current state the converter is in.
     */
    onBeginResolve(context) {
        const excludeInternal = this.application.options.getValue("excludeInternal");
        const excludePrivate = this.application.options.getValue("excludePrivate");
        const excludeProtected = this.application.options.getValue("excludeProtected");
        const project = context.project;
        const reflections = Object.values(project.reflections);
        // Remove hidden reflections
        const hidden = reflections.filter((reflection) => CommentPlugin_1.isHidden(reflection, excludeInternal, excludePrivate, excludeProtected));
        hidden.forEach((reflection) => project.removeReflection(reflection));
        // remove functions with empty signatures after their signatures have been removed
        const [allRemoved, someRemoved] = (0, utils_1.partition)((0, utils_1.filterMap)(hidden, (reflection) => {
            var _a;
            return ((_a = reflection.parent) === null || _a === void 0 ? void 0 : _a.kindOf(index_2.ReflectionKind.FunctionOrMethod | index_2.ReflectionKind.Constructor))
                ? reflection.parent
                : void 0;
        }), (method) => { var _a; return ((_a = method.signatures) === null || _a === void 0 ? void 0 : _a.length) === 0; });
        allRemoved.forEach((reflection) => project.removeReflection(reflection));
        someRemoved.forEach((reflection) => {
            reflection.sources = (0, utils_1.unique)(reflection.signatures.reduce((c, s) => c.concat(s.sources || []), []));
        });
    }
    /**
     * Triggered when the converter resolves a reflection.
     *
     * Cleans up comment tags related to signatures like @param or @return
     * and moves their data to the corresponding parameter reflections.
     *
     * This hook also copies over the comment of function implementations to their
     * signatures.
     *
     * @param context  The context object describing the current state the converter is in.
     * @param reflection  The reflection that is currently resolved.
     */
    onResolve(_context, reflection) {
        if (!(reflection instanceof index_2.DeclarationReflection)) {
            return;
        }
        if (reflection.type instanceof models_1.ReflectionType) {
            this.addCommentToSignatures(reflection, reflection.type.declaration.getNonIndexSignatures());
        }
        else {
            this.addCommentToSignatures(reflection, reflection.getNonIndexSignatures());
        }
    }
    addCommentToSignatures(reflection, signatures) {
        if (!signatures.length) {
            return;
        }
        const comment = reflection.comment;
        if (comment && comment.hasTag("returns")) {
            comment.returns = comment.getTag("returns").text;
            comment.removeTags("returns");
        }
        signatures.forEach((signature) => {
            var _a, _b;
            let childComment = signature.comment;
            if (childComment && childComment.hasTag("returns")) {
                childComment.returns = childComment.getTag("returns").text;
                childComment.removeTags("returns");
            }
            if (comment) {
                if (!childComment) {
                    childComment = signature.comment = new index_1.Comment();
                }
                childComment.shortText || (childComment.shortText = comment.shortText);
                childComment.text || (childComment.text = comment.text);
                childComment.returns || (childComment.returns = comment.returns);
                childComment.tags = childComment.tags.length
                    ? childComment.tags
                    : [...comment.tags];
            }
            (_a = signature.parameters) === null || _a === void 0 ? void 0 : _a.forEach((parameter, index) => {
                var _a;
                let tag;
                if (childComment && parameter.name === "__namedParameters") {
                    const commentParams = childComment === null || childComment === void 0 ? void 0 : childComment.tags.filter((tag) => tag.tagName === "param" &&
                        !tag.paramName.includes("."));
                    if (((_a = signature.parameters) === null || _a === void 0 ? void 0 : _a.length) === commentParams.length &&
                        commentParams[index].paramName) {
                        parameter.name = commentParams[index].paramName;
                    }
                }
                if (childComment) {
                    moveNestedParamTags(childComment, parameter);
                    tag = childComment.getTag("param", parameter.name);
                }
                if (comment && !tag) {
                    tag = comment.getTag("param", parameter.name);
                }
                if (tag) {
                    parameter.comment = new index_1.Comment(tag.text);
                }
            });
            (_b = signature.typeParameters) === null || _b === void 0 ? void 0 : _b.forEach((parameter) => {
                let tag;
                if (childComment) {
                    tag =
                        childComment.getTag("typeparam", parameter.name) ||
                            childComment.getTag("template", parameter.name) ||
                            childComment.getTag("param", `<${parameter.name}>`);
                }
                if (comment && !tag) {
                    tag =
                        comment.getTag("typeparam", parameter.name) ||
                            comment.getTag("template", parameter.name) ||
                            comment.getTag("param", `<${parameter.name}>`);
                }
                if (tag) {
                    parameter.comment = new index_1.Comment(tag.text);
                }
            });
            childComment === null || childComment === void 0 ? void 0 : childComment.removeTags("param");
            childComment === null || childComment === void 0 ? void 0 : childComment.removeTags("typeparam");
            childComment === null || childComment === void 0 ? void 0 : childComment.removeTags("template");
        });
        delete reflection.comment;
    }
    removeExcludedTags(comment) {
        for (const tag of TAG_BLACKLIST) {
            comment.removeTags(tag);
        }
        for (const tag of this.excludeTags) {
            comment.removeTags(tag);
        }
    }
    /**
     * Determines whether or not a reflection has been hidden
     *
     * @param reflection Reflection to check if hidden
     */
    static isHidden(reflection, excludeInternal, excludePrivate, excludeProtected) {
        const comment = reflection.comment;
        if (reflection.flags.hasFlag(index_2.ReflectionFlag.Private) &&
            excludePrivate) {
            return true;
        }
        if (reflection.flags.hasFlag(index_2.ReflectionFlag.Protected) &&
            excludeProtected) {
            return true;
        }
        if (!comment) {
            return false;
        }
        return (comment.hasTag("hidden") ||
            comment.hasTag("ignore") ||
            (comment.hasTag("internal") && excludeInternal));
    }
};
__decorate([
    (0, utils_1.BindOption)("excludeTags")
], CommentPlugin.prototype, "excludeTags", void 0);
CommentPlugin = CommentPlugin_1 = __decorate([
    (0, components_1.Component)({ name: "comment" })
], CommentPlugin);
exports.CommentPlugin = CommentPlugin;
// Moves tags like `@param foo.bar docs for bar` into the `bar` property of the `foo` parameter.
function moveNestedParamTags(comment, parameter) {
    if (parameter.type instanceof models_1.ReflectionType) {
        const tags = comment.tags.filter((t) => t.tagName === "param" &&
            t.paramName.startsWith(`${parameter.name}.`));
        for (const tag of tags) {
            const path = tag.paramName.split(".");
            path.shift();
            const child = parameter.type.declaration.getChildByName(path);
            if (child && !child.comment) {
                child.comment = new index_1.Comment(tag.text);
            }
        }
    }
}
//# sourceMappingURL=CommentPlugin.js.map