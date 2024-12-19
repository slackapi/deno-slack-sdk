---
slug: /deno-slack-sdk/guides/creating-event-triggers
---

# Creating event triggers

<PaidPlanBanner />

>Invoke a workflow when a specific event happens in Slack

Event triggers are a type of *automatic* trigger, as they don't require manual activation. Instead, they're automatically invoked when a certain event happens.

## Supported events {#supported-events}

A certain number of events have corresponding event triggers.

Your app needs to have the proper scopes to use event triggers. Include these scopes within your app's [manifest](/deno-slack-sdk/guides/using-the-app-manifest). Your app also needs to be a member of any channel where you want to listen for events.

Events can be referenced in the form of `TriggerEventTypes.EVENTNAME`.

| Event. Reference with `TriggerEventTypes.EVENTNAME` | Description          | Required scopes        |
|------------------|----------------------|------------------------|
|`AppMentioned`| Subscribe to only the message events that mention your app or bot. | [`app_mentions:read`](https://api.slack.com/scopes/app_mentions:read) |
| `ChannelArchived`| A channel was archived. | [`channels:read`](https://api.slack.com/scopes/channels:read)     |
| `ChannelCreated`| A channel was created. | [`channels:read`](https://api.slack.com/scopes/channels:read)  |
| `ChannelDeleted`| A channel was deleted. | [`channels:read`](https://api.slack.com/scopes/channels:read)  |
| `ChannelRenamed`| A channel was renamed. | [`channels:read`](https://api.slack.com/scopes/channels:read)  |
| `ChannelShared` | A channel has been shared with an external workspace. | [`channels:read`](https://api.slack.com/scopes/channels:read) [`groups:read`](https://api.slack.com/scopes/groups:read) |
| `ChannelUnarchived`| A channel was unarchived. | [`channels:read`](https://api.slack.com/scopes/channels:read)  |
|`ChannelUnshared`| A channel has been unshared with an external workspace.      | [`channels:read`](https://api.slack.com/scopes/channels:read) [`groups:read`](https://api.slack.com/scopes/groups:read)  |
| `DndUpdated`| Do not Disturb settings changed for a member.  | [`dnd:read`](https://api.slack.com/scopes/dnd:read) |
| `EmojiChanged` | A custom emoji has been added or changed.  | [`emoji:read`](https://api.slack.com/scopes/emoji:read)      |
|`MessagePosted`| A message was sent to a channel. _A [filter](#filters) is required to listen for this event._ | [`channels:history`](https://api.slack.com/scopes/channels:history) [`groups:history`](https://api.slack.com/scopes/groups:history) [`im:read`](https://api.slack.com/scopes/im:history) [`mpim:read`](https://api.slack.com/scopes/mpim:history) |
| `MessageMetadataPosted` | Message metadata was posted.  | [`metadata.message:read`](https://api.slack.com/scopes/metadata.message:read) |
|`PinAdded`| A pin was added to a channel. | [`pins:read`](https://api.slack.com/scopes/pins:read)           |
| `PinRemoved`| A pin was removed from a channel.  | [`pins:read`](https://api.slack.com/scopes/pins:read)    |
| `ReactionAdded`| A member has added an emoji reaction.  | [`reactions:read`](https://api.slack.com/scopes/reactions:read)   |
| `ReactionRemoved`| A member removed an emoji reaction.  | [`reactions:read`](https://api.slack.com/scopes/reactions:read)       |
| `SharedChannelInviteAccepted`| A shared channel invite was accepted.    | [`conversations.connect:manage`](https://api.slack.com/scopes/conversations.connect:manage)      |
| `SharedChannelInviteApproved`| A shared channel invite was approved.  | [`conversations.connect:manage`](https://api.slack.com/scopes/conversations.connect:manage)    |
|  `SharedChannelInviteDeclined`| A shared channel invite was declined.  | [`conversations.connect:manage`](https://api.slack.com/scopes/conversations.connect:manage) |
| `SharedChannelInviteReceived`| A shared channel invite was sent to a Slack user.  | [`conversations.connect:read`](https://api.slack.com/scopes/conversations.connect:read) |
| `SharedChannelInviteRequested` | A shared channel invite was requested to be sent. | [`conversations.connect:manage`](https://api.slack.com/scopes/conversations.connect:manage) |
| `UserJoinedChannel`| A user joined a public or private channel. | [`channels:read`](https://api.slack.com/scopes/channels:read) [`groups:read`](https://api.slack.com/scopes/groups:read) |
| `UserJoinedTeam`| A new member has joined.  | [`users:read`](https://api.slack.com/scopes/users:read)         |
| `UserLeftChannel`| A user left a public or private channel.    | [`channels:read`](https://api.slack.com/scopes/channels:read) [`groups:read`](https://api.slack.com/scopes/groups:read)

### Events can activate multiple triggers {#multiple}

When an event happens, all event triggers listening for that event will be invoked at roughly the same time. If you want to control which workflow runs first, you have two options:

* Combine the functions of both workflows into a single workflow, invoked with a single event trigger.
* Have the second workflow be invoked by the first workflow, instead of the original event trigger.


### Avoid infinite loops {#loops}

Your app can respond to events *and* be the cause of events. This can create situations where your app gets stuck in a loop.

For example, if your app listens for all `message_posted` events in a channel and then posts its own message in response, it'll keep posting messages forever! That's why the `message_posted` event requires a filter.

Carefully construct a [filter](#filters) to prevent boundless behavior. If your app does get stuck in an infinite loop, you can [delete the trigger](/deno-slack-sdk/guides/managing-triggers#delete) and the behavior will cease.

## Create an event trigger {#create-trigger}

Triggers can be added to workflows in two ways:

* **You can add triggers with the CLI.** These static triggers are created only once. You create them with the Slack CLI, attach them to your app's workflow, and that's that. The trigger is defined within a trigger file.
* **You can add triggers at runtime.** These dynamic triggers are created at any step of a workflow so they can incorporate data acquired from other workflow steps. The trigger is defined within a function file.

<Tabs groupId="trigger-type">
  <TabItem value="cli" label="Create an event trigger with the CLI">

:::info[Slack CLI built-in documentation]

Use `slack trigger --help`  to easily access information on the `trigger` command's flags and subcommands.

:::

The triggers you create when running locally (with the `slack run` command) will not work when you deploy your app in production (with the `slack deploy` command). You'll need to `create` any triggers again with the CLI.

### Create the trigger file

To create an event trigger with the CLI, you'll need to create a trigger file. The trigger file contains the payload you used to define your trigger.

Create a TypeScript trigger file within your app's folder with the following form:

```js
import { Trigger } from "deno-slack-api/types.ts";
import { TriggerEventTypes, TriggerTypes, TriggerContextData } from "deno-slack-api/mod.ts";

const trigger: Trigger<typeof ExampleWorkflow.definition> = {
  // your TypeScript payload
};

export default trigger;
```

Your TypeScript payload consists of the [parameters](#parameters) needed for your own use case. The following is a trigger file with a payload creating an event trigger that listens for a `reaction_added` event in a specific channel:

```js
import { Trigger } from "deno-slack-api/types.ts";
import { TriggerEventTypes, TriggerTypes, TriggerContextData } from "deno-slack-api/mod.ts";

const trigger: Trigger<typeof ExampleWorkflow.definition> = {
  type: TriggerTypes.Event,
  name: "Reactji response",
  description: "responds to a specific reactji",
  workflow: "#/workflows/myWorkflow",
  event: {
    event_type: TriggerEventTypes.ReactionAdded,
    channel_ids: ["C123ABC456"],
    filter: {
      version: 1,
      root: {
        statement: "{{data.reaction}} == sunglasses"
      }
    }
  },
  inputs: {
    stringtoSend: {
      value: "how cool is that",
    },
    channel: {
      value: "C123ABC456",
    },
  },
};

export default trigger;
```

### Use the `trigger create` command

Once you have created a trigger file, use the following command to create the event trigger:

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

Create an event trigger at runtime using the `client.workflows.triggers.create` method within the relevant `function` file.

```js
const triggerResponse = await client.workflows.triggers.create<typeof ExampleWorkflow.definition>({
  // your TypeScript payload
});
```

Your TypeScript payload consists of the [parameters](#parameters) needed for your own use case. Below is a function file with an example TypeScript payload for an event trigger. This specific TypeScript payload is for creating an event trigger that listens for a `reaction_added` event in a specific channel:

```js
// functions/example_function.ts
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { ExampleWorkflow } from "../workflows/example_workflow.ts";
import { TriggerEventTypes, TriggerTypes } from "deno-slack-api/mod.ts";

export const ExampleFunctionDefinition = DefineFunction({
  callback_id: "example_function_def",
  title: "Example function",
  source_file: "functions/example_function.ts",
});

export default SlackFunction(
  ExampleFunctionDefinition,
  ({ inputs, client }) => {

  const triggerResponse = await client.workflows.triggers.create<typeof ExampleWorkflow.definition>({
    type: TriggerTypes.Event,
    name: "Reactji response",
    description: "responds to a specific reactji",
    workflow: `#/workflows/${ExampleWorkflow.definition.callback_id}`,
    event: {
      event_type: TriggerEventTypes.ReactionAdded,
      channel_ids: ["C123ABC456"],
      filter: {
        version: 1,
        root: {
          statement: "{{data.reaction}} == sunglasses"
        }
      }
    },
    inputs: {
      stringtoSend: {
        value: "how cool is that",
      },
      channel: {
        value: "C123ABC456",
      },
    }
  });

  // ...
```

  </TabItem>
</Tabs>

---

## Event trigger parameters {#parameters}

| Field         | Description        | Required? |
|---------------|---------------------------------------------|----|
| `name`        | The name of the trigger.                         | Required |
| `type`        | The type of trigger: `TriggerTypes.Event`. | Required
| `workflow`    | Path to workflow that the trigger initiates.     | Required |
| `description` | The description of the trigger.                   | Optional |
| `event`       | Contains [the `event` object](#event-object).            | Optional |
| `inputs`      | The inputs provided to the workflow. Can use with the [event response object](#response-object).   | Optional |

:::info

Event triggers are not interactive. Use a [link trigger](/deno-slack-sdk/guides/creating-link-triggers) to take advantage of interactivity.

:::

### The `Event` object {#event-object}

| Field         | Description                                 | Required? |
|---------------|---------------------------------------------|------------|
| `event_type`    | The type of event; use one of the properties of `TriggerEventTypes`.      | Required |
| `team_ids`      | An array of event-related team ID strings.   | Required for Enterprise Grid |
| `all_resources` | Trip the event trigger in all channels your app is present in. Defaults to `false`. Mutually exclusive with `channel_ids`. See [below](#scoping) for more details.  | Dependent on the [event](#channel-based-event-triggers) |
| `channel_ids`   | An array of channel IDs where the event trigger will trip. Mutually exclusive with `all_resources`. See [below](#scoping) for more details. | Dependent on the [event](#channel-based-event-triggers) |
| `filter`        | See [trigger filters](#filters) for more details.             | Optional |

#### Scoping channel-based event triggers {#scoping}

When writing a channel-based event trigger, you can pass the `channel_ids` field with a list of specific channels for the trigger to trip in. Example:

```javascript
event: {
  event_type: TriggerEventTypes.ReactionAdded,
  channel_ids: ["C123ABC456", "C01234567", "C09876543"],
}
```

Alternatively, you can set `all_resources` to `true` The `channel_ids` field will no longer be required, and the event will now trigger in all channels in the workspace the app is a part of. Example:

```javascript
event: {
  event_type: TriggerEventTypes.ReactionAdded,
  all_resources: true,
}
```

:::warning

Setting `all_resources` to `true` could cause additional charges, as the event will trip in all channels the app is a member of in the workspace and may therefore lead to many workflow executions in workspaces with a large number of channels.

:::

#### Channel-based event triggers {#channel-based-event-triggers}

The following channel-based event triggers require either the `channel_ids` or `all_resources` event object to be set:

* `app_mentioned`
* `call_rejected`
* `channel_history_changed`
* `channel_id_changed`
* `channel_shared`
* `channel_unshared`
* `member_left_channel`
* `message_metadata_posted`
* `pin_added`
* `pin_removed`
* `reaction_added`
* `reaction_removed`
* `user_joined_channel`

### The event response object {#response-object}

 An event's response object will contain additional information about that specific event instance.

| Property          | Description                      |
|-------------------|----------------------------------|
| `data`            | Contains additional information dependent on event type. See [below](#data).        |
| `enterprise_id`   | A unique identifier for the enterprise where this event occurred.                   |
| `event_id`        | A unique identifier for this specific event, globally unique across all workspaces. |
| `event_timestamp` | A Unix timestamp in seconds indicating when this event was dispatched.              |
| `team_id`         | A unique identifier for the workspace/team where this event occurred.               |
| `type`            | An identifier showing the `event` type                                              |

#### The `data` property {#data}

Each type of event has unique sub-properties within the `data` property. You can pass these values on to your workflows. See the example below.

##### Event types

<details>
<summary><code>app_mentioned</code></summary>

```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1643810217.088700,
  "type": "event",
  "data": {
    "app_id": "A1234ABC",
    "channel_id": "C0123ABC",
    "channel_name": "cool-channel",
    "channel_type": "public/private/im/mpim",
    "event_type": "slack#/events/app_mentioned",
    "message_ts": "164432432542.2353",
    "text": "<@U0LAN0Z89> is it everything a river should be?",
    "user_id:": "U0123ABC",
  }
}
```

</details>

<details>
<summary><code>channel_archived</code>*</summary>


```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1630623713,
  "type": "event",
  "data": {
    "channel_id": "C0123ABC",
    "channel_name": "cool-channel",
    "channel_type": "public/private/im/mpim",
    "event_type": "slack#/events/channel_archived",
    "user_id": "U0123ABC",
  }
}
```
</details>

<details>
<summary><code>channel_created</code>*</summary>

```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1630623713,
  "type": "event",
  "data": {
    "channel_id": "C0123ABC",
    "channel_name": "fun",
    "channel_type": "public",
    "created": 1360782804,
    "creator_id": "U0123ABC",
    "event_type": "slack#/events/channel_created",
  }
}
```
</details>

<details>
<summary><code>channel_deleted</code>*</summary>

```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1643810217.088700,
  "type": "event",
  "data": {
    "channel_id": "C0123ABC",
    "channel_name": "project_planning",
    "channel_type": "public/private/im/mpim",
    "event_type": "slack#/events/channel_deleted",
    "user_id": "U0123ABC",
  }
}
```
</details>

<details>
<summary><code>channel_renamed</code>*</summary>

```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1643810217.088700,
  "type": "event",
  "data": {
    "channel_id": "C0123ABC",
    "channel_name": "project_planning",
    "channel_type": "public/private/im/mpim",
    "event_type": "slack#/events/channel_renamed",
    "user_id": "U0123ABC",
  }
}
```

</details>

<details>
<summary><code>channel_shared</code></summary>


```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1643810217.088700,
  "type": "event",
  "data": {
    "channel_id": "C0123ABC",
    "channel_name": "cool-channel",
    "channel_type": "public/private/im/mpim",
    "connected_team_id": "E0123ABC",
    "event_type": "slack#/events/channel_shared",
  }
}
```

</details>

<details>
<summary><code>channel_unarchived</code>*</summary>


```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1643810217.088700,
  "type": "event",
  "data": {
    "channel_id": "C0123ABC",
    "channel_name": "cool-channel",
    "channel_type": "public/private/im/mpim",
    "event_type": "slack#/events/channel_unarchived",
    "user_id": "U0123ABC",
  }
}
```

</details>

<details>
<summary><code>channel_unshared</code></summary>


```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1643810217.088700,
  "type": "event",
  "data": {
    "channel_id": "C0123ABC",
    "channel_name": "cool-channel",
    "channel_type": "public/private/im/mpim",
    "disconnected_team_id": "E0123ABC",
    "event_type": "slack#/events/channel_unshared",
    "is_ext_shared": false,
  }
}
```

</details>

<details>
<summary><code>dnd_updated</code>*</summary>


```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1630623713,
  "type": "event",
  "data": {
    "dnd_status": {
      "dnd_enabled": true,
    },
    "event_type": "slack#/events/user_updated_dnd",
    "user_id": "U0123ABC",
  }
}
```
</details>

<details>
<summary><code>emoji_changed</code>*</summary>


##### Emoji added

```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1630623713,
  "type": "event",
  "data": {
    "event_type": "slack#/events/emoji_changed",
    "name": "picard_facepalm",
    "subtype": "add",
    "value": "https://my.slack.com/emoji/picard_facepalm/abc123.gif"
  }
}
```

##### Emoji removed

```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1630623713,
  "type": "event",
  "data": {
    "event_type": "slack#/events/emoji_changed",
    "names": ["picard_facepalm"],
    "subtype": "remove",
  }
}
```

##### Emoji renamed

```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1630623713,
  "type": "event",
  "data": {
    "event_type": "slack#/events/emoji_changed",
    "new_name": "captain_picard_facepalm",
    "old_name": "picard_facepalm",
    "subtype": "rename",
    "value": "https://my.slack.com/emoji/picard_facepalm/abc123.gif"
  }
}
```

</details>

<details>
<summary><code>user_joined_channel</code></summary>


```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1630623713,
  "type": "event",
  "data": {
    "channel_id": "C0123ABC",
    "channel_type" : "public/private/im/mpim",
    "event_type": "slack#/events/user_joined_channel",
    "inviter_id": "U0123ABC",
    "user_id": "U0123ABC",
  }
}
```

</details>

<details>
<summary><code>user_left_channel</code></summary>



```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1630623713,
  "type": "event",
  "data": {
    "channel_id": "C0123ABC",
    "channel_type" : "public/private/im/mpim",
    "event_type": "slack#/events/user_left_channel",
    "user_id": "W0123ABC",
  }
}
```

</details>

<details>
<summary><code>message_posted</code></summary>


```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1630623713,
  "type": "event",
  "data": {
    "channel_id": "C0123ABC",
    "channel_type": "public/private/im/mpim",
    "event_type": "slack#/events/message_posted",
    "message_ts": "1355517523.000005",
    "text": "Hello world",
    "thread_ts": "1355517523.000006", // Nullable
    "user_id": "U0123ABC",
  }
}
```

</details>

<details>
<summary><code>message_metadata_posted</code></summary>


```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1630623713,
  "type": "event",
  "data": {
    "app_id": "A0123ABC",
    "channel_id": "C0123ABC",
    "event_type": "slack#/events/message_metadata_posted",
    "message_ts": "1630708981.000001",
    "metadata": {
      "event_type": "incident_created",
      "event_payload": {
        "incident": {
          "id": 123,
          "summary": "Someone tripped over",
          "sev": 1
        }
      }
    },
    "user_id": "U0123ABC",
  }
}
```

</details>

<details>
<summary><code>pin_added</code></summary>


```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1643810217.088700,
  "type": "event",
  "data": {
    "channel_id": "C0123ABC",
    "channel_type": "public/private/im/mpim",
    "channel_name": "project_planning",
    "event_type": "slack#/events/pin_added",
    "message_ts": "1360782804.083113",
    "user_id": "U0123ABC",
  }
}
```

</details>

<details>
<summary><code>pin_removed</code></summary>



```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1643810217.088700,
  "type": "event",
  "data": {
    "channel_id": "C0123ABC",
    "channel_name": "project_planning",
    "channel_type": "public/private/im/mpim",
    "event_type": "slack#/events/pin_removed",
    "message_ts": "1360782804.083113",
    "user_id": "U0123ABC",
  }
}
```

</details>

<details>
<summary><code>reaction_added</code></summary>


```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1630623713,
  "type": "event",
  "data": {
    "channel_id": "C0123ABC",
    "event_type": "slack#/events/reaction_added",
    "message_context": {
      "message_ts": "1535430114.000100",
      "channel_id": "C0123ABC",
    },
    "message_ts": "1535430114.000100",
    "message_link": "https:\/\/example.slack.com\/archives\/C0123ABC\/p1535430114000100",
    "reaction": "joy",
    "user_id": "U0123ABC",
    "item_user": "U0123ABC",
    "parent_message_link": "https:\/\/example.slack.com\/archives\/C0123ABC\/p1535430114000100",
  }
}
```

</details>

<details>
<summary><code>reaction_removed</code></summary>


```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 12345,
  "type": "event",
  "data": {
    "channel_id": "C0123ABC",
    "event_type": "slack#/events/reaction_removed",
    "message_ts": "1535430114.000100",
    "reaction": "thumbsup",
    "user_id": "U0123ABC",
  }
}
```

</details>

<details>
<summary><code>shared_channel_invite_accepted</code>*</summary>


```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1643810217.088700,
  "type": "event",
  "data": {
    "accepting_user": {
      "display_name": "John Doe",
      "id": "U123",
      "is_bot": false,
      "name": "John Doe",
      "real_name": "John Doe",
      "team_id": "T123",
      "timezone": "America/Los_Angeles",
    },
    "approval_required": false,
    "channel_id": "C12345678",
    "channel_name": "test-slack-connect",
    "channel_type": "public/private/im/mpim",
    "event_type": "slack#/events/shared_channel_invite_accepted",
    "invite": {
      "date_created": 1626876000,
      "date_invalid": 1628085600,
      "id": "I0ABC123",
      "inviting_team": {
        "date_created": 1480946400,
        "domain": "corgis",
        "icon": {...},
        "id": "T12345678",
        "is_verified": false,
        "name": "Corgis",
      },
      "inviting_user": {
        "display_name": "John Doe",
        "id": "U123",
        "is_bot": false,
        "name": "John Doe",
        "real_name": "John Doe",
        "team_id": "T123",
        "timezone": "America/Los_Angeles",
      },
      "recipient_email": "golden@doodle.com",
      "recipient_user_id": "U87654321",
    },
    "teams_in_channel": [
      {
        "date_created": 1626789600,
        "domain": "corgis",
        "icon": {...},
        "id": "T12345678",
        "is_verified": false,
        "name": "Corgis",
      }
    ],
  }
}
```

</details>

<details>
<summary><code>shared_channel_invite_approved</code>*</summary>


```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1643810217.0887,
  "type": "event",
  "data": {
    "approving_team_id": "T87654321",
    "approving_user": {
      "display_name": "John Doe",
      "id": "U123",
      "is_bot": false,
      "team_id": "T123",
      "name": "John Doe",
      "real_name": "John Doe",
      "team_id": "T12345",
      "timezone": "America/Los_Angeles",
    },
    "channel_id": "C12345678",
    "channel_name": "test-slack-connect",
    "channel_type": "public/private/im/mpim",
    "event_type": "slack#/events/shared_channel_invite_approved",
    "invite": {
      "date_created": 1626876000,
      "date_invalid": 1628085600,
      "id": "I0123ABC",
      "inviting_team": {
        "date_created": 1480946400,
        "domain": "corgis",
        "icon": {...},
        "id": "T12345678",
        "is_verified": false,
        "name": "Corgis",
      },
      "inviting_user": {
        "display_name": "John Doe",
        "id": "U123",
        "is_bot": false,
        "name": "John Doe",
        "real_name": "John Doe",
        "team_id": "T123",
        "timezone": "America/Los_Angeles",
      },
      "recipient_email": "golden@doodle.com",
      "recipient_user_id": "U87654321"
    },
    "teams_in_channel": [
      {
        "date_created": 1626789600,
        "domain": "corgis",
        "icon": {...},
        "id": "T12345678",
        "is_verified": false,
        "name": "Corgis",
      }
    ],
  }
}
```

</details>

<details>
<summary><code>shared_channel_invite_declined</code>*</summary>


```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1643810217.0887,
  "type": "event",
  "data": {
    "channel_id": "C12345678",
    "channel_type": "public/private/im/mpim",
    "channel_name": "test-slack-connect",
    "declining_team_id": "T87654321",
    "declining_user": {
      "display_name": "John Doe",
      "id": "U123",
      "is_bot": false,
      "name": "John Doe",
      "real_name": "John Doe",
      "team_id": "T123",
      "timezone": "America/Los_Angeles",
    },
    "event_type": "slack#/events/shared_channel_invite_declined",
    "invite": {
      "date_created": 1626876000,
      "date_invalid": 1628085600,
      "id": "I0123ABC",
      "inviting_team": {
        "date_created": 1480946400,
        "domain": "corgis",
        "icon": {...},
        "id": "T12345678",
        "is_verified": false,
        "name": "Corgis",
      },
      "inviting_user": {
        "display_name": "John Doe",
        "id": "U123",
        "is_bot": false,
        "name": "John Doe",
        "real_name": "John Doe",
        "team_id": "T123",
        "timezone": "America/Los_Angeles",
      },
      "recipient_email": "golden@doodle.com",
      "recipient_user_id": "U3472391",
    },
    "teams_in_channel": [
      {
        "date_created": 1626789600,
        "domain": "corgis",
        "icon": {...},
        "id": "T12345678",
        "is_verified": false,
        "name": "Corgis",
      }
    ],
  }
}
```

</details>

<details>
<summary><code>shared_channel_invite_received</code>*</summary>


```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1643810217.0887,
  "type": "event",
  "data": {
    "channel_id": "C12345678",
    "channel_name": "test-slack-connect",
    "channel_type": "public/private/im/mpim",
    "event_type": "slack#/events/shared_channel_invite_received",
    "invite": {
      "date_created": 1626876000,
      "date_invalid": 1628085600,
      "id": "I0123ABC",
      "inviting_team": {
        "date_created": 1480946400,
        "domain": "corgis",
        "icon": {...},
        "id": "T12345678",
        "is_verified": false,
        "name": "Corgis",
      },
      "inviting_user": {
        "display_name": "John Doe",
        "id": "U123",
        "is_bot": false,
        "name": "John Doe",
        "real_name": "John Doe",
        "team_id": "T123",
        "timezone": "America/Los_Angeles",
      },
      "recipient_email": "golden@doodle.com",
      "recipient_user_id": "U87654321"
    },

  }
}
```

</details>

<details>
<summary><code>user_joined_team</code>*</summary>


```json
{
  "team_id": "T0123ABC",
  "enterprise_id": "E0123ABC",
  "event_id": "Ev0123ABC",
  "event_timestamp": 1630623713,
  "type": "event",
  "data": {
    "event_type": "slack#/events/user_joined_team",
    "user": {
      "display_name": "John Doe",
      "id": "U123",
      "is_bot": false,
      "name": "John Doe",
      "real_name": "John Doe",
      "team_id": "T123",
      "timezone": "America/Los_Angeles",
    }
  }
}
```

</details>

\*When developing with these event types on Enterprise Grid, you must include the `team_ids` field when creating workspace-based event triggers.

The data returned in the event response object can be passed along to workflows. In this example, we take the `user_id`, `channel_id`, and `message_ts` from the `reaction_added` event's response object and pass them along to the `joy_workflow` in the `inputs` field, referencing them by their respective enums.

```javascript
{
  type: TriggerTypes.Event,
  name: "Joy reactji event trigger",
  description: "Joy reactji trigger",
  workflow: "#/workflows/joy_workflow",
  inputs: {
    user: {
      value: TriggerContextData.Event.ReactionAdded.user_id, // Pulled from event response body and passed into the workflow
    },
    channel: {
      value: TriggerContextData.Event.ReactionAdded.channel_id, // Pulled from event response body and passed into the workflow
    },
    message_ts: {
      value: TriggerContextData.Event.ReactionAdded.message_ts // Pulled from event response body and passed into the workflow
    }
  },
  event: {
    event_type: TriggerEventTypes.ReactionAdded,
    channel_ids: ["C123ABC456"]
  }
}
```

## Event trigger filters {#filters}

Trigger filters allow you to define a set of conditions for a trigger which must be true in order for the trigger to activate.

Filters can also prevent your app from getting stuck in an infinite loop of responses triggered by responding to events it created.

Trigger filters are implemented by inserting a filter payload within your `trigger` object. The payload takes the form of an object containing blocks of conditional logic. The logical condition within each block can be one of two types:

* Conditional expressions (e.g. `x < y`)
* Boolean logic (e.g. `x AND y`)

### Conditional expressions {#conditional-filters}
Conditional expression blocks need a single `statement` key with a string containing the comparison block. Values from the `inputs` payload can be referenced within the comparison block.

Below is an example payload of a `reaction_added` event trigger that only invokes a workflow if the reaction was the `:eyes:` reaction.

```js
{
  type: TriggerTypes.Event,
  name: "Reactji response",
  description: "responds to a specific reactji",
  workflow: "#/workflows/myWorkflow",
  event: {
    event_type: TriggerEventTypes.ReactionAdded,
    channel_ids: ["C123ABC456"],
    filter: {
      version: 1,
      root: {
        statement: "{{data.reaction}} == eyes"
      }
    }
  },
  inputs: {
    stringtoSend: {
      value: "how cool is that",
    },
    channel: {
      value: "C123ABC456",
    },
  },
};
```

The supported operand types are `integer`, `double`, `boolean`, `string`, and `null`. The following comparators are supported.

| Comparator | Supported types |
| ---------- | -------------- |
| `==`| all types |
| `>` | `int`, `double` |
| `<` | `int`, `double` |
| `>=`| `int`, `double` |
| `<=`| `int`, `double` |
| `CONTAINS` | string; i.e. ``` {{data.text}} CONTAINS 'hello' ``` |

### Boolean logic blocks {#boolean-filters}
Boolean logic blocks are made up of two key:value pairs:

* An `operator` key with a string containing the comparison operator: `AND`, `OR`, or `NOT`
* An `inputs` key with the child blocks

The child blocks then contain additional logic. The following example filters on the `reaction` value:

```ts
{
  type: TriggerTypes.Event,
  name: "Reactji response",
  description: "responds to a specific reactji",
  workflow: "#/workflows/myWorkflow",
  event: {
    event_type: TriggerEventTypes.ReactionAdded,
    channel_ids: ["C123ABC456"],
    filter: {
      version: 1,
      root: {
        operator: "OR",
        inputs: [{
          statement: "{{data.reaction}} == sunglasses"
        },
        {
          statement: "{{data.reaction}} == smile"
        }],
      }
    }
  },
  inputs: {
    stringtoSend: {
      value: "how cool is that",
    },
    channel: {
      value: "C123ABC456",
    },
  },
};
```

:::info[Nested logic blocks]

You can use the same boolean logic to create nested boolean logic blocks. It's boolean logic all the way down - up to a maximum of 5 nested blocks, that is. The `NOT` operator, however, must contain only one input. Also, at the moment the boolean logic block does _not_ support [short-circuit evaluation](https://en.wikipedia.org/wiki/Short-circuit_evaluation), so all arguments will be evaluated.

:::

### Trigger filters in sample apps

✨ [The Simple Survey App](https://github.com/slack-samples/deno-simple-survey) lets users collect feedback on specific messages. The process begins when a user reacts to a message with the `:clipboard:` reaction. This is done with a `reaction_added` event trigger filtering for the `:clipboard:` reaction.

✨ [The Daily Topic App](https://github.com/slack-samples/deno-daily-channel-topic) can reply to messages in a channel. The `message_posted` event filters out both messages by apps (to prevent recursive replies) and messages within a thread (to reply only once per thread).

## Event trigger response {#response}

The response will have a property called `ok`. If `true`, then the trigger was created, and the `trigger` property will be populated.

Your response will include a `trigger.id`; be sure to store it! You use that to `update` or `delete` the trigger if need be. See [trigger management](/deno-slack-sdk/guides/managing-triggers).

## Onward

➡️ With your trigger created, you can now test your app by [running your app locally](/deno-slack-sdk/guides/developing-locally).

✨ Once your app is active, see [trigger management](/deno-slack-sdk/guides/managing-triggers) for info on managing your triggers in your workspace.
