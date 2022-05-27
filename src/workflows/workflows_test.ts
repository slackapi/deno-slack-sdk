import { assertEquals } from "../dev_deps.ts";
import { DefineWorkflow } from "./mod.ts";
import { DefineFunction, Schema } from "../mod.ts";

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

  const workflow = DefineWorkflow({
    callback_id: "test_wf",
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
      required: ["email"],
    },
  });

  // Add a DefineFunction result as a step
  const step1 = workflow.addStep(TestFunction, {
    email: workflow.inputs.email,
    name: `A name: ${workflow.inputs.name}`,
  });

  // add a manually configured step
  const step2 = workflow.addStep("slack#/functions/create_channel", {
    channel_name: `test-channel-${workflow.inputs.name}-${step1.outputs.url}`,
  });

  // another manually configured step, reyling on outputs of another manually configured step
  workflow.addStep("slack#/functions/send_message", {
    channel_id: "C123123",
    message: `Channel Created <#${step2.outputs.channel_id}>`,
  });

  const step4 = workflow.addStep(Schema.slack.functions.SendMessage, {
    // channel_id: "garbage",
    // message: "hi Brad",
  });

  step2.outputs.message_ts;

  const exportedWorkflow = workflow.export();
  const step1Inputs = exportedWorkflow.steps[0].inputs;
  const step2Inputs = exportedWorkflow.steps[1].inputs;
  const step3Inputs = exportedWorkflow.steps[2].inputs;

  assertEquals(exportedWorkflow.steps.length, 4);
  assertEquals(exportedWorkflow.title, "test");
  assertEquals(exportedWorkflow?.input_parameters?.properties.email, {
    type: "string",
  });
  assertEquals(`${step1Inputs.email}`, "{{inputs.email}}");
  assertEquals(`${step1Inputs.name}`, "A name: {{inputs.name}}");
  assertEquals(`${step1.outputs.url}`, "{{steps.0.url}}");

  assertEquals(
    `${step2Inputs.channel_name}`,
    "test-channel-{{inputs.name}}-{{steps.0.url}}",
  );

  assertEquals(`${step3Inputs.channel_id}`, "C123123");
  assertEquals(
    `${step3Inputs.message}`,
    "Channel Created <#{{steps.1.channel_id}}>",
  );
});
