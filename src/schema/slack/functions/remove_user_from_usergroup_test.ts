import { assertEquals } from "../../../dev_deps.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SlackTypes from "../schema_types.ts";
import RemoveUserFromUsergroup from "./remove_user_from_usergroup.ts";

Deno.test("RemoveUserFromUsergroup generates valid FunctionManifests", () => {
  assertEquals(
    RemoveUserFromUsergroup.definition.callback_id,
    "slack#/functions/remove_user_from_usergroup",
  );
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Remove from a user group",
    description: "Remove someone from a user group",
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
      required: [],
      properties: {
        usergroup_id: {
          type: SlackTypes.usergroup_id,
          description: "User group",
        },
      },
    },
  };
  const actual = RemoveUserFromUsergroup.export();
  assertEquals(actual, expected);
});
