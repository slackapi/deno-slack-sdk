/** This file was autogenerated. Follow the steps in src/schema/slack/functions/_scripts/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";

export default DefineFunction({
  callback_id: "slack#/functions/canvas_update_content",
  source_file: "",
  title: "Update a canvas",
  input_parameters: {
    properties: {
      canvas_update_type: {
        type: SchemaTypes.string,
        description: "Type of update",
        title: "Type of update",
      },
      channel_id: {
        type: SlackTypes.channel_id,
        description: "Channel name",
        title: "Select a channel",
      },
      canvas_id: {
        type: SlackTypes.canvas_id,
        description: "Search standalone canvases",
        title: "Select a canvas",
      },
      section_id: {
        type: SchemaTypes.string,
        description: "Select an option",
        title: "Choose which section to update",
      },
      action: {
        type: SchemaTypes.string,
        description: "Select an option",
        title: "How do you want to update?",
      },
      content: {
        type: SlackTypes.expanded_rich_text,
        description: "Add content to the canvas",
        title: "Content",
      },
    },
    required: ["action", "content"],
  },
  output_parameters: {
    properties: {
      canvas_id: {
        type: SlackTypes.canvas_id,
        description: "Canvas link",
        title: "Canvas link",
      },
    },
    required: ["canvas_id"],
  },
});
