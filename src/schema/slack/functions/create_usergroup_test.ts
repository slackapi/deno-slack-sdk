/** This file was autogenerated on Thu Apr 06 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { assertEquals, assertExists } from "../../../dev_deps.ts";
import { DefineWorkflow } from "../../../workflows/mod.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";
import CreateUsergroup from "./create_usergroup.ts";

Deno.test("CreateUsergroup generates valid FunctionManifest", () => {
  assertEquals(
    CreateUsergroup.definition.callback_id,
    "slack#/functions/create_usergroup",
  );
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Create a user group",
    description: "Create a Slack user group",
    input_parameters: {
      properties: {
        usergroup_handle: {
          type: SchemaTypes.string,
          description: "Ex: accounts-team",
          title: "Handle",
        },
        usergroup_name: {
          type: SchemaTypes.string,
          description: "Ex. Accounts Team",
          title: "Display name",
        },
      },
      required: ["usergroup_handle", "usergroup_name"],
    },
    output_parameters: {
      properties: {
        usergroup_id: {
          type: SlackTypes.usergroup_id,
          description: "User group",
          title: "User group",
        },
      },
      required: ["usergroup_id"],
    },
  };
  const actual = CreateUsergroup.export();

  assertEquals(actual, expected);
});

Deno.test("CreateUsergroup can be used as a built-in function in a workflow step", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_CreateUsergroup_built_in",
    title: "Test CreateUsergroup",
    description: "This is a generated test to test CreateUsergroup",
  });
  testWorkflow.addStep(CreateUsergroup, {
    usergroup_handle: "test",
    usergroup_name: "test",
  });
  const actual = testWorkflow.steps[0].export();

  assertEquals(actual.function_id, "slack#/functions/create_usergroup");
  assertEquals(actual.inputs, {
    usergroup_handle: "test",
    usergroup_name: "test",
  });
});

Deno.test("All outputs of built-in function CreateUsergroup should exist", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_CreateUsergroup_built_in",
    title: "Test CreateUsergroup",
    description: "This is a generated test to test CreateUsergroup",
  });
  const step = testWorkflow.addStep(CreateUsergroup, {
    usergroup_handle: "test",
    usergroup_name: "test",
  });
  assertExists(step.outputs.usergroup_id);
});
