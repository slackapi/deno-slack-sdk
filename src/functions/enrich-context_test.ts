import { assertExists } from "../dev_deps.ts";
import { enrichContext } from "./enrich-context.ts";
import { BaseRuntimeFunctionContext } from "./types.ts";

Deno.test("enrichContext with no env.SLACK_API_URL", () => {
  // deno-lint-ignore no-explicit-any
  const ctx: BaseRuntimeFunctionContext<any> = {
    env: {},
    inputs: {},
    team_id: "team",
    token: "token",
  };

  const newContext = enrichContext(ctx);

  assertExists(newContext.client);
});

Deno.test("enrichContext with env.SLACK_API_URL", () => {
  // deno-lint-ignore no-explicit-any
  const ctx: BaseRuntimeFunctionContext<any> = {
    env: {
      "SLACK_API_URL": "https://something.slack.com/api",
    },
    inputs: {},
    team_id: "team",
    token: "token",
  };

  const newContext = enrichContext(ctx);

  assertExists(newContext.client);
});
