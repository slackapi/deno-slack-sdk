import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../../parameters/mod.ts";
import { SlackFunction } from "../mod.ts";
import type { FunctionRuntimeParameters } from "../types.ts";
import { CreateContext, SlackFunctionTesterFn } from "./types.ts";

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
          callback_id: typeof funcOrCallbackId === "string"
            ? funcOrCallbackId
            : funcOrCallbackId.definition.callback_id,
          title: typeof funcOrCallbackId === "string"
            ? DEFAULT_FUNCTION_TESTER_TITLE
            : funcOrCallbackId.definition.title,
        },
      },
    };
  };

  return { createContext };
};
