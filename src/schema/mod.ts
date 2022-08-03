import SchemaTypes from "./schema_types.ts";
import SlackSchema from "./slack/mod.ts";
import Providers from "./providers/mod.ts";

const Schema = {
  // Contains primitive types
  types: SchemaTypes,
  // Contains slack-specific schema types
  slack: SlackSchema,
  providers: Providers,
} as const;

export default Schema;
