declare const _default: import("../../../functions/mod.js").SlackFunction<{
    user_id: {
        type: "slack#/types/user_id";
        description: string;
    };
    channel_id: {
        type: "slack#/types/channel_id";
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
}, ("message" | "channel_id" | "user_id")[], "ts"[]>;
export default _default;
