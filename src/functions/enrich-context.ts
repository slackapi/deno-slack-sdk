import { SlackAPI } from "../deps.ts";
import {
  BaseRuntimeFunctionContext,
  FunctionContextEnrichment,
} from "./types.ts";

export const enrichContext = (
  // deno-lint-ignore no-explicit-any
  context: BaseRuntimeFunctionContext<any>,
): typeof context & FunctionContextEnrichment => {
  const token = context.token;
  const slackApiUrl = (context.env || {})["SLACK_API_URL"];

  const client = SlackAPI(token, {
    slackApiUrl: slackApiUrl ? slackApiUrl : undefined,
  });

  return {
    ...context,
    client,
  };
};
