"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithUntypedObjectProxy = void 0;
const param_js_1 = require("./param.js");
const WithUntypedObjectProxy = (
// deno-lint-ignore no-explicit-any
rootObject, ...path
// deno-lint-ignore no-explicit-any
) => {
    const parameterizedObject = {
        ...rootObject,
        ...(0, param_js_1.ParamReference)(...path),
    };
    const proxy = new Proxy(parameterizedObject, {
        get: function (obj, prop) {
            // If it's a property that exists, just access it directly
            if (prop in obj) {
                // deno-lint-ignore no-explicit-any
                return Reflect.get.apply(obj, arguments);
            }
            // We're attempting to access a property that doesn't exist, so create a new nested proxy
            if (typeof prop === "string") {
                return (0, exports.WithUntypedObjectProxy)(obj, ...path, prop);
            }
            // Fallback to trying to access it directly even if it's not in this objects props
            // deno-lint-ignore no-explicit-any
            return Reflect.get.apply(obj, arguments);
        },
    });
    return proxy;
};
exports.WithUntypedObjectProxy = WithUntypedObjectProxy;
