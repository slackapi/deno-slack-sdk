import SchemaTypes from "../../../schema_types.ts";
import { DefineType } from "../../../../types/mod.ts";
import { UserContextType } from "./user_context.ts";

const InteractivityType = DefineType({
  name: "slack#/types/interactivity",
  description: "Context about a user interaction",
  type: SchemaTypes.typedobject,
  properties: {
    interactivity_pointer: {
      type: SchemaTypes.string,
    },
    interactor: {
      type: SchemaTypes.custom,
      custom: UserContextType,
    },
  },
});

export { InteractivityType };
