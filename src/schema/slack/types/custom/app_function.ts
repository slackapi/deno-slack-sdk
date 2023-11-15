import SchemaTypes from "../../../schema_types.ts";
import { DefineType } from "../../../../types/mod.ts";

const AppFunctionOutputType = DefineType({
  name: "slack#/types/app_function",
  type: SchemaTypes.object,
  properties: {
    function_ids: {
      type: SchemaTypes.array,
      items: {
        type: SchemaTypes.string,
      },
    },
  },
  required: ["function_ids"],
});

export { AppFunctionOutputType };
