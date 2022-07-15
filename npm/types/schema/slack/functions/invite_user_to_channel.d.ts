declare const _default: import("../../../functions/mod.js").SlackFunction<{
    channel_id: {
        type: "slack#/types/channel_id";
        description: string;
    };
    user_id: {
        type: "slack#/types/user_id";
        description: string;
    };
}, {
    user_id: {
        type: "slack#/types/user_id";
        description: string;
    };
}, ("channel_id" | "user_id")[], "user_id"[]>;
export default _default;
