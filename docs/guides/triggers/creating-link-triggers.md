---
slug: /deno-slack-sdk/guides/creating-link-triggers
---

# Creating link triggers

<PaidPlanBanner />

> Invoke a workflow from a channel in Slack

Link triggers are an *interactive* type of trigger. You typically invoke them by clicking on the associated shortcut link. A link trigger will unfurl into a button when posted in a channel.

They can be invoked in other ways as well. You can:
* add the link trigger as a bookmark in a channel, then select it
* invoke it with a slash command via the [Shortcut menu](https://api.slack.com/interactivity/shortcuts#global)
* create it as a [workflow button](#workflow_buttons), then click the button

## Create a link trigger {#create-trigger}

Triggers can be added to workflows in two ways:

* **You can add triggers with the CLI.** These static triggers are created only once. You create them with the Slack CLI, attach them to your app's workflow, and that's that. The trigger is typically defined within a trigger file, although you can create a basic link trigger without one.

* **You can add triggers at runtime.** These dynamic triggers are created at any step of a workflow so they can incorporate data acquired from other workflow steps. The trigger is defined within a function file.

<Tabs groupId="trigger-type">
  <TabItem value="cli" label="Create a link trigger with the CLI">

:::info[Slack CLI built-in documentation]

You can use `slack trigger --help`  to easily access information on the `trigger` command's flags and subcommands.

:::

The triggers you create when running locally (with the `slack run` command) will not work when you deploy your app in production (with the `slack deploy` command). You'll need to `create` any triggers again with the CLI.


### Create a basic link trigger {#create-cli}

If your workflow doesn't need any parameters mapped from the trigger, such as `interactivity`, then you can create a trigger using the `trigger create` command:

```
slack trigger create --workflow "#/workflows/your_workflow"
```

### Create a link trigger with interactivity {#create-cli-interactivity}

If you need to use the `interactivity` parameter, append the `--interactivity` flag to that command:

```
slack trigger create --workflow "#/workflows/your_workflow" --interactivity
```

### Create a link trigger with additional parameters {#create-cli-additional-parameters}

If you need to pass specific values, or use other parameters, you'll need to create a link trigger using a trigger file. The trigger file contains the payload you used to define your trigger.

Create a TypeScript trigger file within your app's folder with the following form:

```js
import { Trigger } from "deno-slack-api/types.ts";
import { ExampleWorkflow } from "../workflows/example_workflow.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";

const trigger: Trigger<typeof ExampleWorkflow.definition> = {
  // your TypeScript payload
};

export default trigger;
```

Your TypeScript payload consists of the [parameters](#parameters) needed for your own use case; below is the trigger file from the [Deno Starter Template](https://github.com/slack-samples/deno-starter-template/blob/main/triggers/sample_trigger.ts):

```js
import { Trigger } from "deno-slack-sdk/types.ts";
import SampleWorkflow from "../workflows/sample_workflow.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";

const sampleTrigger: Trigger<typeof SampleWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Sample trigger",
  description: "A sample trigger",
  workflow: "#/workflows/sample_workflow",
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    channel: {
      value: TriggerContextData.Shortcut.channel_id,
    },
    user: {
      value: TriggerContextData.Shortcut.user_id,
    },
  },
};

export default sampleTrigger;
```

Once you have created a trigger file, use the `trigger create` command to create the link trigger by pointing to a trigger file:

```bash
slack trigger create --trigger-def "path/to/trigger.ts"
```

If you have not used the `slack triggers create` command to create a trigger prior to running the `slack run` command, you will receive a prompt in the Slack CLI to do so.

### The CLI response

Once you've instructed Slack just how to create your link trigger using the CLI, it will respond with a shortcut link you can then copy and paste into a Slack channel or bookmarks bar. Use it to activate your workflow. Alternatively, you can use a [slash command](https://api.slack.com/interactivity/slash-commands).

The triggers you create when running locally (with the `slack run` command) will not work when you deploy your app in production (with the `slack deploy` command). You'll need to `create` any triggers again with the CLI.

When a `trigger create` command is successful, the CLI's response looks something like:

```bash
⚡ Trigger successfully created!

   Train markovbot with words Ft0123ABC456 (shortcut)
   Created: 2023-01-01 12:34:56 -07:00 (8 seconds ago)
   Runnable by: everyone
   https://slack.com/shortcuts/Ft0123ABC456/abc123...
```

This response includes the trigger name, ID, and type on the first line, followed by the time of creation and access list for the trigger. The last line includes the shortcut link you'll need for invoking the trigger in Slack. You can send this to a channel or add it as a bookmark, then click it to begin the workflow!

When you need to [modify, remove, or otherwise maintain the triggers you've created](/deno-slack-sdk/guides/managing-triggers), the trigger ID will come in handy to specify which trigger you're updating. No need to memorize it though, since you can use `slack trigger list` to show all available triggers for your app.

  </TabItem>
  <TabItem value="runtime" label="Create a scheduled trigger at runtime">

Your app needs to have the [`triggers:write`](https://api.slack.com/scopes/triggers:write) scope to use a trigger at runtime. Include the scope within your app's [manifest](/deno-slack-sdk/guides/using-the-app-manifest).

The logic of a runtime trigger lies within a function's TypeScript code. Within your `functions` folder, you'll have the functions that are the steps making up your workflow. Within this folder is where you can create a trigger within the relevant `<function>.ts` file.

When you create a runtime trigger, you can leverage `inputs` acquired from functions within the workflow. Provide the workflow definition to get additional typing for the workflow and inputs fields.

Create a link trigger at runtime using the `client.workflows.triggers.create` method within the relevant function file.

```js
const triggerResponse = await client.workflows.triggers.create<typeof ExampleWorkflow.definition>({
  // your TypeScript payload
});
```

Your TypeScript payload consists of the [parameters](#parameters) needed for your own use case. Here's a function file with an example TypeScript payload for a link trigger:

```js
// functions/example_function.ts
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { ExampleWorkflow } from "../workflows/example_workflow.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";

export const ExampleFunctionDefinition = DefineFunction({
  callback_id: "example_function_def",
  title: "Example function",
  source_file: "functions/example_function.ts",
});

export default SlackFunction(
  ExampleFunctionDefinition,
  ({ inputs, client }) => {

  const triggerResponse = await client.workflows.triggers.create<typeof ExampleWorkflow.definition>({
    type: TriggerTypes.Shortcut,
    name: "My Trigger",
    workflow: `#/workflows/${ExampleWorkflow.definition.callback_id}`,
    inputs: {
      input_name: {
        value: "value",
      }
    }
  });

  // ...
```

  </TabItem>
</Tabs>

---

## Link trigger parameters {#parameters}

| Field                  | Description                                 | Required? |
|------------------------|---------------------------------------------| --------- |
| `type`                 | The type of trigger: `TriggerTypes.Shortcut`            | Required | 
| `name`                 | The name of the trigger                     | Required |
| `workflow`             | Path to workflow that the trigger initiates | Required |
| `description`          | The description of the trigger              | Optional |
| `inputs`               | The inputs provided to the workflow. See [the `inputs` object](#inputs) below         | Optional |
| `shortcut`             |  Contains `button_text`, if desired          | Optional |
| `shortcut.button_text` | The text of the shortcut button             | Optional |

### The `inputs` object {#inputs}

The `inputs` of a trigger map to the inputs of a [workflow](/deno-slack-sdk/guides/creating-workflows). You can pass any value as an input. You should either provide a `value` for every input, or mark the input as `customizable: true` instead. See [workflow buttons](#workflow_buttons) for info on why you might want to use `customizable: true`.

There are also a specific set of input values that contain information about the trigger. Pass any of these values to provide trigger information to your workflows!

Fields that take the form of `data.VALUE` can be referenced in the form of `TriggerContextData.Shortcut.VALUE`

| Referenced field | Type | Description            |
|--------|------------------------|------|
| `TriggerContextData.Shortcut.action_id`     | string | Only available when the trigger is invoked from a [Workflow Button](#workflow_buttons)! A unique identifier for the action that invoked the trigger. |
| `TriggerContextData.Shortcut.block_id`      | string | Only available when the trigger is invoked from a [Workflow Button](#workflow_buttons)! A unique identifier for the block where the trigger was invoked. |
| `TriggerContextData.Shortcut.bookmark_id`   | string | Only available when the trigger is invoked from a channel's bookmarks bar! A unique identifier for the bookmark where the trigger was invoked.     |
| `TriggerContextData.Shortcut.channel_id`    | string | Only available when the trigger is invoked from a channel, DM or MPDM! A unique identifier for the channel where the trigger was invoked.      |
| `TriggerContextData.Shortcut.interactivity` | object | A temporary token for use in building interactive UIs in the Slack client.                      |
|  `TriggerContextData.Shortcut.location`      | string | Where the trigger was invoked. Can be `message`, `bookmark` or `button`.  |
| `TriggerContextData.Shortcut.message_ts`    | string | Only available when the trigger is invoked from a channel, DM or MPDM! A unique Unix timestamp in seconds indicating when the trigger-invoking message was sent. |
| `TriggerContextData.Shortcut.user_id`       | string | A unique identifier for the Slack user who invoked the trigger.               |
| `TriggerContextData.Shortcut.event_timestamp`     | timestamp | A Unix timestamp in seconds indicating when this event was dispatched. |

The following snippet shows a `channel_id` input being set with a value of `TriggerContextData.Shortcut.channel_id`, which is a unique identifier for the channel where the trigger was invoked.

```js
...
inputs: {
  channel_id: {
    value: TriggerContextData.Shortcut.channel_id
  }
},
...
```

## Link trigger response {#trigger-response}

The response will have a property called `ok`. If `true`, then the trigger was created, and the `trigger` property will be populated.

Your response will include a `trigger.id`; be sure to store it! You use that to `update` or `delete` the trigger if need be. See [trigger management](/deno-slack-sdk/guides/managing-triggers).


<details>
    <summary>An example response of a created link trigger</summary>

```json
{
  // If ok == true, the trigger was created
  ok: true,

  // The newly created trigger's details are here
  trigger: {
    // Your trigger's unique ID
    id: "Ft12345",

    // inputs will contain a summary of your inputs as defined in the trigger file
    inputs: {},

    // since this is a link trigger, `outputs` will automatically contain:
    //   {{event_timestamp}}: time when the workflow started
    //   {{data.user_id}}: The user ID of the person who invoked the trigger
    //                     (by clicking the shortcut link or run button in Slack)
    //   {{data.channel_id}}: The channel where the shortcut was run
    //   {{data.interactivity}}: The trigger's interactivity context
    outputs: {
      "{{event_timestamp}}": {
        type: "string",
        name: "event_timestamp",
        title: "Time when workflow started",
        is_required: false,
        description: "Time when workflow started"
      },
      "{{data.user_id}}": {
        type: "slack#/types/user_id",
        name: "user_id",
        title: "Person who ran this shortcut",
        is_required: true,
        description: "Person who clicked the shortcut link or run button in Slack"
      },
      "{{data.channel_id}}": {
        type: "slack#/types/channel_id",
        name: "channel_id",
        title: "Channel where the shortcut was run",
        is_required: false,
        description: "Channel where the shortcut was run, if available"
      },
      "{{data.interactivity}}": {
        type: "slack#/types/interactivity",
        name: "interactivity",
        title: "Interactivity context",
        is_required: true,
        description: "Interactivity context",
        is_hidden: true
      }
    },

    // Trigger-specific information
    date_created: 1661894315,
    date_updated: 1661894315,
    type: "shortcut",
    name: "Submit a ticket to our work management system",
    description: "",

    // The shortcut URL that will activate this trigger and invoke the underlying workflow
    shortcut_url: "https://slack.com/shortcuts/Ft12345/caef7d773d611ddd1da81fd85de08a78",

    // Details about the workflow associated with this trigger
    workflow: {
      id: "Fn1234567890",
      callback_id: "handle_new_tickets_workflow",
      title: "Handle new tickets",
      description: "Handles a new ticket and updates the submitting user",
      type: "workflow",

      // Any workflow inputs will be included here
      input_parameters: [],

      // Any of the workflow's outputs will be included here
      output_parameters: [],

      app_id: "A1234567890",

      // App-specific details
      app: {
        id: "A1234567890",
        name: "ticket-management-app",
        icons: [Object],
        is_workflow_app: false
      },
      date_created: 1661889787,
      date_updated: 1661894304,
      date_deleted: 0,
      workflow_id: "Wf01234567890"
    }
  }
}
```
</details>


## Workflow buttons {#workflow_buttons}

You can also create link triggers in the form of workflow buttons! [Workflow buttons](https://api.slack.com/reference/block-kit/block-elements/#workflow_button) are Block Kit elements that allow you to use link triggers with _customizable_ inputs. These customizable inputs are provided by the workflow button itself when it is used, as opposed to the inputs being provided when the link trigger is created. You can create a link trigger once, and then use that same link trigger multiple times with different values.

You should use workflow buttons when your function's logic execution is about to complete but you want to provide users with follow-up actions in a message. These follow-up actions likely fit better in a separate workflow than within your interactivity handler. Distributing actions for multiple users (like a poll), or updating an object created by your function (like an incident), are common examples of when one would use workflow buttons.

### Creating the link trigger for a button {#workflow_buttons_create}

Creating a link trigger to use as a workflow button is much like how you would normally [create a link trigger with the CLI](#create-cli). The only addition is that you need to specify which of the parameters are customizable. Customizable parameters can have their values provided by a workflow button that wraps a link trigger. You can set a maximum of 10 input parameters as customizable.

The below example shows a sample payload used to create a link trigger that has one customizable parameter: `some_customizable_parameter`, and one non-customizable parameter: `channel_id`.

```js
// In a file: ./triggers/some_workflow_trigger.ts

import { Trigger } from "deno-slack-sdk/types.ts";
import SomeWorkflow from "../workflows/some_workflow.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";

export const someWorkflowTrigger: Trigger<typeof MyWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Some Workflow trigger",
  description: "A trigger for SomeWorkflow that allows for workflow_buttons to customize the value of some_customizable_parameter",
  workflow: "#/workflows/some_workflow",
  inputs: {
    channel_id: {
      value: TriggerContextData.Shortcut.channel_id,
    },
    some_customizable_parameter: {
      customizable: true,
    },
  },
};
```

The trigger definition above is for a workflow defined like so:
```js
// In a file: ./workflows/some_workflow.ts

import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

export const SomeWorkflow = DefineWorkflow({
  callback_id: "some_workflow",
  title: "Some Workflow",
  input_parameters: {
    required: [],
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
      some_customizable_parameter: {
        type: Schema.types.string,
      },
    },
  },
});
```

Running `slack triggers create --trigger-def="./triggers/some_workflow_trigger.ts"` would output a link trigger URL (e.g. `https://slack.com/shortcuts/Ft0123ABC456/123XYZ`), which will be referenced elsewhere inside the actual `workflow_button` elements. See [below](#workflow_buttons_use) for more details.

You can have both customizable and non-customizable input parameters, but only the customizable input parameters can be provided elsewhere by a [`workflow_button`](https://api.slack.com/reference/block-kit/block-elements/#workflow_button) element. A non-customizable input parameter does not have a `value`, since it will be provided elsewhere by a `workflow_button` element.

:::info

The values used for input parameters set as `customizable: true` may be visible client-side to end users. You should not share sensitive information or secrets via these input parameters.

:::

Input parameters marked as `customizable: true` are restricted to input parameters of types `string`, `Schema.slack.types.channel_id`, or `Schema.slack.types.user_id`.

:::info

Remember, link triggers are specific to an environment and workspace. You will need to create the link trigger that uses customizable inputs in each environment and workspace you want to use workflow buttons in.

:::

### Using the link trigger with a button {#workflow_buttons_use}

After you have created a link trigger with customizable input parameters, you can use it in a [`workflow_button`](https://api.slack.com/reference/block-kit/block-elements/#workflow_button), within which you will actually provide the values for the customizable input parameters.

Workflow buttons are only supported in messages and message attachments, and not on views.

You can use [`workflow_buttons`](https://api.slack.com/reference/block-kit/block-elements/#workflow_button) with any Slack function that accepts `interactive_blocks`, like [`SendMessage`](/deno-slack-sdk/reference/slack-functions/send_message) and [`SendDm`](/deno-slack-sdk/reference/slack-functions/send_dm).

```js
MyWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: MyWorkflow.inputs.channel,
  message: `Click on this workflow button to run SomeWorkflow (not MyWorkflow!).`,
  interactive_blocks: [
    {
      type: "actions",
      elements: [
        {
          type: "workflow_button",
          text: {
            type: "plain_text",
            text: "Run Me",
          },
          workflow: {
            trigger: {
              url: "https://slack.com/shortcuts/Ft0123ABC456/123XYZ",
              customizable_input_parameters: [
                {
                  name: "some_customizable_parameter",
                  value: MyWorkflow.inputs.input_coming_from_elsewhere,
                },
              ],
            },
          },
        },
      ],
    },
  ],
});
```

The above example is a workflow step for `MyWorkflow`, which has a button that will run a *different* workflow (`SomeWorkflow`) via the link trigger URL `https://slack.com/shortcuts/Ft0123ABC456/123XYZ`. When `SomeWorkflow` gets run through this workflow button, the value of `MyWorkflow.inputs.input_coming_from_elsewhere` will be passed in to `SomeWorkflow`.

You can also use [`workflow_buttons`](https://api.slack.com/reference/block-kit/block-elements/#workflow_button) when you call [`chat.postMessage`](https://api.slack.com/methods/chat.postMessage), [`chat.scheduleMessage`](https://api.slack.com/methods/chat.scheduleMessage), or [`chat.postEphemeral`](https://api.slack.com/methods/chat.postEphemeral) inside the `blocks` directly.

```js
export default SlackFunction(MyFunction, async ({ inputs, token, env, client }) => {
  const resp = await client.chat.postMessage({
    channel: inputs.channel_id,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "A header above the workflow button.",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "A section block with a workflow button accessory: ",
        },
        accessory: {
          type: "workflow_button",
          text: {
            type: "plain_text",
            text: "Run Me",
          },
          workflow: {
            trigger: {
              url: "https://slack.com/shortcuts/Ft0123ABC456/123XYZ",
              customizable_input_parameters: [
                {
                  name: "some_customizable_parameter",
                  value: inputs.some_value,
                },
              ],
            },
          },
        },
      },
    ],
  });
  ...
});
```

### Data validation {#workflow_buttons_data_validation}
Defining customizable input parameters for your link trigger means that the values for these inputs will be provided elsewhere (where the link trigger is used in a workflow button).

In your workflow, validate the inputs you receive by ensuring that any provided users are authorized to pass the input, and that the values received are ones you expect to receive and nothing more.

For example: You're building a workflow that grants salary increases for individuals. Your workflow has three parameters: `approver_user`, `target_user`, `amount`. You'll want to make sure to validate inside
the workflow itself that the provided `approver_user` is authorized to grant a salary increase of `amount` for the `target_user`.

## Onward

➡️ With your trigger created, you can now test your app by [running your app locally](/deno-slack-sdk/guides/developing-locally).

✨ Once your app is active, see [trigger management](/deno-slack-sdk/guides/managing-triggers) for info on managing your triggers in your workspace.