---
slug: /deno-slack-sdk/guides/creating-scheduled-triggers
---

# Creating scheduled triggers

<PaidPlanBanner />

> Invoke a workflow at specific time intervals

Scheduled triggers are an *automatic* type of trigger. This means that once the trigger is created, they do not require any user input.

Use a scheduled trigger if you need a workflow to kick off after a delay or on an hourly, daily, weekly, or annual cadence.

## Create a scheduled trigger {#create-trigger}

Triggers can be added to workflows in two ways:

* **You can add triggers with the CLI.** These static triggers are created only once. You create them with the Slack CLI, attach them to your app's workflow, and that's that. The trigger is defined within a trigger file.

* **You can add triggers at runtime.** These dynamic triggers are created at any step of a workflow so they can incorporate data acquired from other workflow steps. The trigger is defined within a function file.

<Tabs groupId="trigger-type">
  <TabItem value="cli" label="Create a scheduled trigger with the CLI">
  
:::info[Slack CLI built-in documentation]

Use `slack trigger --help`  to easily access information on the `trigger` command's flags and subcommands.

:::

The triggers you create when running locally (with the `slack run` command) will not work when you deploy your app in production (with the `slack deploy` command). You'll need to `create` any triggers again with the CLI.

### Create the trigger file

To create a scheduled trigger with the CLI, you'll need to create a trigger file. The trigger file contains the payload you used to define your trigger.

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

Your TypeScript payload consists of the [parameters](#parameters) needed for your own use case. Below is the trigger file from the [Message Translator](https://github.com/slack-samples/deno-message-translator) app:

```js
// triggers/daily_maintenance_job.ts
import { Trigger } from "deno-slack-sdk/types.ts";
import workflowDef from "../workflows/maintenance_job.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";

/**
 * A trigger that periodically starts the "maintenance-job" workflow.
 */
const trigger: Trigger<typeof workflowDef.definition> = {
  type: TriggerTypes.Scheduled,
  name: "Trigger a scheduled maintenance job",
  workflow: `#/workflows/${workflowDef.definition.callback_id}`,
  inputs: {},
  schedule: {
    // Schedule the first execution 60 seconds from when the trigger is created
    start_time: new Date(new Date().getTime() + 60000).toISOString(),
    end_time: "2037-12-31T23:59:59Z",
    frequency: { type: "daily", repeats_every: 1 },
  },
};

export default trigger;
```

### Use the `trigger create` command

Once you have created a trigger file, use the following command to create the scheduled trigger:

```bash
slack trigger create --trigger-def "path/to/trigger.ts"
```

If you have not used the `slack triggers create` command to create a trigger prior to running the `slack run` command, you will receive a prompt in the Slack CLI to do so.


  </TabItem>
  <TabItem value="runtime" label="Create a scheduled trigger at runtime">

:::info

Your app needs to have the [`triggers:write`](https://api.slack.com/scopes/triggers:write) scope to use a trigger at runtime. Include the scope within your app's [manifest](/deno-slack-sdk/guides/using-the-app-manifest).

:::

The logic of a runtime trigger lies within a function's TypeScript code. Within your `functions` folder, you'll have the functions that are the steps making up your workflow. Within this folder is where you can create a trigger within the relevant `<function>.ts` file.

When you create a runtime trigger, you can leverage `inputs` acquired from functions within the workflow. Provide the workflow definition to get additional typing for the workflow and inputs fields.

Create a scheduled trigger at runtime using the `client.workflows.triggers.create` method within the relevant `function` file.

```js
const triggerResponse = await client.workflows.triggers.create<typeof ExampleWorkflow.definition>({
  // your TypeScript payload
});
```

Your TypeScript payload consists of the [parameters](#parameters) needed for your own use case. Below is the function file with a TypeScript payload for a scheduled trigger from the [Daily Channel Topic](https://github.com/slack-samples/deno-daily-channel-topic) app:

```js
// functions/create_scheduled_trigger.ts
import { SlackAPI } from "deno-slack-api/mod.ts";
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";

export const CreateScheduledTrigger = DefineFunction({
  title: "Create a scheduled trigger",
  callback_id: "create_scheduled_trigger",
  source_file: "functions/create_scheduled_trigger.ts",
  input_parameters: {
    properties: {
      channel_id: {
        description: "The ID of the Channel to create a schedule for",
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["channel_id"],
  },
  output_parameters: {
    properties: {
      trigger_id: {
        description: "The ID of the trigger created by the Slack API",
        type: Schema.types.string,
      },
    },
    required: ["trigger_id"],
  },
});

export default SlackFunction(
  CreateScheduledTrigger,
  async ({ inputs, token }) => {
    console.log(`Creating scheduled trigger to update daily topic`);

    const client = SlackAPI(token, {});
    const scheduleDate = new Date();
    // Start schedule 1 minute in the future. Start_time must always be in the future.
    scheduleDate.setMinutes(scheduleDate.getMinutes() + 1);

    // triggers/sample_scheduled_update_topic.txt has a JSON example of the payload
    const scheduledTrigger = await client.workflows.triggers.create({
      name: `Channel ${inputs.channel_id} Schedule`,
      workflow: "#/workflows/scheduled_update_topic",
      type: TriggerTypes.Scheduled,
      inputs: {
        channel_id: { value: inputs.channel_id },
      },
      schedule: {
        start_time: scheduleDate.toUTCString(),
        frequency: {
          type: "daily",
          repeats_every: 1,
        },
      },
    });

    if (!scheduledTrigger.trigger) {
      return {
        error: "Trigger could not be created",
      };
    }

    console.log("scheduledTrigger has been created");

    return {
      outputs: { trigger_id: scheduledTrigger.trigger.id },
    };
  },
);
```

  </TabItem>
</Tabs>

## Scheduled trigger parameters {#parameters}

| Field         | Description                                             | Required? |
|---------------|---------------------------------------------------------| --------- |
| `type`        | The type of trigger: `TriggerTypes.Scheduled`                        | Required | 
| `name`        | The name of the trigger                                 | Required | 
| `workflow`    | Path to workflow that the trigger initiates             | Required | 
| `schedule`    | When and how often the trigger will activate. See the [ `schedule`](#schedule) object below | Required |
| `description` | The description of the trigger                          | Optional |
| `inputs`      | The inputs provided to the workflow. See the [ `inputs`](#inputs) object below                     | Optional |

:::info

Scheduled triggers are not interactive. Use a [link trigger](/deno-slack-sdk/guides/creating-link-triggers) to take advantage of interactivity.

:::

### The `inputs` object {#inputs}

The `inputs` of a trigger map to the inputs of a [workflow](/deno-slack-sdk/guides/creating-workflows). You can pass any value as an input.

There is also a specific input value that contains information about the trigger. Pass this value to provide trigger information to your workflows!

Fields that take the form of `data.VALUE` can be referenced in the form of `TriggerContextData.Shortcut.VALUE`

| Referenced field       | Type               | Description |
|--------|---------------|-------------|
| `TriggerContextData.Scheduled.user_id` | string | A unique identifier for the user who created the trigger. |
 `TriggerContextData.Scheduled.event_timestamp` | timestamp | A Unix timestamp in seconds indicating when this event was dispatched. |

The following snippet shows a `user_id` input being set with a value of `TriggerContextData.Scheduled.user_id`, representing the user who created the trigger.

```js
...
inputs: {
  user_id: {
    value: TriggerContextData.Scheduled.user_id
  }
},
...
```

### The `schedule` object {#schedule}

| Field              | Description                                                     | Required? |
|--------------------|-----------------------------------------------------------------|-----------|
| `start_time`       | ISO date string of the first scheduled trigger                    | Required |
| `timezone`         | Timezone string to use for scheduling                          | Optional |
| `frequency`        | Details on what cadence trigger will activate. See the [`frequency`](#frequency) object below        | Optional |
| `occurrence_count` | The maximum number of times trigger will run                    | Optional |
| `end_time`         | If set, this trigger will not run past the provided ISO date string | Optional |

### The `frequency` object {#frequency}


<details>
  <summary>One-time triggers</summary>

| Field           | Description                                                       | Required? |
|-----------------|-------------------------------------------------------------------|-----------|
| `type`          | How often the trigger will activate: `once`                      | Required |
| `repeats_every` | How often the trigger will repeat, respective to `frequency.type` | Optional |
| `on_week_num`   | The nth week of the month the trigger will repeat                 | Optional |


#### Example one-time trigger {#once-example}

```js
import { TriggerTypes } from "deno-slack-api/mod.ts";
import { ScheduledTrigger } from "deno-slack-api/typed-method-types/workflows/triggers/scheduled.ts";
import { ExampleWorkflow } from "../workflows/example_workflow.ts";

const schedule: ScheduledTrigger<typeof ExampleWorkflow.definition> = {
  name: "Sample",
  type: TriggerTypes.Scheduled,
  workflow: `#/workflows/${ExampleWorkflow.definition.callback_id}`,
  inputs: {},
  schedule: {
    // Starts 60 seconds after creation
    start_time: new Date(new Date().getTime() + 60000).toISOString(),
    timezone: "asia/kolkata",
    frequency: {
      type: "once",
    },
  },
};
export default schedule;
```

</details>


<details>
  <summary>Hourly triggers</summary>

| Field           | Description                                                       | Required? |
|-----------------|-------------------------------------------------------------------|-----------|
| `type`          | How often the trigger will activate: `hourly`                    | Required |
| `repeats_every` | How often the trigger will repeat, respective to `frequency.type` | Required |
| `on_week_num`   | The nth week of the month the trigger will repeat                 | Optional |

#### Example hourly trigger {#hourly-example}

```js
import { TriggerTypes } from "deno-slack-api/mod.ts";
import { ScheduledTrigger } from "deno-slack-api/typed-method-types/workflows/triggers/scheduled.ts";
import { ExampleWorkflow } from "../workflows/example_workflow.ts";

const schedule: ScheduledTrigger<typeof ExampleWorkflow.definition> = {
  name: "Sample",
  type: TriggerTypes.Scheduled,
  workflow: `#/workflows/${ExampleWorkflow.definition.callback_id}`,
  inputs: {},
  schedule: {
    // Starts 60 seconds after creation
    start_time: new Date(new Date().getTime() + 60000).toISOString(),
    end_time: "2040-05-01T14:00:00Z",
    frequency: {
      type: "hourly",
      repeats_every: 2,
    },
  },
};
export default schedule;
```

</details>


<details>
  <summary>Daily triggers</summary>

| Field           | Description                                                       | Required? |
|-----------------|-------------------------------------------------------------------|-----------|
| `type`          | How often the trigger will activate: `daily`                     | Required |
| `repeats_every` | How often the trigger will repeat, respective to `frequency.type` | Required |
| `on_week_num`   | The nth week of the month the trigger will repeat                 | Optional |

#### Example daily trigger {#daily-example}

```js
import { TriggerTypes } from "deno-slack-api/mod.ts";
import { ScheduledTrigger } from "deno-slack-api/typed-method-types/workflows/triggers/scheduled.ts";
import { ExampleWorkflow } from "../workflows/example_workflow.ts";

const schedule: ScheduledTrigger<typeof ExampleWorkflow.definition> = {
  name: "Sample",
  type: TriggerTypes.Scheduled,
  workflow: `#/workflows/${ExampleWorkflow.definition.callback_id}`,
  inputs: {},
  schedule: {
    // Starts 60 seconds after creation
    start_time: new Date(new Date().getTime() + 60000).toISOString(),
    end_time: "2040-05-01T14:00:00Z",
    occurrence_count: 3,
    frequency: { type: "daily" },
  },
};
export default schedule;
```
</details>


<details>
  <summary>Weekly triggers</summary>

| Field           | Description                                                       | Required? |
|-----------------|-------------------------------------------------------------------|-----------|
| `type`          | How often the trigger will activate: `weekly`                    | Required |
| `on_days`       | The days of the week the trigger should activate on               | Required |
| `repeats_every` | How often the trigger will repeat, respective to `frequency.type` | Required |
| `on_week_num`   | The nth week of the month the trigger will repeat       | Optional |

#### Example weekly trigger {#weekly-example}

```js
import { TriggerTypes } from "deno-slack-api/mod.ts";
import { ScheduledTrigger } from "deno-slack-api/typed-method-types/workflows/triggers/scheduled.ts";
import { ExampleWorkflow } from "../workflows/example_workflow.ts";

const schedule: ScheduledTrigger<typeof ExampleWorkflow.definition> = {
  name: "Sample",
  type: TriggerTypes.Scheduled,
  workflow: `#/workflows/${ExampleWorkflow.definition.callback_id}`,
  inputs: {},
  schedule: {
    // Starts 60 seconds after creation
    start_time: new Date(new Date().getTime() + 60000).toISOString(),
    frequency: {
      type: "weekly",
      repeats_every: 3,
      on_days: ["Friday", "Monday"],
    },
  },
};
export default schedule;
```

</details>


<details>
  <summary>Monthly triggers</summary>

| Field           | Description                                                       | Required? |
|-----------------|-------------------------------------------------------------------|-----------|
| `type`          | How often the trigger will activate: `monthly`                   | Required |
| `on_days`       | The day of the week the trigger should activate on. Provide the `on_week_num` value along with this field. | Required |
| `repeats_every` | How often the trigger will repeat, respective to `frequency.type` | Required |
| `on_week_num`   | The nth week of the month the trigger will repeat                 | Optional |

#### Example monthly trigger {#monthly-example}

```js
import { TriggerTypes } from "deno-slack-api/mod.ts";
import { ScheduledTrigger } from "deno-slack-api/typed-method-types/workflows/triggers/scheduled.ts";
import { ExampleWorkflow } from "../workflows/example_workflow.ts";

const schedule: ScheduledTrigger<typeof ExampleWorkflow.definition> = {
  name: "Sample",
  type: TriggerTypes.Scheduled,
  workflow: `#/workflows/${ExampleWorkflow.definition.callback_id}`,
  inputs: {},
  schedule: {
    // Starts 60 seconds after creation
    start_time: new Date(new Date().getTime() + 60000).toISOString(),
    frequency: {
      type: "monthly",
      repeats_every: 3,
      on_days: ["Friday"],
      on_week_num: 1,
    },
  },
};
export default schedule;
```

</details>


<details>
  <summary>Yearly triggers</summary>

| Field           | Description                                                       | Required? |
|-----------------|-------------------------------------------------------------------|-----------|
| `type`          | How often the trigger will activate: `yearly`                     | Required | 
| `repeats_every` | How often the trigger will repeat, respective to `frequency.type` | Required |
| `on_week_num`   | The nth week of the month the trigger will repeat      | Optional |

#### Example yearly trigger {#yearly-example}

```js
import { TriggerTypes } from "deno-slack-api/mod.ts";
import { ScheduledTrigger } from "deno-slack-api/typed-method-types/workflows/triggers/scheduled.ts";
import { ExampleWorkflow } from "../workflows/example_workflow.ts";

const schedule: ScheduledTrigger<typeof ExampleWorkflow.definition> = {
  name: "Sample",
  type: TriggerTypes.Scheduled,
  workflow: `#/workflows/${ExampleWorkflow.definition.callback_id}`,
  inputs: {},
  schedule: {
    // Starts 60 seconds after creation
    start_time: new Date(new Date().getTime() + 60000).toISOString(),
    frequency: {
      type: "yearly",
      repeats_every: 2,
    },
  },
};
export default schedule;
```

</details>

## Scheduled trigger response {#response}

The response will have a property called `ok`. If `true`, then the trigger was created, and the `trigger` property will be populated.

Your response will include a `trigger.id`; be sure to store it! You use that to `update` or `delete` the trigger if need be. See [trigger management](/deno-slack-sdk/guides/managing-triggers).

## Onward

➡️ With your trigger created, you can now test your app by [running your app locally](/deno-slack-sdk/guides/developing-locally).

✨ Once your app is active, see [trigger management](/deno-slack-sdk/guides/managing-triggers) for info on managing your triggers in your workspace.
