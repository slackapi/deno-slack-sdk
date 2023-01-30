import { assertEquals } from "../../../dev_deps.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";
import UpdateChannelTopic from "./update_channel_topic.ts";

Deno.test("UpdateChannelTopic generates valid FunctionManifests", () => {
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
      required: ["channel_id", "topic"],
      properties: {
        channel_id: {
          type: SlackTypes.channel_id,
          description: "Search all channels",
        },
        topic: {
          type: SchemaTypes.string,
          description: "Enter a topic",
        },
      },
    },
    output_parameters: {
      required: ["topic"],
      properties: {
        topic: {
          type: SchemaTypes.string,
          description: "Channel topic",
        },
      },
    },
  };
  const actual = UpdateChannelTopic.export();
  assertEquals(actual, expected);
});