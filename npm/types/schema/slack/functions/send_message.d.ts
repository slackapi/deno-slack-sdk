declare const _default: import("../../../functions/mod.js").SlackFunction<{
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
    metadata: {
        type: "object";
        description: string;
    };
}, {
    ts: {
        type: "string";
        description: string;
    };
}, ("message" | "channel_id")[], "ts"[]>;
export default _default;
