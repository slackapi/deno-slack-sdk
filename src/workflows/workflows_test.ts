import { assertEquals } from "../dev_deps.ts";
import { DefineWorkflow } from "./mod.ts";
import { DefineFunction } from "../mod.ts";
import SlackTypes from "../schema/slack/schema_types.ts";

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
        manager: {
          type: "object",
          properties: {
            email: { type: "string" },
            name: { type: "string" },
          },
        },
      },
      required: ["email"],
    },
    output_parameters: {
      properties: {
        url: {
          type: "string",
        },
        manager: {
          type: "object",
          properties: {
            email: { type: "string" },
            name: { type: "string" },
          },
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
        manager: {
          type: "object",
          properties: {
            email: { type: "string" },
            name: { type: "string" },
          },
        },
      },
      required: ["email", "manager"],
    },
  });

  // Add a DefineFunction result as a step
  const step1 = workflow.addStep(TestFunction, {
    email: workflow.inputs.email,
    name: `A name: ${workflow.inputs.name}`,
    manager: {
      name: workflow.inputs.manager.name,
      email: workflow.inputs.manager.email,
    },
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

  const exportedWorkflow = workflow.export();
  const step1Inputs = exportedWorkflow.steps[0].inputs;
  const step2Inputs = exportedWorkflow.steps[1].inputs;
  const step3Inputs = exportedWorkflow.steps[2].inputs;

  assertEquals(exportedWorkflow.steps.length, 3);
  assertEquals(exportedWorkflow.title, "test");
  assertEquals(exportedWorkflow?.input_parameters?.properties.email, {
    type: "string",
  });
  assertEquals(`${step1Inputs.email}`, "{{inputs.email}}");
  assertEquals(`${step1Inputs.name}`, "A name: {{inputs.name}}");
  assertEquals(`${step1.outputs.url}`, "{{steps.0.url}}");
  assertEquals(`${step1.outputs.manager?.email}`, "{{steps.0.manager.email}}");
  assertEquals(`${step1.outputs.manager?.name}`, "{{steps.0.manager.name}}");

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

Deno.test("Workflows properly treats interactivity and user context types", () => {
  const TestFunction = DefineFunction({
    source_file: "./test.ts",
    callback_id: "test",
    title: "Test",
    output_parameters: {
      properties: {
        interactivity: {
          type: SlackTypes.interactivity,
        },
        user: {
          type: SlackTypes.user_context,
        },
      },
      required: ["interactivity"],
    },
  });

  const TestWorkflow = DefineWorkflow({
    callback_id: "test",
    title: "Test",
  });

  const step1 = TestWorkflow.addStep(TestFunction, {});

  assertEquals(
    `${step1.outputs.interactivity}`,
    `{{steps.0.interactivity}}`,
  );
  assertEquals(
    `${step1.outputs.interactivity.interactivity_pointer}`,
    `{{steps.0.interactivity.interactivity_pointer}}`,
  );
  assertEquals(
    `${step1.outputs.interactivity.interactor.id}`,
    `{{steps.0.interactivity.interactor.id}}`,
  );
  assertEquals(
    `${step1.outputs.interactivity.interactor.secret}`,
    `{{steps.0.interactivity.interactor.secret}}`,
  );
  assertEquals(
    `${step1.outputs.user}`,
    `{{steps.0.user}}`,
  );
  assertEquals(
    `${step1.outputs.user?.id}`,
    `{{steps.0.user.id}}`,
  );
  assertEquals(
    `${step1.outputs.user?.secret}`,
    `{{steps.0.user.secret}}`,
  );
});
