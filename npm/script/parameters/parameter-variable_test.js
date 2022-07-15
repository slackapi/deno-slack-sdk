"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dntShim = __importStar(require("../_dnt.test_shims.js"));
const schema_types_js_1 = __importDefault(require("../schema/schema_types.js"));
const mod_js_1 = require("./mod.js");
const mod_js_2 = require("../types/mod.js");
const dev_deps_js_1 = require("../dev_deps.js");
dntShim.Deno.test("ParameterVariable string", () => {
    const param = (0, mod_js_1.ParameterVariable)("", "incident_name", {
        type: schema_types_js_1.default.string,
    });
    (0, dev_deps_js_1.assertStrictEquals)(`${param}`, "{{incident_name}}");
});
dntShim.Deno.test("ParameterVariable typed object", () => {
    const param = (0, mod_js_1.ParameterVariable)("", "incident", {
        type: schema_types_js_1.default.object,
        properties: {
            id: {
                type: schema_types_js_1.default.integer,
            },
            name: {
                type: schema_types_js_1.default.string,
            },
        },
    });
    (0, dev_deps_js_1.assertStrictEquals)(`${param}`, "{{incident}}");
    (0, dev_deps_js_1.assertStrictEquals)(`${param.id}`, "{{incident.id}}");
    (0, dev_deps_js_1.assertStrictEquals)(`${param.name}`, "{{incident.name}}");
});
dntShim.Deno.test("ParameterVariable typed object with additional properties", () => {
    const param = (0, mod_js_1.ParameterVariable)("", "incident", {
        type: schema_types_js_1.default.object,
        properties: {
            id: {
                type: schema_types_js_1.default.integer,
            },
            name: {
                type: schema_types_js_1.default.string,
            },
        },
        additionalProperties: true,
    });
    (0, dev_deps_js_1.assertStrictEquals)(`${param}`, "{{incident}}");
    (0, dev_deps_js_1.assertStrictEquals)(`${param.id}`, "{{incident.id}}");
    (0, dev_deps_js_1.assertStrictEquals)(`${param.name}`, "{{incident.name}}");
    (0, dev_deps_js_1.assertStrictEquals)(`${param.foo.bar}`, "{{incident.foo.bar}}");
});
dntShim.Deno.test("ParameterVariable untyped object", () => {
    const param = (0, mod_js_1.ParameterVariable)("", "incident", {
        type: schema_types_js_1.default.object,
    });
    (0, dev_deps_js_1.assertStrictEquals)(`${param}`, "{{incident}}");
    (0, dev_deps_js_1.assertStrictEquals)(`${param.id}`, "{{incident.id}}");
    (0, dev_deps_js_1.assertStrictEquals)(`${param.name}`, "{{incident.name}}");
    (0, dev_deps_js_1.assertStrictEquals)(`${param.name.foo.bar}`, "{{incident.name.foo.bar}}");
});
dntShim.Deno.test("ParameterVariable array of strings", () => {
    const param = (0, mod_js_1.ParameterVariable)("", "myArray", {
        type: schema_types_js_1.default.array,
        items: {
            type: schema_types_js_1.default.string,
        },
    });
    (0, dev_deps_js_1.assertStrictEquals)(`${param}`, "{{myArray}}");
});
dntShim.Deno.test("ParameterVariable using CustomType string", () => {
    const customType = (0, mod_js_2.DefineType)({
        name: "customTypeString",
        type: schema_types_js_1.default.string,
    });
    const param = (0, mod_js_1.ParameterVariable)("", "myCustomTypeString", {
        type: customType,
    });
    (0, dev_deps_js_1.assertStrictEquals)(`${param}`, "{{myCustomTypeString}}");
});
dntShim.Deno.test("ParameterVariable using Custom Type typed object", () => {
    const customType = (0, mod_js_2.DefineType)({
        name: "customType",
        type: schema_types_js_1.default.object,
        properties: {
            aString: {
                type: schema_types_js_1.default.string,
            },
        },
    });
    const param = (0, mod_js_1.ParameterVariable)("", "myCustomType", {
        type: customType,
    });
    (0, dev_deps_js_1.assertStrictEquals)(`${param}`, "{{myCustomType}}");
    (0, dev_deps_js_1.assertStrictEquals)(`${param.aString}`, "{{myCustomType.aString}}");
});
dntShim.Deno.test("ParameterVariable using Custom Type untyped object", () => {
    const customType = (0, mod_js_2.DefineType)({
        name: "customTypeObject",
        type: schema_types_js_1.default.object,
    });
    const param = (0, mod_js_1.ParameterVariable)("", "myCustomTypeObject", {
        type: customType,
    });
    (0, dev_deps_js_1.assertStrictEquals)(`${param}`, "{{myCustomTypeObject}}");
    (0, dev_deps_js_1.assertStrictEquals)(`${param.foo}`, "{{myCustomTypeObject.foo}}");
    (0, dev_deps_js_1.assertStrictEquals)(`${param.foo.bar}`, "{{myCustomTypeObject.foo.bar}}");
    (0, dev_deps_js_1.assertStrictEquals)(`${param.foo.bar.baz}`, "{{myCustomTypeObject.foo.bar.baz}}");
});
dntShim.Deno.test("ParameterVariable using Custom Type array", () => {
    const customType = (0, mod_js_2.DefineType)({
        name: "customTypeArray",
        type: schema_types_js_1.default.array,
    });
    const param = (0, mod_js_1.ParameterVariable)("", "myCustomTypeArray", {
        type: customType,
    });
    (0, dev_deps_js_1.assertStrictEquals)(`${param}`, "{{myCustomTypeArray}}");
});
dntShim.Deno.test("ParameterVariable using Custom Type object referencing another Custom Type", () => {
    const StringType = (0, mod_js_2.DefineType)({
        name: "stringType",
        type: schema_types_js_1.default.string,
        minLength: 2,
    });
    const customType = (0, mod_js_2.DefineType)({
        name: "customTypeWithCustomType",
        type: schema_types_js_1.default.object,
        properties: {
            customType: {
                type: StringType,
            },
        },
    });
    const param = (0, mod_js_1.ParameterVariable)("", "myNestedCustomType", {
        type: customType,
    });
    (0, dev_deps_js_1.assertStrictEquals)(`${param}`, "{{myNestedCustomType}}");
    (0, dev_deps_js_1.assertStrictEquals)(`${param.customType}`, "{{myNestedCustomType.customType}}");
});
dntShim.Deno.test("ParameterVariable typed object with Custom Type property", () => {
    const StringType = (0, mod_js_2.DefineType)({
        name: "stringType",
        type: schema_types_js_1.default.string,
        minLength: 2,
    });
    const param = (0, mod_js_1.ParameterVariable)("", "myObjectParam", {
        type: schema_types_js_1.default.object,
        properties: {
            aString: {
                type: StringType,
            },
        },
    });
    (0, dev_deps_js_1.assertStrictEquals)(`${param}`, "{{myObjectParam}}");
    (0, dev_deps_js_1.assertStrictEquals)(`${param.aString}`, "{{myObjectParam.aString}}");
});
