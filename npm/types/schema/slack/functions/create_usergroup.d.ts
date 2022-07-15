declare const _default: import("../../../functions/mod.js").SlackFunction<{
    usergroup_handle: {
        type: "string";
        description: string;
    };
    usergroup_name: {
        type: "string";
        description: string;
    };
}, {
    usergroup_id: {
        type: "slack#/types/usergroup_id";
        description: string;
    };
}, ("usergroup_handle" | "usergroup_name")[], "usergroup_id"[]>;
export default _default;
