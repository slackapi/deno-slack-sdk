import SchemaTypes from "./schema_types.js";
import SlackSchema from "./slack/mod.js";
import Providers from "./providers/mod.js";

const Schema = {
  // Contains primitive types
  types: SchemaTypes,
  // Contains slack-specific schema types
  slack: SlackSchema,
  providers: Providers,
} as const;

export default Schema;
