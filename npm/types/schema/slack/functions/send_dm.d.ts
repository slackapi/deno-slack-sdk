declare const _default: import("../../../functions/mod.js").SlackFunction<{
    user_id: {
        type: "slack#/types/user_id";
        description: string;
    };
    message: {
        type: "slack#/types/blocks";
        description: string;
    };
    thread_ts: {
        type: "string";
        description: string;
    };
}, {
    ts: {
        type: "string";
        description: string;
    };
}, ("message" | "user_id")[], "ts"[]>;
export default _default;
