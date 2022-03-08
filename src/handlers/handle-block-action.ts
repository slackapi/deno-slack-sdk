import { Env, InvocationPayload, ISlackAPIClient } from "../types.ts";
import {
  BlockActionInvocationBody,
  IBlockAction,
} from "../block-actions/types.ts";

export type HandlerOptions = {
  payload: InvocationPayload<BlockActionInvocationBody>;
  client: ISlackAPIClient;
  actions: IBlockAction[];
  env: Env;
};

export async function handleAction({
  payload,
  client,
  actions,
  env,
}: HandlerOptions) {
  const { body } = payload;
  const action = body.actions[0];
  if (!action) {
    return {};
  }

  // Find our action handler that maps to this action
  const handler = actions?.find((handler) => {
    return handler.matches(body);
  });

  if (!handler) {
    return {};
  }

  const resp = await handler.run({ action, body, client, env });

  return resp || {};
}
