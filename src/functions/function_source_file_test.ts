import { assertEquals } from "../dev_deps.ts";
import { FunctionSourceFile, Schema } from "../mod.ts";
import { DefineFunction } from "./mod.ts";

Deno.test("FunctionSourceFile returns a valid source_file", () => {
  const sourceFile = FunctionSourceFile(
    "file:///path-to-project-dir/functions/hello_world.ts",
  );
  assertEquals(sourceFile, "functions/hello_world.ts");
});

Deno.test("FunctionSourceFile returns a valid source_file when depth is given", () => {
  const sourceFile = FunctionSourceFile(
    "file:///path-to-project-dir/functions/approval/iteractivity_handler.ts",
    1,
  );
  assertEquals(sourceFile, "functions/approval/iteractivity_handler.ts");
});

Deno.test("FunctionSourceFile returns a valid string for this test file", () => {
  const sourceFile = FunctionSourceFile(import.meta.url);
  assertEquals(sourceFile, "functions/function_source_file_test.ts");
});

Deno.test("FunctionSourceFile can be used for DefineFunction", () => {
  const def = DefineFunction({
    callback_id: "test-callback",
    title: "Test function",
    source_file: FunctionSourceFile(import.meta.url),
    input_parameters: {
      properties: {
        name: { type: Schema.types.string },
        channel: { type: Schema.slack.types.channel_id },
      },
      required: [],
    },
    output_parameters: {
      properties: {},
      required: [],
    },
  });
  assertEquals(
    def.definition.source_file,
    "functions/function_source_file_test.ts",
  );
});
