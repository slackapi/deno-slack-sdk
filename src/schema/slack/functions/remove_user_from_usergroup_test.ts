/** This file was autogenerated. Follow the steps in src/schema/slack/functions/_scripts/README.md to rebuild **/
import { assertEquals, assertExists } from "../../../dev_deps.ts";
import { DefineWorkflow } from "../../../workflows/mod.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";
import RemoveUserFromUsergroup from "./remove_user_from_usergroup.ts";

Deno.test("RemoveUserFromUsergroup generates valid FunctionManifest", () => {
  assertEquals(
    RemoveUserFromUsergroup.definition.callback_id,
    "slack#/functions/remove_user_from_usergroup",
  );
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Remove someone from a user group",
    description: "Additional permissions might be required",
    input_parameters: {
      properties: {
        usergroup_id: {
          type: SlackTypes.usergroup_id,
          description: "Search all user groups",
          title: "Select a user group",
        },
        user_ids: {
          type: SchemaTypes.array,
          description: "Search all people",
          title: "Select member(s)",
          items: { type: SlackTypes.user_id },
        },
      },
      required: ["usergroup_id", "user_ids"],
    },
    output_parameters: {
      properties: {
        usergroup_id: {
          type: SlackTypes.usergroup_id,
          description: "User group",
          title: "User group",
        },
      },
      required: [],
    },
  };
  const actual = RemoveUserFromUsergroup.export();

  assertEquals(actual, expected);
});

Deno.test("RemoveUserFromUsergroup can be used as a Slack function in a workflow step", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_RemoveUserFromUsergroup_slack_function",
    title: "Test RemoveUserFromUsergroup",
    description: "This is a generated test to test RemoveUserFromUsergroup",
  });
  testWorkflow.addStep(RemoveUserFromUsergroup, {
    usergroup_id: "test",
    user_ids: "test",
  });
  const actual = testWorkflow.steps[0].export();

  assertEquals(
    actual.function_id,
    "slack#/functions/remove_user_from_usergroup",
  );
  assertEquals(actual.inputs, { usergroup_id: "test", user_ids: "test" });
});

Deno.test("All outputs of Slack function RemoveUserFromUsergroup should exist", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_RemoveUserFromUsergroup_slack_function",
    title: "Test RemoveUserFromUsergroup",
    description: "This is a generated test to test RemoveUserFromUsergroup",
  });
  const step = testWorkflow.addStep(RemoveUserFromUsergroup, {
    usergroup_id: "test",
    user_ids: "test",
  });
  assertExists(step.outputs.usergroup_id);
});
