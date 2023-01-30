import { assertEquals } from "../../../dev_deps.ts";
import { DefineWorkflow } from "../../../workflows/mod.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";
import AddPin from "./add_pin.ts";

Deno.test("AddPin generates valid FunctionManifests", () => {
  assertEquals(AddPin.definition.callback_id, "slack#/functions/add_pin");
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Pin to channel",
    description: "Pin a message to a channel",
    input_parameters: {
      required: ["channel_id", "message"],
      properties: {
        channel_id: {
          type: SlackTypes.channel_id,
          description: "Search all channels",
        },
        message: {
          type: SchemaTypes.string,
          description: "Enter a message URL or message timestamp",
        },
      },
    },
    output_parameters: {
      required: [],
      properties: {},
    },
  };
  const actual = AddPin.export();
  assertEquals(actual, expected);
});

Deno.test("AddPin can be used as a built-in function in a workflow step", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_AddPin_built_in",
    title: "Test AddPin",
    description: "This is a generated test to test AddPin",
    input_parameters: {
      properties: {
        channel: {
          type: SlackTypes.channel_id,
        },
      },
      required: ["channel"],
    },
  });
  testWorkflow.addStep(AddPin, {
    channel_id: testWorkflow.inputs.channel,
    message: "test message",
  });

  const actual = testWorkflow.steps[0].export();
  assertEquals(actual.function_id, "slack#/functions/add_pin");
  assertEquals(actual.inputs, {
    channel_id: "{{inputs.channel}}",
    message: "test message",
  });
});
