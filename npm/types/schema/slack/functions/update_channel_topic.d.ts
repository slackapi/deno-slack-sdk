declare const _default: import("../../../functions/mod.js").SlackFunction<{
    channel_id: {
        type: "slack#/types/channel_id";
        description: string;
    };
    topic: {
        type: "string";
        description: string;
    };
}, {
    topic: {
        type: "string";
        description: string;
    };
}, ("channel_id" | "topic")[], "topic"[]>;
export default _default;
