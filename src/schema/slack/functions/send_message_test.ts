import { assertEquals } from "../../../dev_deps.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";
import SendMessage from "./send_message.ts";

Deno.test("SendMessage generates valid FunctionManifests", () => {
  assertEquals(
    SendMessage.definition.callback_id,
    "slack#/functions/send_message",
  );
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Send a message",
    description: "Send a message to a channel",
    input_parameters: {
      required: ["channel_id", "message"],
      properties: {
        channel_id: {
          type: SlackTypes.channel_id,
          description: "Search all channels",
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
        metadata: {
          type: SchemaTypes.object,
          description:
            "Metadata you post to Slack is accessible to any app or user who is a member of that workspace",
          properties: {
            event_type: {
              type: SchemaTypes.string,
            },
            event_payload: {
              type: SchemaTypes.object,
            },
          },
          additionalProperties: true,
        },
        interactive_blocks: {
          type: SlackTypes.blocks,
          description: "Button(s) to send with the message",
        },
      },
    },
    output_parameters: {
      required: ["message_ts", "message_link", "message_context"],
      properties: {
        message_ts: {
          type: SchemaTypes.string,
          description: "Message time stamp",
        },
        message_link: {
          type: SchemaTypes.string,
          description: "Message link",
        },
        action: {
          type: SchemaTypes.object,
          description: "Button interactivity data",
        },
        interactivity: {
          type: SlackTypes.interactivity,
          description: "Interactivity context",
        },
        message_context: {
          type: SchemaTypes.string,
          description: "Reference to the message sent",
        },
      },
    },
  };
  const actual = SendMessage.export();
  assertEquals(actual, expected);
});
