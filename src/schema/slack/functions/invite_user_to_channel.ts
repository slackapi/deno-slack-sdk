/** This file was autogenerated on Mon Feb 06 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
import SlackTypes from "../schema_types.ts";

export default DefineFunction({
  callback_id: "slack#/functions/invite_user_to_channel",
  source_file: "",
  title: "Invite to channel",
  description:
    "Invite someone to a channel. This will only work if this workflow created the channel.",
  input_parameters: {
    properties: {
      channel_id: {
        type: SlackTypes.channel_id,
        description: "Search all channels",
      },
      user_id: { type: SlackTypes.user_id, description: "Search all people" },
    },
    required: ["channel_id", "user_id"],
  },
  output_parameters: {
    properties: {
      user_id: {
        type: SlackTypes.user_id,
        description: "Person who was invited",
      },
    },
    required: [],
  },
});
