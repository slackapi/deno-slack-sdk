import { assertEquals } from "../../../dev_deps.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";
import CreateChannel from "./create_channel.ts";

Deno.test("CreateChannel generates valid FunctionManifests", () => {
  assertEquals(
    CreateChannel.definition.callback_id,
    "slack#/functions/create_channel",
  );
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Create a channel",
    description: "Create a Slack channel",
    input_parameters: {
      required: ["channel_name"],
      properties: {
        channel_name: {
          type: SchemaTypes.string,
          description: "Enter a channel name",
        },
        is_private: {
          type: SchemaTypes.boolean,
          description: "Make this channel private",
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
  const actual = CreateChannel.export();
  assertEquals(actual, expected);
});
