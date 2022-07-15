/** This file was autogenerated on Wed Jul 06 2022. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.js";
import SchemaTypes from "../../schema_types.js";
import SlackTypes from "../schema_types.js";

export default DefineFunction(
  {
    callback_id: "slack#/functions/remove_user_from_usergroup",
    source_file: "",
    title: "Remove user from user group",
    description: "Remove someone from a Slack user group.",
    input_parameters: {
      required: ["usergroup_id", "user_ids"],
      properties: {
        usergroup_id: {
          type: SlackTypes.usergroup_id,
          description: "User group",
        },
        user_ids: {
          type: SchemaTypes.array,
          description: "Users to be removed from user group",
          items: {
            type: "slack#/types/user_id",
          },
        },
      },
    },
    output_parameters: {
      required: [],
      properties: {
        usergroup_id: {
          type: SlackTypes.usergroup_id,
          description: "Updated usergroup",
        },
      },
    },
  },
);
