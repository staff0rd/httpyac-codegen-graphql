"use strict";
exports.__esModule = true;
exports.generateHttpFile = void 0;
var graphql_1 = require("graphql");
var buildVariables_1 = require("./buildVariables");
var generateHttpFile = function (operation, config) {
    var _a, _b, _c;
    var host = config.host;
    var httpFile = [];
    var headers = "POST ".concat(host, "\nContent-Type: application/json");
    httpFile.push(headers);
    var request = (0, graphql_1.print)(operation);
    httpFile.push(request);
    var schemaVariables = operation.variableDefinitions;
    var configVariables = ((_a = config.variables) !== null && _a !== void 0 ? _a : {})[(_c = (_b = operation.name) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : ""];
    var variables = (0, buildVariables_1.buildVariables)(configVariables, schemaVariables);
    if (variables)
        httpFile.push(JSON.stringify(variables, null, 2));
    return httpFile.join("\n\n");
};
exports.generateHttpFile = generateHttpFile;
