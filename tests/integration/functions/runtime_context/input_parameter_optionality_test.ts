import { assert } from "../../../../src/dev_deps.ts";
import type { CanBe, CanBeUndefined } from "../../../../src/test_utils.ts";
import { DefineFunction, Schema } from "../../../../src/mod.ts";
import type {
  EnrichedSlackFunctionHandler,
} from "../../../../src/functions/types.ts";
import { SlackFunctionTester } from "../../../../src/functions/tester/mod.ts";

/**
 * Custom function handler tests exercising optionality of inputs for primitive types
 */
Deno.test("Custom function with an optional string input provide the string/undefined input in a function handler context", () => {
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
      required: [],
    },
  });
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> = (
    { inputs },
  ) => {
    assert<CanBe<typeof inputs.in, string>>(true);
    assert<CanBeUndefined<typeof inputs.in>>(true);
    return {
      outputs: {
        out: inputs.in || "default",
      },
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const inputs = {};
  handler(createContext({ inputs }));
});

Deno.test("Custom function with an optional boolean input provide the boolean/undefined input in a function handler context", () => {
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
      required: [],
    },
  });
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> = (
    { inputs },
  ) => {
    assert<CanBe<typeof inputs.in, boolean>>(true);
    assert<CanBeUndefined<typeof inputs.in>>(true);
    return {
      outputs: {
        out: inputs.in || "default",
      },
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const inputs = {};
  handler(createContext({ inputs }));
});

Deno.test("Custom function with an optional integer input provide the number/undefined input in a function handler context", () => {
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
      required: [],
    },
  });
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> = (
    { inputs },
  ) => {
    assert<CanBe<typeof inputs.in, number>>(true);
    assert<CanBeUndefined<typeof inputs.in>>(true);
    return {
      outputs: {
        out: inputs.in || "default",
      },
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const inputs = {};
  handler(createContext({ inputs }));
});

Deno.test("Custom function with an optional number input provide the number/undefined input in a function handler context", () => {
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
      required: [],
    },
  });
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> = (
    { inputs },
  ) => {
    assert<CanBe<typeof inputs.in, number>>(true);
    assert<CanBeUndefined<typeof inputs.in>>(true);
    return {
      outputs: {
        out: inputs.in || "default",
      },
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const inputs = {};
  handler(createContext({ inputs }));
});
