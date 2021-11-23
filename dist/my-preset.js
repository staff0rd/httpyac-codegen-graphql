"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.__esModule = true;
exports.preset = void 0;
var addPlugin = require("@graphql-codegen/add");
var utils_1 = require("@graphql-tools/utils");
var graphql_1 = require("graphql");
exports.preset = {
    buildGeneratesSection: function (options) {
        var e_1, _a, _b;
        var schema = options.schemaAst, _c = options.config, _d = _c.depthLimit, depthLimit = _d === void 0 ? 10 : _d, _e = _c.circularReferenceDepth, circularReferenceDepth = _e === void 0 ? 1 : _e;
        if (!schema)
            throw new Error("Missing schema AST");
        var rootTypeMap = (0, utils_1.getRootTypeMap)(schema);
        var definitions = [];
        try {
            for (var rootTypeMap_1 = __values(rootTypeMap), rootTypeMap_1_1 = rootTypeMap_1.next(); !rootTypeMap_1_1.done; rootTypeMap_1_1 = rootTypeMap_1.next()) {
                var _f = __read(rootTypeMap_1_1.value, 2), kind = _f[0], rootType = _f[1];
                for (var field in rootType.getFields()) {
                    var operationDefinitionNode = (0, utils_1.buildOperationNodeForField)({
                        schema: schema,
                        kind: kind,
                        field: field,
                        depthLimit: depthLimit,
                        circularReferenceDepth: circularReferenceDepth
                    });
                    definitions.push(operationDefinitionNode);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (rootTypeMap_1_1 && !rootTypeMap_1_1.done && (_a = rootTypeMap_1["return"])) _a.call(rootTypeMap_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var pluginMap = __assign(__assign({}, options.pluginMap), (_b = {}, _b["add"] = addPlugin, _b));
        return definitions.map(function (d) {
            var _a;
            return (__assign(__assign({}, options), { pluginMap: pluginMap, plugins: [
                    (_a = {},
                        _a["add"] = {
                            content: "POST {{HOST}}\nContent-Type: application/json\n\n" + (0, graphql_1.print)(d)
                        },
                        _a),
                ], filename: "".concat(options.baseOutputDir, "/").concat(d.name.value, ".http") }));
        });
    }
};
exports["default"] = exports.preset;
