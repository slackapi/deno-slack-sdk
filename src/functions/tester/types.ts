import type {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../../parameters/types.ts";
import type { SlackFunctionDefinition } from "../mod.ts";
import type {
  FunctionContext,
  FunctionParameters,
  FunctionRuntimeParameters,
} from "../types.ts";

export type SlackFunctionTesterArgs<
  InputParameters extends FunctionParameters,
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

export type SlackFunctionTesterSignature = {
  <
    InputParameters extends ParameterSetDefinition,
    OutputParameters extends ParameterSetDefinition,
    RequiredInput extends PossibleParameterKeys<InputParameters>,
    RequiredOutput extends PossibleParameterKeys<OutputParameters>,
  >(
    funcOrCallbackId: SlackFunctionDefinition<
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
      <I extends FunctionParameters>(
        args: SlackFunctionTesterArgs<I>,
      ): FunctionContext<I>;
    };
  };
};
