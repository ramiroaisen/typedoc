"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeAndParent = void 0;
const models_1 = require("../../../../models");
const utils_1 = require("../../../../utils");
const typeAndParent = (context, props) => {
    if (!props)
        return utils_1.JSX.createElement(utils_1.JSX.Fragment, null, "void");
    if (props instanceof models_1.ArrayType) {
        return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            context.typeAndParent(props.elementType),
            "[]"));
    }
    if (props instanceof models_1.ReferenceType && props.reflection) {
        const refl = props.reflection instanceof models_1.SignatureReflection ? props.reflection.parent : props.reflection;
        const parent = refl === null || refl === void 0 ? void 0 : refl.parent;
        return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            (parent === null || parent === void 0 ? void 0 : parent.url) ? utils_1.JSX.createElement("a", { href: context.urlTo(parent) }, parent.name) : parent === null || parent === void 0 ? void 0 : parent.name,
            ".",
            (refl === null || refl === void 0 ? void 0 : refl.url) ? utils_1.JSX.createElement("a", { href: context.urlTo(refl) }, refl.name) : refl === null || refl === void 0 ? void 0 : refl.name));
    }
    return utils_1.JSX.createElement(utils_1.JSX.Fragment, null, props.toString());
};
exports.typeAndParent = typeAndParent;
//# sourceMappingURL=typeAndParent.js.map