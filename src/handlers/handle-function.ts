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

export async function handleFunction({
  payload,
  client,
  project,
  env,
}: HandlerOptions) {
  const { body } = payload;

  const callbackId = body.event?.function?.callback_id;
  const functionExecutionId = body.event?.function_execution_id;
  const func = project.functions?.find(
    (slackFunction) => slackFunction.id === callbackId,
  );
  if (!func) {
    throw Error(`${callbackId} function not found`);
  }
  const inputs = body.event?.inputs || {};
  // We don't catch any errors the handlers may throw, we let them throw, and stop the process
  const { completed = true, outputs = {}, error } = await func.run({
    inputs,
    client,
    env,
    executionId: functionExecutionId,
  });

  // App has indicated there's an unrecoverable error with this function invocation
  if (error) {
    const result = await client.call("functions.completeError", {
      error: error,
      "function_execution_id": functionExecutionId,
    });

    if (result.error) {
      console.log("functions.completeError error: " + result.error);
    }

    return {};
  }

  // App has indicated it's function completed successfully
  if (completed) {
    const result = await client.call("functions.completeSuccess", {
      outputs,
      function_execution_id: functionExecutionId,
    });

    if (result.error) {
      console.log("functions.completeSuccess error: " + result.error);
    }

    return {};
  }

  return {};
}
