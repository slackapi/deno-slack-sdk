import { assertEquals } from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { DefineWorkflow } from "./workflows.ts";
import { DefineFunction } from "./mod.ts";

Deno.test("WorkflowStep export input values", () => {
  const TestFunction = DefineFunction("no_params", {
    title: "Test Function",
  }, async () => {
    return await {};
  });

  const workflow = DefineWorkflow("test_wf", {
    title: "test",
    input_parameters: {
      required: ["test"],
      properties: {
        test: {
          type: "string",
        },
      },
    },
  });

  const inputs = {
    a_string: "blah",
    a_string_with_variable: `${workflow.inputs.test}`,
    a_number: 1,
    a_boolean: true,
    an_object: {
      name: "Wut",
    },
    an_array: [
      { label: "Hello", style: "primary" },
      { label: "There", style: "danger" },
    ],
  };

  workflow.addStep(TestFunction, inputs);
  const exportedWorkflow = workflow.export();

  assertEquals(exportedWorkflow.steps[0].inputs, inputs);
});
