---
slug: /deno-slack-sdk/guides/creating-workflows
---

# Creating workflows

<PaidPlanBanner />

Workflows are the combination of functions, executed in order. Remember:

1. Both [Slack functions](/deno-slack-sdk/guides/creating-slack-functions) and [custom functions](/deno-slack-sdk/guides/creating-custom-functions) define the actions of your app.
2. Workflows are a combination of functions, executed in order. (⬅️ you are here)
3. Triggers execute workflows.

Depending on your use case, you'll want to acquaint yourself with either [Slack functions](/deno-slack-sdk/guides/creating-slack-functions), [custom functions](/deno-slack-sdk/guides/creating-custom-functions), or both. Then continue here to learn how to implement them in a workflow. 

We'll walk through defining a workflow, adding input and output parameters, adding both a Slack function and a custom function to the workflow, and declaring the workflow in your manifest.

## Defining workflows {#defining-workflows}

Workflows are defined in their own files within your app's `/workflows` directory and declared in your app's [manifest](/deno-slack-sdk/guides/using-the-app-manifest). Listing workflows in your manifest tells the CLI that they are implemented in your app &mdash; more on that later.

Before defining your workflow, import [`DefineWorkflow`](https://github.com/slackapi/deno-slack-sdk/blob/main/src/workflows/mod.ts) at the top of your workflow file:

```javascript
// say_hello_workflow.ts
import { DefineWorkflow } from "deno-slack-sdk/mod.ts";
```

Then, create a **workflow definition**. This is where you set, at a minimum, the workflow's title and its unique callback ID:

```javascript
// say_hello_workflow.ts
export const SayHelloWorkflow = DefineWorkflow({
  callback_id: "say_hello_workflow",
  title: "Say Hello",
});
```

| Definition properties     | Description | Required? |
| ------------------| ---------- | ------ |
| `callback_id`      | A unique string that identifies this particular component of your app. | Required |
| `title`            | The display name of the workflow that shows up in slugs, unfurl cards, and certain end-user modals. | Required |
| `description`      | A string description of this workflow. | Optional |
| `input_parameters` | See [Defining input parameters](#defining-input-parameters). | Optional |

In the next section, we'll look at `input_parameters` in more detail.
## Defining input parameters {#defining-input-parameters}

Workflows can pass information into both functions and other workflows that are part of its workflow steps. To do this, we define what information we want to bring in to the workflow via its `input_parameters` property. 

A workflow's `input_parameters` property has two sub-properties: 
* `required`, which is how you can ensure that a workflow only executes if specific input parameters are provided.
* `properties`, where you can list the specific parameters that your workflow accounts for. Any [built-in type](/deno-slack-sdk/reference/slack-types) or [custom type](/deno-slack-sdk/guides/creating-a-custom-type) can be used.

Input parameters are listed in the `properties` sub-property. Each input parameter must include a `type` and a `description`, and can optionally include a `default` value.

```javascript
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

// Workflow definition
export const SomeWorkflow = DefineWorkflow({
  callback_id: "some_workflow",
  title: "Some Workflow",
  input_parameters: {
    required: [],
    properties: {
      exampleString: {
        type: Schema.types.string,
        description: "Here's an example string.",
      },
      exampleBoolean: {
        type: Schema.types.boolean,
        description: "An example boolean.",
        default: true,
      },
      exampleInteger: {
        type: Schema.types.integer,
        description: "An example integer.",
      },
      exampleChannelId: {
        type: Schema.slack.types.channel_id,
        description: "Example channel ID.",
      },
      exampleUserId: {
        type: Schema.slack.types.user_id,
        description: "Example user ID.",
      },
      exampleUsergroupId: {
        type: Schema.slack.types.usergroup_id,
        description: "Example usergroup ID.",
      },
    },
  },
});
```

Denote which properties are required by listing their names as strings in the `required` property of `input_parameters`. For example, here's how we can indicate that a parameter named `exampleUserId` is required:

```javascript
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

// Workflow definition
export const SomeWorkflow = DefineWorkflow({
  callback_id: "some_workflow",
  title: "Some Workflow",
  input_parameters: {
    required: ["exampleUserId"],
    properties: {
      exampleUserId: {
        type: Schema.slack.types.user_id,
        description: "Example user ID.",
      },
    },
  },
});
```

If a workflow is invoked and the required input parameters are not provided, the workflow will not execute.

An important distinction: `input_parameters` are used when _defining_ a workflow, whereas _retrieving_ values will use `inputs`. `inputs` is also used when implementing the logic of a custom function.

Once you've defined your workflow, you can then add functionality by calling Slack functions and custom functions. This is done with the `addStep` method, which takes two arguments: 

* the function you want to call
* the inputs (if any) you want to pass to that function.

We'll see examples of how to call both types of functions in the following section.

---

## Adding functions to workflows {#adding-functions}

### Import Schema reference {#import-schema}

The first step to adding a function to a workflow is to import `Schema` from the Slack SDK.

```javascript
// /workflows/greeting_workflow.ts

import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
```

### Call a function with `addStep` {#call-function}

#### Slack functions{#workflow-slack-functions}

> [Slack functions](/deno-slack-sdk/guides/creating-slack-functions) are essentially Slack-native actions, like creating a channel or sending a message. 

To use a Slack function, like [`SendMessage`](/deno-slack-sdk/reference/slack-functions/send_message), let's look at an example from the [Deno Hello World](https://github.com/slack-samples/deno-hello-world) sample app.

After defining the workflow, call the Slack function with your workflow's `addStep` method:

```javascript
const GreetingWorkflow = DefineWorkflow({
  callback_id: "greeting_workflow",
  title: "Send a greeting",
  description: "Send a greeting to channel",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity"],
  },
});

const inputForm = GreetingWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Send a greeting",
    interactivity: GreetingWorkflow.inputs.interactivity,
    submit_label: "Send greeting",
    fields: {
      elements: [{
        name: "recipient",
        title: "Recipient",
        type: Schema.slack.types.user_id,
      }, {
        name: "channel",
        title: "Channel to send message to",
        type: Schema.slack.types.channel_id,
        default: GreetingWorkflow.inputs.channel,
      }, {
        name: "message",
        title: "Message to recipient",
        type: Schema.types.string,
        long: true,
      }],
      required: ["recipient", "channel", "message"],
    },
  },
);

//...call GreetingFunctionDefinition in greetingFunctionStep

// Example: taking the string output from the greetingFunctionStep function and passing it to SendMessage
GreetingWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: inputForm.outputs.fields.channel,
  message: greetingFunctionStep.outputs.greeting,
});
```

##### Using OpenForm in a workflow {#using-forms}

The only Slack function that has an additional requirement is [`OpenForm`](/deno-slack-sdk/reference/slack-functions/open_form). When creating a workflow that will have a step to open a form, your workflow needs to:

* include the `interactivity` input parameter
* have the call to `OpenForm` be its **first** step _or_ ensure the preceding step is interactive. An interactive step will generate a fresh pointer to use for opening the form; for example, use the interactive button that can be added with the [`SendMessage`](/deno-slack-sdk/reference/slack-functions/send_message) Slack function immediately before opening the form. 

Here's an example of a basic workflow definition using `interactivity`:

```javascript
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

export const SayHelloWorkflow = DefineWorkflow({
  callback_id: "say_hello_workflow",
  title: "Say Hello to a user",
  input_parameters: {
    properties: { interactivity: { type: Schema.slack.types.interactivity } },
    required: ["interactivity"],
  },
});
```

✨ Visit the [forms](/deno-slack-sdk/guides/creating-a-form) section for more details and code examples of using `OpenForm` in your app. 

#### Custom functions{#workflow-custom-functions}

>[Custom functions](/deno-slack-sdk/guides/creating-custom-functions) are reusuable building blocks of automation of your own design. 

To use a [custom function](/deno-slack-sdk/guides/creating-custom-functions) that you have already defined:

1. Import the function in your manifest, where you define the workflow:

```javascript
import { SomeFunction } from "../functions/some_function.ts";
```

2. Call your function, storing its output in a variable. Here you may also pass input parameters from the workflow into the function itself:

```javascript
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { SomeFunction } from "../functions/some_function.ts";

export const SomeWorkflow = DefineWorkflow({
  callback_id: "some_workflow",
  title: "Some Workflow",
  input_parameters: {
    properties: {
      someString: {
        type: Schema.types.string,
        description: "Some string",
      },
      channelId: {
        type: Schema.slack.types.channel_id,
        description: "Target channel",
        default: "C1234567",
      },
    },
    required: [],
  },
});

const myFunctionResult = SomeWorkflow.addStep(SomeFunction, {
  // ... Pass along workflow inputs via SomeWorkflow.inputs
  // ... For example, SomeWorkflow.inputs.someString
});
```

3. Use your function in follow-on steps. For example:

```javascript
// Example: taking the string output from a function and passing it to SendMessage
SomeWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: SomeWorkflow.inputs.channelId,
  message: SomeFunction.outputs.exampleOutput, // This comes from your function definition
});
```

Once you've added all steps and functions to your workflow, there's one final stop to having a fully functioning workflow &mdash; adding it to the [app manifest](/deno-slack-sdk/guides/using-the-app-manifest).

---
## Adding the workflow to the manifest {#add-workflow}

The final step of using a workflow is adding it to your [manifest](/deno-slack-sdk/guides/using-the-app-manifest). Declare your workflow in your app's manifest definition of your manifest file like this:

```javascript
// manifest.ts
import { Manifest } from "deno-slack-sdk/mod.ts";
import { SayHelloWorkflow } from "./workflows/say_hello_workflow.ts";

export default Manifest({
  name: "sayhello",
  description: "A deno app with an example workflow",
  icon: "assets/icon.png",
  workflows: [SayHelloWorkflow], // Add your workflow here
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
```

:::info

The workflows guest or external users can run is based on whether those workflows run functions that are defined with certain scopes. Refer to [guests and external users](/deno-slack-sdk/guides/controlling-access-to-custom-functions#guests-external) for more details.

:::

---
## Onward


➡️ **To keep building your app**, head to the [triggers](/deno-slack-sdk/guides/using-triggers) section to learn how to create a trigger that invokes a defined workflow.  

You can also learn about [creating a datastore](/deno-slack-sdk/guides/using-datastores) to store and retrieve information, or building [custom types](/deno-slack-sdk/guides/creating-a-custom-type) for your data.