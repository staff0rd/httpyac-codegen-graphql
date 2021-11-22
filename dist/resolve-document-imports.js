"use strict";
exports.__esModule = true;
exports.resolveDocumentImports = void 0;
var plugin_helpers_1 = require("@graphql-codegen/plugin-helpers");
var visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
var fragment_resolver_1 = require("./fragment-resolver");
/**
 * Transform the preset's provided documents into single-file generator sources, while resolving fragment and user-defined imports
 *
 * Resolves user provided imports and fragment imports using the `DocumentImportResolverOptions`.
 * Does not define specific plugins, but rather returns a string[] of `importStatements` for the calling plugin to make use of
 */
function resolveDocumentImports(presetOptions, schemaObject, importResolverOptions, dedupeFragments) {
    if (dedupeFragments === void 0) { dedupeFragments = false; }
    var resolveFragments = (0, fragment_resolver_1["default"])(importResolverOptions, presetOptions, schemaObject, dedupeFragments);
    var baseOutputDir = presetOptions.baseOutputDir, documents = presetOptions.documents;
    var generateFilePath = importResolverOptions.generateFilePath, schemaTypesSource = importResolverOptions.schemaTypesSource, baseDir = importResolverOptions.baseDir, typesImport = importResolverOptions.typesImport;
    return documents.map(function (documentFile) {
        try {
            var generatedFilePath = generateFilePath(documentFile.location);
            var importStatements = [];
            var _a = resolveFragments(generatedFilePath, documentFile.document), externalFragments = _a.externalFragments, fragmentImports = _a.fragmentImports;
            if ((0, plugin_helpers_1.isUsingTypes)(documentFile.document, externalFragments.map(function (m) { return m.name; }), schemaObject)) {
                var schemaTypesImportStatement = (0, visitor_plugin_common_1.generateImportStatement)({
                    baseDir: baseDir,
                    importSource: (0, visitor_plugin_common_1.resolveImportSource)(schemaTypesSource),
                    baseOutputDir: baseOutputDir,
                    outputPath: generatedFilePath,
                    typesImport: typesImport
                });
                importStatements.unshift(schemaTypesImportStatement);
            }
            return {
                filename: generatedFilePath,
                documents: [documentFile],
                importStatements: importStatements,
                fragmentImports: fragmentImports,
                externalFragments: externalFragments
            };
        }
        catch (e) {
            throw new plugin_helpers_1.DetailedError("Unable to validate GraphQL document!", "\n  File ".concat(documentFile.location, " caused error:\n    ").concat(e.message || e.toString(), "\n        "), documentFile.location);
        }
    });
}
exports.resolveDocumentImports = resolveDocumentImports;
