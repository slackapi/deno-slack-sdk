declare const _default: import("../../../functions/mod.js").SlackFunction<{
    usergroup_id: {
        type: "slack#/types/usergroup_id";
        description: string;
    };
    user_ids: {
        type: "array";
        description: string;
        items: {
            type: "slack#/types/user_id";
        };
    };
}, {
    usergroup_id: {
        type: "slack#/types/usergroup_id";
        description: string;
    };
}, ("usergroup_id" | "user_ids")[], never[]>;
export default _default;
