const SlackPrimitiveTypes = {
  user_id: "slack#/types/user_id",
  channel_id: "slack#/types/channel_id",
  usergroup_id: "slack#/types/usergroup_id",
  date: "slack#/types/date",
  timestamp: "slack#/types/timestamp",
  blocks: "slack#/types/blocks",
  oauth2: "slack#/types/credential/oauth2",
} as const;

export { SlackPrimitiveTypes };
