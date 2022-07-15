import SchemaTypes from "./schema_types.js";
import SlackSchema from "./slack/mod.js";

const Schema = {
  // Contains primitive types
  types: SchemaTypes,
  // Contains slack-specific schema types
  slack: SlackSchema,
} as const;

export default Schema;
