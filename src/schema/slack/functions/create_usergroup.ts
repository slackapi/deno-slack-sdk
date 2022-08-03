/** This file was autogenerated on Mon Aug 01 2022. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";

export default DefineFunction(
  {
    callback_id: "slack#/functions/create_usergroup",
    source_file: "",
    title: "Create a user group",
    description: "Create a Slack user group.",
    input_parameters: {
      required: ["usergroup_handle", "usergroup_name"],
      properties: {
        usergroup_handle: {
          type: SchemaTypes.string,
          description: "User group name",
        },
        usergroup_name: {
          type: SchemaTypes.string,
          description: "User group friendly name",
        },
      },
    },
    output_parameters: {
      required: ["usergroup_id"],
      properties: {
        usergroup_id: {
          type: SlackTypes.usergroup_id,
          description: "Created Usergroup",
        },
      },
    },
  },
);
