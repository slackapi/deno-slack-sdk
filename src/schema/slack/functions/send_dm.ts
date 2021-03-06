/** This file was autogenerated on Wed Jul 06 2022. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";

export default DefineFunction(
  {
    callback_id: "slack#/functions/send_dm",
    source_file: "",
    title: "Send a direct message (experimental)",
    description: "Sends a direct message to a user.",
    input_parameters: {
      required: ["user_id", "message"],
      properties: {
        user_id: {
          type: SlackTypes.user_id,
          description: "Send this message to this user",
        },
        message: {
          type: SlackTypes.blocks,
          description: "Message Text",
        },
        thread_ts: {
          type: SchemaTypes.string,
          description:
            "Another Message's ts value to make this message a reply",
        },
      },
    },
    output_parameters: {
      required: ["ts"],
      properties: {
        ts: {
          type: SchemaTypes.string,
          description: "Timestamp of the message that was sent",
        },
      },
    },
  },
);
