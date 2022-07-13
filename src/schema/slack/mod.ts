import SlackTypes from "./schema_types.ts";
import SlackFunctions from "./functions/mod.ts";

const SlackSchema = {
  types: SlackTypes,
  functions: SlackFunctions,
} as const;

export default SlackSchema;
