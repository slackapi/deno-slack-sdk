/** This file was autogenerated on Wed Feb 15 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";

export default DefineFunction({
  callback_id: "slack#/functions/reply_in_thread",
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
        properties: {
          event_type: { type: SchemaTypes.string },
          event_payload: { type: SchemaTypes.object },
        },
        additionalProperties: true,
        required: ["event_type", "event_payload"],
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
});
