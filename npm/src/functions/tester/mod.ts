import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../../parameters/mod.js";
import { SlackFunction } from "../mod.js";
import type { FunctionRuntimeParameters } from "../types.js";
import { CreateContext, SlackFunctionTesterFn } from "./types.js";

export const DEFAULT_FUNCTION_TESTER_TITLE = "Function Test Title";

export const SlackFunctionTester: SlackFunctionTesterFn = <
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
  RequiredOutput extends PossibleParameterKeys<OutputParameters>,
>(
  funcOrCallbackId:
    | string
    | SlackFunction<
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

  const createContext: CreateContext<InputParameters, RequiredInput> = (
    args,
  ) => {
    const ts = new Date();

    return {
      inputs: (args.inputs || {}) as FunctionRuntimeParameters<
        InputParameters,
        RequiredInput
      >,
      env: args.env || {},
      token: args.token || "slack-function-test-token",
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
