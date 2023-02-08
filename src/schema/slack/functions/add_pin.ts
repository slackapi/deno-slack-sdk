/** This file was autogenerated on Wed Feb 08 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";

export default DefineFunction({
  callback_id: "slack#/functions/add_pin",
  source_file: "",
  title: "Pin to channel",
  description: "Pin a message to a channel",
  input_parameters: {
    properties: {
      channel_id: {
        type: SlackTypes.channel_id,
        description: "Search all channels",
        title: "Select a channel",
      },
      message: {
        type: SchemaTypes.string,
        description: "Enter a message URL or message timestamp",
        title: "Message URL or message timestamp",
      },
    },
    required: ["channel_id", "message"],
  },
  output_parameters: { properties: {}, required: [] },
});
