import { assertEquals } from "../../../dev_deps.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";
import CreateUsergroup from "./create_usergroup.ts";

Deno.test("CreateUsergroup generates valid FunctionManifests", () => {
  assertEquals(
    CreateUsergroup.definition.callback_id,
    "slack#/functions/create_usergroup",
  );
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Create a user group",
    description: "Create a Slack user group",
    input_parameters: {
      required: ["usergroup_handle", "usergroup_name"],
      properties: {
        usergroup_handle: {
          type: SchemaTypes.string,
          description: "Ex: accounts-team",
        },
        usergroup_name: {
          type: SchemaTypes.string,
          description: "Ex. Accounts Team",
        },
      },
    },
    output_parameters: {
      required: ["usergroup_id"],
      properties: {
        usergroup_id: {
          type: SlackTypes.usergroup_id,
          description: "User group",
        },
      },
    },
  };
  const actual = CreateUsergroup.export();
  assertEquals(actual, expected);
});
