import { ParamReference } from "./param.js";
import { WithUntypedObjectProxy } from "./with-untyped-object-proxy.js";
import SchemaTypes from "../schema/schema_types.js";
export const ParameterVariable = (namespace, paramName, definition) => {
    let param = null;
    // TODO: Should be able to use instanceof CustomType here
    if (definition.type instanceof Object) {
        param = ParameterVariable(namespace, paramName, definition.type.definition);
    }
    else if (definition.type === SchemaTypes.object) {
        if ("properties" in definition) {
            param = CreateTypedObjectParameterVariable(namespace, paramName, definition);
        }
        else {
            param = CreateUntypedObjectParameterVariable(namespace, paramName);
        }
    }
    else {
        param = CreateSingleParameterVariable(namespace, paramName);
    }
    return param;
};
const CreateTypedObjectParameterVariable = (namespace, paramName, definition) => {
    const ns = namespace ? `${namespace}.` : "";
    const pathReference = `${ns}${paramName}`;
    const param = ParamReference(pathReference);
    for (const [propName, propDefinition] of Object.entries(definition.properties || {})) {
        param[propName] = ParameterVariable(pathReference, propName, propDefinition);
    }
    // We wrap the typed object parameter w/ an untyped proxy to allow indexing into additional properties
    return WithUntypedObjectProxy(param, namespace, paramName);
};
export const CreateUntypedObjectParameterVariable = (namespace, paramName) => {
    return WithUntypedObjectProxy({}, namespace, paramName);
};
const CreateSingleParameterVariable = (namespace, paramName) => {
    return ParamReference(namespace, paramName);
};
