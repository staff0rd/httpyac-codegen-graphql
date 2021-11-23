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
    httpFile.push(request);
    var variables = config.variables[operation.name.value];
    if (variables)
        httpFile.push(JSON.stringify(variables));
    return httpFile.join("\n\n");
};
exports.generateHttpFile = generateHttpFile;
