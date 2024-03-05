const SlackPrimitiveTypes = {
  user_id: "slack#/types/user_id",
  channel_id: "slack#/types/channel_id",
  usergroup_id: "slack#/types/usergroup_id",
  date: "slack#/types/date",
  timestamp: "slack#/types/timestamp",
  blocks: "slack#/types/blocks",
  oauth2: "slack#/types/credential/oauth2",
  jwt: "slack#/types/credential/jwt",
  rich_text: "slack#/types/rich_text",
  message_ts: "slack#/types/message_ts",
  file_id: "slack#/types/file_id",
} as const;

export type ValidSlackPrimitiveTypes =
  typeof SlackPrimitiveTypes[keyof typeof SlackPrimitiveTypes];

export { SlackPrimitiveTypes };
