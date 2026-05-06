import { assertExists } from "../dev_deps.ts";
import { assertEqualsTypedValues } from "../test_utils.ts";
import { SlackFunctionTester } from "./tester/mod.ts";
import { DefineFunction } from "./mod.ts";
import { RuntimeSlackFunctionHandler } from "./types.ts";

Deno.test("RuntimeSlackFunctionHandler type should not include a client property", () => {
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
  const handler: RuntimeSlackFunctionHandler<typeof TestFn.definition> = (
    ctx,
  ) => {
    // @ts-expect-error ctx.client shouldn't be typed by RuntimeSlackFunctionHandler type - but SlackFunctionTester should inject it at runtime
    assertExists(ctx.client);

    return {
      completed: false,
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = handler(createContext({ inputs: {} }));
  assertEqualsTypedValues(result.completed, false);
});
