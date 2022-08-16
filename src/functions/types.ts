import { Env } from "../types.ts";
import { ManifestFunctionSchema } from "../manifest/manifest_schema.ts";
import {
  ParameterDefinition,
  ParameterPropertiesDefinition,
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../parameters/mod.ts";
import {
  CustomTypeParameterDefinition,
  TypedArrayParameterDefinition,
  TypedObjectParameterDefinition,
} from "../parameters/types.ts";
import type SchemaTypes from "../schema/schema_types.ts";
import type SlackSchemaTypes from "../schema/slack/schema_types.ts";
import { SlackManifest } from "../manifest/mod.ts";

export type { BlockActionHandler } from "./interactivity/types.ts";

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

/** @description Defines accepted depth values */
type RecursionDepthLevel = 0 | 1 | 2 | 3 | 4 | 5;

/** @description Defines the max depth we want to recurse */
type MaxRecursionDepth = 5;

/** @description Increases the depth value one at a time */
type IncreaseDepth<Depth extends RecursionDepthLevel = 0> = Depth extends 0 ? 1
  : Depth extends 1 ? 2
  : Depth extends 2 ? 3
  : Depth extends 3 ? 4
  : Depth extends 4 ? 5
  : Depth extends 5 ? MaxRecursionDepth
  : MaxRecursionDepth;

/**
 * @description Maps a ParameterDefinition into a runtime type, i.e. "string" === string.
 */
type FunctionInputRuntimeType<
  Param extends ParameterDefinition,
  CurrentDepth extends RecursionDepthLevel = 0,
> =
  // Recurse through Custom Types, stop when we hit our max depth
  CurrentDepth extends MaxRecursionDepth ? UnknownRuntimeType
    : Param extends CustomTypeParameterDefinition ? FunctionInputRuntimeType<
        Param["type"]["definition"],
        IncreaseDepth<CurrentDepth>
      >
      // Not a Custom Type, so assign the runtime value
    : Param["type"] extends typeof SchemaTypes.string ? string
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
    : Param["type"] extends
      | typeof SlackSchemaTypes.user_id
      | typeof SlackSchemaTypes.usergroup_id
      | typeof SlackSchemaTypes.channel_id
      | typeof SlackSchemaTypes.date ? string
    : Param["type"] extends typeof SlackSchemaTypes.timestamp ? number
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

/**
 * @description Converts a ParameterSetDefinition, and list of required params into an object type used for runtime inputs and outputs
 */
export type FunctionRuntimeParameters<
  Params extends ParameterSetDefinition,
  RequiredParams extends PossibleParameterKeys<Params>,
> =
  & {
    [k in RequiredParams[number]]: FunctionInputRuntimeType<
      Params[k]
    >;
  }
  & {
    [k in keyof Params]?: FunctionInputRuntimeType<
      Params[k]
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
  InputParameters extends FunctionParameters,
  OutputParameters extends FunctionParameters,
> =
  | AsyncFunctionHandler<InputParameters, OutputParameters>
  | SyncFunctionHandler<InputParameters, OutputParameters>;

// Exporting this alias for backwards compatability
/**
 * @deprecated Use either SlackFunctionHandler<Definition> or BaseSlackFunctionHandler<Inputs, Outputs>
 */
export type FunctionHandler<I, O> = BaseSlackFunctionHandler<I, O>;

type SuccessfulFunctionReturnArgs<
  OutputParameters extends FunctionParameters,
> = {
  completed?: true;
  // Allow function to return an empty object if no outputs are defined
  outputs: OutputParameters extends undefined ? (Record<never, never>)
    : OutputParameters;
  error?: string;
};

type ErroredFunctionReturnArgs<OutputParameters> =
  & Partial<SuccessfulFunctionReturnArgs<OutputParameters>>
  & Required<Pick<SuccessfulFunctionReturnArgs<OutputParameters>, "error">>;

type PendingFunctionReturnArgs = {
  completed: false;
  outputs?: never;
  error?: never;
};

export type FunctionHandlerReturnArgs<
  OutputParameters,
> =
  | SuccessfulFunctionReturnArgs<OutputParameters>
  | ErroredFunctionReturnArgs<OutputParameters>
  | PendingFunctionReturnArgs;

export type FunctionContext<
  InputParameters extends FunctionParameters,
> = {
  /**
   * @description A map of string keys to string values containing any environment variables available and provided to your function handler's execution context.
   */
  env: Env;
  /**
   * @description The inputs to the function as defined by your function definition. If no inputs are specified, an empty object is provided at runtime.
   */
  inputs: InputParameters;
  token: string;
  event: FunctionInvocationBody["event"];
};

// Allow undefined here for functions that have no inputs and/or outputs
export type FunctionParameters = {
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
} | undefined;

export interface ISlackFunction<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
  RequiredOutputs extends PossibleParameterKeys<OutputParameters>,
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
  RequiredInputs extends PossibleParameterKeys<InputParameters>,
  RequiredOutputs extends PossibleParameterKeys<OutputParameters>,
> = {
  callback_id: string;
  /** A title for your function. */
  title: string;
  source_file: string;
  /** An optional description for your function. */
  description?: string;
  /** An optional map of input parameter names containing information about their type, title, description, required and (additional) properties. */
  "input_parameters"?: ParameterPropertiesDefinition<
    InputParameters,
    RequiredInputs
  >;
  /** An optional map of output parameter names containing information about their type, title, description, required and (additional) properties. */
  "output_parameters"?: ParameterPropertiesDefinition<
    OutputParameters,
    RequiredOutputs
  >;
};
