import SchemaTypes from "../../../schema_types.ts";
import { DefineType } from "../../../../types/mod.ts";

const FormInput = DefineType({
  name: "slack#/types/form_input_object",
  type: SchemaTypes.object,
  properties: {
    required: {
      type: SchemaTypes.array,
      items: {
        type: SchemaTypes.string,
      },
    },
    elements: {
      type: SchemaTypes.array,
      items: {
        type: SchemaTypes.object,
      },
    },
  },
});

export { FormInput };
