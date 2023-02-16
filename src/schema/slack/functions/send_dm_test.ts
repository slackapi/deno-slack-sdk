/** This file was autogenerated on Wed Feb 15 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { assertEquals, assertExists } from "../../../dev_deps.ts";
import { DefineWorkflow } from "../../../workflows/mod.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";
import SendDm from "./send_dm.ts";

Deno.test("SendDm generates valid FunctionManifest", () => {
  assertEquals(SendDm.definition.callback_id, "slack#/functions/send_dm");
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Send a direct message",
    description: "Send a direct message to someone",
    input_parameters: {
      properties: {
        user_id: {
          type: SlackTypes.user_id,
          description: "Search all people",
          title: "Select a member",
        },
        message: {
          type: SlackTypes.rich_text,
          description: "Add a message",
          title: "Add a message",
        },
        thread_ts: {
          type: SlackTypes.message_ts,
          description:
            "Provide another message's timestamp value to make this message a reply",
          title: "Another message's timestamp value",
        },
        interactive_blocks: {
          type: SlackTypes.blocks,
          description: "Button(s) to send with the message",
          title: "Button(s) to send with the message",
        },
      },
      required: ["user_id", "message"],
    },
    output_parameters: {
      properties: {
        message_ts: {
          type: SlackTypes.message_ts,
          description: "Message time stamp",
          title: "Message time stamp",
        },
        message_link: {
          type: SchemaTypes.string,
          description: "Message link",
          title: "Message link",
        },
        action: {
          type: SchemaTypes.object,
          description: "Button interactivity data",
          title: "Button interactivity data",
        },
        interactivity: {
          type: SlackTypes.interactivity,
          description: "Interactivity context",
          title: "interactivity",
        },
        message_context: {
          type: SlackTypes.message_context,
          description: "Reference to the message sent",
          title: "Reference to the message sent",
        },
      },
      required: ["message_ts", "message_link", "message_context"],
    },
  };
  const actual = SendDm.export();

  assertEquals(actual, expected);
});

Deno.test("SendDm can be used as a built-in function in a workflow step", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_SendDm_built_in",
    title: "Test SendDm",
    description: "This is a generated test to test SendDm",
  });
  testWorkflow.addStep(SendDm, { user_id: "test", message: "test" });
  const actual = testWorkflow.steps[0].export();

  assertEquals(actual.function_id, "slack#/functions/send_dm");
  assertEquals(actual.inputs, { user_id: "test", message: "test" });
});

Deno.test("All outputs of built-in function SendDm should exist", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_SendDm_built_in",
    title: "Test SendDm",
    description: "This is a generated test to test SendDm",
  });
  const step = testWorkflow.addStep(SendDm, {
    user_id: "test",
    message: "test",
  });
  assertExists(step.outputs.message_ts);
  assertExists(step.outputs.message_link);
  assertExists(step.outputs.action);
  assertExists(step.outputs.interactivity);
  assertExists(step.outputs.message_context);
});
