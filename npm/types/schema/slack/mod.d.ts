declare const SlackSchema: {
    readonly types: {
        readonly user_id: "slack#/types/user_id";
        readonly channel_id: "slack#/types/channel_id";
        readonly usergroup_id: "slack#/types/usergroup_id";
        readonly timestamp: "slack#/types/timestamp";
        readonly blocks: "slack#/types/blocks";
        readonly oauth2: "slack#/types/credential/oauth2";
    };
    readonly functions: {
        readonly AddPin: import("../../functions/mod.js").SlackFunction<{
            channel_id: {
                type: "slack#/types/channel_id";
                description: string;
            };
            message: {
                type: "string";
                description: string;
            };
        }, {}, ("message" | "channel_id")[], never[]>;
        readonly AddUserToUsergroup: import("../../functions/mod.js").SlackFunction<{
            usergroup_id: {
                type: "slack#/types/usergroup_id";
                description: string;
            };
            user_id: {
                type: "slack#/types/user_id";
                description: string;
            };
        }, {
            usergroup_id: {
                type: "slack#/types/usergroup_id";
                description: string;
            };
        }, ("usergroup_id" | "user_id")[], "usergroup_id"[]>;
        readonly ArchiveChannel: import("../../functions/mod.js").SlackFunction<{
            channel_id: {
                type: "slack#/types/channel_id";
                description: string;
            };
        }, {
            channel_id: {
                type: "slack#/types/channel_id";
                description: string;
            };
        }, "channel_id"[], "channel_id"[]>;
        readonly CreateChannel: import("../../functions/mod.js").SlackFunction<{
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
        readonly CreateUsergroup: import("../../functions/mod.js").SlackFunction<{
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
        readonly Delay: import("../../functions/mod.js").SlackFunction<{
            minutes_to_delay: {
                type: "integer";
                description: string;
            };
        }, {}, "minutes_to_delay"[], never[]>;
        readonly InviteUserToChannel: import("../../functions/mod.js").SlackFunction<{
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
        readonly RemoveUserFromUsergroup: import("../../functions/mod.js").SlackFunction<{
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
        readonly RenameChannel: import("../../functions/mod.js").SlackFunction<{
            channel_id: {
                type: "slack#/types/channel_id";
                description: string;
            };
            channel_name: {
                type: "string";
                description: string;
            };
        }, {
            channel_id: {
                type: "slack#/types/channel_id";
                description: string;
            };
        }, ("channel_id" | "channel_name")[], "channel_id"[]>;
        readonly SendDm: import("../../functions/mod.js").SlackFunction<{
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
        readonly SendEphemeralMessage: import("../../functions/mod.js").SlackFunction<{
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
        readonly SendMessage: import("../../functions/mod.js").SlackFunction<{
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
        readonly UpdateChannelTopic: import("../../functions/mod.js").SlackFunction<{
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
    };
};
export default SlackSchema;
