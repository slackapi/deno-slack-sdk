import { Env, ISlackAPIClient } from "../types.ts";

type BlockAction = {
  type: string;
  "action_id": string;
  "block_id": string;
  "action_ts": string;
  value?: string;
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
};
export type BlockActionInvocationBody = {
  type: "block_actions";
  actions: BlockAction[];
  "trigger_id": string;
  "response_url": string;
  user: {
    id: string;
    username: string;
    name: string;
    "team_id": string;
  };
  state?: {
    // deno-lint-ignore no-explicit-any
    values: any;
  };
  view?: {
    state?: {
      // deno-lint-ignore no-explicit-any
      values: any;
    };
  };
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
};

export type BlockActionCallbackArgs = {
  action: BlockAction;
  body: BlockActionInvocationBody;
  client: ISlackAPIClient;
  env: Env;
};

export type BlockActionCallback = {
  // deno-lint-ignore no-explicit-any
  (args: BlockActionCallbackArgs): Promise<any>;
};

export interface IBlockAction {
  matches(body: BlockActionInvocationBody): boolean;
  // deno-lint-ignore no-explicit-any
  run(args: BlockActionCallbackArgs): Promise<any>;
}

export type BlockActionCriteria = {
  actionId: string;
  blockId?: string;
} | {
  actionId?: string;
  blockId: string;
};
