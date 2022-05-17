import { assertEquals } from "../dev_deps.ts";
import { DefineWorkflow } from "./mod.ts";
import { DefineFunction } from "../mod.ts";

Deno.test("WorkflowStep export input values", () => {
  const TestFunction = DefineFunction({
    callback_id: "no_params",
    title: "Test Function",
    source_file: "",
    input_parameters: {
      properties: {
        email: {
          type: "string",
        },
        name: {
          type: "string",
        },
      },
      required: ["email"],
    },
    output_parameters: {
      properties: {
        url: {
          type: "string",
        },
      },
      required: ["url"],
    },
  });

  const workflow = DefineWorkflow("test_wf", {
    title: "test",
    input_parameters: {
      properties: {
        email: {
          type: "string",
        },
        name: {
          type: "string",
        },
      },
      required: ["email", "name"],
    },
  });

  const step1 = workflow.addStep(TestFunction, {
    email: workflow.inputs.email,
    name: `A name: ${workflow.inputs.name}`,
  });

  const exportedWorkflow = workflow.export();
  const step1Inputs = exportedWorkflow.steps[0].inputs;

  assertEquals(exportedWorkflow.steps.length, 1);
  assertEquals(exportedWorkflow.title, "test");
  assertEquals(exportedWorkflow?.input_parameters?.properties.email, {
    type: "string",
  });
  assertEquals(`${step1Inputs.email}`, "{{inputs.email}}");
  assertEquals(`${step1Inputs.name}`, "A name: {{inputs.name}}");
  assertEquals(`${step1.outputs.url}`, "{{steps.0.url}}");
});
