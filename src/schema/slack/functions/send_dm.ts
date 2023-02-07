/** This file was autogenerated on Tue Feb 07 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";

export default DefineFunction({
  callback_id: "slack#/functions/send_dm",
  source_file: "",
  title: "Send a direct message",
  description: "Send a direct message to someone",
  input_parameters: {
    properties: {
      user_id: { type: SlackTypes.user_id, description: "Search all people" },
      message: { type: SlackTypes.rich_text, description: "Add a message" },
      thread_ts: {
        type: SlackTypes.message_ts,
        description:
          "Provide another message's timestamp value to make this message a reply",
      },
      interactive_blocks: {
        type: SlackTypes.blocks,
        description: "Button(s) to send with the message",
      },
    },
    required: ["user_id", "message"],
  },
  output_parameters: {
    properties: {
      message_ts: {
        type: SlackTypes.message_ts,
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
      message_context: {
        type: SlackTypes.message_context,
        description: "Reference to the message sent",
      },
    },
    required: ["message_ts", "message_link", "message_context"],
  },
});
