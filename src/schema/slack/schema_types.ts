import SchemaTypes from "../schema_types.ts";

const SlackTypes = {
  user_id: "slack#/types/user_id",
  channel_id: "slack#/types/channel_id",
  usergroup_id: "slack#/types/usergroup_id",
  timestamp: "slack#/types/timestamp",
  blocks: "slack#/types/blocks",
  oauth2: "slack#/types/credential/oauth2",
  user_context: "slack#/types/user_context",
  interactivity: "slack#/types/interactivity",
} as const;

export const InteractivityParameterDefinition = {
  type: SchemaTypes.object,
  properties: {
    interactivity_pointer: {
      type: SchemaTypes.string,
    },
    interactor: {
      type: SlackTypes.user_context,
    },
  },
} as const;

export const UserContextParameterDefinition = {
  type: SchemaTypes.object,
  properties: {
    id: {
      type: SlackTypes.user_id,
    },
    secret: {
      type: SchemaTypes.string,
    },
  },
} as const;

export default SlackTypes;
