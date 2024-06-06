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
import ChannelCanvasCreate from "./channel_canvas_create.ts";

Deno.test("ChannelCanvasCreate generates valid FunctionManifest", () => {
  assertEquals(
    ChannelCanvasCreate.definition.callback_id,
    "slack#/functions/channel_canvas_create",
  );
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Create channel canvas",
    input_parameters: {
      properties: {
        channel_id: {
          type: SlackTypes.channel_id,
          description: "Channel name",
          title: "Select a channel",
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
      required: ["channel_id"],
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
  const actual = ChannelCanvasCreate.export();

  assertNotStrictEquals(actual, expected);
});

Deno.test("ChannelCanvasCreate can be used as a Slack function in a workflow step", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_ChannelCanvasCreate_slack_function",
    title: "Test ChannelCanvasCreate",
    description: "This is a generated test to test ChannelCanvasCreate",
  });
  testWorkflow.addStep(ChannelCanvasCreate, { channel_id: "test" });
  const actual = testWorkflow.steps[0].export();

  assertEquals(actual.function_id, "slack#/functions/channel_canvas_create");
  assertEquals(actual.inputs, { channel_id: "test" });
});

Deno.test("All outputs of Slack function ChannelCanvasCreate should exist", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_ChannelCanvasCreate_slack_function",
    title: "Test ChannelCanvasCreate",
    description: "This is a generated test to test ChannelCanvasCreate",
  });
  const step = testWorkflow.addStep(ChannelCanvasCreate, {
    channel_id: "test",
  });
  assertExists(step.outputs.canvas_id);
});
