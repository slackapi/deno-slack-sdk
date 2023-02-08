/** This file was autogenerated on Wed Feb 08 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { assertEquals, assertExists } from "../../../dev_deps.ts";
import { DefineWorkflow } from "../../../workflows/mod.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";
import ReplyInThread from "./reply_in_thread.ts";

Deno.test("ReplyInThread generates valid FunctionManifest", () => {
  assertEquals(
    ReplyInThread.definition.callback_id,
    "slack#/functions/reply_in_thread",
  );
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Reply in thread",
    description: "Send a message in a thread",
    input_parameters: {
      properties: {
        message_context: {
          type: SlackTypes.message_context,
          description: "Select a message to reply to",
          title: "Select a message to reply to",
        },
        message: {
          type: SlackTypes.rich_text,
          description: "Add a reply",
          title: "Add a reply",
        },
        reply_broadcast: {
          type: SchemaTypes.boolean,
          description: "Also send to conversation",
          title: "Also send to conversation",
        },
        metadata: {
          type: SchemaTypes.object,
          description:
            "Metadata you post to Slack is accessible to any app or user who is a member of that workspace",
          title: "Message metadata",
          additionalProperties: true,
          required: ["event_type", "event_payload"],
          properties: {
            event_type: { type: SchemaTypes.string },
            event_payload: { type: SchemaTypes.object },
          },
        },
      },
      required: ["message_context", "message"],
    },
    output_parameters: {
      properties: {
        message_context: {
          type: SlackTypes.message_context,
          description: "Reference to the message sent",
          title: "Reference to the message sent",
        },
        message_link: {
          type: SchemaTypes.string,
          description: "Message link",
          title: "Message link",
        },
      },
      required: ["message_context", "message_link"],
    },
  };
  const actual = ReplyInThread.export();

  assertEquals(actual, expected);
});

Deno.test("ReplyInThread can be used as a built-in function in a workflow step", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_ReplyInThread_built_in",
    title: "Test ReplyInThread",
    description: "This is a generated test to test ReplyInThread",
  });
  testWorkflow.addStep(ReplyInThread, {
    message_context: "test",
    message: "test",
  });
  const actual = testWorkflow.steps[0].export();

  assertEquals(actual.function_id, "slack#/functions/reply_in_thread");
  assertEquals(actual.inputs, { message_context: "test", message: "test" });
});

Deno.test("All outputs of built-in function ReplyInThread should exist", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_ReplyInThread_built_in",
    title: "Test ReplyInThread",
    description: "This is a generated test to test ReplyInThread",
  });
  const step = testWorkflow.addStep(ReplyInThread, {
    message_context: "test",
    message: "test",
  });
  assertExists(step.outputs.message_context);
  assertExists(step.outputs.message_link);
});
