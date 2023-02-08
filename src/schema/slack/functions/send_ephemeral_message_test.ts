/** This file was autogenerated on Wed Feb 08 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { assertEquals, assertExists } from "../../../dev_deps.ts";
import { DefineWorkflow } from "../../../workflows/mod.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";
import SendEphemeralMessage from "./send_ephemeral_message.ts";

Deno.test("SendEphemeralMessage generates valid FunctionManifest", () => {
  assertEquals(
    SendEphemeralMessage.definition.callback_id,
    "slack#/functions/send_ephemeral_message",
  );
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Send an ephemeral message",
    description: "Send a private message to someone in a channel",
    input_parameters: {
      properties: {
        channel_id: {
          type: SlackTypes.channel_id,
          description: "Search all channels",
          title: "Select a channel",
        },
        user_id: {
          type: SlackTypes.user_id,
          description: "Search all people",
          title: "Select a member of the channel",
        },
        message: {
          type: SlackTypes.rich_text,
          description: "Add a message",
          title: "Add a message",
        },
        thread_ts: {
          type: SchemaTypes.string,
          description:
            "Provide another message's ts value to make this message a reply",
          title: "Another message's timestamp value",
        },
      },
      required: ["channel_id", "user_id", "message"],
    },
    output_parameters: {
      properties: {
        message_ts: {
          type: SlackTypes.message_ts,
          description: "Message time stamp",
          title: "Message time stamp",
        },
      },
      required: ["message_ts"],
    },
  };
  const actual = SendEphemeralMessage.export();

  assertEquals(actual, expected);
});

Deno.test("SendEphemeralMessage can be used as a built-in function in a workflow step", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_SendEphemeralMessage_built_in",
    title: "Test SendEphemeralMessage",
    description: "This is a generated test to test SendEphemeralMessage",
  });
  testWorkflow.addStep(SendEphemeralMessage, {
    channel_id: "test",
    user_id: "test",
    message: "test",
  });
  const actual = testWorkflow.steps[0].export();

  assertEquals(actual.function_id, "slack#/functions/send_ephemeral_message");
  assertEquals(actual.inputs, {
    channel_id: "test",
    user_id: "test",
    message: "test",
  });
});

Deno.test("All outputs of built-in function SendEphemeralMessage should exist", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_SendEphemeralMessage_built_in",
    title: "Test SendEphemeralMessage",
    description: "This is a generated test to test SendEphemeralMessage",
  });
  const step = testWorkflow.addStep(SendEphemeralMessage, {
    channel_id: "test",
    user_id: "test",
    message: "test",
  });
  assertExists(step.outputs.message_ts);
});
