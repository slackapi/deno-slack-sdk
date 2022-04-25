import { Env, ManifestFunctionSchema } from "../types.ts";
import {
  ParameterDefinition,
  ParameterSetDefinition,
  RequiredParameters,
} from "../parameters/mod.ts";
import { TypedArrayParameterDefinition } from "../parameters/types.ts";
import type SchemaTypes from "../schema/schema_types.ts";
import type SlackSchemaTypes from "../schema/slack/schema_types.ts";
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

type FunctionInputRuntimeType<Param extends ParameterDefinition> =
  Param["type"] extends typeof SchemaTypes.string ? string
    : // : Param["type"] extends
    //   | typeof SchemaTypes.integer
    //   | typeof SchemaTypes.number ? number
    Param["type"] extends typeof SchemaTypes.boolean ? boolean
    : Param["type"] extends typeof SchemaTypes.array
      ? Param extends TypedArrayParameterDefinition
        ? TypedArrayFunctionInputRuntimeType<Param>
      : UnknownRuntimeType[]
    : // : Param["type"] extends typeof SchemaTypes.object
    //   ? Param extends TypedObjectParameterDefinition
    //     ? TypedObjectFunctionInputRuntimeType<Param>
    //   : UnknownRuntimeType
    Param["type"] extends
      | typeof SlackSchemaTypes.user_id
      // | typeof SlackSchemaTypes.usergroup_id
      | typeof SlackSchemaTypes.channel_id ? string
    : // : Param["type"] extends typeof SlackSchemaTypes.timestamp ? number
    UnknownRuntimeType;

// deno-lint-ignore no-explicit-any
type UnknownRuntimeType = any;

type TypedArrayFunctionInputRuntimeType<
  Param extends TypedArrayParameterDefinition,
> = FunctionInputRuntimeType<Param["items"]>[];

type FunctionRuntimeParameters<
  Parameters extends ParameterSetDefinition,
  RequiredInputs extends RequiredParameters<Parameters>,
> =
  & {
    [k in RequiredInputs[number]]: FunctionInputRuntimeType<
      Parameters[k]
    >;
  }
  & {
    [k in keyof Parameters]?: FunctionInputRuntimeType<
      Parameters[k]
    >;
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

/**
 * @description Slack Function handler from a function definition
 */
export type SlackFunctionHandler<Definition> = Definition extends
  FunctionDefinitionArgs<infer I, infer O, infer RI, infer RO>
  ? BaseSlackFunctionHandler<
    FunctionRuntimeParameters<I, RI>,
    FunctionRuntimeParameters<O, RO>
  >
  : never;

/**
 * @description Slack Function handler from input and output types directly
 */
export type BaseSlackFunctionHandler<
  InputParameters,
  OutputParameters,
> =
  | AsyncFunctionHandler<InputParameters, OutputParameters>
  | SyncFunctionHandler<InputParameters, OutputParameters>;

type SuccessfulFunctionReturnArgs<OutputParameters> = {
  completed?: boolean;
  outputs: OutputParameters;
  error?: string;
};

// Exporting this alias for backwards compatability
/**
 * @deprecated Use either SlackFunctionHandler or BaseSlackFunctionHandler instead
 */
export type FunctionHandler<
  InputParameters,
  OutputParameters,
> = BaseSlackFunctionHandler<
  InputParameters,
  OutputParameters
>;

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
    properties: InputParameters;
    required: RequiredInput;
  };
  /** An optional map of output parameter names containing information about their type, title, description, required and (additional) properties. */
  "output_parameters"?: {
    properties: OutputParameters;
    required: RequiredOutputs;
  };
};
