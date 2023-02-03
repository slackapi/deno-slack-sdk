/** This file was autogenerated on Thu Feb 02 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { assertEquals } from "../../../dev_deps.ts";
import { DefineWorkflow } from "../../../workflows/mod.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";
import SendDm from "./send_dm.ts";

Deno.test("SendDm generates valid FunctionManifest", () => {
  assertEquals(SendDm.definition.callback_id, "slack#/functions/send_dm");
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Send a direct message",
    description: "Send a direct message to someone",
    input_parameters: {
      properties: {
        user_id: { type: SlackTypes.user_id, description: "Search all people" },
        message: { type: SlackTypes.rich_text, description: "Add a message" },
        thread_ts: {
          type: SchemaTypes.string,
          description:
            "Provide another message's timestamp value to make this message a reply",
        },
        interactive_blocks: {
          type: SlackTypes.blocks,
          description: "Button(s) to send with the message",
        },
      },
      required: ["user_id", "message"],
    },
    output_parameters: {
      properties: {
        message_ts: {
          type: SchemaTypes.string,
          description: "Message time stamp",
        },
        message_link: { type: SchemaTypes.string, description: "Message link" },
        action: {
          type: SchemaTypes.object,
          description: "Button interactivity data",
        },
        interactivity: {
          type: SlackTypes.interactivity,
          description: "Interactivity context",
        },
      },
      required: ["message_ts", "message_link"],
    },
  };
  const actual = SendDm.export();

  assertEquals(actual, expected);
});

Deno.test("SendDm can be used as a built-in function in a workflow step", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_SendDm_built_in",
    title: "Test SendDm",
    description: "This is a generated test to test SendDm",
  });
  testWorkflow.addStep(SendDm, { user_id: "test", message: "test" });
  const actual = testWorkflow.steps[0].export();

  assertEquals(actual.function_id, "slack#/functions/send_dm");
  assertEquals(actual.inputs, { user_id: "test", message: "test" });
});
