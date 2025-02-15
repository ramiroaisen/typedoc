"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeParameters = void 0;
const utils_1 = require("../../../../utils");
function typeParameters(context, typeParameters) {
    return (utils_1.JSX.createElement("ul", { class: "tsd-type-parameters" }, typeParameters === null || typeParameters === void 0 ? void 0 : typeParameters.map((item) => (utils_1.JSX.createElement("li", null,
        utils_1.JSX.createElement("h4", null,
            item.name,
            !!item.type && (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
                utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, ": "),
                context.type(item.type))),
            !!item.default && (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
                " = ",
                context.type(item.default)))),
        context.comment(item))))));
}
exports.typeParameters = typeParameters;
//# sourceMappingURL=typeParameters.js.map