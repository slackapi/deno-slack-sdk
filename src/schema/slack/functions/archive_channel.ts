/** This file was autogenerated on Wed Aug 03 2022. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
import SlackTypes from "../schema_types.ts";

export default DefineFunction(
  {
    callback_id: "slack#/functions/archive_channel",
    source_file: "",
    title: "Archive a channel",
    description: "Archive a Slack channel",
    input_parameters: {
      required: ["channel_id"],
      properties: {
        channel_id: {
          type: SlackTypes.channel_id,
          description: "Search all channels",
        },
      },
    },
    output_parameters: {
      required: ["channel_id"],
      properties: {
        channel_id: {
          type: SlackTypes.channel_id,
          description: "Channel that was archived",
        },
      },
    },
  },
);
