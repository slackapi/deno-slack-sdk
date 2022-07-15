import SlackTypes from "./schema_types.js";
import SlackFunctions from "./functions/mod.js";

const SlackSchema = {
  types: SlackTypes,
  functions: SlackFunctions,
} as const;

export default SlackSchema;
