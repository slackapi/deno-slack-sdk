/** This file was autogenerated. Follow the steps in src/schema/slack/functions/_scripts/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";

export default DefineFunction({
  callback_id: "slack#/functions/canvas_copy",
  source_file: "",
  title: "Copy a canvas",
  input_parameters: {
    properties: {
      canvas_id: {
        type: SlackTypes.canvas_id,
        description: "Search all canvases",
        title: "Select a canvas",
      },
      title: {
        type: SchemaTypes.string,
        description: "Enter a canvas name",
        title: "Canvas name",
      },
      owner_id: {
        type: SlackTypes.user_id,
        description: "Person",
        title: "Canvas owner",
      },
      placeholder_values: {
        type: SchemaTypes.object,
        description: "Variables",
        title: "Variables",
      },
    },
    required: ["canvas_id", "title", "owner_id"],
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
