## Functions

Functions are the core of your Slack app: they accept one or more input parameters, execute some logic and return one or more output parameters. 

### Defining a Function

Functions can be defined with the top level `DefineFunction` export. Below is an example function that turns a `name` input parameter into a dinosaur name:

```ts
import { DefineFunction, Schema } from "slack-cloud-sdk/mod.ts";

export const DinoFunction = DefineFunction(
  "dino",
  {
    title: "Dino",
    description: "Turns a name into a dinosaur name",
    source_file: "functions/dino.ts",
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
  }
);
```

Let's go over each of the arguments that must be provided to `DefineFunction`.

#### Function ID

The first argument is the `id` of the function, a unique string identifier representing the function (`"dino"` in the above example). It must be unique in your application; no other functions may be named identically.

#### Function Definition

The second argument is the `definition` of the function, an object with a few properties that help to describe and define the function in more detail. In particular, the required properties of the object are:

- `title`: A pretty string to nicely identify the function.
- `description`: A short-and-sweet string description of your function succinctly summarizing what your function does.
- `source file`: The relative path from the project root to the function `handler` file.
- `input_parameters`: Itself an object which describes one or more input parameters that will be available to your function. Each top-level property of this object defines the name of one input parameter which will become available to your function. The value for this property needs to be an object with further sub-properties:
  - `type`: The type of the input parameter. The supported types are `string`, `integer`, `boolean`, `number`, `object` and `array`.
  - `description`: A string description of the input parameter.
- `output_parameters`: Itself an object which describes one or more output parameters that will be returned by your function. This object follows the exact same pattern as `input_parameters`: top-level properties of the object define output parameter names, with the property values being an object that further describes the `type` and `description` of individual output parameters.

### Adding runtime logic to your Function
Now that you have defined your function's input and output parameters, it's time to define the body of your function.

1. Create a new file at the location set on the `source_file` parameter.
2. That file's default export should be an async function handler.
  - The function takes a single argument, referred to as the function "context".
  - The function returns an object that exactly matches the structure of your function definition's `output_parameters`.
##### Function Handler Context

The single argument to your function is an object composed of several properties that may be useful to leverage during your function's execution:

- `env`: represents environment variables available to your function's execution context.
- `inputs`: an object containing the input parameters you defined as part of your Function Definition. In the example above, the `name` input parameter is available on the `inputs` property of our function handler context.
- `client`: a pre-configured instance of a Slack API Client. The API client has an async `call` function which accepts two arguments:
  1. `method`: a string which defines which API method you wish to invoke.
  2. `data`: a JSON object representing parameter data to be passed to the API method you wish to invoke; the client will handle serializing it appropriately.

### Adding Functions to Projects

Once you have defined a function, don't forget to include it in your [`Project`][project] definition!

    import { ReverseString } from "./functions/reverse.ts";

    Project({
      name: "heuristic-tortoise",
      description:
        "A demo showing how to use Slack functions",
      icon: "assets/icon.png",
      runtime: "deno1.x",
      botScopes: ["commands", "chat:write", "chat:write.public"],
      functions: [ReverseString], // <-- don't forget this!
    });

[project]: ./project.md
