import * as dntShim from "../_dnt.test_shims.js";
import { assertEquals } from "../dev_deps.js";
import { SlackFunctionTester } from "./tester/mod.js";
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
    const { createContext } = SlackFunctionTester("test");
    const inputs = { in: "test" };
    const result = handler(createContext({ inputs }));
    assertEquals(result.outputs?.out, inputs.in);
});
dntShim.Deno.test("BaseSlackFunctionHandler with empty inputs and empty outputs", () => {
    const handler = () => {
        return {
            outputs: {},
        };
    };
    const { createContext } = SlackFunctionTester("test");
    const result = handler(createContext({ inputs: {} }));
    assertEquals(result.outputs, {});
});
dntShim.Deno.test("BaseSlackFunctionHandler with undefined inputs and outputs", () => {
    const handler = () => {
        return {
            outputs: {},
        };
    };
    const { createContext } = SlackFunctionTester("test");
    const result = handler(createContext({ inputs: undefined }));
    assertEquals(result.outputs, {});
});
dntShim.Deno.test("BaseSlackFunctionHandler with inputs and empty outputs", () => {
    const handler = ({ inputs }) => {
        const _test = inputs.in;
        return {
            outputs: {},
        };
    };
    const { createContext } = SlackFunctionTester("test");
    const inputs = { in: "test" };
    const result = handler(createContext({ inputs }));
    assertEquals(result.outputs, {});
});
dntShim.Deno.test("BaseSlackFunctionHandler with empty inputs and outputs", () => {
    const handler = () => {
        return {
            outputs: {
                out: "test",
            },
        };
    };
    const { createContext } = SlackFunctionTester("test");
    const result = handler(createContext({ inputs: {} }));
    assertEquals(result.outputs?.out, "test");
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
    const { createContext } = SlackFunctionTester("test");
    const inputs = { in: "test" };
    const result = handler(createContext({ inputs }));
    assertEquals(result.outputs?.out, inputs.in);
});
dntShim.Deno.test("BaseSlackFunctionHandler with no inputs and error output", () => {
    // deno-lint-ignore no-explicit-any
    const handler = () => {
        return {
            error: "error",
        };
    };
    const { createContext } = SlackFunctionTester("test");
    const result = handler(createContext({ inputs: {} }));
    assertEquals(result.error, "error");
});
dntShim.Deno.test("BaseSlackFunctionHandler with no inputs and completed false output", () => {
    // deno-lint-ignore no-explicit-any
    const handler = () => {
        return {
            completed: false,
        };
    };
    const { createContext } = SlackFunctionTester("test");
    const result = handler(createContext({ inputs: {} }));
    assertEquals(result.completed, false);
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
    const { createContext } = SlackFunctionTester("test");
    const inputs = { in: "test" };
    const result = handler(createContext({ inputs }));
    assertEquals(result.outputs?.out, inputs.in);
});
dntShim.Deno.test("BaseSlackFunctionHandler with input and output objects", () => {
    const handler = ({ inputs }) => {
        return {
            outputs: {
                anObject: { out: inputs.anObject.in },
            },
        };
    };
    const { createContext } = SlackFunctionTester("test");
    const inputs = { anObject: { in: "test" } };
    const result = handler(createContext({ inputs }));
    assertEquals(result.outputs?.anObject?.out, inputs.anObject.in);
});
