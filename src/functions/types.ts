import { Env, ISlackAPIClient, ManifestFunctionSchema } from "../types.ts";
import {
  ParameterDefinition,
  ParameterSetDefinition,
  RequiredParameters,
} from "../parameters/mod.ts";
import {
  TypedArrayParameterDefinition,
  TypedObjectParameterDefinition,
} from "../parameters/types.ts";
import SchemaTypes from "../schema/schema_types.ts";
import { SlackProject } from "../project.ts";

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

export type FunctionHandler<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends RequiredParameters<InputParameters>,
  RequiredOutputs extends RequiredParameters<OutputParameters>,
> = {
  // TODO: Type the return args of promise more
  (context: FunctionContext<InputParameters, RequiredInput>): Promise<
    FunctionHandlerReturnArgs<OutputParameters, RequiredOutputs>
  >;
};
export type FunctionContext<
  InputParameters extends ParameterSetDefinition,
  RequiredInputs extends RequiredParameters<InputParameters>,
> = {
  // TODO: Type the values to our supported types?
  /** A map of string keys to string values containing any environment variables available and provided to your function handler's execution context. */
  env: Env;
  /** The inputs to the function as defined by your function definition. */
  inputs: FunctionInputs<
    InputParameters,
    RequiredInputs
  >;
  /** A Slack API client pre-configured with your application's access token */
  client: ISlackAPIClient;
  executionId: string;
};

type FunctionInputRuntimeType<Param extends ParameterDefinition> =
  Param["type"] extends typeof SchemaTypes.string ? string
    : Param["type"] extends
      | typeof SchemaTypes.integer
      | typeof SchemaTypes.number ? number
    : Param["type"] extends typeof SchemaTypes.boolean ? boolean
    : Param["type"] extends typeof SchemaTypes.array
      ? Param extends TypedArrayParameterDefinition
        ? TypedArrayFunctionInputRuntimeType<Param>
      : UnknownRuntimeType[]
    : Param["type"] extends typeof SchemaTypes.object
      ? Param extends TypedObjectParameterDefinition
        ? TypedObjectFunctionInputRuntimeType<Param>
      : UnknownRuntimeType
    : UnknownRuntimeType;

// deno-lint-ignore no-explicit-any
type UnknownRuntimeType = any;

type TypedObjectFunctionInputRuntimeType<
  Param extends TypedObjectParameterDefinition,
> =
  & {
    [k in keyof Param["properties"]]: FunctionInputRuntimeType<
      Param["properties"][k]
    >;
  }
  & {
    [key: string]: UnknownRuntimeType;
  };

type TypedArrayFunctionInputRuntimeType<
  Param extends TypedArrayParameterDefinition,
> = FunctionInputRuntimeType<Param["items"]>[];

type FunctionInputs<
  InputParameters extends ParameterSetDefinition,
  RequiredInputs extends RequiredParameters<InputParameters>,
> =
  & {
    [k in RequiredInputs[number]]: FunctionInputRuntimeType<
      InputParameters[k]
    >;
  }
  & {
    [k in keyof InputParameters]?: FunctionInputRuntimeType<
      InputParameters[k]
    >;
  };

// TODO: Type the outputs similar to the inputs
export type FunctionHandlerReturnArgs<
  OutputParameters extends ParameterSetDefinition,
  RequiredOutputs extends RequiredParameters<OutputParameters>,
> = {
  completed?: boolean;
  outputs?: FunctionInputs<OutputParameters, RequiredOutputs>;
  error?: string;
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
}

export interface IRunnableSlackFunction<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInputs extends RequiredParameters<InputParameters>,
  RequiredOutputs extends RequiredParameters<OutputParameters>,
> extends
  ISlackFunction<
    InputParameters,
    OutputParameters,
    RequiredInputs,
    RequiredOutputs
  > {
  run: (
    context: FunctionContext<InputParameters, RequiredInputs>,
  ) => Promise<FunctionHandlerReturnArgs<OutputParameters, RequiredOutputs>>;
  export: () => ManifestFunctionSchema;
  registerParameterTypes: (project: SlackProject) => void;
}

export type FunctionDefinitionArgs<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends RequiredParameters<InputParameters>,
  RequiredOutputs extends RequiredParameters<OutputParameters>,
> = {
  /** A title for your function. */
  title: string;
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

export type FunctionDefinitionArgsWithOptional<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends RequiredParameters<InputParameters>,
> = {
  title: string;
  description?: string;
  "input_parameters"?: {
    required: RequiredInput;
    properties: InputParameters;
  };
  "output_parameters"?: {
    required: RequiredParameters<OutputParameters>;
    properties: OutputParameters;
  };
};
