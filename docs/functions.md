## Functions

Functions are the core of your Slack app: they accept one or more input parameters, execute some logic and return one or more output parameters. Your application's [Workflow][workflows] combines one or more Functions together, binding the output of one Function to the input of another.

### Defining a Function

Functions can be defined with the top level `DefineFunction` export. Below is an example function that turns a `name` input parameter into a dinosaur name:

```ts
import { DefineFunction, Schema } from "slack-cloud-sdk/mod.ts";

export const DinoFunction = DefineFunction(
  "dino",
  {
    title: "Dino",
    description: "Turns a name into a dinosaur name",
    input_parameters: {
      name: {
        type: Schema.types.string,
        description: "The provided name",
      },
    },
    output_parameters: {
      dinoname: {
        type: Schema.types.string,
        description: "The new dinosaur name",
      },
    },
  },
  async ({ inputs, env, client }) => {
    return await {
      outputs: { dinoname: `${inputs.name}asaurus` },
    };
  },
);
```

Let's go over each of the three arguments that must be provided to `DefineFunction`.

#### Function ID

The first argument is the `id` of the function, a unique string identifier representing the function (`"dino"` in the above example). It must be unique in your application; no other functions or [workflows][workflows] may be named identically.

#### Function Definition

The second argument is the `definition` of the function, an object with a few properties that help to describe and define the function in more detail. In particular, the required properties of the object are:

- `title`: A pretty string to nicely identify the function.
- `description`: A short-and-sweet string description of your function succinctly summarizing what your function does.
- `input_parameters`: Itself an object which describes one or more input parameters that will be available to your function. Each top-level property of this object defines the name of one input parameter which will become available to your function. The value for this property needs to be an object with further sub-properties:
  - `type`: The type of the input parameter. The supported types are `string`, `integer`, `boolean`, `number`, `object` and `array`.
  - `description`: A string description of the input parameter.
- `output_parameters`: Itself an object which describes one or more output parameters that will be returned by your function. This object follows the exact same pattern as `input_parameters`: top-level properties of the object define output parameter names, with the property values being an object that further describes the `type` and `description` of individual output parameters.

#### Function Handler

The third and final argument is the function `handler`. This is a function that accepts a single argument (referred to as the function "context"), executes some logic and returns an object that exactly matches the structure of your function definition's `output_parameters`.

##### Function Handler Context

The single argument to your function is an object composed of several properties that may be useful to leverage during your function's execution:

- `env`: represents environment variables available to your function's execution context.
- `inputs`: an object containing the input parameters you defined as part of your Function Definition. In the example above, the `name` input parameter is available on the `inputs` property of our function handler context.
- `client`: a pre-configured instance of a Slack API Client. The API client has an async `call` function which accepts two arguments:
  1. `method`: a string which defines which API method you wish to invoke.
  2. `data`: a JSON object representing parameter data to be passed to the API method you wish to invoke; the client will handle serializing it appropriately.

### Built-in Functions

We also provide several built-in functions, encapsulating common interactions with the Slack API.

For the full list of built-in function provided so far, check out [`src/schema/slack/functions/mod.ts`](../src/schema/slack/functions/mod.ts).

### Adding Functions to Projects

Once you have defined a function, don't forget to include it in your [`Project`][project] definition!

    import { ReverseString } from "./functions/reverse.ts";

    Project({
      name: "heuristic-tortoise",
      description:
        "A demo showing how to use Slack workflows and functions",
      icon: "assets/icon.png",
      runtime: "deno1.x",
      botScopes: ["commands", "chat:write", "chat:write.public"],
      functions: [ReverseString], // <-- don't forget this!
    });

[workflows]: ./workflows.md
[project]: ./project.md
