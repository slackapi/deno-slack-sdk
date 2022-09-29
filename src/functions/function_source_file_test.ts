import { assertMatch } from "../dev_deps.ts";
import { FunctionSourceFile, Schema } from "../mod.ts";
import { DefineFunction } from "./mod.ts";

Deno.test("FunctionSourceFile returns a valid source_file", () => {
  const sourceFile = FunctionSourceFile(
    "file:///path-to-project-dir/functions/hello_world.ts",
  );
  // .js for npm builds
  assertMatch(sourceFile, new RegExp("functions/hello_world.(ts|js)"));
});

Deno.test("FunctionSourceFile returns a valid source_file when depth is given", () => {
  const sourceFile = FunctionSourceFile(
    "file:///path-to-project-dir/functions/approval/iteractivity_handler.ts",
    1,
  );
  // .js for npm builds
  assertMatch(
    sourceFile,
    new RegExp("functions/approval/iteractivity_handler.(ts|js)"),
  );
});

Deno.test("FunctionSourceFile returns a valid string for this test file", () => {
  const sourceFile = FunctionSourceFile(import.meta.url);
  // .js for npm builds
  assertMatch(
    sourceFile,
    new RegExp("functions/function_source_file_test.(ts|js)"),
  );
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
  // .js for npm builds
  assertMatch(
    def.definition.source_file,
    new RegExp("functions/function_source_file_test.(ts|js)"),
  );
});
