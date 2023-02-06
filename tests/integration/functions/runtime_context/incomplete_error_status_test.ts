import { DefineFunction } from "../../../../src/mod.ts";
import {
  EnrichedSlackFunctionHandler,
} from "../../../../src/functions/types.ts";
import { SlackFunctionTester } from "../../../../src/functions/tester/mod.ts";
import { assertEqualsTypedValues } from "../../../../src/test_utils.ts";

/**
 * Custom Function handler tests exercising error or incomplete function return values
 */

Deno.test("Custom Function that returns completed=false", () => {
  const TestFn = DefineFunction({
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
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    () => {
      return {
        completed: false,
      };
    };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = handler(createContext({ inputs: {} }));
  assertEqualsTypedValues(result.completed, false);
});

Deno.test("Custom Function that returns error", () => {
  const TestFn = DefineFunction({
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
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    () => {
      return {
        error: "error",
      };
    };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = handler(createContext({ inputs: {} }));
  assertEqualsTypedValues(result.error, "error");
});