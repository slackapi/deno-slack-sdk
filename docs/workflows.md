## Workflows

While [Functions][functions] define small units of logic your application will execute, you might want to sequence multiple
functions together, feeding the output of one function into the input of another function. Combining various functions in
this way is achieved using Workflows!

A common Workflow most apps typically want to use is to run a custom function within the app and then call the [built-in Slack function][builtin-functions] to post a message to a channel.

### Defining a Workflow

Workflows can be defined with the top level `DefineWorkflow` export. Below is an example workflow that reverses a `stringToReverse` input parameter and then posts it to the channel by combining a custom string-reversing function with a [Slack built-in fuction][builtin-functions] that posts a message to a channel:

```ts
import { DefineWorkflow, Schema } from "slack-cloud-sdk/mod.ts";
import { ReverseString } from "../functions/reverse.ts";

export const ReverseEchoString = DefineWorkflow("reverse_echo", {
  title: "Reverse, echo",
  description: "Reverses a string, echos it out",
  input_parameters: {
    stringToReverse: {
      type: Schema.types.string,
      description: "The string to reverse",
    },
    channel: {
      type: Schema.slack.types.channel_id,
      description: "Channel to echo the reversed string",
    },
  },
});

const reverseStep = ReverseEchoString.addStep(ReverseString, {
  stringToReverse: ReverseEchoString.inputs.stringToReverse,
});

ReverseEchoString.addStep(Schema.slack.functions.SendMessage, {
  channel_id: ReverseEchoString.inputs.channel,
  message: `Your string in reverse is *${reverseStep.outputs.reverseString}*`,
});

```

Let's go over the two arguments to `DefineWorkflow`.

#### Workflow ID

The first argument is the `id` of the workflow, a unique string identifier representing the workflow (`"reverse_echo"` in the above example). It must be unique in your application; no other [functions][functions] or workflows may use the same identifier.

#### Workflow Definition

The second argument is the `definition` of the workflow, an object with a few properties that help to describe and define the workflow in more detail.

The definition object uses the exact same structure as a [Function's `definition` argument][function-defn].

### Adding Workflows to Projects

Once you have defined a workflow, don't forget to include it in your [`Project`][project] definition!

    import { ReverseEchoString } from "./workflows/reverse_echo.ts";

    Project({
      name: "heuristic-tortoise",
      description:
        "A demo showing how to use Slack workflows and functions",
      icon: "assets/icon.png",
      runtime: "deno1.x",
      botScopes: ["commands", "chat:write", "chat:write.public"],
      workflows: [ReverseEchoString], // <-- don't forget this!
    });

### Adding Functions to Workflows

Now that you have a workflow defined, we need to do one more thing: wire up some [Functions][functions] to it! This is done using the `addStep` method, and there are two important things to note with this method:

1. `addStep` returns a kind of wrapper around your [function][functions] (internally this is called a [`WorkflowStepDefinition`][workflow-step-defn]) which you can reference later on (the `reverseStep` variable in the above example), and
2. This function wrapper conveniently gives you access to any output parameters you have defined for your function, which is imperative when using the output of one function as the input to another. This is exhibited in the above example, where we use the output of the `ReverseString` function as the input to the [built-in Slack message function][builtin-functions].

Let's take a closer look at the parameters `addStep` accepts.

#### `addStep` Parameters

`addStep` takes two parameters: a reference to the [function][functions] and one or more inputs, structured as a plain object, that should be fed into the function.

The first parameter, the function reference, is the imported [function][functions], either a custom implementation or a [built-in Slack function][builtin-functions].

The second parameter is an object mapping any inputs to the [function][functions]. The keys of this object should match the names of the [function definition's input parameter names][function-defn]. The values can be any value you wish, though typically when sequencing functions together, you want to use the values of either the workflow's inputs, or the previous function's outputs. You can use the `inputs` property on your original [Workflow definition](#workflow-definition) to get a reference to the Workflow inputs (just like the first use of `addStep` in the above example). You can also use the `outputs` property of any functions wrapped with `addStep` (just like the second use of `addStep` in the above example).

[functions]: ./functions.md
[project]: ./project.md
[builtin-functions]: ./functions.md#built-in-functions
[function-defn]: ./functions.md#function-definition
[workflow-step-defn]: ../src/workflows.ts#L112
