"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUntypedObjectParameterVariable = exports.ParameterVariable = void 0;
const param_js_1 = require("./param.js");
const with_untyped_object_proxy_js_1 = require("./with-untyped-object-proxy.js");
const schema_types_js_1 = __importDefault(require("../schema/schema_types.js"));
const ParameterVariable = (namespace, paramName, definition) => {
    let param = null;
    // TODO: Should be able to use instanceof CustomType here
    if (definition.type instanceof Object) {
        param = (0, exports.ParameterVariable)(namespace, paramName, definition.type.definition);
    }
    else if (definition.type === schema_types_js_1.default.object) {
        if ("properties" in definition) {
            param = CreateTypedObjectParameterVariable(namespace, paramName, definition);
        }
        else {
            param = (0, exports.CreateUntypedObjectParameterVariable)(namespace, paramName);
        }
    }
    else {
        param = CreateSingleParameterVariable(namespace, paramName);
    }
    return param;
};
exports.ParameterVariable = ParameterVariable;
const CreateTypedObjectParameterVariable = (namespace, paramName, definition) => {
    const ns = namespace ? `${namespace}.` : "";
    const pathReference = `${ns}${paramName}`;
    const param = (0, param_js_1.ParamReference)(pathReference);
    for (const [propName, propDefinition] of Object.entries(definition.properties || {})) {
        param[propName] = (0, exports.ParameterVariable)(pathReference, propName, propDefinition);
    }
    // We wrap the typed object parameter w/ an untyped proxy to allow indexing into additional properties
    return (0, with_untyped_object_proxy_js_1.WithUntypedObjectProxy)(param, namespace, paramName);
};
const CreateUntypedObjectParameterVariable = (namespace, paramName) => {
    return (0, with_untyped_object_proxy_js_1.WithUntypedObjectProxy)({}, namespace, paramName);
};
exports.CreateUntypedObjectParameterVariable = CreateUntypedObjectParameterVariable;
const CreateSingleParameterVariable = (namespace, paramName) => {
    return (0, param_js_1.ParamReference)(namespace, paramName);
};
