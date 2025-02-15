"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hierarchy = void 0;
const utils_1 = require("../../../../utils");
const hierarchy = (context, props) => (utils_1.JSX.createElement("ul", { class: "tsd-hierarchy" }, props.types.map((item, i, l) => (utils_1.JSX.createElement("li", null,
    props.isTarget ? utils_1.JSX.createElement("span", { class: "target" }, item.toString()) : context.type(item),
    i === l.length - 1 && !!props.next && context.hierarchy(props.next))))));
exports.hierarchy = hierarchy;
//# sourceMappingURL=hierarchy.js.map