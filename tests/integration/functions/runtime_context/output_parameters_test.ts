import { DefineFunction, Schema } from "../../../../src/mod.ts";
import {
  EnrichedSlackFunctionHandler,
} from "../../../../src/functions/types.ts";
import { SlackFunctionTester } from "../../../../src/functions/tester/mod.ts";
import { assertEqualsTypedValues } from "../../../../src/test_utils.ts";

/**
 * Custom Function handler tests exercising outputs of various primitive types
 */
Deno.test("Custom Function with only a string output defined must return a string output", () => {
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
      required: ["out"],
    },
  });
  const validHandler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    () => {
      return {
        outputs: {
          out: "test",
        },
      };
    };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = validHandler(createContext({ inputs: {} }));
  assertEqualsTypedValues(result.outputs?.out, "test");
  // @ts-expect-error `out` output property must be a string
  const _invalidHandler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    () => {
      return {
        outputs: {
          out: 1,
        },
      };
    };
});

Deno.test("Custom Function with only a boolean output defined must return a boolean output", () => {
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
      required: ["out"],
    },
  });
  const validHandler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    () => {
      return {
        outputs: {
          out: true,
        },
      };
    };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = validHandler(createContext({ inputs: {} }));
  assertEqualsTypedValues(result.outputs?.out, true);
  // @ts-expect-error `out` output property must be a boolean
  const _invalidHandler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    () => {
      return {
        outputs: {
          out: "haha",
        },
      };
    };
});

Deno.test("Custom Function with only an integer output defined must return a number output", () => {
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
      required: ["out"],
    },
  });
  const validHandler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    () => {
      return {
        outputs: {
          out: 14,
        },
      };
    };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = validHandler(createContext({ inputs: {} }));
  assertEqualsTypedValues(result.outputs?.out, 14);
  // @ts-expect-error `out` output property must be an integer
  const _invalidHandler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    () => {
      return {
        outputs: {
          out: "haha",
        },
      };
    };
});

Deno.test("Custom Function with only a number output defined must return a number output", () => {
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
      required: ["out"],
    },
  });
  const validHandler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    () => {
      return {
        outputs: {
          out: 14.2,
        },
      };
    };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = validHandler(createContext({ inputs: {} }));
  assertEqualsTypedValues(result.outputs?.out, 14);
  // @ts-expect-error `out` output property must be an integer
  const _invalidHandler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    () => {
      return {
        outputs: {
          out: "haha",
        },
      };
    };
});