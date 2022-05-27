import SlackEvents from "./events/mod.ts";
import SlackFunctions from "./functions/mod.ts";
import SlackTypes from "./schema_types.ts";

const SlackSchema = {
  types: SlackTypes,
  functions: SlackFunctions,
  events: SlackEvents,
} as const;

export default SlackSchema;
