import { assertEquals } from "../../../dev_deps.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";
import SendEphemeralMessage from "./send_ephemeral_message.ts";

Deno.test("SendEphemeralMessage generates valid FunctionManifests", () => {
  assertEquals(
    SendEphemeralMessage.definition.callback_id,
    "slack#/functions/send_ephemeral_message",
  );
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Send an ephemeral message",
    description: "Send a private message to someone in a channel",
    input_parameters: {
      required: ["channel_id", "user_id", "message"],
      properties: {
        channel_id: {
          type: SlackTypes.channel_id,
          description: "Search all channels",
        },
        user_id: {
          type: SlackTypes.user_id,
          description: "Search all people",
        },
        message: {
          type: SlackTypes.rich_text,
          description: "Add a message",
        },
        thread_ts: {
          type: SchemaTypes.string,
          description:
            "Provide another message's ts value to make this message a reply",
        },
      },
    },
    output_parameters: {
      required: ["message_ts"],
      properties: {
        message_ts: {
          type: SchemaTypes.string,
          description: "Message time stamp",
        },
      },
    },
  };
  const actual = SendEphemeralMessage.export();
  assertEquals(actual, expected);
});
