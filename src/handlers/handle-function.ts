import { FunctionInvocationBody } from "../functions/types.ts";
import {
  Env,
  InvocationPayload,
  ISlackAPIClient,
  SlackProjectType,
} from "../types.ts";

export type HandlerOptions = {
  payload: InvocationPayload<FunctionInvocationBody>;
  client: ISlackAPIClient;
  project: SlackProjectType;
  env: Env;
};

export async function handleFunction() {
  return await {};
}
