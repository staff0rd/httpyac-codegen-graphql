"use strict";
exports.__esModule = true;
exports.extractExternalFragmentsInUse = exports.appendExtensionToFilePath = exports.defineFilepathSubfolder = void 0;
var path_1 = require("path");
var parse_filepath_1 = require("parse-filepath");
var plugin_helpers_1 = require("@graphql-codegen/plugin-helpers");
function defineFilepathSubfolder(baseFilePath, folder) {
    var parsedPath = (0, parse_filepath_1["default"])(baseFilePath);
    return (0, path_1.join)(parsedPath.dir, folder, parsedPath.base).replace(/\\/g, "/");
}
exports.defineFilepathSubfolder = defineFilepathSubfolder;
function appendExtensionToFilePath(baseFilePath, extension) {
    var parsedPath = (0, parse_filepath_1["default"])(baseFilePath);
    return (0, path_1.join)(parsedPath.dir, parsedPath.name + extension).replace(/\\/g, "/");
}
exports.appendExtensionToFilePath = appendExtensionToFilePath;
function extractExternalFragmentsInUse(documentNode, fragmentNameToFile, result, level) {
    if (result === void 0) { result = {}; }
    if (level === void 0) { level = 0; }
    var ignoreList = new Set();
    // First, take all fragments definition from the current file, and mark them as ignored
    (0, plugin_helpers_1.oldVisit)(documentNode, {
        enter: {
            FragmentDefinition: function (node) {
                ignoreList.add(node.name.value);
            }
        }
    });
    // Then, look for all used fragments in this document
    (0, plugin_helpers_1.oldVisit)(documentNode, {
        enter: {
            FragmentSpread: function (node) {
                if (!ignoreList.has(node.name.value)) {
                    if (result[node.name.value] === undefined ||
                        (result[node.name.value] !== undefined &&
                            level < result[node.name.value])) {
                        result[node.name.value] = level;
                        if (fragmentNameToFile[node.name.value]) {
                            extractExternalFragmentsInUse(fragmentNameToFile[node.name.value].node, fragmentNameToFile, result, level + 1);
                        }
                    }
                }
            }
        }
    });
    return result;
}
exports.extractExternalFragmentsInUse = extractExternalFragmentsInUse;
