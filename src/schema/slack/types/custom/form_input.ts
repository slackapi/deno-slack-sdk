import SchemaTypes from "../../../schema_types.ts";
import { DefineType } from "../../../../types/mod.ts";
import { DefineObject } from "../../../../types/objects.ts";

const FormInputObject = DefineObject({
  description: "Input fields to be shown on the form",
  type: SchemaTypes.object,
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
        type: SchemaTypes.object,
      },
    },
  },
  required: [],
});
const FormInput = DefineType({
  name: "slack#/types/form_input_object",
  ...FormInputObject,
});

export { FormInput };
