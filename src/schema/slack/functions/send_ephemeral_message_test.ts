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
import SendEphemeralMessage from "./send_ephemeral_message.ts";

Deno.test("SendEphemeralMessage generates valid FunctionManifest", () => {
  assertEquals(
    SendEphemeralMessage.definition.callback_id,
    "slack#/functions/send_ephemeral_message",
  );
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: 'Send an "only visible to you" message',
    description:
      "Send a temporary message to someone in a channel that only they can see",
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
          description: "Message timestamp",
          title: "Message timestamp",
        },
      },
      required: ["message_ts"],
    },
  };
  const actual = SendEphemeralMessage.export();

  assertNotStrictEquals(actual, expected);
});

Deno.test("SendEphemeralMessage can be used as a Slack function in a workflow step", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_SendEphemeralMessage_slack_function",
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

Deno.test("All outputs of Slack function SendEphemeralMessage should exist", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_SendEphemeralMessage_slack_function",
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
