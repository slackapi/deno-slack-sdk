const SlackPrimitiveTypes = {
  blocks: "slack#/types/blocks",
  canvas_id: "slack#/types/canvas_id",
  canvas_template_id: "slack#/types/canvas_template_id",
  channel_id: "slack#/types/channel_id",
  date: "slack#/types/date",
  expanded_rich_text: "slack#/types/expanded_rich_text",
  file_id: "slack#/types/file_id",
  list_id: "slack#/types/list_id",
  message_ts: "slack#/types/message_ts",
  oauth2: "slack#/types/credential/oauth2",
  rich_text: "slack#/types/rich_text",
  team_id: "slack#/types/team_id",
  timestamp: "slack#/types/timestamp",
  user_id: "slack#/types/user_id",
  usergroup_id: "slack#/types/usergroup_id",
} as const;

export type ValidSlackPrimitiveTypes =
  typeof SlackPrimitiveTypes[keyof typeof SlackPrimitiveTypes];

export { SlackPrimitiveTypes };
