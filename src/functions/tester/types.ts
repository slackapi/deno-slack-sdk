import type {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../../parameters/mod.ts";
import type { SlackFunction } from "../mod.ts";
import type { FunctionContext, FunctionRuntimeParameters } from "../types.ts";
import type { ActionContext } from "../routers/types.ts";

export type SlackFunctionTesterArgs<
  InputParameters,
> =
  & Partial<
    FunctionContext<InputParameters>
  >
  & {
    inputs: InputParameters;
  };

export type CreateFunctionContext<
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
  createContext: CreateFunctionContext<InputParameters, RequiredInput>;
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
  (funcOrCallbackId: string): {
    createContext: {
      <I>(args: SlackFunctionTesterArgs<I>): FunctionContext<I>;
    };
  };
};

export type SlackActionHandlerTesterArgs<InputParameters> =
  & Partial<
    ActionContext<InputParameters>
  >
  & {
    inputs: InputParameters;
  };

export type CreateActionHandlerContext<
  InputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
> = {
  (
    args: SlackActionHandlerTesterArgs<
      FunctionRuntimeParameters<InputParameters, RequiredInput>
    >,
  ): ActionContext<
    FunctionRuntimeParameters<InputParameters, RequiredInput>
  >;
};

export type SlackActionHandlerTesterResponse<
  InputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
> = {
  createContext: CreateActionHandlerContext<InputParameters, RequiredInput>;
};

export type SlackActionHandlerTesterFn = {
  // Accept a Slack Function
  <
    InputParameters extends ParameterSetDefinition,
    OutputParameters extends ParameterSetDefinition,
    RequiredInput extends PossibleParameterKeys<InputParameters>,
    RequiredOutput extends PossibleParameterKeys<OutputParameters>,
  >(
    func: SlackFunction<
      InputParameters,
      OutputParameters,
      RequiredInput,
      RequiredOutput
    >,
  ): SlackActionHandlerTesterResponse<
    InputParameters,
    RequiredInput
  >;
};
