/** This file was autogenerated. Follow the steps in src/schema/slack/functions/_scripts/README.md to rebuild **/
import {
  assertEquals,
  assertExists,
  assertNotStrictEquals,
} from "../../../dev_deps.ts";
import { DefineWorkflow } from "../../../workflows/mod.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";
import ShareListUsers from "./share_list_users.ts";

Deno.test("ShareListUsers generates valid FunctionManifest", () => {
  assertEquals(
    ShareListUsers.definition.callback_id,
    "slack#/functions/share_list_users",
  );
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Share a list with people",
    description: "Share a list with users",
    input_parameters: {
      properties: {
        file_id: {
          type: undefined,
          description: "Search all list",
          title: "Select a List",
        },
        user_ids: {
          type: SchemaTypes.array,
          description: "Search all people",
          title: "Select member(s)",
          items: { type: SlackTypes.user_id },
        },
        user_access_level: {
          type: SchemaTypes.string,
          description: "Selects an access level for sharing",
          title: "Select access level",
        },
        message: {
          type: SlackTypes.rich_text,
          description: "Add a message",
          title: "Add a message",
        },
      },
      required: ["file_id", "user_ids", "user_access_level"],
    },
    output_parameters: {
      properties: {
        file_id: {
          type: undefined,
          description: "List title",
          title: "List title",
        },
      },
      required: [],
    },
  };
  const actual = ShareListUsers.export();

  assertNotStrictEquals(actual, expected);
});

Deno.test("ShareListUsers can be used as a Slack function in a workflow step", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_ShareListUsers_slack_function",
    title: "Test ShareListUsers",
    description: "This is a generated test to test ShareListUsers",
  });
  testWorkflow.addStep(ShareListUsers, {
    file_id: "test",
    user_ids: "test",
    user_access_level: "test",
  });
  const actual = testWorkflow.steps[0].export();

  assertEquals(actual.function_id, "slack#/functions/share_list_users");
  assertEquals(actual.inputs, {
    file_id: "test",
    user_ids: "test",
    user_access_level: "test",
  });
});

Deno.test("All outputs of Slack function ShareListUsers should exist", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_ShareListUsers_slack_function",
    title: "Test ShareListUsers",
    description: "This is a generated test to test ShareListUsers",
  });
  const step = testWorkflow.addStep(ShareListUsers, {
    file_id: "test",
    user_ids: "test",
    user_access_level: "test",
  });
  assertExists(step.outputs.file_id);
});
