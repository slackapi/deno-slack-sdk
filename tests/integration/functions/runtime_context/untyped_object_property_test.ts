import { assert, assertExists, IsAny } from "../../../../src/dev_deps.ts";
import { DefineFunction, Schema } from "../../../../src/mod.ts";
import {
  EnrichedSlackFunctionHandler,
} from "../../../../src/functions/types.ts";
import { SlackFunctionTester } from "../../../../src/functions/tester/mod.ts";

/**
 * Custom Function handler tests, exercising Untyped Object inputs/outputs
 */
Deno.test("Custom Function using untyped Objects should allow for referencing any property in a function handler context", () => {
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        untypedObj: {
          type: Schema.types.object,
        },
      },
      required: ["untypedObj"],
    },
    output_parameters: {
      properties: {
        untypedObj: {
          type: Schema.types.object,
        },
      },
      required: ["untypedObj"],
    },
  });

  const sharedInputs = {
    untypedObj: { aString: "hi" },
  };

  const handler: EnrichedSlackFunctionHandler<typeof TestFunction.definition> =
    (
      { inputs },
    ) => {
      const { untypedObj } = inputs;

      assert<IsAny<typeof untypedObj>>(true);
      assert<IsAny<typeof untypedObj.aString>>(true);

      return {
        outputs: {
          untypedObj: { literallyAnything: "ok" },
        },
      };
    };

  const { createContext } = SlackFunctionTester(TestFunction);

  const result = handler(createContext({ inputs: sharedInputs }));

  assertExists(result.outputs?.untypedObj);
  if (result.outputs?.untypedObj) {
    assert<IsAny<typeof result.outputs.untypedObj>>(true);
  }
});
