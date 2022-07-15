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
Object.defineProperty(exports, "__esModule", { value: true });
const dntShim = __importStar(require("../../_dnt.test_shims.js"));
const dev_deps_js_1 = require("../../dev_deps.js");
const mod_js_1 = require("./mod.js");
const mod_js_2 = require("../mod.js");
const mod_js_3 = require("../../mod.js");
dntShim.Deno.test("SlackFunctionTester.createContext using a string for callback_id", () => {
    const callbackId = "my_callback_id";
    const { createContext } = (0, mod_js_1.SlackFunctionTester)(callbackId);
    const inputs = {
        myValue: "some value",
    };
    const ctxWithInputs = createContext({
        inputs,
    });
    const ctxWithoutInputs = createContext({ inputs: {} });
    (0, dev_deps_js_1.assertEquals)(ctxWithInputs.inputs, inputs);
    (0, dev_deps_js_1.assertEquals)(ctxWithInputs.env, {});
    (0, dev_deps_js_1.assertEquals)(typeof ctxWithInputs.token, "string");
    (0, dev_deps_js_1.assertEquals)(ctxWithInputs.event.type, "function_executed");
    (0, dev_deps_js_1.assertEquals)(ctxWithInputs.event.function.callback_id, callbackId);
    (0, dev_deps_js_1.assertEquals)(ctxWithInputs.event.function.title, mod_js_1.DEFAULT_FUNCTION_TESTER_TITLE);
    (0, dev_deps_js_1.assertEquals)(ctxWithoutInputs.inputs, {});
    (0, dev_deps_js_1.assertEquals)(ctxWithoutInputs.event.function.callback_id, callbackId);
});
dntShim.Deno.test("SlackFunctionTester.createContext using Function definitions", () => {
    const callbackId = "my_callback_id";
    const TestFunction = (0, mod_js_2.DefineFunction)({
        callback_id: callbackId,
        source_file: "test",
        title: "Test",
        input_parameters: {
            properties: {
                myValue: { type: mod_js_3.Schema.types.string },
                myOptionalValue: { type: mod_js_3.Schema.types.boolean },
            },
            required: ["myValue"],
        },
    });
    const { createContext } = (0, mod_js_1.SlackFunctionTester)(TestFunction);
    const requiredCtx = createContext({
        inputs: { myValue: "some value" },
    });
    const optionalCtx = createContext({
        inputs: { myValue: "some value", myOptionalValue: true },
    });
    (0, dev_deps_js_1.assertEquals)(requiredCtx.inputs, { myValue: "some value" });
    (0, dev_deps_js_1.assertEquals)(requiredCtx.env, {});
    (0, dev_deps_js_1.assertEquals)(typeof requiredCtx.token, "string");
    (0, dev_deps_js_1.assertEquals)(requiredCtx.event.type, "function_executed");
    (0, dev_deps_js_1.assertEquals)(requiredCtx.event.function.callback_id, callbackId);
    (0, dev_deps_js_1.assertEquals)(requiredCtx.event.function.title, TestFunction.definition.title);
    (0, dev_deps_js_1.assertEquals)(optionalCtx.inputs, {
        myValue: "some value",
        myOptionalValue: true,
    });
});
dntShim.Deno.test("SlackFunctionTester.createContext with empty inputs", () => {
    const callbackId = "my_callback_id";
    const { createContext } = (0, mod_js_1.SlackFunctionTester)(callbackId);
    const ctx = createContext({ inputs: {} });
    (0, dev_deps_js_1.assertEquals)(ctx.inputs, {});
    (0, dev_deps_js_1.assertEquals)(ctx.env, {});
    (0, dev_deps_js_1.assertEquals)(typeof ctx.token, "string");
    (0, dev_deps_js_1.assertEquals)(ctx.event.type, "function_executed");
    (0, dev_deps_js_1.assertEquals)(ctx.event.function.callback_id, callbackId);
});
