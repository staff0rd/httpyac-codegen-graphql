"use strict";
exports.__esModule = true;
exports.buildVariables = void 0;
var buildVariables = function (configVariables, schemaVariables) {
    if (configVariables || (schemaVariables === null || schemaVariables === void 0 ? void 0 : schemaVariables.length)) {
        var entries = (schemaVariables !== null && schemaVariables !== void 0 ? schemaVariables : []).map(function (v) {
            var _a;
            var key = v.variable.name.value;
            var value = (_a = configVariables === null || configVariables === void 0 ? void 0 : configVariables[key]) !== null && _a !== void 0 ? _a : (v.type.kind === "NonNullType" ? "$".concat(v.variable.name.value) : null);
            return [key, value];
        });
        return Object.fromEntries(entries);
    }
};
exports.buildVariables = buildVariables;
