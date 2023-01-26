import { assertEquals } from "../../../dev_deps.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SlackTypes from "../schema_types.ts";
import InviteUserToChannel from "./invite_user_to_channel.ts";

Deno.test("InviteUserToChannel generates valid FunctionManifests", () => {
  assertEquals(
    InviteUserToChannel.definition.callback_id,
    "slack#/functions/invite_user_to_channel",
  );
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Invite to channel",
    description:
      "Invite someone to a channel. This will only work if this workflow created the channel.",
    input_parameters: {
      required: ["channel_id", "user_id"],
      properties: {
        channel_id: {
          type: SlackTypes.channel_id,
          description: "Search all channels",
        },
        user_id: {
          type: SlackTypes.user_id,
          description: "Search all people",
        },
      },
    },
    output_parameters: {
      required: [],
      properties: {
        user_id: {
          type: SlackTypes.user_id,
          description: "Person who was invited",
        },
      },
    },
  };
  const actual = InviteUserToChannel.export();
  assertEquals(actual, expected);
});
