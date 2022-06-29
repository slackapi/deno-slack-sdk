import { assertEquals } from "../dev_deps.ts";
import { SlackFunctionTester } from "./tester/mod.ts";
import { DefineFunction } from "./mod.ts";
import { SlackFunctionHandler } from "./types.ts";

// These tests are to ensure our Function Handler types are supporting the use cases we want to
// Any "failures" here will most likely be reflected in Type errors

Deno.test("SlackFunctionHandler with inputs and outputs", () => {
  const TestFn = DefineFunction({
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
  const handler: SlackFunctionHandler<typeof TestFn.definition> = (
    { inputs },
  ) => {
    return {
      outputs: {
        out: inputs.in,
      },
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const inputs = { in: "test" };
  const result = handler(createContext({ inputs }));

  const stringTest = SlackFunctionTester("test");
  const stringResult = handler(stringTest.createContext({ inputs }));

  assertEquals(result.outputs?.out, inputs.in, stringResult.outputs?.out);
});

Deno.test("SlackFunctionHandler with optional input", () => {
  const TestFn = DefineFunction({
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
  const handler: SlackFunctionHandler<typeof TestFn.definition> = (
    { inputs },
  ) => {
    return {
      outputs: {
        out: inputs.in || "default",
      },
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const inputs = {};
  const result = handler(createContext({ inputs }));
  assertEquals(result.outputs?.out, "default");
});

Deno.test("SlackFunctionHandler with no inputs or outputs", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
  });
  const handler: SlackFunctionHandler<typeof TestFn.definition> = () => {
    return {
      outputs: {},
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = handler(createContext({ inputs: {} }));
  assertEquals(result.outputs, {});
});

Deno.test("SlackFunctionHandler with undefined inputs and outputs", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    input_parameters: undefined,
    output_parameters: undefined,
  });
  const handler: SlackFunctionHandler<typeof TestFn.definition> = () => {
    return {
      outputs: {},
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = handler(createContext({ inputs: {} }));
  assertEquals(result.outputs, {});
});

Deno.test("SlackFunctionHandler with empty inputs and outputs", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    input_parameters: { properties: {}, required: [] },
    output_parameters: { properties: {}, required: [] },
  });
  const handler: SlackFunctionHandler<typeof TestFn.definition> = () => {
    return {
      outputs: {},
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = handler(createContext({ inputs: {} }));
  assertEquals(result.outputs, {});
});

Deno.test("SlackFunctionHandler with only inputs", () => {
  const TestFn = DefineFunction({
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
  const handler: SlackFunctionHandler<typeof TestFn.definition> = (
    { inputs },
  ) => {
    const _test = inputs.in;

    return {
      outputs: {},
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const inputs = { in: "test" };
  const result = handler(createContext({ inputs }));
  assertEquals(result.outputs, {});
});

Deno.test("SlackFunctionHandler with only outputs", () => {
  const TestFn = DefineFunction({
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
  const handler: SlackFunctionHandler<typeof TestFn.definition> = () => {
    return {
      outputs: {
        out: "test",
      },
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = handler(createContext({ inputs: {} }));
  assertEquals(result.outputs?.out, "test");
});

Deno.test("SlackFunctionHandler with only completed false", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    output_parameters: {
      properties: {
        onlyComplete: {
          type: "boolean",
        },
      },
      required: [],
    },
  });
  const handler: SlackFunctionHandler<typeof TestFn.definition> = () => {
    return {
      completed: false,
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = handler(createContext({ inputs: {} }));
  assertEquals(result.completed, false);
});

Deno.test("SlackFunctionHandler with only error", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    output_parameters: {
      properties: {
        onlyError: {
          type: "string",
        },
      },
      required: [],
    },
  });
  const handler: SlackFunctionHandler<typeof TestFn.definition> = () => {
    return {
      error: "error",
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = handler(createContext({ inputs: {} }));
  assertEquals(result.error, "error");
});
