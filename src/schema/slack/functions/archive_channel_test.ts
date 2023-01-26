import { assertEquals } from "../../../dev_deps.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SlackTypes from "../schema_types.ts";
import ArchiveChannel from "./archive_channel.ts";

Deno.test("ArchiveChannel generates valid FunctionManifests", () => {
  assertEquals(
    ArchiveChannel.definition.callback_id,
    "slack#/functions/archive_channel",
  );
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Archive a channel",
    description: "Archive a Slack channel",
    input_parameters: {
      required: ["channel_id"],
      properties: {
        channel_id: {
          type: SlackTypes.channel_id,
          description: "Search all channels",
        },
      },
    },
    output_parameters: {
      required: ["channel_id"],
      properties: {
        channel_id: {
          type: SlackTypes.channel_id,
          description: "Channel name",
        },
      },
    },
  };
  const actual = ArchiveChannel.export();
  assertEquals(actual, expected);
});
