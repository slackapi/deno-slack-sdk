/** This file was autogenerated on Wed Jan 25 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
import SchemaTypes from "../../schema_types.ts";

export default DefineFunction(
  {
    callback_id: "slack#/functions/delay",
    source_file: "",
    title: "Delay",
    description: "Pause the workflow for a set amount of time",
    input_parameters: {
      required: ["minutes_to_delay"],
      properties: {
        minutes_to_delay: {
          type: SchemaTypes.integer,
          description: "Enter number of minutes",
        },
      },
    },
    output_parameters: {
      required: [],
      properties: {},
    },
  },
);
