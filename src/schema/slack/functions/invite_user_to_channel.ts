/** This is an autogenerated file. Run ./.slack/sdk/schema/slack/functions/_scripts/generate to rebuild **/
import { DefineFunctionStatic } from "../../../functions/mod.ts";
import SlackTypes from "../schema_types.ts";

export default DefineFunctionStatic(
  "slack#/functions/invite_user_to_channel",
  {
    title: "Invite User To Channel",
    description: "Invites a user to the provided channel",
    input_parameters: {
      required: ["channel_id", "user_id"],
      properties: {
        channel_id: {
          type: SlackTypes.channel_id,
          description: "Channel",
        },
        user_id: {
          type: SlackTypes.user_id,
          description: "User",
        },
      },
    },
    output_parameters: {
      required: ["user_id"],
      properties: {
        user_id: {
          type: SlackTypes.user_id,
          description: "Invited User",
        },
      },
    },
  },
);
