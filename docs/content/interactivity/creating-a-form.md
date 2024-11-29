# Creating a form

Forms are a straight-forward way to collect user input and pass it onto to other parts of your workflow. Their interactivity is one way - users interact with a static form. You cannot update the form itself based on user input. 

For example, say you need to collect some information from a user, send it to your system, then update a Slack channel with a link to a summary. Each task can be configured as a step in your workflow, allowing for user interactivity data to be passed to each step sequentially until the process is complete.

Forms are created with the [`OpenForm`](/reference/functions/open_form) Slack function.

✨  **If you only need to update an already-created form**, refer to the [`OpenForm`](/reference/functions/open_form) Slack function reference page.
  
## 1. Add interactivity to your workflow {#add-interactivity}

First let's take a look at the "Send a Greeting" workflow from the [Hello World sample app](https://github.com/slack-samples/deno-hello-world).

Making your app interactive is the key to collecting user data. To accomplish this, an [`interactivity`](/automation/types#interactivity) input parameter must be included as a property in your workflow definition. The `interactivity` parameter is required to ensure users don't experience any unexpected or unwanted forms appearing - only their interaction can open a form. 

as in the following code snippet:

```javascript
// workflows/greeting_workflow.ts

import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GreetingFunctionDefinition } from "../functions/greeting_function.ts";

/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * https://api.slack.com/automation/workflows
 */
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
```

## 2. Add a form to your workflow {#add-form}

Now that you've added the `interactivity` property into your workflow, it's time to add the `OpenForm` Slack function to a step in your workflow.

While some of the functions you add to your workflow will be [custom functions](/automation/functions/custom), a variety of [Slack functions](/automation/functions) that cover some of the most common tasks executed on our platform are also available. The `OpenForm` Slack function allows for the collection of user input.

### Form element schema {#element-schema}

The fields of a form are made up of different types of form elements. Form elements have several properties you can customize depending on the element type.

Links using Markdown are supported in the top-level description, but not in individual element descriptions.

| Property | Type | Description | Required? |
| :------- | :--- | :---------- | :-------- |
| `name` | String | The internal name of the element | Required |
| `title` | String | Title of the form shown to the user. Maximum length is 25 characters | Required |
| `type` | `Schema.slack.types.*` | The [type of form element](/automation/forms#type-parameters) to display | Required |
| `description` | String | Description of the form shown to the user | Optional |
| `default` | Same type as `type` | Default value for this field | Optional |

The following parameters are available for each type when defining your form. For each parameter listed above, `type` is required.

:::info

Note the distinction that some element types are prefixed with `Schema.types`, while some are prefixed with `Schema.slack.types`.

:::

#### Form types and parameters {#type-parameters}

| Type | Parameters | Optionaltes |
| :---------- | :--- | :--- |
| [`Schema.types.string`](/automation/types#string) | `title`, `description`, `default`, `minLength`, `maxLength`, `format`, `enum`, `choices`, `long`, `type` | If the `long` parameter is provided and set to `true`, it will render as a multi-line text box. Otherwise, it renders as a single-line text input field. In addition, basic input validation can be done by setting `format` to either `email` or `url` | |
| [`Schema.types.boolean`](/automation/types#boolean) | `title`, `description`, `default`, `type` | A boolean rendered as a radio button in the form |
| [`Schema.types.integer`](/automation/types#integer) | `title`, `description`, `default`, `enum`, `choices`, `type`, `minimum`, `maximum` | A whole number, such as `-1`, `0`, or `31415926535` |
| [`Schema.types.number`](/automation/types#number) | `title`, `description`, `default`, `enum`, `choices`, `type`, `minimum`, `maximum` | A number that allows decimal points, such as `13557523.0005` |
| [`Schema.types.array`](/automation/types#array) | `title`, `description`, `default`, `type`, `items`, `maxItems`, `display_type` | The required `items` parameter is an object itself, which must have a `type` sub-property defined. It can accept multiple different kinds of sub-properties based on the type chosen. Can be [`Schema.types.string`](/automation/types#string), [`Schema.slack.types.channel_id`](/automation/types#channelid), [`Schema.slack.types.user_id`](/automation/types#userid).   The `display_type` parameter can be used if the `items` object has the `type` parameter set to `Schema.types.string` and contains an `enum` parameter. The `display_type` parameter can be then set to `multi_static_select` (default) or `checkboxes`. |
| [`Schema.slack.types.date`](/automation/types#date) | `title`, `description`, `default`, `enum`, `choices`, `type` | A string containing a date, displayed in `YYYY-MM-DD` format |
| [`Schema.slack.types.timestamp`](/automation/types#timestamp) | `title`, `description`, `default`, `enum`, `choices`, `type` | A Unix timestamp in seconds, rendered as a [date picker](/reference/block-kit/block-elements#datepicker) |
| [`Schema.slack.types.user_id`](/automation/types#userid) | `title`, `description`, `default`, `enum`, `choices`, `type` | A user picker |
| [`Schema.slack.types.channel_id`](/automation/types#channelid) | `title`, `description`, `default`, `enum`, `choices`, `type` | A channel picker |
| [`Schema.slack.types.rich_text`](/automation/types#rich-text) | `title`, `description`, `default`, `type` | A way to nicely format messages in your app. Note that this type cannot be converted to other message types, such as a string |
| [`Schema.slack.types.file_id`](/automation/types#fileid) | `title`, `description`, `type`, `allowed_filetypes_group`, `allowed_filetypes` | Needs the [`files:read`](/scopes/files:read) scope. |


<details>
<summary> An additional example: a form element from the <a href="https://github.com/slack-samples/deno-give-kudos">Give Kudos</a> sample app. </summary>

```javascript
// workflows/give_kudos.ts

const kudo = GiveKudosWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Give someone kudos",
    interactivity: GiveKudosWorkflow.inputs.interactivity,
    submit_label: "Share",
    description: "Continue the positive energy through your written word",
    fields: {
      elements: [{
        name: "doer_of_good_deeds",
        title: "Whose deeds are deemed worthy of a kudo?",
        description: "Recognizing such deeds is dazzlingly desirable of you!",
        type: Schema.slack.types.user_id,
      }, {
        name: "kudo_channel",
        title: "Where should this message be shared?",
        type: Schema.slack.types.channel_id,
      }, {
        name: "kudo_message",
        title: "What would you like to say?",
        type: Schema.types.string,
        long: true,
      }, {
        name: "kudo_vibe",
        title: 'What is this kudo\'s "vibe"?',
        description: "What sorts of energy is given off?",
        type: Schema.types.string,
        enum: [
          "Appreciation for someone 🫂",
          "Celebrating a victory 🏆",
          "Thankful for great teamwork ⚽️",
          "Amazed at awesome work ☄️",
          "Excited for the future 🎉",
          "No vibes, just plants 🪴",
        ],
      }],
      required: ["doer_of_good_deeds", "kudo_channel", "kudo_message"],
    },
  },
);
```
</details>

Add the `OpenForm` Slack function as a step in your workflow:

```javascript
// workflows/greeting_workflow.ts

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
```

Forms have two output parameters:
- `fields`: The same field names in the inputs, which are returned as outputs with the values entered by the user
- `interactivity`: The context about the form submit action interactive event

Use these output parameters to pass the information you collected from the user to subsequent steps in a workflow. When using the `OpenForm` Slack function, either add it as the first step in your workflow or ensure the preceding step is interactive, as an interactive step will generate a fresh pointer to use for opening the form. For example, use the interactive button in a later step in your workflow, which can be added with the [`Send a message`](/reference/functions/send_message) Slack function immediately before opening the form.


It is important to validate the inputs you receive from the user: first, that the user is authorized to pass the input, and second, that the user is passing a value you expect to receive and nothing more.

The example below passes the user's input data into the second step of the workflow, a [custom function](/automation/functions/custom), by using the output parameter `fields` and selecting the desired output element by name (i.e. `recipient` and `message`)

```javascript
// workflows/greeting_workflow.ts

const greetingFunctionStep = GreetingWorkflow.addStep(
  GreetingFunctionDefinition,
  {
    recipient: inputForm.outputs.fields.recipient,
    message: inputForm.outputs.fields.message,
  },
);
```

User input data can also be passed to [Slack functions](/automation/functions). This example sends the user's message to a specific channel specified by the user. 

```javascript
// workflows/greeting_workflow.ts

GreetingWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: inputForm.outputs.fields.channel,
  message: greetingFunctionStep.outputs.greeting,
});

export default GreetingWorkflow;
```

Take note of the `title`, `description`, and `submit_label` fields. It is important be descriptive with these fields, as these are the first things the user will see once the workflow is started and your form is displayed to them:

![form-metadata](form-metadata.png "Sample form metadata")

## 3. Add your workflow to your manifest {#manifest-workflow}

With a workflow defined and steps outlined, it's time to make this an official part of your app! Add the workflow definition to your manifest as in the following example:

```javascript
// manifest.ts

import { Manifest } from "deno-slack-sdk/mod.ts";
import GreetingWorkflow from "./workflows/greeting_workflow.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "deno-hello-world",
  description:
    "A sample that demonstrates using a function, workflow and trigger to send a greeting",
  icon: "assets/default_new_app_icon.png",
  workflows: [GreetingWorkflow],
  outgoingDomains: [],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
```

✨  **To learn more about workflows**, check out the [workflows](/automation/workflows) page.

## 4. Add a trigger to kick off your workflow {#add-trigger}

Let's add the needed momentum to your workflow and create a [link trigger](/automation/triggers/link#create-cli__create-a-link-trigger-with-a-trigger-file).

In the trigger definition, add `interactivity` as an input value. This value holds context about the user interactivity that invoked this trigger, and passes it along to your workflow.

In a separate file, define your trigger in the following way:

```javascript
// triggers/greeting_trigger.ts

import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import GreetingWorkflow from "../workflows/greeting_workflow.ts";

/**
 * Triggers determine when workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/automation/triggers
 */
const greetingTrigger: Trigger<typeof GreetingWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Send a greeting",
  description: "Send greeting to channel",
  workflow: `#/workflows/${GreetingWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    channel: {
      value: TriggerContextData.Shortcut.channel_id,
    },
  },
};

export default greetingTrigger;
```

Run the following CLI command to create the link trigger:

```sh
$ slack trigger create --trigger-def triggers/greeting_trigger.ts

...

⚡ Trigger created
   Trigger ID:   Ft0123ABC456
   Trigger Type: shortcut
   Trigger Name: Send a greeting
   URL: https://slack.com/shortcuts/Ft0123ABC456/c001a02b13c42de35f47b55a89aad33c
```

You now have a shortcut `URL` to share in a channel or save as a bookmark, which allows you to kick off your workflow and open your form.

✨  **To learn more about starting workflows with triggers**, head to the [triggers overview](/automation/triggers) page.