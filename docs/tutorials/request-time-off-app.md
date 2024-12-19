# Request time off app

<PaidPlanBanner />

This tutorial will guide you in creating, running, and deploying a workflow app. The Request Time Off App models how to collect user inputs as well as how to send those inputs to other users in Slack. More specifically, this app showcases one way [user interactivity](/deno-slack-sdk/guides/creating-a-form) is implemented within an app. By the end, you will have a working app that can post [Block Kit](https://api.slack.com/block-kit/interactivity) messages, handle user interactions, and update messages in real time.

✨  **First time creating a workflow app?** Try an app to build your confidence, such as [Hello World](/deno-slack-sdk/tutorials/hello-world-app)!

We can break this app into 3 major parts that work together to create a symphonic harmony:
1. Functions
2. Workflows
3. Triggers

Each segment will give an explanation of the components, along with some tips & tricks for orchestrating a successful path forward.

Before we begin, ensure you have the following prerequisites completed:
* Install the [Slack CLI](/deno-slack-sdk/guides/getting-started).
* Run `slack auth list` and ensure your workspace is listed.
* If your workspace is not listed, address any issues by following along with the [Getting started](/deno-slack-sdk/guides/getting-started), then come on back.

## Choose your adventure

After you've [installed the command-line interface](/deno-slack-sdk/guides/getting-started) you have two ways you can get started:

### Use a blank app

You can create a blank app with the Slack CLI using the following command:

```bash
slack create request-time-off-app --template https://github.com/slack-samples/deno-blank-template
```

### Use a pre-built app

Or, you can use the pre-built [Request Time Off app](https://github.com/slack-samples/deno-request-time-off):

```
slack create request-time-off-app --template https://github.com/slack-samples/deno-request-time-off
```

Once you have your new project ready to go, change into your project directory.

## Compose the manifest

The app manifest is where we define the intricacies of an app. Below is the manifest that powers the Request Time Off app:

```javascript
import { Manifest } from "deno-slack-sdk/mod.ts";
import { CreateTimeOffRequestWorkflow } from "./workflows/CreateTimeOffRequestWorkflow.ts";
import { SendTimeOffRequestToManagerFunction } from "./functions/send_time_off_request_to_manager/definition.ts";

export default Manifest({
  name: "Request Time Off",
  description: "Ask your manager for some time off",
  icon: "assets/default_new_app_icon.png",
  workflows: [CreateTimeOffRequestWorkflow],
  functions: [SendTimeOffRequestToManagerFunction],
  outgoingDomains: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
  ],
});

```
The manifest of an app describes the most important application information, such as its `name`, `description`, `icon`, the list of [workflows](/deno-slack-sdk/guides/creating-workflows) and [functions](/deno-slack-sdk/guides/creating-custom-functions), and more. Read through the full [manifest documentation](/deno-slack-sdk/guides/using-the-app-manifest) to learn more.

## Create a function

First we will define and implement our function. [Functions](/deno-slack-sdk/guides/creating-custom-functions) are reusable building blocks that accept inputs, perform calculations, and provide outputs. 

The code behind the app's function is stored under the `./functions/send_time_off_request_to_manager/` directory. We're working with five files inside (not including test files):

1. `block_actions.ts`: An action handler for our interactive blocks.
2. `blocks.ts`: A layout of visual blocks that is easy on the eyes.
3. `constants.ts`: Constant variables referenced throughout the app.
4. `definition.ts`: Our function definition, which houses the function's `input_parameters`, `output_parameters`, `title`, `description` and implementation source file. This is a [custom function](/deno-slack-sdk/guides/creating-custom-functions) as opposed to [Slack function](/deno-slack-sdk/guides/creating-slack-functions), meaning the function implementation is up to you! _Notice the `interactivity` parameter of type `Schema.slack.types.interactivity` -- one of the many built-in [Slack types](/deno-slack-sdk/reference/slack-types#interactivity) available to allow your function to utilize user interaction._
5. `mod.ts`: Our function implementation.

### Implement a function

Once you define your custom function, we'll bring it to life by completing the `mod.ts` file with various [API calls](/deno-slack-sdk/guides/calling-slack-api-methods) and Block Kit [blocks](https://api.slack.com/reference/block-kit/blocks).

Remember, the Request Time Off app collects time off start and end dates, and sends that request to a manager for approval. We can utilize [Block Kit](https://api.slack.com/reference/block-kit/blocks) buttons to help facilitate the decision process and to create a rich user experience.

```javascript
import { SendTimeOffRequestToManagerFunction } from "./definition.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";
import BlockActionHandler from "./block_actions.ts";
import { APPROVE_ID, DENY_ID } from "./constants.ts";
import timeOffRequestHeaderBlocks from "./blocks.ts";

// Custom function that sends a message to the user's manager asking
// for approval for the time off request. The message includes some Block Kit with two
// interactive buttons: one to approve, and one to deny.
export default SlackFunction(
  SendTimeOffRequestToManagerFunction,
  async ({ inputs, client }) => {
    console.log("Forwarding the following time off request:", inputs);

    // Create a block of Block Kit elements composed of several header blocks
    // plus the interactive approve/deny buttons at the end
    const blocks = timeOffRequestHeaderBlocks(inputs).concat([{
      "type": "actions",
      "block_id": "approve-deny-buttons",
      "elements": [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Approve",
          },
          action_id: APPROVE_ID, // <-- important! we will differentiate between buttons using these IDs
          style: "primary",
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Deny",
          },
          action_id: DENY_ID, // <-- important! we will differentiate between buttons using these IDs
          style: "danger",
        },
      ],
    }]);
    // ...continued in the next snippet
```

Now we have a message with two buttons, each using a unique `ACTION_ID` to differentiate between an approval or denial. In order to properly utilize the Block Kit buttons, we'll rely on the [`BlockActionsHandler`](https://api.slack.com/reference/interaction-payloads/block-actions) to route the button actions. Check it out below:


```javascript
// ...continued from the snippet above
    // Send the message to the manager
    const msgResponse = await client.chat.postMessage({
      channel: inputs.manager,
      blocks,
      // Fallback text to use when rich media can't be displayed (i.e. notifications) as well as for screen readers
      text: "A new time off request has been submitted",
    });

    if (!msgResponse.ok) {
      console.log("Error during request chat.postMessage!", msgResponse.error);
    }

    // IMPORTANT! Set `completed` to false in order to keep the interactivity
    // points (the approve/deny buttons) "alive"
    // We will set the function's complete state in the button handlers below.
    return {
      completed: false,
    };
  },
  // Create an 'actions router' which is a helper utility to route interactions
  // with different interactive Block Kit elements (like buttons!)
).addBlockActionsHandler(
  // listen for interactions with components with the following action_ids
  [APPROVE_ID, DENY_ID],
  // interactions with the above components get handled by the function below
  BlockActionHandler,
);
```

This `mods.ts` function is responsible for building a message, sending it to the selected manager, and replying with a response that is triggered by the decision of that manager. How do we connect these function steps, you may ask? Not to worry, our next step covers how to bring together the functions using a [workflow](/deno-slack-sdk/guides/creating-workflows)!

## Define a workflow

A [workflow](/deno-slack-sdk/guides/creating-workflows) is a set of steps that are executed in order. Each step in a workflow can be a [function](/deno-slack-sdk/guides/creating-custom-functions). Similar to functions, workflows can also optionally accept inputs and pass them further along to other functions that comprise the workflow.

This app contains a single workflow stored within the `workflows/` folder.

This app's workflow is composed of two functions chained sequentially as steps:

1. The workflow uses the [OpenForm Slack function](/deno-slack-sdk/reference/slack-functions/open_form) to collect data from the user that started the workflow.
2. Form data is then passed to your app's [custom function](/deno-slack-sdk/guides/creating-custom-functions), which is called `SendTimeOffRequestToManagerFunction`. This function is stored within the `functions/` folder.

First let's define the workflow with the `DefineWorkflow` method. Make sure to set a custom `callback_id` that you can reference later on.

```javascript
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { SendTimeOffRequestToManagerFunction } from "../functions/send_time_off_request_to_manager/definition.ts";

/**
 * A Workflow composed of two steps: asking for time off details from the user
 * that started the workflow, and then forwarding the details along with two
 * buttons (approve and deny) to the user's manager.
 */
export const CreateTimeOffRequestWorkflow = DefineWorkflow({
  callback_id: "create_time_off",
  title: "Request Time Off",
  description:
    "Create a time off request and send it for approval to your manager",
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

Then, place the functions in order of execution. In this case, use the Slack [`OpenForm`](/deno-slack-sdk/reference/slack-functions/open_form) function to open a modal form to collect the time off request data; then use the [custom function](/deno-slack-sdk/guides/creating-custom-functions) you built to send the request for approval.


```javascript
// Step 1: opening a form for the user to input their time off details.
const formData = CreateTimeOffRequestWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Time Off Details",
    interactivity: CreateTimeOffRequestWorkflow.inputs.interactivity,
    submit_label: "Submit",
    description: "Enter your time off request details",
    fields: {
      required: ["manager", "start_date", "end_date"],
      elements: [
        {
          name: "manager",
          title: "Manager",
          type: Schema.slack.types.user_id,
        },
        {
          name: "start_date",
          title: "Start Date",
          type: "slack#/types/date",
        },
        {
          name: "end_date",
          title: "End Date",
          type: "slack#/types/date",
        },
        {
          name: "reason",
          title: "Reason",
          type: Schema.types.string,
        },
      ],
    },
  },
);

// Step 2: send time off request details along with approve/deny buttons to manager
CreateTimeOffRequestWorkflow.addStep(SendTimeOffRequestToManagerFunction, {
  interactivity: formData.outputs.interactivity,
  employee: CreateTimeOffRequestWorkflow.inputs.interactivity.interactor.id,
  manager: formData.outputs.fields.manager,
  start_date: formData.outputs.fields.start_date,
  end_date: formData.outputs.fields.end_date,
  reason: formData.outputs.fields.reason,
});

```
Voilà! Next, let's define a trigger to get the wheels in motion!

## Create a trigger

A [trigger](/deno-slack-sdk/guides/using-triggers) is a crucial finishing piece of your app. Creating a trigger sets the steps of your workflow in motion, which runs your custom & Slack functions, allowing your app to provide a pleasant experience.

These triggers can be invoked by a user, or automatically as a response to an event within Slack.

A [link trigger](/deno-slack-sdk/guides/creating-link-triggers) is a type of trigger that generates a shortcut URL which, when posted in a channel or added as a bookmark, becomes a link. When clicked, the link trigger will run the associated workflow.

To create a link trigger for our workflow, run the following command:

```bash
$ slack trigger create --trigger-def triggers/trigger.ts
```

After selecting a workspace and an app environment, the output provided will include the URL. Copy and paste this URL into a channel as a message, or add it as a bookmark in a channel of the workspace you selected.

_Note: this link won't run the workflow until the app is either running locally or deployed! Read on to learn how to run your app locally and eventually deploy it to Slack hosting._

## Run your app

You're almost to the end! Let's use development mode to run this workflow in Slack directly from the machine you're reading this from now:

```bash
$ slack run
```
After you've chosen your app and assigned it to your workspace, you can switch over to the app in Slack and try it out. Use the link trigger you created previously; when you paste the shortcut URL into the message box and post them, it'll unfurl and give you a button for invoking your workflow.

## Great work!

Congratulations! You've successfully built an approval workflow app, providing fancy buttons to all who request time off. Now that we've posted a message using Block Kit, handled the user interaction of buttons, and updated a message &mdash; you have the capability to either extend this app or to create a new one from scratch.

### Next steps

For your next challenge, perhaps consider creating [a social app to log runs with virtual running buddies](/deno-slack-sdk/tutorials/virtual-running-buddies-app)!



