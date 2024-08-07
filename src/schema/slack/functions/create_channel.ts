/** This file was autogenerated. Follow the steps in src/schema/slack/functions/_scripts/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";

export default DefineFunction({
  callback_id: "slack#/functions/create_channel",
  source_file: "",
  title: "Create a channel",
  input_parameters: {
    properties: {
      team_id: {
        type: SlackTypes.team_id,
        description: "Search all workspaces",
        title: "Select a workspace",
      },
      channel_name: {
        type: SchemaTypes.string,
        description: "Enter a channel name",
        title: "Channel name",
      },
      manager_ids: {
        type: SchemaTypes.array,
        description: "Search all people",
        title: "Select Channel Manager(s)",
        items: { type: SlackTypes.user_id },
      },
      is_private: {
        type: SchemaTypes.boolean,
        description: "Make this channel private",
        title: "Make channel private",
      },
    },
    required: ["channel_name"],
  },
  output_parameters: {
    properties: {
      channel_id: {
        type: SlackTypes.channel_id,
        description: "Channel name",
        title: "Channel name",
      },
      manager_ids: {
        type: SchemaTypes.array,
        description: "Person(s) who were made channel manager",
        title: "Person(s) who were made channel manager",
        items: { type: SlackTypes.user_id },
      },
    },
    required: ["channel_id"],
  },
});
