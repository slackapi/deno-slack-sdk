import SlackFunctionPage from '@site/src/components/SlackFunctionPage';

export const toc = [
{ value: 'Facts', id: 'facts', level: 2 },
{ value: 'Input parameters', id: 'input-parameters', level: 2 },
{ value: 'Output parameters', id: 'output-parameters', level: 2 },
{ value: 'Usage info', id: 'usage-info', level: 2 },
];

<SlackFunctionPage jsonFile="open_form" >

Forms are a straight-forward way to collect user input and pass it onto to other parts of your workflow. Their interactivity is one way - users interact with a static form. You cannot update the form itself based on user input.

Refer to [Creating a form](/deno-slack-sdk/guides/creating-a-form) for guidance.

### Form element schema

Form elements have several properties you can customize depending on the element type.

Links using Markdown are supported in the top-level description, but not in individual form element descriptions. See the [Announcement Bot tutorial](https://api.slack.com/tutorials/announcement-bot) for an example.

| Property | Type | Description | Required?
| --- | --- | ---|---|
| `name` | `string` | Internal name of the element | Required 
| `title` | `string` | Title of the form shown to the user. Max length is 25 characters. | Required 
| `type` | `Schema.slack.types.*` | The [type of form element](/deno-slack-sdk/guides/creating-a-form#type-parameters) to display. | Required
| `description` | `string` | Description of the form shown to the user | Optional
| `default` | same as `type` property | Default value for this field | Optional

#### Form element `type` parameters

The following parameters are available for each type when defining your form. For each parameter listed, `type` is required.

Pay careful attention: some element types are prefixed with `Schema.types`, while some are prefixed with `Schema.slack.types`.

TODO: Table to go here once i have internet again :TODO

### Example workflow step

```
const openFormStep = SayHelloWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Send a greeting",
    interactivity: SayHelloWorkflow.inputs.interactivity,
    submit_label: "Send",
    fields: {
      elements: [{
        name: "recipient",
        title: "Recipient",
        type: Schema.slack.types.user_id,
      }, {
        name: "channel",
        title: "Channel to send message to",
        type: Schema.slack.types.channel_id,
        default: SayHelloWorkflow.inputs.channel,
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
```

### Additional requirements

When creating a workflow that will have a step to open a form, your workflow must have the call to `OpenForm` be its **first** step or ensure the preceding step is interactive. An interactive step will generate a fresh pointer to use for opening the form.

Here's an example of a basic workflow definition using `interactivity`:

```ts
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

export const SayHelloWorkflow = DefineWorkflow({
  callback_id: "say_hello_workflow",
  title: "Say Hello to another user",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});
```

</SlackFunctionPage>
