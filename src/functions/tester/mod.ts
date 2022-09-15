import { SlackAPI } from "../../deps.ts";
import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../../parameters/mod.ts";
import { SlackFunctionDefinition } from "../mod.ts";
import type { FunctionRuntimeParameters } from "../types.ts";
import { CreateFunctionContext, SlackFunctionTesterFn } from "./types.ts";
export const DEFAULT_FUNCTION_TESTER_TITLE = "Function Test Title";

export const SlackFunctionTester: SlackFunctionTesterFn = <
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
  RequiredOutput extends PossibleParameterKeys<OutputParameters>,
>(
  funcOrCallbackId:
    | string
    | SlackFunctionDefinition<
      InputParameters,
      OutputParameters,
      RequiredInput,
      RequiredOutput
    >,
) => {
  const now = new Date();
  const testFnID = `fn${now.getTime()}`;
  let testFnCallbackID: string;
  let testFnTitle: string;

  if (typeof funcOrCallbackId === "string") {
    testFnCallbackID = funcOrCallbackId;
    testFnTitle = DEFAULT_FUNCTION_TESTER_TITLE;
  } else {
    testFnCallbackID = funcOrCallbackId.definition.callback_id;
    testFnTitle = funcOrCallbackId.definition.title;
  }

  const createContext: CreateFunctionContext<InputParameters, RequiredInput> = (
    args,
  ) => {
    const ts = new Date();
    const token = args.token || "slack-function-test-token";

    return {
      inputs: (args.inputs || {}) as FunctionRuntimeParameters<
        InputParameters,
        RequiredInput
      >,
      env: args.env || {},
      token,
      client: SlackAPI(token),
      team_id: args.team_id || "test-team-id",
      event: args.event || {
        type: "function_executed",
        event_ts: `${ts.getTime()}`,
        function_execution_id: `fx${ts.getTime()}`,
        inputs: args.inputs as Record<string, unknown>,
        function: {
          id: testFnID,
          callback_id: testFnCallbackID,
          title: testFnTitle,
        },
      },
    };
  };

  return { createContext };
};
