import SchemaTypes from "../../../schema_types.ts";
import SlackTypes from "../../types/mod.ts";
import { DefineType } from "../../../../types/mod.ts";

const UserContextType = DefineType({
  name: "User Context",
  type: SchemaTypes.object,
  properties: {
    id: {
      type: SlackTypes.user_id,
    },
    secret: {
      type: SchemaTypes.string,
    },
  },
});

export default UserContextType;
