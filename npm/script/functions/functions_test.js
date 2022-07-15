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
const mod_js_1 = require("./mod.js");
const mod_js_2 = __importDefault(require("../schema/mod.js"));
const dev_deps_js_1 = require("../dev_deps.js");
// TODO: Re-add tests to validate function execution when we've determined how to execute functions locally
const emptyParameterObject = Object.freeze({ required: [], properties: {} });
dntShim.Deno.test("Function sets appropriate defaults", () => {
    const Func = (0, mod_js_1.DefineFunction)({
        callback_id: "my_function",
        title: "My function",
        source_file: "functions/dino.ts",
    });
    const exportedFunc = Func.export();
    (0, dev_deps_js_1.assertStrictEquals)(exportedFunc.source_file, "functions/dino.ts");
    (0, dev_deps_js_1.assertEquals)(exportedFunc.input_parameters, emptyParameterObject);
    (0, dev_deps_js_1.assertEquals)(exportedFunc.output_parameters, emptyParameterObject);
});
dntShim.Deno.test("Function with required params", () => {
    const AllTypesFunction = (0, mod_js_1.DefineFunction)({
        callback_id: "my_function",
        title: "All Types Function",
        source_file: "functions/example.ts",
        input_parameters: {
            properties: {
                myString: {
                    type: mod_js_2.default.types.string,
                    title: "My string",
                    description: "a really neat value",
                },
                myBoolean: {
                    type: mod_js_2.default.types.boolean,
                    title: "My boolean",
                },
                myInteger: {
                    type: mod_js_2.default.types.integer,
                    description: "integer",
                },
                myNumber: {
                    type: mod_js_2.default.types.number,
                    description: "number",
                },
            },
            required: ["myString", "myNumber"],
        },
        output_parameters: {
            properties: {
                out: {
                    type: mod_js_2.default.types.string,
                },
            },
            required: ["out"],
        },
    });
    (0, dev_deps_js_1.assertEquals)(AllTypesFunction.definition.input_parameters?.required, [
        "myString",
        "myNumber",
    ]);
    (0, dev_deps_js_1.assertEquals)(AllTypesFunction.definition.output_parameters?.required, [
        "out",
    ]);
});
dntShim.Deno.test("Function without input and output parameters", () => {
    const NoParamFunction = (0, mod_js_1.DefineFunction)({
        callback_id: "no_params",
        title: "No Parameter Function",
        source_file: "functions/no_params.ts",
    });
    (0, dev_deps_js_1.assertEquals)(emptyParameterObject, NoParamFunction.export().input_parameters);
    (0, dev_deps_js_1.assertEquals)(emptyParameterObject, NoParamFunction.export().output_parameters);
});
dntShim.Deno.test("Function with input parameters but no output parameters", () => {
    const inputParameters = {
        properties: {
            aString: { type: mod_js_2.default.types.string },
        },
        required: [],
    };
    const NoOutputParamFunction = (0, mod_js_1.DefineFunction)({
        callback_id: "input_params_only",
        title: "No Parameter Function",
        source_file: "functions/input_params_only.ts",
        input_parameters: inputParameters,
    });
    NoOutputParamFunction.export();
    (0, dev_deps_js_1.assertStrictEquals)(inputParameters, NoOutputParamFunction.definition.input_parameters);
    (0, dev_deps_js_1.assertEquals)(emptyParameterObject, NoOutputParamFunction.export().output_parameters);
});
dntShim.Deno.test("Function with output parameters but no input parameters", () => {
    const outputParameters = {
        properties: {
            aString: { type: mod_js_2.default.types.string },
        },
        required: [],
    };
    const NoInputParamFunction = (0, mod_js_1.DefineFunction)({
        callback_id: "output_params_only",
        title: "No Parameter Function",
        source_file: "functions/output_params_only.ts",
        output_parameters: outputParameters,
    });
    (0, dev_deps_js_1.assertEquals)(emptyParameterObject, NoInputParamFunction.export().input_parameters);
    (0, dev_deps_js_1.assertStrictEquals)(outputParameters, NoInputParamFunction.definition.output_parameters);
});
