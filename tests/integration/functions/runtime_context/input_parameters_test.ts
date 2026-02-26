import { assert, type IsExact } from "../../../../src/dev_deps.ts";
import { DefineFunction, Schema } from "../../../../src/mod.ts";
import type {
  EnrichedSlackFunctionHandler,
} from "../../../../src/functions/types.ts";
import { SlackFunctionTester } from "../../../../src/functions/tester/mod.ts";
import { assertEqualsTypedValues } from "../../../../src/test_utils.ts";

/**
 * Custom function handler tests exercising inputs of various primitive types
 */
Deno.test("Custom function with a string input should provide a string input in the function handler context", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    input_parameters: {
      properties: {
        in: {
          type: Schema.types.string,
        },
      },
      required: ["in"],
    },
  });
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> = (
    { inputs },
  ) => {
    assert<IsExact<typeof inputs.in, string>>(true);
    return {
      outputs: {},
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const inputs = { in: "test" };
  const result = handler(createContext({ inputs }));
  assertEqualsTypedValues(result.outputs, {});
});

Deno.test("Custom function with a boolean input should provide a boolean input in the function handler context", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    input_parameters: {
      properties: {
        in: {
          type: Schema.types.boolean,
        },
      },
      required: ["in"],
    },
  });
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> = (
    { inputs },
  ) => {
    assert<IsExact<typeof inputs.in, boolean>>(true);
    return {
      outputs: {},
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const inputs = { in: false };
  const result = handler(createContext({ inputs }));
  assertEqualsTypedValues(result.outputs, {});
});

Deno.test("Custom function with an integer input should provide a number input in the function handler context", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    input_parameters: {
      properties: {
        in: {
          type: Schema.types.integer,
        },
      },
      required: ["in"],
    },
  });
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> = (
    { inputs },
  ) => {
    assert<IsExact<typeof inputs.in, number>>(true);
    return {
      outputs: {},
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const inputs = { in: 21 };
  const result = handler(createContext({ inputs }));
  assertEqualsTypedValues(result.outputs, {});
});

Deno.test("Custom function with a number input should provide a number input in the function handler context", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    input_parameters: {
      properties: {
        in: {
          type: Schema.types.number,
        },
      },
      required: ["in"],
    },
  });
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> = (
    { inputs },
  ) => {
    assert<IsExact<typeof inputs.in, number>>(true);
    return {
      outputs: {},
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const inputs = { in: 21.5 };
  const result = handler(createContext({ inputs }));
  assertEqualsTypedValues(result.outputs, {});
});
