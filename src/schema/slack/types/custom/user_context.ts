import SchemaTypes from "../../../schema_types.ts";
import { SlackPrimitiveTypes } from "../../types/mod.ts";
import { DefineType } from "../../../../types/mod.ts";

const UserContextType = DefineType({
  name: "User Context",
  type: SchemaTypes.object,
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
