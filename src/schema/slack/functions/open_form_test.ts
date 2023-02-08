/** This file was autogenerated on Wed Feb 08 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { assertEquals } from "../../../dev_deps.ts";
import { DefineWorkflow } from "../../../workflows/mod.ts";
import { ManifestFunctionSchema } from "../../../manifest/manifest_schema.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";
import { InternalSlackTypes } from "../types/custom/mod.ts";
import OpenForm from "./open_form.ts";

Deno.test("OpenForm generates valid FunctionManifest", () => {
  assertEquals(OpenForm.definition.callback_id, "slack#/functions/open_form");
  const expected: ManifestFunctionSchema = {
    source_file: "",
    title: "Open a form",
    description: "Opens a form for the user",
    input_parameters: {
      properties: {
        title: {
          type: SchemaTypes.string,
          description: "Title of the form",
          title: "title",
        },
        description: {
          type: SchemaTypes.string,
          description: "Description of the form",
          title: "description",
        },
        submit_label: {
          type: SchemaTypes.string,
          description: "Submit Label of the form",
          title: "submit_label",
        },
        fields: {
          type: InternalSlackTypes.form_input_object,
          description: "Input fields to be shown on the form",
          title: "fields",
        },
        interactivity: {
          type: SlackTypes.interactivity,
          description:
            "Context about the interactive event that led to opening of the form",
          title: "interactivity",
        },
      },
      required: ["title", "fields", "interactivity"],
    },
    output_parameters: {
      properties: {
        fields: {
          type: SchemaTypes.object,
          description: "fields",
          title: "fields",
        },
        interactivity: {
          type: SlackTypes.interactivity,
          description: "Context about the form submit action interactive event",
          title: "interactivity",
        },
      },
      required: ["fields", "interactivity"],
    },
  };
  const actual = OpenForm.export();

  assertEquals(actual, expected);
});

Deno.test("OpenForm can be used as a built-in function in a workflow step", () => {
  const testWorkflow = DefineWorkflow({
    callback_id: "test_OpenForm_built_in",
    title: "Test OpenForm",
    description: "This is a generated test to test OpenForm",
  });
  testWorkflow.addStep(OpenForm, {
    title: "test",
    fields: "test",
    interactivity: "test",
  });
  const actual = testWorkflow.steps[0].export();

  assertEquals(actual.function_id, "slack#/functions/open_form");
  assertEquals(actual.inputs, {
    title: "test",
    fields: "test",
    interactivity: "test",
  });
});
