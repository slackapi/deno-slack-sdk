/** This file was autogenerated on Tue Feb 07 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";
import { InternalSlackTypes } from "../types/custom/mod.ts";

export default DefineFunction({
  callback_id: "slack#/functions/open_form",
  source_file: "",
  title: "Open a form",
  description: "Opens a form for the user",
  input_parameters: {
    properties: {
      title: {
        type: SchemaTypes.string,
        description: "Title of the form",
        title: "title",
      },
      description: {
        type: SchemaTypes.string,
        description: "Description of the form",
        title: "description",
      },
      submit_label: {
        type: SchemaTypes.string,
        description: "Submit Label of the form",
        title: "submit_label",
      },
      fields: {
        type: InternalSlackTypes.form_input_object,
        description: "Input fields to be shown on the form",
        title: "fields",
      },
      interactivity: {
        type: SlackTypes.interactivity,
        description:
          "Context about the interactive event that led to opening of the form",
        title: "interactivity",
      },
    },
    required: ["title", "fields", "interactivity"],
  },
  output_parameters: {
    properties: {
      fields: {
        type: SchemaTypes.object,
        description: "fields",
        title: "fields",
      },
      interactivity: {
        type: SlackTypes.interactivity,
        description: "Context about the form submit action interactive event",
        title: "interactivity",
      },
    },
    required: ["fields", "interactivity"],
  },
});
