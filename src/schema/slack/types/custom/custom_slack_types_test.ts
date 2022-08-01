import { assertEquals } from "../../../../dev_deps.ts";
import { CustomSlackTypes, InternalSlackTypes } from "./mod.ts";

Deno.test("Custom Slack Types are stringified correctly", () => {
  const { interactivity, user_context } = CustomSlackTypes;
  const { form_input_object } = InternalSlackTypes;
  assertEquals(`${interactivity}`, interactivity.id);
  assertEquals(`${user_context}`, user_context.id);
  assertEquals(`${form_input_object}`, form_input_object.id);
});
