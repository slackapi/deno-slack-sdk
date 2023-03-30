/** This file was autogenerated on Thu Mar 30 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";

export default DefineFunction({
  callback_id: "slack#/functions/remove_user_from_usergroup",
  source_file: "",
  title: "Remove from a user group",
  description: "Remove someone from a user group",
  input_parameters: {
    properties: {
      usergroup_id: {
        type: SlackTypes.usergroup_id,
        description: "Search all user groups",
        title: "Select a user group",
      },
      user_ids: {
        type: SchemaTypes.array,
        description: "Search all people",
        title: "Select member(s)",
        items: { type: SlackTypes.user_id },
      },
    },
    required: ["usergroup_id"],
  },
  output_parameters: {
    properties: {
      usergroup_id: {
        type: SlackTypes.usergroup_id,
        description: "User group",
        title: "User group",
      },
    },
    required: [],
  },
});
