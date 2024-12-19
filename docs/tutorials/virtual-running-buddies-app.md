# Virtual running buddies app

<PaidPlanBanner />

In this tutorial, you'll learn how to create a social app to log runs with your virtual running buddies. 

We'll pace you along the path to design a [datastore](/deno-slack-sdk/guides/using-datastores), craft a [custom type](/deno-slack-sdk/guides/creating-a-custom-type), tailor [triggers](/deno-slack-sdk/guides/using-triggers), wire [workflows](/deno-slack-sdk/guides/creating-workflows), and form [functions](/deno-slack-sdk/guides/creating-slack-functions). Now that you're familiar with the course map, let's head to the start line.

✨  **First time creating a workflow app?** Try a basic app to build your confidence, such as [Hello World](/deno-slack-sdk/tutorials/hello-world-app)!

Before we begin, ensure you have the following prerequisites completed:

* Install the Slack CLI.
* Run `slack auth list` and ensure your workspace is listed.
* If your workspace is not listed, address any issues by following along with the Getting started, then come on back.

---

## Step 1: Create an app to complete your warmup {#warmup}

Each Slack app built using the CLI begins with the same steps. Make sure you have everything you need before you show up at the start line.

After you've [installed the command-line interface](/deno-slack-sdk/guides/getting-started), you have two ways you can get started.

<Tabs groupId="operating-systems">
  <TabItem value="blank-app" label="Use a blank app">

You can create a blank app with the Slack CLI using the following command:

```bash
slack create virtual-running-buddies-app --template https://github.com/slack-samples/deno-blank-template
```

</TabItem>
<TabItem value="pre-built-app" label="Use a pre-built app">


Or, you can use the pre-built [Virtual Running Buddies app](https://github.com/slack-samples/deno-virtual-running-buddies):

```
slack create virtual-running-buddies-app --template https://github.com/slack-samples/deno-virtual-running-buddies
```

</TabItem>
</Tabs>

Once you have your new project ready to go, change into your project directory and get to the start line.

---

## Step 2: Map your course with your manifest {#map-course}

Determining the definitions and manifest of your app allows you to create a course map of where you want to go. Open your text editor (we recommend VSCode with the [Deno plugin](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)) and point to the directory you created with the `slack` command.

Import and add the following definitions to your [app's manifest](/deno-slack-sdk/guides/using-the-app-manifest):

```javascript
import { Manifest } from "deno-slack-sdk/mod.ts";
import RunningDatastore from "./datastores/run_data.ts";
import LogRunWorkflow from "./workflows/log_run_workflow.ts";
import DisplayLeaderboardWorkflow from "./workflows/display_leaderboard_workflow.ts";
import { RunnerStatsType } from "./types/runner_stats.ts";

export default Manifest({
  name: "my-run-app",
  description: "Log runs with virtual running buddies!",
  icon: "assets/icon.png",
  workflows: [LogRunWorkflow, DisplayLeaderboardWorkflow],
  outgoingDomains: [],
  datastores: [RunningDatastore],
  types: [RunnerStatsType],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
    "channels:read",
    "triggers:write",
  ],
});

```

You'll notice a lot of stuff we haven't talked about yet, but not to worry! We'll cover everything in the following steps.

---

## Step 3: Define a datastore {#datastore}
We need a way to store all the information that our running buddies log, including their user ID (`runner`), how long they ran (`distance`), and the date they ran (`rundate`). Enter [datastores](/deno-slack-sdk/guides/using-datastores)!

Datastores have three main properties:

* `name`: to identify your datastore.
* `primary_key`: the attribute to be used as the datastore's primary key (ensure this is an actual attribute that you have defined), which we'll use for querying information later. For more information, refer to [querying the datastore](/deno-slack-sdk/guides/retrieving-items-from-a-datastore).
* `attributes`: to scaffold your datastore's columns.

For what we need, the following datastore will do the trick. Let's create a `datastores` folder and add a file called `run_data.ts` with our datastore definition:

```javascript
import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export const RUN_DATASTORE = "running_datastore";

const RunningDatastore = DefineDatastore({
  name: RUN_DATASTORE,
  primary_key: "id",
  attributes: {
    id: {
      type: Schema.types.string,
    },
    runner: {
      type: Schema.slack.types.user_id,
    },
    distance: {
      type: Schema.types.number,
    },
    rundate: {
      type: Schema.slack.types.date,
    },
  },
});

export default RunningDatastore;

```

We already did this earlier when we defined our manifest &mdash; but if you hadn't yet, you would need to import your datastore within the manifest file:

`import RunningDatastore from "./datastores/run_data.ts";`

And then, register it:

`datastores: [RunningDatastore],`

Additionally, for any datastore, you'll need to add the following bot scopes to your manifest:

* `datastore:read`
* `datastore:write`

---

## Step 4: Craft a custom type {#custom-type}

The next thing we'll do is define a custom type for our runners' recent runs. Since we're going to be passing this information to our datastore, workflows, and functions, having our own custom reusable type will make our lives a little easier.

✨  **For more information about custom types and how to define them**, refer to [custom types](/deno-slack-sdk/guides/creating-a-custom-type).

We'll create a new `types` folder with a file called `runner_stats.ts` with our custom type definition:

```javascript
import { DefineType, Schema } from "deno-slack-sdk/mod.ts";

export const RunnerStatsType = DefineType({
  title: "Runner Stats",
  description: "Information about the recent runs for a runner",
  name: "runner_stats",
  type: Schema.types.object,
  properties: {
    runner: { type: Schema.slack.types.user_id },
    weekly_distance: { type: Schema.types.number },
    total_distance: { type: Schema.types.number },
  },
  required: ["runner", "weekly_distance", "total_distance"],
});

```

Just like with our datastore, we'll also verify that we imported our custom type into our manifest earlier:

`import { RunnerStatsType } from "./types/runner_stats.ts";`

And then, make sure it's registered:

`types: [RunnerStatsType],`

---

## Step 5: Wire your workflows {#workflows}

Next, let's define our workflows &mdash; we'll have two of them. Don't worry about functions yet; we'll get to those next. For now, you can just import and call them as shown in our workflows.

For our first workflow, we need three steps to accomplish the following:

1. Allow a runner on our team to log their run details. The Slack function [`OpenForm`](/deno-slack-sdk/reference/slack-functions/open_form) is used to collect data.
2. Save those details to the datastore we defined earlier.
3. Post a message of encouragement to the runner. Every runner loves a good cheering section!

Let's create a `workflows` folder and add a file called `log_run_workflow.ts` with the following workflow definition:

```javascript
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { LogRunFunction } from "../functions/log_run.ts";

const LogRunWorkflow = DefineWorkflow({
  callback_id: "log_run_workflow",
  title: "Log a run",
  description: "Collect and store info about a recent run",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
      channel: { type: Schema.slack.types.channel_id },
      user_id: { type: Schema.slack.types.user_id },
    },
    required: ["interactivity", "channel", "user_id"],
  },
});

// Step 1: Collect run information with a form
const inputForm = LogRunWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Log your run",
    interactivity: LogRunWorkflow.inputs.interactivity,
    submit_label: "Submit run",
    fields: {
      elements: [{
        name: "runner",
        title: "Runner",
        type: Schema.slack.types.user_id,
        default: LogRunWorkflow.inputs.user_id,
      }, {
        name: "distance",
        title: "Distance (in miles)",
        type: Schema.types.number,
        minimum: 0,
      }, {
        name: "rundate",
        title: "Run date",
        type: Schema.slack.types.date,
        default: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      }, {
        name: "channel",
        title: "Channel to send entry to",
        type: Schema.slack.types.channel_id,
        default: LogRunWorkflow.inputs.channel,
      }],
      required: ["channel", "runner", "distance", "rundate"],
    },
  },
);

// Step 2: Save run info to the datastore
LogRunWorkflow.addStep(LogRunFunction, {
  runner: inputForm.outputs.fields.runner,
  distance: inputForm.outputs.fields.distance,
  rundate: inputForm.outputs.fields.rundate,
});

// Step 3: Post a message about the run
LogRunWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: inputForm.outputs.fields.channel,
  message:
    `:athletic_shoe: <@${inputForm.outputs.fields.runner}> submitted ${inputForm.outputs.fields.distance} mile(s) on ${inputForm.outputs.fields.rundate}. Keep up the great work!`,
});

export default LogRunWorkflow;
```

---

For our second workflow, we need to generate our leaderboard. To do this, our workflow contains the following steps:

1. Gather our team's runs.
2. Gather each individual's runs.
3. Format our leaderboard.
4. Post the leaderboard to our channel.

```javascript
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { CollectTeamStatsFunction } from "../functions/collect_team_stats.ts";
import { CollectRunnerStatsFunction } from "../functions/collect_runner_stats.ts";
import { FormatLeaderboardFunction } from "../functions/format_leaderboard.ts";

const DisplayLeaderboardWorkflow = DefineWorkflow({
  callback_id: "display_leaderboard_workflow",
  title: "Display the leaderboard",
  description:
    "Show team statistics and highlight the top runners from the past week",
  input_parameters: {
    properties: {
      channel: { type: Schema.slack.types.channel_id },
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: ["channel", "interactivity"],
  },
});

// Step 1: Gather team stats from the past week
const teamStats = DisplayLeaderboardWorkflow.addStep(
  CollectTeamStatsFunction,
  {},
);

// Step 2: Collect individual runner stats
const runnerStats = DisplayLeaderboardWorkflow.addStep(
  CollectRunnerStatsFunction,
  {},
);

// Step 3: Format the leaderboard message
const leaderboard = DisplayLeaderboardWorkflow.addStep(
  FormatLeaderboardFunction,
  {
    team_distance: teamStats.outputs.weekly_distance,
    percent_change: teamStats.outputs.percent_change,
    runner_stats: runnerStats.outputs.runner_stats,
  },
);

// Step 4: Post the leaderboard message to channel
DisplayLeaderboardWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: DisplayLeaderboardWorkflow.inputs.channel,
  message:
    `${leaderboard.outputs.teamStatsFormatted}\n\n${leaderboard.outputs.runnerStatsFormatted}`,
});

export default DisplayLeaderboardWorkflow;
```

Our workflows also need to be imported into our manifest, so let's just double-check the following lines are there:
`import LogRunWorkflow from "./workflows/log_run_workflow.ts";`
`import DisplayLeaderboardWorkflow from "./workflows/display_leaderboard_workflow.ts";`

And that they are registered:

`workflows: [LogRunWorkflow, DisplayLeaderboardWorkflow],`

---

## Step 6: Form your functions {#functions}

Following fast, functions: we'll fashion four.

The first function will store our collected run data in our datastore (so don't forget to import it first):

```javascript
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { RUN_DATASTORE } from "../datastores/run_data.ts";

export const LogRunFunction = DefineFunction({
  callback_id: "log_run",
  title: "Log a run",
  description: "Record a run in the datastore",
  source_file: "functions/log_run.ts",
  input_parameters: {
    properties: {
      runner: {
        type: Schema.slack.types.user_id,
        description: "Runner",
      },
      distance: {
        type: Schema.types.number,
        description: "Distance",
      },
      rundate: {
        type: Schema.slack.types.date,
        description: "Run date",
      },
    },
    required: ["runner", "distance", "rundate"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(LogRunFunction, async ({ inputs, client }) => {
  const { distance, rundate, runner } = inputs;
  const uuid = crypto.randomUUID();

  const putResponse = await client.apps.datastore.put({
    datastore: RUN_DATASTORE,
    item: {
      id: uuid,
      runner: runner,
      distance: distance,
      rundate: rundate,
    },
  });

  if (!putResponse.ok) {
    return { error: `Failed to store run: ${putResponse.error}` };
  }
  return { outputs: {} };
});

```
✨  **For more information about how data is stored and successful vs. unsuccessful payloads**, refer to [creating or updating an item](/deno-slack-sdk/guides/adding-items-to-a-datastore).

---

Our second function calculates weekly and all-time total distance statistics for an individual runner. 

We'll query the datastore to get a runner's logged run details, calculate some statistics for that runner, and then return an array containing all of that information:

```javascript
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import RunningDatastore, { RUN_DATASTORE } from "../datastores/run_data.ts";
import { RunnerStatsType } from "../types/runner_stats.ts";

export const CollectRunnerStatsFunction = DefineFunction({
  callback_id: "collect_runner_stats",
  title: "Collect runner stats",
  description: "Gather statistics of past runs for all runners",
  source_file: "functions/collect_runner_stats.ts",
  input_parameters: {
    properties: {},
    required: [],
  },
  output_parameters: {
    properties: {
      runner_stats: {
        type: Schema.types.array,
        items: { type: RunnerStatsType },
        description: "Weekly and all-time total distances for runners",
      },
    },
    required: ["runner_stats"],
  },
});

export default SlackFunction(CollectRunnerStatsFunction, async ({ client }) => {
  // Query the datastore for all the data we collected
  const runs = await client.apps.datastore.query<
    typeof RunningDatastore.definition
  >({ datastore: RUN_DATASTORE });

  if (!runs.ok) {
    return { error: `Failed to retrieve past runs: ${runs.error}` };
  }

  const runners = new Map<typeof Schema.slack.types.user_id, {
    runner: typeof Schema.slack.types.user_id;
    total_distance: number;
    weekly_distance: number;
  }>();

  const startOfLastWeek = new Date();
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 6);

  // Add run statistics to the associated runner
  runs.items.forEach((run) => {
    const isRecentRun = run.rundate >=
      startOfLastWeek.toLocaleDateString("en-CA", { timeZone: "UTC" });

    // Find existing runner record or create new one
    const runner = runners.get(run.runner) ||
      { runner: run.runner, total_distance: 0, weekly_distance: 0 };

    // Add run distance to the runner's totals
    runners.set(run.runner, {
      runner: run.runner,
      total_distance: runner.total_distance + run.distance,
      weekly_distance: runner.weekly_distance + (isRecentRun && run.distance),
    });
  });

  // Return an array with runner stats
  return {
    outputs: { runner_stats: [...runners.entries()].map((r) => r[1]) },
  };
});

```

✨  **For more information about how data is retrieved and successful vs. unsuccessful payloads**, refer to [retrieving a single item](/deno-slack-sdk/guides/retrieving-items-from-a-datastore#get) and [querying the datastore](/deno-slack-sdk/guides/retrieving-items-from-a-datastore#query).

---

Our third function calculates the weekly and all-time total distance for the whole team, as well as the percentage difference between this week's runs and the previous week's runs.

Similar to the query for individual runners, we'll query the datastore to get the team's logged run details, calculate statistics for the team, and then return all of that information:

```javascript
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { SlackAPIClient } from "deno-slack-api/types.ts";
import RunningDatastore, { RUN_DATASTORE } from "../datastores/run_data.ts";

export const CollectTeamStatsFunction = DefineFunction({
  callback_id: "collect_team_stats",
  title: "Collect team stats",
  description: "Gather and compare run data from the last week",
  source_file: "functions/collect_team_stats.ts",
  input_parameters: {
    properties: {},
    required: [],
  },
  output_parameters: {
    properties: {
      weekly_distance: {
        type: Schema.types.number,
        description: "Total number of miles ran last week",
      },
      percent_change: {
        type: Schema.types.number,
        description: "Percent change of miles ran compared to the prior week",
      },
    },
    required: ["weekly_distance", "percent_change"],
  },
});

export default SlackFunction(CollectTeamStatsFunction, async ({ client }) => {
  const today = new Date();

  // Collect runs from the past week (days 0-6)
  const lastWeekStartDate = new Date(new Date().setDate(today.getDate() - 6));
  const lastWeekDistance = await distanceInWeek(client, lastWeekStartDate);
  if (lastWeekDistance.error) {
    return { error: lastWeekDistance.error };
  }

  // Collect runs from the prior week (days 7-13)
  const priorWeekStartDate = new Date(new Date().setDate(today.getDate() - 13));
  const priorWeekDistance = await distanceInWeek(client, priorWeekStartDate);
  if (priorWeekDistance.error) {
    return { error: priorWeekDistance.error };
  }

  // Calculate percent difference between totals of last week and the prior week
  const weeklyDiff = lastWeekDistance.total - priorWeekDistance.total;
  let percentageDiff = 0;
  if (priorWeekDistance.total != 0) {
    percentageDiff = 100 * weeklyDiff / priorWeekDistance.total;
  }

  return {
    outputs: {
      weekly_distance: Number(lastWeekDistance.total.toFixed(2)),
      percent_change: Number(percentageDiff.toFixed(2)),
    },
  };
});

// Sum all logged runs in the seven days following startDate
async function distanceInWeek(
  client: SlackAPIClient,
  startDate: Date,
): Promise<{ total: number; error?: string }> {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  const runs = await client.apps.datastore.query<
    typeof RunningDatastore.definition
  >({
    datastore: RUN_DATASTORE,
    expression: "#date BETWEEN :start_date AND :end_date",
    expression_attributes: { "#date": "rundate" },
    expression_values: {
      ":start_date": startDate.toLocaleDateString("en-CA", { timeZone: "UTC" }),
      ":end_date": endDate.toLocaleDateString("en-CA", { timeZone: "UTC" }),
    },
  });

  if (!runs.ok) {
    return { total: 0, error: `Failed to retrieve past runs: ${runs.error}` };
  }

  const total = runs.items.reduce((sum, entry) => (sum + entry.distance), 0);
  return { total };
}
```

---

Our final function generates our ordered leaderboard, as well as a formatted message with all of our queried data and calculated statistics:

```javascript
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { RunnerStatsType } from "../types/runner_stats.ts";

export const FormatLeaderboardFunction = DefineFunction({
  callback_id: "format_leaderboard",
  title: "Format leaderboard message",
  description: "Format team and runner stats for a sharable message",
  source_file: "functions/format_leaderboard.ts",
  input_parameters: {
    properties: {
      team_distance: {
        type: Schema.types.number,
        description: "Total number of miles ran last week for the team",
      },
      percent_change: {
        type: Schema.types.number,
        description:
          "Percent change of miles ran compared to the prior week for the team",
      },
      runner_stats: {
        type: Schema.types.array,
        items: { type: RunnerStatsType },
        description: "Weekly and all-time total distances for runners",
      },
    },
    required: ["team_distance", "percent_change", "runner_stats"],
  },
  output_parameters: {
    properties: {
      teamStatsFormatted: {
        type: Schema.types.string,
        description: "A formatted message with team stats",
      },
      runnerStatsFormatted: {
        type: Schema.types.string,
        description: "An ordered leaderboard of runner stats",
      },
    },
    required: ["teamStatsFormatted", "runnerStatsFormatted"],
  },
});

export default SlackFunction(FormatLeaderboardFunction, ({ inputs }) => {
  const teamStatsFormatted =
    `Your team ran *${inputs.team_distance} miles* this past week: a ${inputs.percent_change}% difference from the prior week.`;

  const runnerStatsFormatted = inputs.runner_stats.sort((a, b) =>
    b.weekly_distance - a.weekly_distance
  ).map((runner) =>
    ` - <@${runner.runner}> ran ${runner.weekly_distance} miles last week (${runner.total_distance} total)`
  ).join("\n");

  return {
    outputs: { teamStatsFormatted, runnerStatsFormatted },
  };
});
```

Whew! Don't slow down now...we're almost there!

---

## Step 7: Tailor your triggers {#triggers}

Triggers invoke workflows. There are four types of available triggers, but we'll only be using two: [link triggers](/deno-slack-sdk/guides/creating-link-triggers) and [scheduled triggers](/deno-slack-sdk/guides/creating-scheduled-triggers). For this app, we'll need three triggers, two of which will be link triggers. This means that they require a user to manually trigger them.

First, we'll create a `triggers` folder and define a link trigger for collecting our team's runs called `log_run_trigger.ts`:

```javascript
import { Trigger } from "deno-slack-api/types.ts";
import LogRunWorkflow from "../workflows/log_run_workflow.ts";

const LogRunTrigger: Trigger<typeof LogRunWorkflow.definition> = {
  type: "shortcut",
  name: "Log a run",
  description: "Save the details of a recent run",
  workflow: `#/workflows/${LogRunWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
    channel: {
      value: "{{data.channel_id}}",
    },
    user_id: {
      value: "{{data.user_id}}",
    },
  },
};

export default LogRunTrigger;

```

Run the `trigger create` command in terminal:

```cmd
slack trigger create --trigger-def triggers/log_run_trigger.ts
```

After executing this command, select your app and workspace. Once completed, you'll be given a link called "Shortcut URL." This is your link trigger for this workflow on this workspace. 

Save that URL for when you start testing, since that's how you'll invoke this particular trigger. You can also use the `slack triggers -info` command and select your workspace to grab that URL again later, or click the `/` icon within Slack to open the `Run workflow` menu and select your trigger.

---

Second, we'll need a trigger to display our leaderboard. Create another link trigger in that same `triggers` folder called `display_leaderboard_trigger.ts` and define it as follows:

```javascript
import { Trigger } from "deno-slack-api/types.ts";
import DisplayLeaderboardWorkflow from "../workflows/display_leaderboard_workflow.ts";

const DisplayLeaderboardTrigger: Trigger<
  typeof DisplayLeaderboardWorkflow.definition
> = {
  type: "shortcut",
  name: "Display the leaderboard",
  description: "Show stats for the team and individual runners",
  workflow: `#/workflows/${DisplayLeaderboardWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
    channel: {
      value: "{{data.channel_id}}",
    },
  },
};

export default DisplayLeaderboardTrigger;

```

Run the `trigger create` command in the terminal again and save the Shortcut URL for our second link trigger:

```cmd
slack trigger create --trigger-def triggers/display_leaderboard_trigger.ts
```

---

Finally, we'll create a scheduled trigger in our `triggers` folder to post a message to a channel with our stats on a weekly basis. We'll call this one `display_weekly_stats.ts`:

```javascript
import { Trigger } from "deno-slack-api/types.ts";
import DisplayLeaderboardWorkflow from "../workflows/display_leaderboard_workflow.ts";

const DisplayWeeklyStats: Trigger<
  typeof DisplayLeaderboardWorkflow.definition
> = {
  type: "scheduled",
  name: "Display weekly stats",
  description: "Display weekly running stats on a schedule",
  workflow: `#/workflows/${DisplayLeaderboardWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
    channel: {
      value: "{{data.channel_id}}",
    },
  },
  schedule: {
    start_time: new Date(new Date().getTime() + 60000).toISOString(),
    timezone: "EDT",
    frequency: {
      type: "weekly",
      on_days: ["Thursday"],
      repeats_every: 1,
    },
  },
};

export default DisplayWeeklyStats;

```

Since this is a scheduled trigger, we won't have a Shortcut URL for this one since there's nothing to invoke manually. Use the following command to create the [scheduled trigger](/deno-slack-sdk/guides/creating-event-triggers):

`slack trigger create --trigger-def triggers/display_weekly_stats.ts`

Make sure that the app has the `triggers:write` scope added to the manifest!

---

## Step 8: Cross the finish line {#finish}

You're almost to the finish line! Let's use development mode to run this workflow in Slack directly from the machine you're reading this from now:

```bash
slack run
```

After you've chosen your app and assigned it to your workspace, you can switch over to the app in Slack and give it a spin. Use the link triggers you created previously; when you paste the Shortcut URLs into the box and post them as messages, they'll unfurl and give you buttons for invoking our workflows.

Here is an example of the message displayed after logging a run:

![Log a run](/img/social-app/log_run.png)


Here is an example of a message displayed after generating the leaderboard:

![Display leaderboard](/img/social-app/display_leaderboard.png)

## Next steps

Congratulations, you made it! 🎉

Thinking about signing up for your next race? For your next challenge, perhaps consider creating an app your users can use to [request time off](/deno-slack-sdk/tutorials/request-time-off-app)!