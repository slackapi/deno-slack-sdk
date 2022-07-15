export type { BaseSlackFunctionHandler, FunctionHandler, // Deprecated
SlackFunctionHandler, } from "./functions/types.js";
export declare type InvocationPayload<Body> = {
    body: Body;
    context: {
        bot_access_token: string;
        variables: Record<string, string>;
    };
};
export declare type Env = Record<string, string>;
