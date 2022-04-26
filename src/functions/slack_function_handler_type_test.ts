import { assertEquals } from "../dev_deps.ts";
import { DefineFunction } from "./mod.ts";
import { SlackFunctionHandler } from "./types.ts";

// These tests are to ensure our Function Handler types are supporting the use cases we want to
// Any "failures" here will most likely be reflected in Type errors

Deno.test("SlackFunctionHandler types", () => {
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
  assertEquals(typeof handler, "function");
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
  assertEquals(typeof handler, "function");
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
  assertEquals(typeof handler, "function");
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
  assertEquals(typeof handler, "function");
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
  assertEquals(typeof handler, "function");
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
  assertEquals(typeof handler, "function");
});
