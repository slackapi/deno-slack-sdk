/** This file was autogenerated on Mon Feb 06 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { assertEquals } from "../../../dev_deps.ts";
import { DefineWorkflow } from "../../../workflows/mod.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SlackTypes from "../schema_types.ts";
import InviteUserToChannel from "./invite_user_to_channel.ts";

Deno.test("InviteUserToChannel generates valid FunctionManifest", () => {
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
      properties: {
        channel_id: {
          type: SlackTypes.channel_id,
          description: "Search all channels",
        },
        user_id: { type: SlackTypes.user_id, description: "Search all people" },
      },
      required: ["channel_id", "user_id"],
    },
    output_parameters: {
      properties: {
        user_id: {
          type: SlackTypes.user_id,
          description: "Person who was invited",
        },
      },
      required: [],
    },
  };
  const actual = InviteUserToChannel.export();

  assertEquals(actual, expected);
});

Deno.test("InviteUserToChannel can be used as a built-in function in a workflow step", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_InviteUserToChannel_built_in",
    title: "Test InviteUserToChannel",
    description: "This is a generated test to test InviteUserToChannel",
  });
  testWorkflow.addStep(InviteUserToChannel, {
    channel_id: "test",
    user_id: "test",
  });
  const actual = testWorkflow.steps[0].export();

  assertEquals(actual.function_id, "slack#/functions/invite_user_to_channel");
  assertEquals(actual.inputs, { channel_id: "test", user_id: "test" });
});
