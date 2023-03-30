/** This file was autogenerated on Thu Mar 30 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";

export default DefineFunction({
  callback_id: "slack#/functions/invite_user_to_channel",
  source_file: "",
  title: "Invite to channel",
  description:
    "Invite someone to a channel. This will only work if this workflow created the channel.",
  input_parameters: {
    properties: {
      channel_ids: {
        type: SchemaTypes.array,
        description: "Search all channels",
        title: "Select channel(s)",
        items: { type: SlackTypes.channel_id },
      },
      user_ids: {
        type: SchemaTypes.array,
        description: "Search all people",
        title: "Select member(s)",
        items: { type: SlackTypes.user_id },
      },
    },
    required: [],
  },
  output_parameters: {
    properties: {
      user_ids: {
        type: SchemaTypes.array,
        description: "Person(s) who were invited",
        title: "Person(s) who were invited",
        items: { type: SlackTypes.user_id },
      },
    },
    required: [],
  },
});
