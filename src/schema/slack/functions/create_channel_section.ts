/** This file was autogenerated on Thu Mar 30 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
import SchemaTypes from "../../schema_types.ts";

export default DefineFunction({
  callback_id: "slack#/functions/create_channel_section",
  source_file: "",
  title: "Create a sidebar section",
  description: "Create a sidebar section for a user",
  input_parameters: {
    properties: {
      name: {
        type: SchemaTypes.string,
        description: "Choose a helpful name",
        title: "Section name",
      },
      emoji: {
        type: SchemaTypes.string,
        description: "An emoji to display next to the label. For example: mega",
        title: "Enter an emoji",
      },
    },
    required: ["name", "emoji"],
  },
  output_parameters: {
    properties: {
      channel_section_id: {
        type: SchemaTypes.string,
        description: "The newly created Channel Section ID",
        title: "Channel section",
      },
    },
    required: [],
  },
});
