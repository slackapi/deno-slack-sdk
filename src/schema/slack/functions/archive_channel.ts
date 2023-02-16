/** This file was autogenerated on Wed Feb 15 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
import SlackTypes from "../schema_types.ts";

export default DefineFunction({
  callback_id: "slack#/functions/archive_channel",
  source_file: "",
  title: "Archive a channel",
  description: "Archive a Slack channel",
  input_parameters: {
    properties: {
      channel_id: {
        type: SlackTypes.channel_id,
        description: "Search all channels",
        title: "Select a channel",
      },
    },
    required: ["channel_id"],
  },
  output_parameters: {
    properties: {
      channel_id: {
        type: SlackTypes.channel_id,
        description: "Channel name",
        title: "Channel name",
      },
    },
    required: ["channel_id"],
  },
});
