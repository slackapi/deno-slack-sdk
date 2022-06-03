## Workflows

Workflows can be defined and included in your [manifest][manifest]. A workflow itself has several pieces of metadata, such as a unique `callback_id`, a `title` and a `description`. It can also include `input_parameters` just like a [function][function]. Key to a workflow is a series of steps, each of which are a function that can be passed dynamic data to their inputs through referencing workflow inputs, or outputs from previous steps. Let's take a look at an example.

```ts
import { DefineWorkflow, Manifest, Schema } from "slack-cloud-sdk/mod.ts";

const workflow = DefineWorkflow({
  callback_id: "my_workflow",
  title: "My Workflow",
  description: "A sample workflow",
  input_parameters: {
    properties: {
      a_string: {
        type: Schema.types.string,
      },
      a_channel: {
        type: Schema.slack.types.channel_id,
      }
    },
    required: ["a_string", "a_channel"],
  },
});

// register your workflow in your manifest
export default Manifest({
  ...,
  workflows: [
    workflow,
  ]
});
```

A workflow by itself isn't of much use, and isn't valid, until you add some steps. Let's use the `DinoFunction` we've defined over in the [functions][function] example as one of our steps. The `DinoFunction` has a single `input_parameter` of `name` that we'll need to pass it. We'll use our `a_string` workflow `input_parameter` as the value for this, but you could just as easily pass a hard-coded value to any step input parameter as well.

```ts
import { DinoFunction, DefineWorkflow } from '../functions/dino.ts';

const workflow = DefineWorkflow({...});

const step1 = workflow.addStep(DinoFunction, {
  name: workflow.inputs.a_string,
});
```

Great, we've got a single step workflow that takes a string, and turns it into a dinosaur name via our `DinoFunction`. It would be nice to see what that looks like, so lets add another step that sends that value as a message somewhere. For this, we can use one of Slack's built-in functions. Notice how we can also use our reference to `step1` to access an output called `dinoname` that the `DinoFunction` produces.

```ts
const step1 = workflow.addStep(...);

workflow.addStep("slack#/functions/send_message", {
  channel: workflow.inputs.a_channel,
  message: `A dinosaur name: ${step1.outputs.dinoname}`,
});
```

You'll notice the first parameter to `addStep()` here is a string, instead of something like our `DinoFunction`. This is because we're referencing a step produced outside of our app, in this case by `slack`. We're using the string reference of `"slack#/functions/send_message"` to identify the function we're adding as a step. In fact, you can do the same thing with your own functions by creating what's called a local reference string to your own app's function. This uses your `callback_id`, and would like like `"#/functions/my_workflow"`. If we added our function as a step that way, it would look like this:

```ts
const step1 = workflow.addStep("#/functions/my_workflow", {
  name: workflow.inputs.a_string,
});
```

The big difference here is you won't get some of the automatic typic of `inputs` and `outputs` for that step in this case, but you can still reference them as long as you follow the definition of that function.

### Auto-Registration of Workflow dependencies

When a workflow is registered on your `Manifest()` any `functions` it uses as steps, or custom `types` used as input_parameters to the workflow or functions it references are automatically registered in your manifest. This can save you from having to register each function or type that a workflow might use, and just register the workflow.

[manifest]: ./manifest.md
[function]: ./functions.md