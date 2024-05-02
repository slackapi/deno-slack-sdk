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
import ShareCanvasInThread from "./share_canvas_in_thread.ts";

Deno.test("ShareCanvasInThread generates valid FunctionManifest", () => {
  assertEquals(
    ShareCanvasInThread.definition.callback_id,
    "slack#/functions/share_canvas_in_thread",
  );
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Share canvas in thread",
    input_parameters: {
      properties: {
        canvas_id: {
          type: SlackTypes.canvas_id,
          description: "Search all canvases",
          title: "Select a canvas",
        },
        message_context: {
          type: SlackTypes.message_context,
          description: "Select a message to reply to",
          title: "Select a message to reply to",
        },
        access_level: {
          type: SchemaTypes.string,
          description: "Select an option",
          title: "Select access level",
        },
        message: {
          type: SlackTypes.rich_text,
          description: "Add a message",
          title: "Add a message",
        },
        reply_broadcast: {
          type: SchemaTypes.boolean,
          description: "Also send to conversation",
          title: "Also send to conversation",
        },
      },
      required: ["canvas_id", "message_context", "access_level"],
    },
    output_parameters: {
      properties: {
        canvas_id: {
          type: SlackTypes.canvas_id,
          description: "Canvas link",
          title: "Canvas link",
        },
        message_context: {
          type: SlackTypes.message_context,
          description: "Reference to the message sent",
          title: "Reference to the message sent",
        },
      },
      required: [],
    },
  };
  const actual = ShareCanvasInThread.export();

  assertNotStrictEquals(actual, expected);
});

Deno.test("ShareCanvasInThread can be used as a Slack function in a workflow step", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_ShareCanvasInThread_slack_function",
    title: "Test ShareCanvasInThread",
    description: "This is a generated test to test ShareCanvasInThread",
  });
  testWorkflow.addStep(ShareCanvasInThread, {
    canvas_id: "test",
    message_context: "test",
    access_level: "test",
  });
  const actual = testWorkflow.steps[0].export();

  assertEquals(actual.function_id, "slack#/functions/share_canvas_in_thread");
  assertEquals(actual.inputs, {
    canvas_id: "test",
    message_context: "test",
    access_level: "test",
  });
});

Deno.test("All outputs of Slack function ShareCanvasInThread should exist", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_ShareCanvasInThread_slack_function",
    title: "Test ShareCanvasInThread",
    description: "This is a generated test to test ShareCanvasInThread",
  });
  const step = testWorkflow.addStep(ShareCanvasInThread, {
    canvas_id: "test",
    message_context: "test",
    access_level: "test",
  });
  assertExists(step.outputs.canvas_id);
  assertExists(step.outputs.message_context);
});
