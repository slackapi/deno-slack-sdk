import SchemaTypes from "../../../schema_types.ts";
import { SlackPrimitiveTypes } from "../../types/mod.ts";
import { DefineType } from "../../../../types/mod.ts";

const UserContextType = DefineType({
  name: "slack#/types/user_context",
  type: SchemaTypes.typedobject,
  properties: {
    id: {
      type: SlackPrimitiveTypes.user_id,
    },
    secret: {
      type: SchemaTypes.string,
    },
  },
});

export { UserContextType };
