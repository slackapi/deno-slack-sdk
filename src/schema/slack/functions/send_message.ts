/** This file was autogenerated on Wed Feb 01 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";

export default DefineFunction({
  callback_id: "slack#/functions/send_message",
  source_file: "",
  title: "Send a message",
  description: "Send a message to a channel",
  input_parameters: {
    properties: {
      channel_id: {
        type: SlackTypes.channel_id,
        description: "Search all channels",
      },
      message: { type: SlackTypes.rich_text, description: "Add a message" },
      thread_ts: {
        type: SchemaTypes.string,
        description:
          "Provide another message's ts value to make this message a reply",
      },
      metadata: {
        type: SchemaTypes.object,
        description:
          "Metadata you post to Slack is accessible to any app or user who is a member of that workspace",
        additionalProperties: true,
        required: ["event_type", "event_payload"],
        event_type: { type: SchemaTypes.string, description: "undefined" },
        event_payload: { type: SchemaTypes.object, description: "undefined" },
        properties: { undefined },
      },
      interactive_blocks: {
        type: SlackTypes.blocks,
        description: "Button(s) to send with the message",
      },
    },
    required: ["channel_id", "message"],
  },
  output_parameters: {
    properties: {
      message_ts: {
        type: SchemaTypes.string,
        description: "Message time stamp",
      },
      message_link: { type: SchemaTypes.string, description: "Message link" },
      action: {
        type: SchemaTypes.object,
        description: "Button interactivity data",
      },
      interactivity: {
        type: SlackTypes.interactivity,
        description: "Interactivity context",
      },
    },
    required: ["message_ts", "message_link"],
  },
});
