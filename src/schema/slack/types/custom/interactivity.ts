import SchemaTypes from "../../../schema_types.ts";
import { DefineType } from "../../../../types/mod.ts";
import { UserContextType } from "./user_context.ts";
import { DefineObject } from "../../../../types/objects.ts";

const InteractivityObject = DefineObject({
  description: "Context about a user interaction",
  type: SchemaTypes.object,
  properties: {
    interactivity_pointer: {
      type: SchemaTypes.string,
    },
    interactor: {
      type: SchemaTypes.custom,
      custom: UserContextType,
    },
  },
  required: ["interactivity_pointer", "interactor"],
});
const InteractivityType = DefineType({
  name: "slack#/types/interactivity",
  ...InteractivityObject,
});

export { InteractivityType };
