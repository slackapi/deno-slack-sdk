import {
  ParameterSetDefinition,
  RequiredParameters,
} from "../parameters/mod.ts";
import { SlackFunction } from "./mod.ts";
import type { FunctionContext, FunctionRuntimeParameters } from "./types.ts";
type SlackFunctionTesterArgs<
  InputParameters,
> =
  & Partial<
    FunctionContext<InputParameters>
  >
  & {
    inputs: InputParameters;
  };

export const SlackFunctionTester = <
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends RequiredParameters<InputParameters>,
  RequiredOutput extends RequiredParameters<OutputParameters>,
>(
  func: SlackFunction<
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutput
  >,
) => {
  const now = new Date();
  const testFnID = `fn${now.getTime()}`;
  const createContext = (
    args: SlackFunctionTesterArgs<
      FunctionRuntimeParameters<InputParameters, RequiredInput> | undefined
    >,
  ): FunctionContext<
    FunctionRuntimeParameters<InputParameters, RequiredInput>
  > => {
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
          callback_id: func.definition.callback_id,
          title: "Function Test Title",
        },
      },
    };
  };

  return { createContext };
};
