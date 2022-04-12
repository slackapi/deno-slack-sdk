import { Env, ManifestFunctionSchema } from "../types.ts";
import {
  ParameterDefinition,
  ParameterSetDefinition,
  RequiredParameters,
} from "../parameters/mod.ts";
import {
  TypedArrayParameterDefinition,
  // TypedObjectParameterDefinition,
} from "../parameters/types.ts";
import SchemaTypes from "../schema/schema_types.ts";
import SlackSchemaTypes from "../schema/slack/schema_types.ts";
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

// TODO: Type the outputs similar to the inputs
export type FunctionHandlerReturnArgs<
  OutputParameters extends ParameterSetDefinition,
  RequiredOutputs extends RequiredParameters<OutputParameters>,
> = {
  completed?: boolean;
  outputs?: FunctionInputs<OutputParameters, RequiredOutputs>;
  error?: string;
};

export type FunctionContext<
  InputParameters extends ParameterSetDefinition,
  RequiredInputs extends RequiredParameters<InputParameters>,
> = {
  // TODO: Type the values to our supported types?
  /** A map of string keys to string values containing any environment variables available and provided to your function handler's execution context. */
  env: Env;
  /** The inputs to the function as defined by your function definition. */
  // TODO: Support types generated from manifest
  inputs: FunctionInputs<
    InputParameters,
    RequiredInputs
  >;
  executionId: string;
};

/* START TODO: Remove Runtime Generic Typing in favor of Generated Types */

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
    // TODO: Look at moving these slack runtime type declarations into the slack type definitions once we have DefineType and can use it there
    Param["type"] extends
      | typeof SlackSchemaTypes.user_id
      | typeof SlackSchemaTypes.channel_id ? // | typeof SlackSchemaTypes.usergroup_id
    string
    : // : Param["type"] extends typeof SlackSchemaTypes.timestamp ? number
    UnknownRuntimeType;

// deno-lint-ignore no-explicit-any
type UnknownRuntimeType = any;

// type TypedObjectFunctionInputRuntimeType<
//   Param extends TypedObjectParameterDefinition,
// > =
//   & {
//     [k in keyof Param["properties"]]: FunctionInputRuntimeType<
//       Param["properties"][k]
//     >;
//   }
//   & {
//     [key: string]: UnknownRuntimeType;
//   };

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

/* END TODO: Remove Runtime Generic Typing in favor of Generated Types */

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
