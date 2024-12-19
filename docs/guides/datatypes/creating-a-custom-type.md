---
slug: /deno-slack-sdk/guides/creating-a-custom-type
---

# Creating a custom type

<PaidPlanBanner />

Custom types provide a way to introduce reusable, sharable types to your workflow apps. Once registered in your manifest, you can use custom types as input or output parameters in any of your app's [functions](/deno-slack-sdk/guides/creating-slack-functions), [workflows](/deno-slack-sdk/guides/creating-workflows), or [datastores](/deno-slack-sdk/guides/using-datastores). The possibilities are endless!

## Defining a type {#define-type}

Types can be defined with a top level `DefineType` export. In the example below, a custom type object is defined for use in the [Deno Announcement Bot](https://github.com/slack-samples/deno-announcement-bot) sample app:

```javascript
// types/incident.ts
import { DefineType, Schema } from "deno-slack-sdk/mod.ts";

export const AnnouncementCustomType = DefineType({
  name: "Announcement",
  type: Schema.types.object,
  properties: {
    channel_id: {
      type: Schema.slack.types.channel_id,
    },
    success: {
      type: Schema.types.boolean,
    },
    permalink: {
      type: Schema.types.string,
    },
    error: {
      type: Schema.types.string,
    },
  },
  required: ["channel_id", "success"],
});
```

Another way custom types can be defined is within a function, where they can be immediately used:

```javascript
// Define the custom type
import { DefineFunction, DefineType, Schema } from "deno-slack-sdk/mod.ts";

export const AnnouncementCustomType = DefineType({
  name: "Announcement",
  type: Schema.types.object,
  properties: {
    channel_id: {
      type: Schema.slack.types.channel_id,
    },
    success: {
      type: Schema.types.boolean,
    },
    permalink: {
      type: Schema.types.string,
    },
    error: {
      type: Schema.types.string,
    },
  },
  required: ["channel_id", "success"],
});

// Define your function, which uses the custom type we just defined
export const PrepareSendAnnouncementFunctionDefinition = DefineFunction({
  callback_id: "send_announcement",
  title: "Send an announcement",
  description: "Sends a message to one or more channels",
  source_file: "functions/send_announcement/handler.ts",
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "The content of the announcement",
      },
      channels: {
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.channel_id,
        },
        description: "The destination channels of the announcement",
      },
      icon: {
        type: Schema.types.string,
        description: "Optional custom bot icon to use display in announcements",
      },
      username: {
        type: Schema.types.string,
        description: "Optional custom bot emoji avatar to use in announcements",
      },
      draft_id: {
        type: Schema.types.string,
        description: "The datastore ID of the draft message if one was created",
      },
    },
    required: [
      "message",
      "channels",
    ],
  },
  output_parameters: {
    properties: {
      announcements: {
        type: Schema.types.array,
        items: {
          type: AnnouncementCustomType,
        },
        description:
          "Array of objects that includes a channel ID and permalink for each announcement successfully sent",
      },
    },
    required: ["announcements"],
  },
});
// Finish implementing your function
export default SlackFunction(PrepareSendAnnouncementFunctionDefinition, async ({ inputs, client }) => {
// ...
```

If your custom type will be used in an array, create the array as a custom type too. For example, if we wanted an array of `AnnouncementCustomType`, it would look like this:
```javascript
// Define the custom type
import { DefineFunction, DefineType, Schema } from "deno-slack-sdk/mod.ts";

export const AnnouncementCustomType = DefineType({
  name: "Announcement",
  type: Schema.types.object,
  properties: {
    channel_id: {
      type: Schema.slack.types.channel_id,
    },
    success: {
      type: Schema.types.boolean,
    },
    permalink: {
      type: Schema.types.string,
    },
    error: {
      type: Schema.types.string,
    },
  },
  required: ["channel_id", "success"],
});

// Define the array with the items as the custom type
export const AnnouncementArray = DefineType({
  name: "AnnouncementArray",
  type: Schema.types.array,
  items: {
    type: AnnouncementCustomType
  },
})

```

:::info[Fully defined arrays]

If a property on your custom type is an array, be sure to define its properties in the `items` field (refer to example [here](/deno-slack-sdk/reference/slack-types#array)). Untyped objects are not currently supported.

:::


## Registering a type {#register-type}

To register newly-defined types for use with your app, add them to the `types` array when defining your [manifest](/deno-slack-sdk/guides/using-the-app-manifest). Here's an example, again from the [Deno Announcement Bot](https://github.com/slack-samples/deno-announcement-bot) sample app.

:::info

All custom types must be registered in the [manifest](/deno-slack-sdk/guides/using-the-app-manifest) for them to be available for use.

:::

```javascript
import { Manifest } from "deno-slack-sdk/mod.ts";
import AnnouncementDatastore from "./datastores/announcements.ts";
import DraftDatastore from "./datastores/drafts.ts";
import { AnnouncementCustomType } from "./functions/post_summary/types.ts";
import CreateAnnouncementWorkflow from "./workflows/create_announcement.ts";

export default Manifest({
  name: "Announcement Bot",
  description: "Send an announcement to one or more channels",
  icon: "assets/icon.png",
  outgoingDomains: ["cdn.skypack.dev"],
  datastores: [DraftDatastore, AnnouncementDatastore],
  types: [AnnouncementCustomType],
  workflows: [
    CreateAnnouncementWorkflow,
  ],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "chat:write.customize",
    "datastore:read",
    "datastore:write",
  ],
});

```

## Referencing a type {#reference-type}

To use a custom type as a [function](/deno-slack-sdk/guides/creating-slack-functions) parameter, import the type:

```javascript
import { DefineFunction, DefineType, Schema } from "deno-slack-sdk/mod.ts";
// ...
```

Then, set the parameter's `type` property to the custom type it should reference:

```javascript
// ...
input_parameters: {
  incident: {
    title: "A String Cheese Incident",
    type: IncidentType,
  },
},
// ...
```
In the example above, the `title` property from the custom type `IncidentType` is being overridden with the string "A String Cheese Incident".

Let's look at using custom types in a bit more depth with another one of our sample apps, the [Virtual Running Buddies](https://github.com/slack-samples/deno-virtual-running-buddies) app. Taking a look at [`/types/runner_stats.ts`](https://github.com/slack-samples/deno-virtual-running-buddies/blob/main/types/runner_stats.ts) you'll find the definition for `RunnerStatsType`:

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

Information about each runner is collected as a RunnerStatsType, which includes who the runner is (`user_id`), how far they ran each week (`weekly_distance`), and the total distance they've run so far (`total_distance`). This type is then used to describe the array output of the `CollectRunnerStatsFunction` which is called when the `DisplayLeaderBoardWorkflow` is started. Take a look at the `CollectRunnerStatsFunction` definition here to see how the custom type is returned as an output.

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

  // ... runners object is constructed

  // Return an array with runner stats
  return {
    outputs: { runner_stats: [...runners.entries()].map((r) => r[1]) },
  };
});
```

The `map` function you see here in the `outputs` is converting the entries in the `runners` map to an array, then mapping these entries to an array of `RunnerStatsType`. Another way of writing the map part of the function would be:

```javascript
function (r) {
  return r[1];
}
```

`r[1]` is the value in the `runners` array, whereas `r[0]` would be the key, so the map function is essentially mapping an array of small arrays. `RunnerStatsType` here is returned as the output of the function, and the function sets the properties of the custom type before returning it. Pretty cool, huh? To see a full tutorial on this sample app, head over to [Create a social app to log runs with running buddies](/deno-slack-sdk/tutorials/virtual-running-buddies-app).

## TypeScript-friendly type definitions {#define-property}

:::warning[Object types are not supported within Workflow Builder at this time]

If your function will be used within Workflow Builder, we suggest not using the Object types at this time.

:::

Use the `DefineProperty` helper function to get TypeScript-friendly type definitions for your input and output parameters. This is an optional helper utility that is highly recommended for TypeScript source code. While your code will still work without it, we recommend using `DefineProperty` when you have an object parameter with optional sub-properties so that your IDE autocomplete pop-ups will accurately respect the optional nature of properties. If all sub-properties are all required, you don’t need to use `DefineProperty`. Let's illustrate this with an example:

```javascript
const messageAlertFunction = DefineFunction({
   ...
   input_parameters: {
     properties: {
       msg_context: DefineProperty({
         type: Schema.types.object,
         properties: {
           message_ts: { type: Schema.types.string },
           channel_id: { type: Schema.types.string },
           user_id: { type: Schema.types.string },
         },
         required: ["message_ts"]
       })
     }
   },
 });
```
