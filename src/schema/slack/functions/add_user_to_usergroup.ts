/** This file was autogenerated on Wed Mar 29 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";

export default DefineFunction({
  callback_id: "slack#/functions/add_user_to_usergroup",
  source_file: "",
  title: "Add to user group",
  description: "Add someone to a user group.",
  input_parameters: {
    properties: {
      usergroup_id: {
        type: SlackTypes.usergroup_id,
        description: "Search all user groups",
        title: "Select a user group",
      },
      // `user_id` was removed manually, make sure we don't add it back in the next built-in PR
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
    required: ["usergroup_id"],
  },
});
