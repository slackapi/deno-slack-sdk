/** This file was autogenerated on Tue Sep 13 2022. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";

export default DefineFunction(
  {
    callback_id: "slack#/functions/send_dm",
    source_file: "",
    title: "Send a direct message",
    description: "Send a direct message to someone",
    input_parameters: {
      required: ["user_id", "message"],
      properties: {
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
            "Provide another message's timestamp value to make this message a reply",
        },
        interactive_blocks: {
          type: SlackTypes.blocks,
          description: "Button(s) to send with the message",
        },
      },
    },
    output_parameters: {
      required: ["message_ts", "message_link"],
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
        },
      },
    },
  },
);
