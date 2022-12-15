import SchemaTypes from "../../../schema_types.ts";
import { SlackPrimitiveTypes } from "../../types/mod.ts";
import { DefineType } from "../../../../types/mod.ts";
import { DefineObject } from "../../../../types/objects.ts";

const UserContextObject = DefineObject({
  type: SchemaTypes.typedobject,
  properties: {
    id: {
      type: SlackPrimitiveTypes.user_id,
    },
    secret: {
      type: SchemaTypes.string,
    },
  },
  required: ["id", "secret"],
});
const UserContextType = DefineType({
  name: "slack#/types/user_context",
  ...UserContextObject,
});

export { UserContextType };
