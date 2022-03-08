import { Env, ISlackAPIClient } from "../types.ts";

export type ViewSubmissionDefinition = {
  "callback_id": string;
  handler: ViewSubmissionHandler;
};

// TODO: type this payload
export type ViewSubmissionInvocationBody = {
  type: "view_submission";
  view: {
    "callback_id": string;
    // deno-lint-ignore no-explicit-any
    [key: string]: any;
  };
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
};

type ViewSubmissionHandlerArgs = {
  body: ViewSubmissionInvocationBody;
  client: ISlackAPIClient;
  env: Env;
};

type ViewSubmissionHandler = {
  // deno-lint-ignore no-explicit-any
  (args: ViewSubmissionHandlerArgs): Promise<any>;
};
