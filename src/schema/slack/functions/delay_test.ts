import { assertEquals } from "../../../dev_deps.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SchemaTypes from "../../schema_types.ts";
import Delay from "./delay.ts";

Deno.test("Delay generates valid FunctionManifests", () => {
  assertEquals(Delay.definition.callback_id, "slack#/functions/delay");
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Delay",
    description: "Pause the workflow for a set amount of time",
    input_parameters: {
      required: ["minutes_to_delay"],
      properties: {
        minutes_to_delay: {
          type: SchemaTypes.integer,
          description: "Enter number of minutes",
        },
      },
    },
    output_parameters: {
      required: [],
      properties: {},
    },
  };
  const actual = Delay.export();
  assertEquals(actual, expected);
});
