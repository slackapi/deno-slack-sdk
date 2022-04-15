import { Env, ManifestFunctionSchema } from "../types.ts";
import {
  ParameterSetDefinition,
  RequiredParameters,
} from "../parameters/mod.ts";
import { SlackManifest } from "../manifest.ts";

export type FunctionInvocationBody = {
  "team_id": string;
  "api_app_id": string;
  type: "event_callback";
  "event_id": string;
  event: {
    type: "function_executed";
    function: {
      id: string;
      "callback_id": string;
      title: string;
      description?: string;
    };
    "function_execution_id": string;
    inputs?: Record<string, unknown>;
    "event_ts": string;
  };
};

type AsyncFunctionHandler<InputParameters, OutputParameters> = {
  (
    context: FunctionContext<InputParameters>,
  ): Promise<FunctionHandlerReturnArgs<OutputParameters>>;
};

type SyncFunctionHandler<InputParameters, OutputParameters> = {
  (
    context: FunctionContext<InputParameters>,
  ): FunctionHandlerReturnArgs<OutputParameters>;
};

export type FunctionHandler<InputParameters, OutputParameters> =
  | AsyncFunctionHandler<InputParameters, OutputParameters>
  | SyncFunctionHandler<InputParameters, OutputParameters>;

type SuccessfulFunctionReturnArgs<OutputParameters> = {
  completed?: boolean;
  outputs: OutputParameters;
  error?: string;
};

type ErroredFunctionReturnArgs<OutputParameters> =
  & Partial<SuccessfulFunctionReturnArgs<OutputParameters>>
  & Required<Pick<SuccessfulFunctionReturnArgs<OutputParameters>, "error">>;

export type FunctionHandlerReturnArgs<OutputParameters> =
  | SuccessfulFunctionReturnArgs<OutputParameters>
  | ErroredFunctionReturnArgs<OutputParameters>;

export type FunctionContext<InputParameters> = {
  /** A map of string keys to string values containing any environment variables available and provided to your function handler's execution context. */
  env: Env;
  /** The inputs to the function as defined by your function definition. */
  // TODO: Support types generated from manifest
  inputs: InputParameters;
  token: string;
  event: FunctionInvocationBody["event"];
};
export interface ISlackFunction<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends RequiredParameters<InputParameters>,
  RequiredOutputs extends RequiredParameters<OutputParameters>,
> {
  id: string;
  definition: FunctionDefinitionArgs<
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutputs
  >;
  export: () => ManifestFunctionSchema;
  registerParameterTypes: (manifest: SlackManifest) => void;
}

export type FunctionDefinitionArgs<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends RequiredParameters<InputParameters>,
  RequiredOutputs extends RequiredParameters<OutputParameters>,
> = {
  callback_id: string;
  /** A title for your function. */
  title: string;
  source_file: string;
  /** An optional description for your function. */
  description?: string;
  /** An optional map of input parameter names containing information about their type, title, description, required and (additional) properties. */
  "input_parameters"?: {
    required: RequiredInput;
    properties: InputParameters;
  };
  /** An optional map of output parameter names containing information about their type, title, description, required and (additional) properties. */
  "output_parameters"?: {
    required: RequiredOutputs;
    properties: OutputParameters;
  };
};
