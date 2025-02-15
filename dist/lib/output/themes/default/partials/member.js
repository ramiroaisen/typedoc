"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.member = void 0;
const lib_1 = require("../../lib");
const utils_1 = require("../../../../utils");
const models_1 = require("../../../../models");
const member = (context, props) => {
    var _a;
    return (utils_1.JSX.createElement("section", { class: "tsd-panel tsd-member " + props.cssClasses },
        utils_1.JSX.createElement("a", { id: props.anchor, class: "tsd-anchor" }),
        !!props.name && (utils_1.JSX.createElement("h3", null,
            (0, lib_1.renderFlags)(props.flags),
            (0, lib_1.wbr)(props.name))),
        props.signatures
            ? context.memberSignatures(props)
            : props.hasGetterOrSetter()
                ? context.memberGetterSetter(props)
                : props instanceof models_1.ReferenceReflection
                    ? context.memberReference(props)
                    : context.memberDeclaration(props), (_a = props.groups) === null || _a === void 0 ? void 0 :
        _a.map((item) => item.children.map((item) => !item.hasOwnDocument && context.member(item)))));
};
exports.member = member;
//# sourceMappingURL=member.js.map