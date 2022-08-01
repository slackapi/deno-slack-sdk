import SchemaTypes from "../../../schema_types.ts";
import { DefineType } from "../../../../types/mod.ts";
import { UserContextType } from "./user_context.ts";

const InteractivityType = DefineType({
  name: "User Context",
  type: SchemaTypes.object,
  properties: {
    interactivity_pointer: {
      type: SchemaTypes.string,
    },
    interactor: {
      type: UserContextType,
    },
  },
});

export { InteractivityType };
