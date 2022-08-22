## Functions

Functions are the core of your Slack app: they accept one or more input
parameters, execute some logic and return one or more output parameters.

Functions can optionally define different kinds of Interactivity Handlers. If your
function creates messages or opens views, then it may need to define one or more
interactivity handlers to respond to user interactions with these interactive components.
Run-on-Slack applications support the following interactivity handlers, follow the links
to get more information about how each of them work:

- [Block Kit Action Handlers][action-handlers]: Handle events from interactive [Block Kit][block-kit]
  components that you can use in messages like
  Buttons, Menus and Date/Time Pickers](https://api.slack.com/block-kit/interactivity)
- [View Handlers][view-handlers]: Handle events triggered from [Modals][modals],
  which are composed of [Views][views].

### Defining a Function

Functions can be defined with the top level `DefineFunction` export. Below is an
example function that turns a `name` input parameter into a dinosaur name:

```ts
import { DefineFunction, Schema } from "slack-cloud-sdk/mod.ts";

export const DinoFunction = DefineFunction({
  callback_id: "dino",
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
});
```

Let's go over each of the arguments that must be provided to `DefineFunction`.

#### Function Definition

The passed argument is the `definition` of the function, an object with a few
properties that help to describe and define the function in more detail. In
particular, the required properties of the object are:

- `callback_id`: A unique string identifier representing the function (`"dino"`
  in the above example). It must be unique in your application; no other
  functions may be named identically. Changing a function's `callback_id` is not
  recommended as it means that the function will be removed from the app and
  created under the new `callback_id`, which will break any workflows
  referencing the old function.
- `title`: A pretty string to nicely identify the function.
- `description`: A short-and-sweet string description of your function
  succinctly summarizing what your function does.
- `source_file`: The relative path from the project root to the function
  `handler` file.
- `input_parameters`: Itself an object which describes one or more input
  parameters that will be available to your function. Each top-level property of
  this object defines the name of one input parameter which will become
  available to your function. The value for this property needs to be an object
  with further sub-properties:
  - `type`: The type of the input parameter. The supported types are `string`,
    `integer`, `boolean`, `number`, `object` and `array`.
  - `description`: A string description of the input parameter.
- `output_parameters`: Itself an object which describes one or more output
  parameters that will be returned by your function. This object follows the
  exact same pattern as `input_parameters`: top-level properties of the object
  define output parameter names, with the property values being an object that
  further describes the `type` and `description` of individual output
  parameters.

### Adding runtime logic to your Function

Now that you have defined your function's input and output parameters, it's time
to define the body of your function.

1. Create a new file at the location set on the `source_file` parameter.
2. That file's default export should be a function handler, that can either be
   sync or async.

- The function takes a single argument, referred to as the function "context".
- The function returns an object.

##### Function Handler Context

The single argument to your function is an object composed of several properties
that may be useful to leverage during your function's execution:

- `env`: represents environment variables available to your function's execution
  context.
- `inputs`: an object containing the input parameters you defined as part of
  your Function Definition. In the example above, the `name` input parameter is
  available on the `inputs` property of our function handler context.
- `token`: your application's access token.
- `event`: an object containing the full incoming event details.

##### Function Return Object

The object returned by your function that supports the following properties:

- `error`: a string indicating the error that was encountered. If present, the
  function will return an error regardless of what is passed to `outputs`.
- `outputs`: an object that exactly matches the structure of your function
  definition's `output_parameters`. This is required unless an `error` is
  returned.
- `completed`: a boolean indicating whether or not the function is completed.
  This defaults to `true`.

### Adding Functions to the Manifest

Once you have defined a function, don't forget to include it in your
[`Manifest`][manifest] definition!

```ts
import { ReverseString } from "./functions/reverse_definition.ts";

Manifest({
  name: "heuristic-tortoise",
  description: "A demo showing how to use Slack functions",
  icon: "assets/icon.png",
  botScopes: ["commands", "chat:write", "chat:write.public"],
  functions: [ReverseString], // <-- don't forget this!
});
```

[manifest]: ./manifest.md
[action-handlers]: ./functions-action-handlers.md
[view-handlers]: ./functions-view-handlers.md
[block-kit]: https://api.slack.com/block-kit
[modals]: https://api.slack.com/surfaces/modals
[views]: https://api.slack.com/surfaces/modals/using
