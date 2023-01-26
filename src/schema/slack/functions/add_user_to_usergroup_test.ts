import { assertEquals } from "../../../dev_deps.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SlackTypes from "../schema_types.ts";
import AddUserToUsergroup from "./add_user_to_usergroup.ts";

Deno.test("AddUserToUsergroup generates valid FunctionManifests", () => {
  assertEquals(
    AddUserToUsergroup.definition.callback_id,
    "slack#/functions/add_user_to_usergroup",
  );
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Add to user group",
    description: "Add someone to a user group.",
    input_parameters: {
      required: ["usergroup_id", "user_id"],
      properties: {
        usergroup_id: {
          type: SlackTypes.usergroup_id,
          description: "Search all user groups",
        },
        user_id: {
          type: SlackTypes.user_id,
          description: "Search all people",
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
  const actual = AddUserToUsergroup.export();
  assertEquals(actual, expected);
});
