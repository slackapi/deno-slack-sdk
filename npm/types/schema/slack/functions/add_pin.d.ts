declare const _default: import("../../../functions/mod.js").SlackFunction<{
    channel_id: {
        type: "slack#/types/channel_id";
        description: string;
    };
    message: {
        type: "string";
        description: string;
    };
}, {}, ("message" | "channel_id")[], never[]>;
export default _default;
