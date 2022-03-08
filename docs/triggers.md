## Triggers

Triggers setup a connection between an event or action that takes place in Slack, and a [workflow][workflows] that should be run when that event or action occurs.

### Defining a Trigger

Triggers can be defined with the top level `DefineTrigger` export. Below is an example of setting up a Shortcut trigger to run a [workflow][workflows].

```ts
import { DefineTrigger, Schema, TriggerTypes } from "slack-cloud-sdk/mod.ts";
import { SimpleWorkflow } from "../workflows/simple_workflow.ts";

export const SimpleWorkflowRunner = DefineTrigger(
  "simple_workflow_runner",
  {
    type: TriggerTypes.Shortcut,
    name: "Simple Workflow Runner",
  }
).runs(SimpleWorkflow).withInputs((ctx) => ({
  channel_id: ctx.channel_id
}))
```

### Adding Triggers to Projects

Once you have defined a trigger, don't forget to include it in your [`Project`][project] definition!

    import { ReverseEchoShortcut } from "./triggers/reverse_echo_shortcut.ts";

    Project({
      name: "heuristic-tortoise",
      description:
        "A demo showing how to use Slack workflows, functions, and triggers",
      icon: "assets/icon.png",
      runtime: "deno1.x",
      botScopes: ["commands", "chat:write", "chat:write.public"],
      triggers: [ReverseEchoShortcut], // <-- don't forget this!
    });

### Trigger Types
The different trigger types constants can be referenced from a top level `TriggerTypes` export:

```ts
import { TriggerTypes } from "slack-cloud-sdk/mod.ts";
```

There are currently 2 main classes of triggers:

### Command Triggers
These are interactive triggers that are initiated by a user performing a command/action in Slack. They include the following types:


```ts
TriggerTypes.Shortcut
TriggerTypes.MessageShortcut
```


### Event Triggers
These are events that occur that are not necessarily tied to a specific interaction of a user, and may happen in the background. They are encompassed in a singled trigger type of:

```ts
TriggerTypes.Event
```

The single type of `TriggerTypes.Event` encompasses many different event types itself. These are identified by an additional `event_type` configuration on a Trigger. This list of supported `event_type`'s will grow over time, but the current list supported includes a few included in the Slack schema:

```ts
import { Schema } from "slack-cloud-sdk/mod.ts";

Schema.slack.events.ReactionAdded
Schema.slack.events.MessageMetadataPosted
```

### Mapping workflow inputs

Context from a trigger can be mapped into a [workflow][workflows]'s inputs. For example, if a [workflow][workflows] has an input of `user_id` that is of type `slack#/types/user_id`, a Shortcut trigger can map the user who ran the shortcut into that input. This is achieved via the `withInputs()` function on a trigger. It takes a callback as the argument, which has a `ctx` (context) argument that represents the trigger context available to be mapped into the [workflow][workflows] inputs, which differs depending on the trigger type. The callback is expected to return an key/value object that represents [workflow][workflows] input values, where the keys map to the [workflow][workflows] input names. Values can include static or variable references.

```ts
// assuming MyWorkflow has inputs of `name` and `user_id`
trigger.runs(MyWorkflow).withInputs((ctx) => ({
  name: "A static name",
  user_id: ctx.actor_id,
}))
```

#### Partial workflow input mapping
Command triggers have the ability to be configured with partial, or no [workflow][workflows] inputs mapped. Any missing inputs will be gathered at runtime by the user who runs the trigger. Because Event triggers are not guaranteed to be interactive, all of the required [workflow][workflows] inputs must be mapped as part of the trigger definition. This means your `withInputs` callback should return an object that has values for every required [workflow][workflows] input.


### Trigger availability
Trigger availability can be configured the following ways:

#### Command Triggers
Command triggers can be configured in one of two ways:

1. Avaiable to a specific channel:
```ts
// Available to everyone in the channel, identified by channel id
trigger.availableToChannel('C111111');

// Available to a specific set of users in a channel
trigger.availableToChannel('C111111', ['U123456', 'U345678'])
```

2. Available to entire workspace:
```ts
// This will default to only available to app collaborators across the workspace
trigger.availableToWorkspaceUsers();

// Available to specific users across a workspace.
trigger.availableToWorkspaceUsers(['U123456', 'U345678'])
```
Currently when making a command trigger available across the workspace, it must be limited to a subset of users. There is no way to make it available to everyone at the workspace level.

#### Event Triggers
Event triggers must be configured to be available in a specific channel:
```ts
trigger.availableToChannel('C111111');
```
There are no additional user filters to add to event triggers, as they operate only against a channel.

### Workspace configuration
As a [project][project] can be configured to deploy against multiple workspaces, you can set workspace-specific configuration via a `.workspace()` function. It takes a callback that receives a workspace-scoped trigger instance that you can make any needed changes to. For example, setting up an event trigger against two workspaces can be done as follows:

```ts
trigger
  .workspace('workspace-a', (triggerA) => {
    triggerA.availableToChannel('C123456');
  })
  .workspace('workspace-b', (triggerB) => {
    triggerB.availableToChannel('C567890');
  })
```

You can also take advantage of other trigger configuration options across these workspace scopes:

```ts
trigger
  // Disable this trigger by default
  .disable()
  // Enable it for workspace-a and setup the channel
  .workspace('workspace-a', triggerA => {
    triggerA
      .enable()
      .availableToChannel('C123456')
      // You can even adjust the input mappings at a workspace level
      .withInputs(ctx => ({...}))
  })
```

[workflows]: ./workflows.md
[project]: ./project.md
