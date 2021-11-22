"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
var graphql_1 = require("graphql");
var utils_1 = require("./utils");
/**
 * Used by `buildFragmentResolver` to  build a mapping of fragmentNames to paths, importNames, and other useful info
 */
function buildFragmentRegistry(_a, _b, schemaObject) {
    var generateFilePath = _a.generateFilePath;
    var documents = _b.documents, config = _b.config;
    var baseVisitor = new visitor_plugin_common_1.BaseVisitor(config, {
        scalars: (0, visitor_plugin_common_1.buildScalarsFromConfig)(schemaObject, config),
        dedupeOperationSuffix: (0, visitor_plugin_common_1.getConfigValue)(config.dedupeOperationSuffix, false),
        omitOperationSuffix: (0, visitor_plugin_common_1.getConfigValue)(config.omitOperationSuffix, false),
        fragmentVariablePrefix: (0, visitor_plugin_common_1.getConfigValue)(config.fragmentVariablePrefix, ""),
        fragmentVariableSuffix: (0, visitor_plugin_common_1.getConfigValue)(config.fragmentVariableSuffix, "FragmentDoc")
    });
    var getFragmentImports = function (possbileTypes, name) {
        var fragmentImports = [];
        fragmentImports.push({
            name: baseVisitor.getFragmentVariableName(name),
            kind: "document"
        });
        var fragmentSuffix = baseVisitor.getFragmentSuffix(name);
        if (possbileTypes.length === 1) {
            fragmentImports.push({
                name: baseVisitor.convertName(name, {
                    useTypesPrefix: true,
                    suffix: fragmentSuffix
                }),
                kind: "type"
            });
        }
        else if (possbileTypes.length !== 0) {
            possbileTypes.forEach(function (typeName) {
                fragmentImports.push({
                    name: baseVisitor.convertName(name, {
                        useTypesPrefix: true,
                        suffix: "_".concat(typeName, "_").concat(fragmentSuffix)
                    }),
                    kind: "type"
                });
            });
        }
        return fragmentImports;
    };
    var duplicateFragmentNames = [];
    var registry = documents.reduce(function (prev, documentRecord) {
        var e_1, _a;
        var fragments = documentRecord.document.definitions.filter(function (d) { return d.kind === graphql_1.Kind.FRAGMENT_DEFINITION; });
        if (fragments.length > 0) {
            try {
                for (var fragments_1 = __values(fragments), fragments_1_1 = fragments_1.next(); !fragments_1_1.done; fragments_1_1 = fragments_1.next()) {
                    var fragment = fragments_1_1.value;
                    var schemaType = schemaObject.getType(fragment.typeCondition.name.value);
                    if (!schemaType) {
                        throw new Error("Fragment \"".concat(fragment.name.value, "\" is set on non-existing type \"").concat(fragment.typeCondition.name.value, "\"!"));
                    }
                    var possibleTypes = (0, visitor_plugin_common_1.getPossibleTypes)(schemaObject, schemaType);
                    var filePath = generateFilePath(documentRecord.location);
                    var imports = getFragmentImports(possibleTypes.map(function (t) { return t.name; }), fragment.name.value);
                    if (prev[fragment.name.value] &&
                        (0, graphql_1.print)(fragment) !== (0, graphql_1.print)(prev[fragment.name.value].node)) {
                        duplicateFragmentNames.push(fragment.name.value);
                    }
                    prev[fragment.name.value] = {
                        filePath: filePath,
                        imports: imports,
                        onType: fragment.typeCondition.name.value,
                        node: fragment
                    };
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (fragments_1_1 && !fragments_1_1.done && (_a = fragments_1["return"])) _a.call(fragments_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return prev;
    }, {});
    if (duplicateFragmentNames.length) {
        throw new Error("Multiple fragments with the name(s) \"".concat(duplicateFragmentNames.join(", "), "\" were found."));
    }
    return registry;
}
/**
 *  Builds a fragment "resolver" that collects `externalFragments` definitions and `fragmentImportStatements`
 */
function buildFragmentResolver(collectorOptions, presetOptions, schemaObject, dedupeFragments) {
    if (dedupeFragments === void 0) { dedupeFragments = false; }
    var fragmentRegistry = buildFragmentRegistry(collectorOptions, presetOptions, schemaObject);
    var baseOutputDir = presetOptions.baseOutputDir;
    var baseDir = collectorOptions.baseDir, typesImport = collectorOptions.typesImport;
    function resolveFragments(generatedFilePath, documentFileContent) {
        var e_2, _a, _b;
        var fragmentsInUse = (0, utils_1.extractExternalFragmentsInUse)(documentFileContent, fragmentRegistry);
        var externalFragments = [];
        // fragment files to import names
        var fragmentFileImports = {};
        try {
            for (var _c = __values(Object.keys(fragmentsInUse)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var fragmentName = _d.value;
                var level = fragmentsInUse[fragmentName];
                var fragmentDetails = fragmentRegistry[fragmentName];
                if (fragmentDetails) {
                    // add top level references to the import object
                    // we don't checkf or global namespace because the calling config can do so
                    if (level === 0 ||
                        (dedupeFragments &&
                            ["OperationDefinition", "FragmentDefinition"].includes(documentFileContent.definitions[0].kind))) {
                        if (fragmentFileImports[fragmentDetails.filePath] === undefined) {
                            fragmentFileImports[fragmentDetails.filePath] =
                                fragmentDetails.imports;
                        }
                        else {
                            (_b = fragmentFileImports[fragmentDetails.filePath]).push.apply(_b, __spreadArray([], __read(fragmentDetails.imports), false));
                        }
                    }
                    externalFragments.push({
                        level: level,
                        isExternal: true,
                        name: fragmentName,
                        onType: fragmentDetails.onType,
                        node: fragmentDetails.node
                    });
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return {
            externalFragments: externalFragments,
            fragmentImports: Object.entries(fragmentFileImports).map(function (_a) {
                var _b = __read(_a, 2), fragmentsFilePath = _b[0], identifiers = _b[1];
                return ({
                    baseDir: baseDir,
                    baseOutputDir: baseOutputDir,
                    outputPath: generatedFilePath,
                    importSource: {
                        path: fragmentsFilePath,
                        identifiers: identifiers
                    },
                    typesImport: typesImport
                });
            })
        };
    }
    return resolveFragments;
}
exports["default"] = buildFragmentResolver;
