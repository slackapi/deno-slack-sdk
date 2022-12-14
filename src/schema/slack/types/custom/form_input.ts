import SchemaTypes from "../../../schema_types.ts";
import { DefineType } from "../../../../types/mod.ts";

const FormInput = DefineType({
  name: "slack#/types/form_input_object",
  description: "Input fields to be shown on the form",
  type: SchemaTypes.typedobject,
  properties: {
    required: {
      type: SchemaTypes.typedarray,
      items: {
        type: SchemaTypes.string,
      },
    },
    elements: {
      type: SchemaTypes.typedarray,
      items: {
        type: SchemaTypes.untypedobject,
      },
    },
  },
});

export { FormInput };
