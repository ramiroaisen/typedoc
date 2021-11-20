"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterHint = exports.ParameterType = exports.EmitStrategy = exports.TSConfigReader = exports.TypeDocReader = exports.ArgumentsReader = exports.BindOption = exports.Options = void 0;
var options_1 = require("./options");
Object.defineProperty(exports, "Options", { enumerable: true, get: function () { return options_1.Options; } });
Object.defineProperty(exports, "BindOption", { enumerable: true, get: function () { return options_1.BindOption; } });
var readers_1 = require("./readers");
Object.defineProperty(exports, "ArgumentsReader", { enumerable: true, get: function () { return readers_1.ArgumentsReader; } });
Object.defineProperty(exports, "TypeDocReader", { enumerable: true, get: function () { return readers_1.TypeDocReader; } });
Object.defineProperty(exports, "TSConfigReader", { enumerable: true, get: function () { return readers_1.TSConfigReader; } });
var declaration_1 = require("./declaration");
Object.defineProperty(exports, "EmitStrategy", { enumerable: true, get: function () { return declaration_1.EmitStrategy; } });
Object.defineProperty(exports, "ParameterType", { enumerable: true, get: function () { return declaration_1.ParameterType; } });
Object.defineProperty(exports, "ParameterHint", { enumerable: true, get: function () { return declaration_1.ParameterHint; } });
//# sourceMappingURL=index.js.map