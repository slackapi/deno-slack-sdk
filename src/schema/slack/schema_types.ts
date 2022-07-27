import SchemaTypes from "../schema_types.ts";
import { DefineType } from "../../types/mod.ts";

export const SlackTypes = {
  user_id: "slack#/types/user_id",
  channel_id: "slack#/types/channel_id",
  usergroup_id: "slack#/types/usergroup_id",
  timestamp: "slack#/types/timestamp",
  blocks: "slack#/types/blocks",
  oauth2: "slack#/types/credential/oauth2",
} as const;

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

export const SlackCustomTypes = {
  interactivity: InteractivityType,
  user_context: UserContextType,
};

export default { ...SlackTypes, ...SlackCustomTypes };
