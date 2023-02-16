/** This file was autogenerated on Wed Feb 15 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
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
      user_id: {
        type: SlackTypes.user_id,
        description: "Search all people",
        title: "Select a member",
      },
    },
    required: ["usergroup_id", "user_id"],
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
