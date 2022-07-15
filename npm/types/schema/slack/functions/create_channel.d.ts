declare const _default: import("../../../functions/mod.js").SlackFunction<{
    channel_name: {
        type: "string";
        description: string;
    };
    is_private: {
        type: "boolean";
        description: string;
    };
}, {
    channel_id: {
        type: "slack#/types/channel_id";
        description: string;
    };
}, "channel_name"[], "channel_id"[]>;
export default _default;
