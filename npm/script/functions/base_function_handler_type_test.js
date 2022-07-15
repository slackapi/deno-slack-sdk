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
const dntShim = __importStar(require("../_dnt.test_shims.js"));
const dev_deps_js_1 = require("../dev_deps.js");
const mod_js_1 = require("./tester/mod.js");
// These tests are to ensure our Function Handler types are supporting the use cases we want to
// Any "failures" here will most likely be reflected in Type errors
dntShim.Deno.test("BaseSlackFunctionHandler types", () => {
    const handler = ({ inputs }) => {
        return {
            outputs: {
                out: inputs.in,
            },
        };
    };
    const { createContext } = (0, mod_js_1.SlackFunctionTester)("test");
    const inputs = { in: "test" };
    const result = handler(createContext({ inputs }));
    (0, dev_deps_js_1.assertEquals)(result.outputs?.out, inputs.in);
});
dntShim.Deno.test("BaseSlackFunctionHandler with empty inputs and empty outputs", () => {
    const handler = () => {
        return {
            outputs: {},
        };
    };
    const { createContext } = (0, mod_js_1.SlackFunctionTester)("test");
    const result = handler(createContext({ inputs: {} }));
    (0, dev_deps_js_1.assertEquals)(result.outputs, {});
});
dntShim.Deno.test("BaseSlackFunctionHandler with undefined inputs and outputs", () => {
    const handler = () => {
        return {
            outputs: {},
        };
    };
    const { createContext } = (0, mod_js_1.SlackFunctionTester)("test");
    const result = handler(createContext({ inputs: undefined }));
    (0, dev_deps_js_1.assertEquals)(result.outputs, {});
});
dntShim.Deno.test("BaseSlackFunctionHandler with inputs and empty outputs", () => {
    const handler = ({ inputs }) => {
        const _test = inputs.in;
        return {
            outputs: {},
        };
    };
    const { createContext } = (0, mod_js_1.SlackFunctionTester)("test");
    const inputs = { in: "test" };
    const result = handler(createContext({ inputs }));
    (0, dev_deps_js_1.assertEquals)(result.outputs, {});
});
dntShim.Deno.test("BaseSlackFunctionHandler with empty inputs and outputs", () => {
    const handler = () => {
        return {
            outputs: {
                out: "test",
            },
        };
    };
    const { createContext } = (0, mod_js_1.SlackFunctionTester)("test");
    const result = handler(createContext({ inputs: {} }));
    (0, dev_deps_js_1.assertEquals)(result.outputs?.out, "test");
});
dntShim.Deno.test("BaseSlackFunctionHandler with any inputs and any outputs", () => {
    // deno-lint-ignore no-explicit-any
    const handler = ({ inputs }) => {
        return {
            outputs: {
                out: inputs.in,
            },
        };
    };
    const { createContext } = (0, mod_js_1.SlackFunctionTester)("test");
    const inputs = { in: "test" };
    const result = handler(createContext({ inputs }));
    (0, dev_deps_js_1.assertEquals)(result.outputs?.out, inputs.in);
});
dntShim.Deno.test("BaseSlackFunctionHandler with no inputs and error output", () => {
    // deno-lint-ignore no-explicit-any
    const handler = () => {
        return {
            error: "error",
        };
    };
    const { createContext } = (0, mod_js_1.SlackFunctionTester)("test");
    const result = handler(createContext({ inputs: {} }));
    (0, dev_deps_js_1.assertEquals)(result.error, "error");
});
dntShim.Deno.test("BaseSlackFunctionHandler with no inputs and completed false output", () => {
    // deno-lint-ignore no-explicit-any
    const handler = () => {
        return {
            completed: false,
        };
    };
    const { createContext } = (0, mod_js_1.SlackFunctionTester)("test");
    const result = handler(createContext({ inputs: {} }));
    (0, dev_deps_js_1.assertEquals)(result.completed, false);
});
dntShim.Deno.test("BaseSlackFunctionHandler with set inputs and any outputs", () => {
    // deno-lint-ignore no-explicit-any
    const handler = ({ inputs }) => {
        return {
            outputs: {
                out: inputs.in,
            },
        };
    };
    const { createContext } = (0, mod_js_1.SlackFunctionTester)("test");
    const inputs = { in: "test" };
    const result = handler(createContext({ inputs }));
    (0, dev_deps_js_1.assertEquals)(result.outputs?.out, inputs.in);
});
dntShim.Deno.test("BaseSlackFunctionHandler with input and output objects", () => {
    const handler = ({ inputs }) => {
        return {
            outputs: {
                anObject: { out: inputs.anObject.in },
            },
        };
    };
    const { createContext } = (0, mod_js_1.SlackFunctionTester)("test");
    const inputs = { anObject: { in: "test" } };
    const result = handler(createContext({ inputs }));
    (0, dev_deps_js_1.assertEquals)(result.outputs?.anObject?.out, inputs.anObject.in);
});
