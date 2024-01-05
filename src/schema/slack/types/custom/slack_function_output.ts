import SchemaTypes from "../../../schema_types.ts";
import { DefineType } from "../../../../types/mod.ts";

const SlackFunctionOutputType = DefineType({
  name: "slack#/types/slack_function_output",
  type: SchemaTypes.object,
  properties: {
    function_id: {
      type: SchemaTypes.string,
    },
  },
  required: ["function_id"],
});

export { SlackFunctionOutputType };
