import { FunctionInputRuntimeType } from "./functions/types.ts";
import { TypedObjectParameter } from "./parameters/definition_types.ts";
import { ICustomType } from "./types/types.ts";

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

/**
 * @description Used to surface runtime Typescript types from Defined Types and Properties
 */
export type RuntimeType<
  T extends
    | ICustomType
    | TypedObjectParameter,
> = T extends ICustomType ? FunctionInputRuntimeType<T["definition"]>
  : T extends TypedObjectParameter ? FunctionInputRuntimeType<T>
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
