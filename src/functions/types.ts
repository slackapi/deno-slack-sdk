import { SlackAPIClient } from "../deps.ts";
import { Env } from "../types.ts";
import { ManifestFunctionSchema } from "../manifest/manifest_schema.ts";
import {
  ParameterPropertiesDefinition,
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../parameters/types.ts";
import {
  CustomTypeParameterDefinition,
  ParameterDefinition,
  TypedArrayParameterDefinition,
  TypedObjectParameterDefinition,
  TypedObjectProperties,
  TypedObjectRequiredProperties,
} from "../parameters/definition_types.ts";
import type SchemaTypes from "../schema/schema_types.ts";
import type SlackSchemaTypes from "../schema/slack/schema_types.ts";
import { SlackManifest } from "../manifest/mod.ts";
import {
  BasicConstraintField,
  BlockActionConstraint,
  BlockActionHandler,
  BlockSuggestionHandler,
  UnhandledEventHandler,
  ViewClosedHandler,
  ViewSubmissionHandler,
} from "./interactivity/types.ts";
import { ICustomType } from "../types/types.ts";
import {
  IncreaseDepth,
  MaxRecursionDepth,
  RecursionDepthLevel,
} from "../type_utils.ts";
import { DefineFunction } from "./mod.ts";

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

/**
 * @description Maps a ParameterDefinition into a runtime type, i.e. "string" === string.
 */
export type FunctionInputRuntimeType<
  Param extends ParameterDefinition,
  CurrentDepth extends RecursionDepthLevel = 0,
> =
  // Recurse through Custom Types, stop when we hit our max depth
  CurrentDepth extends MaxRecursionDepth ? UnknownRuntimeType
    : Param["type"] extends ICustomType
      ? Param extends CustomTypeParameterDefinition ? FunctionInputRuntimeType<
          Param["type"]["definition"],
          IncreaseDepth<CurrentDepth>
        >
      : UnknownRuntimeType
    : Param["type"] extends
      | typeof SchemaTypes.string
      | typeof SlackSchemaTypes.user_id
      | typeof SlackSchemaTypes.usergroup_id
      | typeof SlackSchemaTypes.channel_id
      | typeof SlackSchemaTypes.date
      | typeof SlackSchemaTypes.message_ts ? string
    : Param["type"] extends
      | typeof SchemaTypes.integer
      | typeof SchemaTypes.number
      | typeof SlackSchemaTypes.timestamp ? number
    : Param["type"] extends typeof SchemaTypes.boolean ? boolean
    : Param["type"] extends typeof SchemaTypes.array
      ? Param extends TypedArrayParameterDefinition
        ? TypedArrayFunctionInputRuntimeType<Param>
      : UnknownRuntimeType[]
    : Param["type"] extends typeof SchemaTypes.object
      ? Param extends TypedObjectParameterDefinition<
        infer P,
        infer RP
      > ? TypedObjectFunctionInputRuntimeType<P, RP, Param>
      : UnknownRuntimeType
    : Param["type"] extends typeof SlackSchemaTypes.rich_text
      ? UnknownRuntimeType
    : UnknownRuntimeType;

// deno-lint-ignore no-explicit-any
type UnknownRuntimeType = any;

type TypedObjectFunctionInputRuntimeType<
  Props extends TypedObjectProperties,
  RequiredProps extends TypedObjectRequiredProperties<Props>,
  Param extends TypedObjectParameterDefinition<Props, RequiredProps>,
> =
  & {
    [prop in keyof Props]?: FunctionInputRuntimeType<
      Props[prop]
    >;
  }
  & (RequiredProps extends Array<keyof Props> ? {
      [prop in RequiredProps[number]]: FunctionInputRuntimeType<
        Props[prop]
      >;
    }
    : Record<never, never>)
  & (Param["additionalProperties"] extends false ? Record<never, never> : {
    [key: string]: UnknownRuntimeType;
  });

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

type AsyncFunctionHandler<
  InputParameters extends FunctionParameters,
  OutputParameters extends FunctionParameters,
  Context extends BaseRuntimeFunctionContext<InputParameters>,
> = {
  (
    context: Context,
  ): Promise<FunctionHandlerReturnArgs<OutputParameters>>;
};

type SyncFunctionHandler<
  InputParameters extends FunctionParameters,
  OutputParameters extends FunctionParameters,
  Context extends BaseRuntimeFunctionContext<InputParameters>,
> = {
  (
    context: Context,
  ): FunctionHandlerReturnArgs<OutputParameters>;
};

/**
 * @description Slack Function handler from a function definition
 */
export type RuntimeSlackFunctionHandler<Definition> = Definition extends
  FunctionDefinitionArgs<infer I, infer O, infer RI, infer RO>
  ? BaseRuntimeSlackFunctionHandler<
    FunctionRuntimeParameters<I, RI>,
    FunctionRuntimeParameters<O, RO>
  >
  : never;

/**
 * @description Slack Function handler from input and output types directly
 */
export type BaseRuntimeSlackFunctionHandler<
  InputParameters extends FunctionParameters,
  OutputParameters extends FunctionParameters,
> =
  | AsyncFunctionHandler<
    InputParameters,
    OutputParameters,
    RuntimeFunctionContext<InputParameters>
  >
  | SyncFunctionHandler<
    InputParameters,
    OutputParameters,
    RuntimeFunctionContext<InputParameters>
  >;

/**
 * @description Slack Function handler from a function definition
 */
export type EnrichedSlackFunctionHandler<Definition> = Definition extends
  FunctionDefinitionArgs<infer I, infer O, infer RI, infer RO>
  ? (BaseEnrichedSlackFunctionHandler<
    FunctionRuntimeParameters<I, RI>,
    FunctionRuntimeParameters<O, RO>
  >)
  : never;

/**
 * @description Slack Function handler from input and output types directly
 */
type BaseEnrichedSlackFunctionHandler<
  InputParameters extends FunctionParameters,
  OutputParameters extends FunctionParameters,
> =
  | AsyncFunctionHandler<
    InputParameters,
    OutputParameters,
    FunctionContext<InputParameters>
  >
  | SyncFunctionHandler<
    InputParameters,
    OutputParameters,
    FunctionContext<InputParameters>
  >;

// export type SlackFunctionHandler<Definition> = EnrichedSlackFunctionHandler<
//   Definition
// >;

type SuccessfulFunctionReturnArgs<
  OutputParameters extends FunctionParameters,
> = {
  completed?: true;
  // Allow function to return an empty object if no outputs are defined
  outputs: OutputParameters extends undefined ? (Record<never, never>)
    : OutputParameters;
  error?: string;
};

type ErroredFunctionReturnArgs<OutputParameters extends FunctionParameters> =
  & Partial<SuccessfulFunctionReturnArgs<OutputParameters>>
  & Required<Pick<SuccessfulFunctionReturnArgs<OutputParameters>, "error">>;

type PendingFunctionReturnArgs = {
  completed: false;
  outputs?: never;
  error?: never;
};

export type FunctionHandlerReturnArgs<
  OutputParameters extends FunctionParameters,
> =
  | SuccessfulFunctionReturnArgs<OutputParameters>
  | ErroredFunctionReturnArgs<OutputParameters>
  | PendingFunctionReturnArgs;

// This describes the base-version of context objects deno-slack-runtime passes into different function handlers (i.e. main fn handler, blockActions, etc).
// Each function handler type extends this with it's own specific additions.
export type BaseRuntimeFunctionContext<
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
  /**
   * @description API token that can be used with the deno-slack-api API client.
   */
  token: string;
  /**
   * @description A unique encoded ID representing the Slack team associated with the workspace where the function execution takes place.
   */
  team_id: string;
  /**
   * @description A unique encoded ID representing the Slack enterprise associated with the workspace where the function execution takes place. In a non-enterprise workspace, this value will be the empty string.
   */
  enterprise_id: string;
};

// SDK Function handlers receive these additional properties on the function context object
export type FunctionContextEnrichment = {
  client: SlackAPIClient;
};

// This is the context deno-slack-runtime passes to the main function handler
export type RuntimeFunctionContext<InputParameters extends FunctionParameters> =
  & BaseRuntimeFunctionContext<InputParameters>
  & {
    event: FunctionInvocationBody["event"];
  };

// This is the enriched context object passed into the main function handler setup with SlackFunction()
export type FunctionContext<
  InputParameters extends FunctionParameters,
> = RuntimeFunctionContext<InputParameters> & FunctionContextEnrichment;

// Allow undefined here for functions that have no inputs and/or outputs
export type FunctionParameters = {
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
} | undefined;

export interface ISlackFunctionDefinition<
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

export type SlackFunctionType<Definition> = Definition extends
  FunctionDefinitionArgs<infer I, infer O, infer RI, infer RO> ? (
    & EnrichedSlackFunctionHandler<Definition>
    & {
      /**
       * @description Add an interactivity handler responding to specific {@link https://api.slack.com/reference/interaction-payloads/block-actions `block_actions` events}.
       * @param {BlockActionConstraint} actionConstraint - A {@link BlockActionConstraint} filter; only `block_actions` payloads that satisfy the constraints provided in this parameter will be routed to the provided handler.
       * @param {BlockActionHandler} handler - A {@link BlockActionHandler} function handler that will be invoked when a matching {@link https://api.slack.com/reference/interaction-payloads/block-actions `block_actions` payload} is dispatched to your application.
       */
      addBlockActionsHandler(
        actionConstraint: BlockActionConstraint,
        handler: BlockActionHandler<
          FunctionDefinitionArgs<I, O, RI, RO>
        >,
      ): SlackFunctionType<Definition>;
      /**
       * @description Add an interactivity handler responding to specific `block_suggestion` events.
       * @param {BlockActionConstraint} actionConstraint - A {@link BlockActionConstraint} filter; only `block_suggestion` payloads that satisfy the constraints provided in this parameter will be routed to the provided handler.
       * @param {BlockSuggestionHandler} handler - A {@link BlockSuggestionHandler} function handler that will be invoked when a matching `block_suggestion` payload is dispatched to your application.
       */
      addBlockSuggestionHandler(
        actionConstraint: BlockActionConstraint,
        handler: BlockSuggestionHandler<
          FunctionDefinitionArgs<I, O, RI, RO>
        >,
      ): SlackFunctionType<Definition>;
      addViewClosedHandler(
        viewConstraint: BasicConstraintField,
        handler: ViewClosedHandler<
          FunctionDefinitionArgs<I, O, RI, RO>
        >,
      ): SlackFunctionType<Definition>;
      addViewSubmissionHandler(
        viewConstraint: BasicConstraintField,
        handler: ViewSubmissionHandler<
          FunctionDefinitionArgs<I, O, RI, RO>
        >,
      ): SlackFunctionType<Definition>;
      addUnhandledEventHandler(
        handler: UnhandledEventHandler<
          FunctionDefinitionArgs<I, O, RI, RO>
        >,
      ): SlackFunctionType<Definition>;
    }
  )
  : never;

// This is the context deno-slack-runtime passes to the unhandledEvent handler
export type RuntimeUnhandledEventContext<
  InputParameters extends FunctionParameters,
> =
  & BaseRuntimeFunctionContext<InputParameters>
  & {
    // deno-lint-ignore no-explicit-any
    body: any;
  };

/**
 * @description Used to extract returned args from Async and Sync function handlers
 */
type ResolveFunctionHandlerReturnArg<
  ReturnArgs extends
    | FunctionHandlerReturnArgs<FunctionParameters>
    | Promise<FunctionHandlerReturnArgs<FunctionParameters>>,
> = ReturnArgs extends FunctionHandlerReturnArgs<FunctionParameters>
  ? ReturnArgs
  : ReturnArgs extends Promise<FunctionHandlerReturnArgs<FunctionParameters>>
    ? Awaited<ReturnArgs>
  : never;

type BaseFunctionRuntimeType<
  EnrichedFunction extends EnrichedSlackFunctionHandler<
    FunctionDefinitionArgs<
      ParameterSetDefinition,
      ParameterSetDefinition,
      PossibleParameterKeys<ParameterSetDefinition>,
      PossibleParameterKeys<ParameterSetDefinition>
    >
  >,
> = {
  args: Parameters<EnrichedFunction>[number];
  outputs: Extract<
    ResolveFunctionHandlerReturnArg<ReturnType<EnrichedFunction>>,
    SuccessfulFunctionReturnArgs<FunctionParameters>
  >["outputs"];
};

/**
 * @description Used to surface function runtime typescript types from defined functions
 */
export type ExtractFunctionRuntimeTypes<
  Function extends ReturnType<typeof DefineFunction>,
> = BaseFunctionRuntimeType<
  EnrichedSlackFunctionHandler<Function["definition"]>
>;
