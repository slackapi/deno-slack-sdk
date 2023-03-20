import { FunctionInputRuntimeType } from "./functions/types.ts";
import {
  TypedObjectParameterDefinition,
} from "./parameters/definition_types.ts";
import { CustomType } from "./types/mod.ts";

export type {
  /**
   * @deprecated Use SlackFunction() to define handlers instead
   */
  BaseRuntimeSlackFunctionHandler as BaseSlackFunctionHandler,
  BlockActionHandler,
  /**
   * @deprecated Use SlackFunction() to define handlers instead
   */
  RuntimeSlackFunctionHandler as SlackFunctionHandler,
} from "./functions/types.ts";

// ----------------------------------------------------------------------------
// Runtime Types
// ----------------------------------------------------------------------------

// deno-lint-ignore no-explicit-any
type AnyCustomType = CustomType<any, any, any>;

type AnyTypedObjectParameterDefinition = TypedObjectParameterDefinition<
  // deno-lint-ignore no-explicit-any
  any,
  // deno-lint-ignore no-explicit-any
  any
>;

/**
 * @description Used to surface runtime Typescript types from Defined Types and Properties
 */
export type RuntimeType<
  T extends
    | AnyCustomType
    | AnyTypedObjectParameterDefinition,
> = T extends AnyCustomType ? FunctionInputRuntimeType<T["definition"]>
  : T extends AnyTypedObjectParameterDefinition ? FunctionInputRuntimeType<T>
  : never;

// ----------------------------------------------------------------------------
// Invocation
// ----------------------------------------------------------------------------

// This is the schema received from the runtime
// TODO: flush this out as we add support for other payloads
export type InvocationPayload<Body> = {
  // TODO: type this out to handle multiple body types
  body: Body;
  context: {
    bot_access_token: string;
    variables: Record<string, string>;
  };
};

// ----------------------------------------------------------------------------
// Env
// ----------------------------------------------------------------------------
export type Env = Record<string, string>;

export type { SlackAPIClient, Trigger } from "./deps.ts";
