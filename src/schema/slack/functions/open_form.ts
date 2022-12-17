/** This file was autogenerated on Tue Aug 30 2022. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";
import { InternalSlackTypes } from "../types/custom/mod.ts";

export default DefineFunction(
  {
    callback_id: "slack#/functions/open_form",
    source_file: "",
    title: "Open a form",
    description: "Opens a form for the user",
    input_parameters: {
      required: ["title", "fields", "interactivity"],
      properties: {
        title: {
          type: SchemaTypes.string,
          description: "Title of the form",
        },
        description: {
          type: SchemaTypes.string,
          description: "Description of the form",
        },
        submit_label: {
          type: SchemaTypes.string,
          description: "Submit Label of the form",
        },
        fields: {
          type: SchemaTypes.custom,
          custom: InternalSlackTypes.form_input_object,
        },
        interactivity: {
          type: SchemaTypes.custom,
          custom: SlackTypes.interactivity,
        },
      },
    },
    output_parameters: {
      required: ["fields", "interactivity"],
      properties: {
        fields: {
          type: SchemaTypes.object,
          description: "fields",
        },
        interactivity: {
          type: SchemaTypes.custom,
          custom: SlackTypes.interactivity,
        },
      },
    },
  },
);
