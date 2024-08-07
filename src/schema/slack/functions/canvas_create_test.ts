/** This file was autogenerated. Follow the steps in src/schema/slack/functions/_scripts/README.md to rebuild **/
import {
  assertEquals,
  assertExists,
  assertNotStrictEquals,
} from "../../../dev_deps.ts";
import { DefineWorkflow } from "../../../workflows/mod.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";
import CanvasCreate from "./canvas_create.ts";

Deno.test("CanvasCreate generates valid FunctionManifest", () => {
  assertEquals(
    CanvasCreate.definition.callback_id,
    "slack#/functions/canvas_create",
  );
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Create a canvas",
    input_parameters: {
      properties: {
        title: {
          type: SchemaTypes.string,
          description: "Enter a canvas name",
          title: "Canvas name",
        },
        canvas_create_type: {
          type: SchemaTypes.string,
          description: "Type of creation",
          title: "Type of creation",
        },
        canvas_template_id: {
          type: SlackTypes.canvas_template_id,
          description: "Select an option",
          title: "Select a canvas template",
        },
        owner_id: {
          type: SlackTypes.user_id,
          description: "Person",
          title: "Canvas owner",
        },
        content: {
          type: SlackTypes.expanded_rich_text,
          description: "Add content to the canvas",
          title: "Add content",
        },
        placeholder_values: {
          type: SchemaTypes.object,
          description: "Variables",
          title: "Variables",
        },
      },
      required: ["title", "owner_id"],
    },
    output_parameters: {
      properties: {
        canvas_id: {
          type: SlackTypes.canvas_id,
          description: "Canvas link",
          title: "Canvas link",
        },
      },
      required: ["canvas_id"],
    },
  };
  const actual = CanvasCreate.export();

  assertNotStrictEquals(actual, expected);
});

Deno.test("CanvasCreate can be used as a Slack function in a workflow step", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_CanvasCreate_slack_function",
    title: "Test CanvasCreate",
    description: "This is a generated test to test CanvasCreate",
  });
  testWorkflow.addStep(CanvasCreate, { title: "test", owner_id: "test" });
  const actual = testWorkflow.steps[0].export();

  assertEquals(actual.function_id, "slack#/functions/canvas_create");
  assertEquals(actual.inputs, { title: "test", owner_id: "test" });
});

Deno.test("All outputs of Slack function CanvasCreate should exist", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_CanvasCreate_slack_function",
    title: "Test CanvasCreate",
    description: "This is a generated test to test CanvasCreate",
  });
  const step = testWorkflow.addStep(CanvasCreate, {
    title: "test",
    owner_id: "test",
  });
  assertExists(step.outputs.canvas_id);
});
