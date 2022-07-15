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
const mod_js_2 = require("./mod.js");
// These tests are to ensure our Function Handler types are supporting the use cases we want to
// Any "failures" here will most likely be reflected in Type errors
dntShim.Deno.test("SlackFunctionHandler with inputs and outputs", () => {
    const TestFn = (0, mod_js_2.DefineFunction)({
        callback_id: "test",
        title: "test fn",
        source_file: "test.ts",
        input_parameters: {
            properties: {
                in: {
                    type: "string",
                },
            },
            required: ["in"],
        },
        output_parameters: {
            properties: {
                out: {
                    type: "string",
                },
            },
            required: ["out"],
        },
    });
    const handler = ({ inputs }) => {
        return {
            outputs: {
                out: inputs.in,
            },
        };
    };
    const { createContext } = (0, mod_js_1.SlackFunctionTester)(TestFn);
    const inputs = { in: "test" };
    const result = handler(createContext({ inputs }));
    const stringTest = (0, mod_js_1.SlackFunctionTester)("test");
    const stringResult = handler(stringTest.createContext({ inputs }));
    (0, dev_deps_js_1.assertEquals)(result.outputs?.out, inputs.in, stringResult.outputs?.out);
});
dntShim.Deno.test("SlackFunctionHandler with optional input", () => {
    const TestFn = (0, mod_js_2.DefineFunction)({
        callback_id: "test",
        title: "test fn",
        source_file: "test.ts",
        input_parameters: {
            properties: {
                in: {
                    type: "string",
                },
            },
            required: [],
        },
        output_parameters: {
            properties: {
                out: {
                    type: "string",
                },
            },
            required: ["out"],
        },
    });
    const handler = ({ inputs }) => {
        return {
            outputs: {
                out: inputs.in || "default",
            },
        };
    };
    const { createContext } = (0, mod_js_1.SlackFunctionTester)(TestFn);
    const inputs = {};
    const result = handler(createContext({ inputs }));
    (0, dev_deps_js_1.assertEquals)(result.outputs?.out, "default");
});
dntShim.Deno.test("SlackFunctionHandler with no inputs or outputs", () => {
    const TestFn = (0, mod_js_2.DefineFunction)({
        callback_id: "test",
        title: "test fn",
        source_file: "test.ts",
    });
    const handler = () => {
        return {
            outputs: {},
        };
    };
    const { createContext } = (0, mod_js_1.SlackFunctionTester)(TestFn);
    const result = handler(createContext({ inputs: {} }));
    (0, dev_deps_js_1.assertEquals)(result.outputs, {});
});
dntShim.Deno.test("SlackFunctionHandler with undefined inputs and outputs", () => {
    const TestFn = (0, mod_js_2.DefineFunction)({
        callback_id: "test",
        title: "test fn",
        source_file: "test.ts",
        input_parameters: undefined,
        output_parameters: undefined,
    });
    const handler = () => {
        return {
            outputs: {},
        };
    };
    const { createContext } = (0, mod_js_1.SlackFunctionTester)(TestFn);
    const result = handler(createContext({ inputs: {} }));
    (0, dev_deps_js_1.assertEquals)(result.outputs, {});
});
dntShim.Deno.test("SlackFunctionHandler with empty inputs and outputs", () => {
    const TestFn = (0, mod_js_2.DefineFunction)({
        callback_id: "test",
        title: "test fn",
        source_file: "test.ts",
        input_parameters: { properties: {}, required: [] },
        output_parameters: { properties: {}, required: [] },
    });
    const handler = () => {
        return {
            outputs: {},
        };
    };
    const { createContext } = (0, mod_js_1.SlackFunctionTester)(TestFn);
    const result = handler(createContext({ inputs: {} }));
    (0, dev_deps_js_1.assertEquals)(result.outputs, {});
});
dntShim.Deno.test("SlackFunctionHandler with only inputs", () => {
    const TestFn = (0, mod_js_2.DefineFunction)({
        callback_id: "test",
        title: "test fn",
        source_file: "test.ts",
        input_parameters: {
            properties: {
                in: {
                    type: "string",
                },
            },
            required: ["in"],
        },
    });
    const handler = ({ inputs }) => {
        const _test = inputs.in;
        return {
            outputs: {},
        };
    };
    const { createContext } = (0, mod_js_1.SlackFunctionTester)(TestFn);
    const inputs = { in: "test" };
    const result = handler(createContext({ inputs }));
    (0, dev_deps_js_1.assertEquals)(result.outputs, {});
});
dntShim.Deno.test("SlackFunctionHandler with only outputs", () => {
    const TestFn = (0, mod_js_2.DefineFunction)({
        callback_id: "test",
        title: "test fn",
        source_file: "test.ts",
        output_parameters: {
            properties: {
                out: {
                    type: "string",
                },
            },
            required: ["out"],
        },
    });
    const handler = () => {
        return {
            outputs: {
                out: "test",
            },
        };
    };
    const { createContext } = (0, mod_js_1.SlackFunctionTester)(TestFn);
    const result = handler(createContext({ inputs: {} }));
    (0, dev_deps_js_1.assertEquals)(result.outputs?.out, "test");
});
dntShim.Deno.test("SlackFunctionHandler with input and output object", () => {
    const TestFn = (0, mod_js_2.DefineFunction)({
        callback_id: "test",
        title: "test fn",
        source_file: "test.ts",
        input_parameters: {
            properties: {
                anObject: {
                    type: "object",
                    properties: { in: { type: "string" } },
                    required: ["in"],
                },
            },
            required: ["anObject"],
        },
        output_parameters: {
            properties: {
                anObject: {
                    type: "object",
                    properties: { out: { type: "string" } },
                    required: ["out"],
                },
            },
            required: ["anObject"],
        },
    });
    const handler = ({ inputs }) => {
        return {
            outputs: {
                anObject: {
                    out: inputs.anObject.in,
                },
            },
        };
    };
    const { createContext } = (0, mod_js_1.SlackFunctionTester)(TestFn);
    const result = handler(createContext({ inputs: { anObject: { in: "test" } } }));
    (0, dev_deps_js_1.assertEquals)(result.outputs?.anObject.out, "test");
});
dntShim.Deno.test("SlackFunctionHandler with only completed false", () => {
    const TestFn = (0, mod_js_2.DefineFunction)({
        callback_id: "test",
        title: "test fn",
        source_file: "test.ts",
        output_parameters: {
            properties: {
                example: {
                    type: "boolean",
                },
            },
            required: ["example"],
        },
    });
    const handler = () => {
        return {
            completed: false,
        };
    };
    const { createContext } = (0, mod_js_1.SlackFunctionTester)(TestFn);
    const result = handler(createContext({ inputs: {} }));
    (0, dev_deps_js_1.assertEquals)(result.completed, false);
});
dntShim.Deno.test("SlackFunctionHandler with only error", () => {
    const TestFn = (0, mod_js_2.DefineFunction)({
        callback_id: "test",
        title: "test fn",
        source_file: "test.ts",
        output_parameters: {
            properties: {
                example: {
                    type: "string",
                },
            },
            required: ["example"],
        },
    });
    const handler = () => {
        return {
            error: "error",
        };
    };
    const { createContext } = (0, mod_js_1.SlackFunctionTester)(TestFn);
    const result = handler(createContext({ inputs: {} }));
    (0, dev_deps_js_1.assertEquals)(result.error, "error");
});
