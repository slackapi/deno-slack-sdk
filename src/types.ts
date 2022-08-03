export type {
  BaseSlackFunctionHandler,
  BlockActionHandler,
  FunctionHandler, // Deprecated
  SlackFunctionHandler,
} from "./functions/types.ts";

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
