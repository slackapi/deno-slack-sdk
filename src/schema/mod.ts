import SchemaTypes from "./schema_types.ts";
import SlackSchema from "./slack/mod.ts";

const Schema = {
  // Contains primitive types
  types: SchemaTypes,
  // Contains slack-specific schema types/functions
  slack: SlackSchema,
} as const;

export default Schema;
