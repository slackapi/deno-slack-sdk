/** This file was autogenerated. Follow the steps in src/schema/slack/functions/_scripts/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";

export default DefineFunction({
  callback_id: "slack#/functions/lists_activity_feed",
  source_file: "",
  title: "Send notification to activity feed",
  input_parameters: {
    properties: {
      user_id: {
        type: SlackTypes.user_id,
        description: "Select a user",
        title: "Select a user",
      },
      updated_by_user_id: {
        type: SlackTypes.user_id,
        description: "User who updated the list item",
        title: "User who updated the list item",
      },
      list_id: {
        type: SlackTypes.list_id,
        description: "Select a list",
        title: "Select a list",
      },
      record_id: {
        type: SchemaTypes.string,
        description: "Item ID",
        title: "Item ID",
      },
      columns: {
        type: SchemaTypes.string,
        description: "Field IDs",
        title: "Field IDs",
      },
    },
    required: ["user_id", "list_id", "record_id", "columns"],
  },
  output_parameters: { properties: {}, required: [] },
});
