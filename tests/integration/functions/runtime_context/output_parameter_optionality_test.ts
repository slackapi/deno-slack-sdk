import { assert } from "../../../../src/dev_deps.ts";
import { CanBe, CanBeUndefined } from "../../../../src/test_utils.ts";
import { DefineFunction, Schema } from "../../../../src/mod.ts";
import {
  EnrichedSlackFunctionHandler,
} from "../../../../src/functions/types.ts";
import { SlackFunctionTester } from "../../../../src/functions/tester/mod.ts";

/**
 * Custom function handler tests exercising optionality of outputs for primitive types
 */
Deno.test("Custom function with an optional string output returns an output that can be either undefined or a string", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    output_parameters: {
      properties: {
        out: {
          type: Schema.types.string,
        },
      },
      required: [],
    },
  });
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    () => {
      return {
        outputs: {
          out: Math.random() > 0.5 ? "default" : undefined,
        },
      };
    };
  const { createContext } = SlackFunctionTester(TestFn);
  const inputs = {};
  const result = handler(createContext({ inputs }));
  const output = result.outputs?.out;
  assert<CanBeUndefined<typeof output>>(true);
  assert<CanBe<typeof output, string>>(true);
});

Deno.test("Custom function with an optional boolean output returns an output that can be either undefined or a boolean", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    output_parameters: {
      properties: {
        out: {
          type: Schema.types.boolean,
        },
      },
      required: [],
    },
  });
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    () => {
      return {
        outputs: {
          out: Math.random() > 0.5 ? true : undefined,
        },
      };
    };
  const { createContext } = SlackFunctionTester(TestFn);
  const inputs = {};
  const result = handler(createContext({ inputs }));
  const output = result.outputs?.out;
  assert<CanBeUndefined<typeof output>>(true);
  assert<CanBe<typeof output, boolean>>(true);
});

Deno.test("Custom function with an optional integer output returns an output that can be either undefined or a number", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    output_parameters: {
      properties: {
        out: {
          type: Schema.types.integer,
        },
      },
      required: [],
    },
  });
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    () => {
      return {
        outputs: {
          out: Math.random() > 0.5 ? 1337 : undefined,
        },
      };
    };
  const { createContext } = SlackFunctionTester(TestFn);
  const inputs = {};
  const result = handler(createContext({ inputs }));
  const output = result.outputs?.out;
  assert<CanBeUndefined<typeof output>>(true);
  assert<CanBe<typeof output, number>>(true);
});

Deno.test("Custom function with an optional number output returns an output that can be either undefined or a number", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    output_parameters: {
      properties: {
        out: {
          type: Schema.types.number,
        },
      },
      required: [],
    },
  });
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    () => {
      return {
        outputs: {
          out: Math.random() > 0.5 ? 9.5 : undefined,
        },
      };
    };
  const { createContext } = SlackFunctionTester(TestFn);
  const inputs = {};
  const result = handler(createContext({ inputs }));
  const output = result.outputs?.out;
  assert<CanBeUndefined<typeof output>>(true);
  assert<CanBe<typeof output, number>>(true);
});
