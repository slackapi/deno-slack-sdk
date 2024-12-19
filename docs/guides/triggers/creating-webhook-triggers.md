---
slug: /deno-slack-sdk/guides/creating-webhook-triggers
---

# Creating webhook triggers

<PaidPlanBanner />

> Invoke a workflow when a specific URL receives a POST request

Webhook triggers are an *automatic* type of trigger that listens for a certain type of data, much like event triggers.

While event triggers are used for activating a trigger based on *internal* activity, webhooks are instead used when activating a trigger based on *external* activity. In other words, webhook triggers are useful when tying Slack functionality together with non-Slack services.

There are two steps to using a webhook trigger:

1. [Create a trigger, either via the CLI or at runtime](#create-trigger)
2. [Invoke the trigger with a POST Request](#invoke-trigger)

## Create a webhook trigger {#create-trigger}

Triggers can be added to workflows in two ways:

* **You can add triggers with the CLI.** These static triggers are created only once. You create them with the Slack CLI, attach them to your app's workflow, and that's that. The trigger is defined within a trigger file.

* **You can add triggers at runtime.** These dynamic triggers are created at any step of a workflow so they can incorporate data acquired from other workflow steps. The trigger is defined within a function file.

<Tabs groupId="trigger-type">
  <TabItem value="cli" label="Create a webhook trigger with the CLI">

:::info[Slack CLI built-in documentation]

Use `slack trigger --help`  to easily access information on the `trigger` command's flags and subcommands.

:::

The triggers you create when running locally (with the `slack run` command) will not work when you deploy your app in production (with the `slack deploy` command). You'll need to `create` any triggers again with the CLI.

### Create the trigger file

To create a webhook trigger with the CLI, you'll need to create a trigger file. The trigger file contains the payload you used to define your trigger.

Create a TypeScript trigger file within your app's folder with the following form:

```js
import { Trigger } from "deno-slack-api/types.ts";
import { ExampleWorkflow } from "../workflows/example_workflow.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";

const trigger: Trigger<typeof ExampleWorkflow.definition> = {
  // your TypeScript payload
};

export default trigger;
```

Your TypeScript payload consists of the [parameters](#parameters) needed for your own use case. The following is a TypeScript payload for creating a webhook trigger:


```js
import { Trigger } from "deno-slack-api/types.ts";
import { ExampleWorkflow } from "../workflows/example_workflow.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";

const trigger: Trigger<typeof ExampleWorkflow.definition> = {
  type: TriggerTypes.Webhook,
  name: "sends 'how cool is that' to my fav channel",
  description: "runs the example workflow",
  // "myWorkflow" must be a valid callback_id of a workflow
  workflow: "#/workflows/myWorkflow",
  inputs: {
    stringToReverse: {
      value: "how cool is that",
    },
    channel: {
      value: "{{data.channel}}",
    },
  },
};

export default trigger;
```

### Use the `trigger create` command

Once you have created a trigger file, use the following command to create the webhook trigger:

```bash
slack trigger create --trigger-def "path/to/trigger.ts"
```

If you have not used the `slack triggers create` command to create a trigger prior to running the `slack run` command, you will receive a prompt in the Slack CLI to do so.

  </TabItem>
  <TabItem value="runtime" label="Create an event trigger at runtime">

:::info

Your app needs to have the [`triggers:write`](https://api.slack.com/scopes/triggers:write) scope to use a trigger at runtime. Include the scope within your app's [manifest](/deno-slack-sdk/guides/using-the-app-manifest).

:::

The logic of a runtime trigger lies within a function's TypeScript code. Within your `functions` folder, you'll have the functions that are the steps making up your workflow. Within this folder is where you can create a trigger within the relevant `<function>.ts` file.

When you create a runtime trigger, you can leverage `inputs` acquired from functions within the workflow. Provide the workflow definition to get additional typing for the workflow and inputs fields.

Create a webhook trigger at runtime using the `client.workflows.triggers.create` method within the relevant `function` file.

```js
const triggerResponse = await client.workflows.triggers.create<typeof ExampleWorkflow.definition>({
  // your TypeScript payload
);
```

Your TypeScript payload consists of the [parameters](#parameters) needed for your own use case. Below is a function file with an example TypeScript payload for a webhook trigger.

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
    type: TriggerTypes.Webhook,
    name: "sends 'how cool is that' to my fav channel",
    description: "runs the example workflow",
    workflow: `#/workflows/${ExampleWorkflow.definition.callback_id}`,
    inputs: {
      stringToReverse: {
        value: "how cool is that",
      },
      channel: {
        value: "{{data.channel}}",
      },
    }
  });

  // ...
```

  </TabItem>
</Tabs>


---

## Webhook trigger parameters {#parameters}
| Field            | Description                                 | Required? |
|------------------|---------------------------------------------|-----------|
| `type`           | The type of trigger: `TriggerTypes.Webhook`              | Required |
| `name`           | The name of the trigger                     | Required |
| `workflow`       | Path to workflow that the trigger initiates | Required |
| `description`    | The description of the trigger              | Optional |
| `inputs`         | The inputs provided to the workflow         | Optional |
| `webhook`        | Contains `filter`, if desired               | Optional |
| `webhook.filter` | See [trigger filters](/deno-slack-sdk/guides/creating-event-triggers/#filters)             | Optional |

:::info

Webhook triggers are not interactive. Use a [link trigger](/deno-slack-sdk/guides/creating-link-triggers) to take advantage of interactivity.

:::

## Webhook trigger response {#response}

The response will have a property called `ok`. If `true`, then the trigger was created, and the `trigger` property will be populated.

Your response will include a `trigger.id`; be sure to store it! You use that to `update` or `delete` the trigger if need be. See [trigger management](/deno-slack-sdk/guides/managing-triggers).

---

## Invoke the trigger {#invoke-trigger}

Send a POST request to invoke the trigger. Within that POST request you can send values for specific inputs.

All JSON objects sent in the POST request need to be flat. Nested JSON objects will return a `parameter_validation_failed` error. 

**Good *flattened* JSON object:**
```
{"channel":"C123ABC456","user":"U123ABC456"}
```

**No good, very bad *nested* JSON object:** 

```js
// JSON does not support comments but we really don't want you using this code
{"channel":"C123ABC456","user":{"first_name":"Jesse","last_name":"Slacksalot"}}
```

Now let's look at an entire example. 

### Example POST request {#example}

```
curl \
  -X POST "https://hooks.slack.com/triggers/T123ABC456/.../..." \
  --header "Content-Type: application/json; charset=utf-8" \
  --data '{"channel":"C123ABC456"}'
```

If the webhook was received and successfully handled, you'll get the following response:

```
{
  "ok":true
}
```

## Onward {#onward}

➡️ With your trigger created, you can now test your app by [running your app locally](/deno-slack-sdk/guides/developing-locally).

✨ Once your app is active, see [trigger management](/deno-slack-sdk/guides/managing-triggers) for info on managing your triggers in your workspace.