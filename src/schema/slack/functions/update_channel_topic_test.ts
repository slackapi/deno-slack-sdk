/** This file was autogenerated on Fri Feb 03 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { assertEquals } from "../../../dev_deps.ts";
import { DefineWorkflow } from "../../../workflows/mod.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";
import UpdateChannelTopic from "./update_channel_topic.ts";

Deno.test("UpdateChannelTopic generates valid FunctionManifest", () => {
  assertEquals(
    UpdateChannelTopic.definition.callback_id,
    "slack#/functions/update_channel_topic",
  );
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Update channel topic",
    description:
      "Update the topic of a specific channel. This will work only if this workflow created the channel.",
    input_parameters: {
      properties: {
        channel_id: {
          type: SlackTypes.channel_id,
          description: "Search all channels",
        },
        topic: { type: SchemaTypes.string, description: "Enter a topic" },
      },
      required: ["channel_id", "topic"],
    },
    output_parameters: {
      properties: {
        topic: { type: SchemaTypes.string, description: "Channel topic" },
      },
      required: ["topic"],
    },
  };
  const actual = UpdateChannelTopic.export();

  assertEquals(actual, expected);
});

Deno.test("UpdateChannelTopic can be used as a built-in function in a workflow step", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_UpdateChannelTopic_built_in",
    title: "Test UpdateChannelTopic",
    description: "This is a generated test to test UpdateChannelTopic",
  });
  testWorkflow.addStep(UpdateChannelTopic, {
    channel_id: "test",
    topic: "test",
  });
  const actual = testWorkflow.steps[0].export();

  assertEquals(actual.function_id, "slack#/functions/update_channel_topic");
  assertEquals(actual.inputs, { channel_id: "test", topic: "test" });
});
