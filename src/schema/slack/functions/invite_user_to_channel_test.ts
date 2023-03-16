/** This file was autogenerated on Thu Feb 16 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { assertEquals, assertExists } from "../../../dev_deps.ts";
import { DefineWorkflow } from "../../../workflows/mod.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SchemaTypes from "../../schema_types.ts";
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
          title: "Select a channel",
        },
        user_id: {
          type: SlackTypes.user_id,
          description: "Search all people",
          title: "Select a member",
        },
        channel_ids: {
          type: SchemaTypes.array,
          description: "Search all channels",
          title: "Select channel(s)",
          items: { type: SlackTypes.channel_id },
        },
        user_ids: {
          type: SchemaTypes.array,
          description: "Search all people",
          title: "Select member(s)",
          items: { type: SlackTypes.user_id },
        },
      },
      required: [],
    },
    output_parameters: {
      properties: {
        user_id: {
          type: SlackTypes.user_id,
          description: "Person who was invited",
          title: "Person who was invited",
        },
        user_ids: {
          type: SchemaTypes.array,
          description: "Person(s) who were invited",
          title: "Person(s) who were invited",
          items: { type: SlackTypes.user_id },
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
  testWorkflow.addStep(InviteUserToChannel, {});
  const actual = testWorkflow.steps[0].export();

  assertEquals(actual.function_id, "slack#/functions/invite_user_to_channel");
  assertEquals(actual.inputs, {});
});

Deno.test("All outputs of built-in function InviteUserToChannel should exist", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_InviteUserToChannel_built_in",
    title: "Test InviteUserToChannel",
    description: "This is a generated test to test InviteUserToChannel",
  });
  const step = testWorkflow.addStep(InviteUserToChannel, {});
  assertExists(step.outputs.user_id);
  assertExists(step.outputs.user_ids);
});