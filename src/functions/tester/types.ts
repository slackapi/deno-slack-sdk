import type {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../../parameters/mod.ts";
import type { SlackFunction } from "../mod.ts";
import type { FunctionContext, FunctionRuntimeParameters } from "../types.ts";

export type SlackFunctionTesterArgs<
  InputParameters,
> =
  & Partial<
    FunctionContext<InputParameters>
  >
  & {
    inputs: InputParameters;
  };

export type CreateContext<
  InputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
> = {
  (
    args: SlackFunctionTesterArgs<
      FunctionRuntimeParameters<InputParameters, RequiredInput> | undefined
    >,
  ): FunctionContext<
    FunctionRuntimeParameters<InputParameters, RequiredInput>
  >;
};

export type SlackFunctionTesterResponse<
  InputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
> = {
  createContext: CreateContext<InputParameters, RequiredInput>;
};

// Slack Function Tester is overloaded to accept either a string or a SlackFunction
export type SlackFunctionTesterFn = {
  // Accept a Slack Function
  <
    InputParameters extends ParameterSetDefinition,
    OutputParameters extends ParameterSetDefinition,
    RequiredInput extends PossibleParameterKeys<InputParameters>,
    RequiredOutput extends PossibleParameterKeys<OutputParameters>,
  >(
    funcOrCallbackId: SlackFunction<
      InputParameters,
      OutputParameters,
      RequiredInput,
      RequiredOutput
    >,
  ): SlackFunctionTesterResponse<
    InputParameters,
    RequiredInput
  >;

  // Accept a string
  // This kind of works, but doesn't know what inputs are needed by the handler
  (funcOrCallbackId: string): {
    createContext: {
      // deno-lint-ignore no-explicit-any
      (args: SlackFunctionTesterArgs<any>): FunctionContext<any>;
    };
  };
};
