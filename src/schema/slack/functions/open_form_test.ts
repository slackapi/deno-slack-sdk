import { assertEquals } from "../../../dev_deps.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";
import { InternalSlackTypes } from "../types/custom/mod.ts";
import OpenForm from "./open_form.ts";

Deno.test("OpenForm generates valid FunctionManifests", () => {
  assertEquals(OpenForm.definition.callback_id, "slack#/functions/open_form");
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Open a form",
    description: "Opens a form for the user",
    input_parameters: {
      required: ["title", "fields", "interactivity"],
      properties: {
        title: {
          type: SchemaTypes.string,
          description: "Title of the form",
        },
        description: {
          type: SchemaTypes.string,
          description: "Description of the form",
        },
        submit_label: {
          type: SchemaTypes.string,
          description: "Submit Label of the form",
        },
        fields: {
          type: InternalSlackTypes.form_input_object,
          description: "Input fields to be shown on the form",
        },
        interactivity: {
          type: SlackTypes.interactivity,
          description:
            "Context about the interactive event that led to opening of the form",
        },
      },
    },
    output_parameters: {
      required: ["fields", "interactivity"],
      properties: {
        fields: {
          type: SchemaTypes.object,
          description: "fields",
        },
        interactivity: {
          type: SlackTypes.interactivity,
          description: "Context about the form submit action interactive event",
        },
      },
    },
  };
  const actual = OpenForm.export();
  assertEquals(actual, expected);
});
