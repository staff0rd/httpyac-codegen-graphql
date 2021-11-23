"use strict";
exports.__esModule = true;
exports.generateHttpFile = void 0;
var graphql_1 = require("graphql");
var generateHttpFile = function (operation, config) {
    var host = config.host;
    var httpFile = [];
    var headers = "POST ".concat(host, "\nContent-Type: application/json");
    httpFile.push(headers);
    var request = (0, graphql_1.print)(operation);
    console.log(JSON.stringify(operation, null, 2));
    httpFile.push(request);
    var schemaVariables = operation.variableDefinitions;
    var configVariables = config.variables[operation.name.value];
    if (configVariables || (schemaVariables === null || schemaVariables === void 0 ? void 0 : schemaVariables.length)) {
        var mandatoryVariables = Object.fromEntries(schemaVariables
            .filter(function (v) { return v.type.kind === "NonNullType"; })
            .map(function (v) {
            var _a;
            return [
                v.variable.name.value,
                (_a = (configVariables || {})[v.variable.name.value]) !== null && _a !== void 0 ? _a : "$".concat(v.variable.name.value),
            ];
        }));
        httpFile.push(JSON.stringify(mandatoryVariables));
    }
    return httpFile.join("\n\n");
};
exports.generateHttpFile = generateHttpFile;
