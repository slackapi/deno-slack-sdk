# Welcome bot

<PaidPlanBanner />

import SlackMessage from '@site/src/components/SlackMessage';

<SlackMessage pfp="img/welcome-bot/parrot.png" name="Welcome Bot" message="Welcome to the Welcome Bot tutorial! We hope you enjoy your stay here!" />

What a nice message to read! It sure would be nice if everyone joining a Slack channel received such a message!

In this tutorial you'll learn how to create a Slack app that sends a friendly welcome message, similar to the one at the top of this page, to a user when they join a channel. A user in the channel will be able to create the custom message from a form.

Before we begin, ensure you have the following prerequisites completed:
* Install the [Slack CLI](/deno-slack-sdk/guides/getting-started).
* Run `slack auth list` and ensure your workspace is listed.
* If your workspace is not listed, address any issues by following along with the [Getting started](/deno-slack-sdk/guides/getting-started), then come on back.

## Create a blank project

Create a blank app with the Slack CLI using the following command:

```
slack create welcome-bot-app --template https://github.com/slack-samples/deno-blank-template
```

A new app folder will be created. Once you have your new project ready to go, change into your project directory. You'll be bouncing between a few folders, so we recommend using an editor that streamlines switching between files.

Welcome to your Slack app! There may not be a welcoming message, but do not fret, you can make yourself at home here. Slack apps are built around their flexibility; don't be afraid to run wild!

For now though, just make three folders within your app folder. Each folder will contain a fundamental building block of a Slack app:
* `functions`
* `workflows`
* `triggers`  

With the setup complete, you can get building!

## Alternatively, create an app from the template

If you want to follow along without placing the code yourself, use the pre-built [Welcome Bot app](https://github.com/slack-samples/deno-welcome-bot):

```
slack create welcome-bot-app --template https://github.com/slack-samples/deno-welcome-bot
```

Once you have your new project ready to go, change into your project directory.

## Create the app manifest

The app manifest provides a sneak peak at what you'll be building throughout the rest of this tutorial. The recipe for the Welcome Bot app calls for:
* two workflows, imported from their files: 
    * `MessageSetupWorkflow`
    * `SendWelcomeMessageWorkflow`
* one datastore imported from its file: 
    * `WelcomeMessageDatastore`
* and six scopes: 
  * [`chat:write`](https://api.slack.com/scopes/chat:write)
  * [`chat:write.public`](https://api.slack.com/scopes/chat:write.public)
  * [`datastore:read`](https://api.slack.com/scopes/datastore:read)
  * [`datastore:write`](https://api.slack.com/scopes/datastore:write)
  * [`channels:read`](https://api.slack.com/scopes/channels:read)
  * [`triggers:write`](https://api.slack.com/scopes/triggers:write)
  * [`triggers:read`](https://api.slack.com/scopes/triggers:read)

Put that all together and your `manifest.ts` file will look like:

```javascript
// /manifest.ts
import { Manifest } from "deno-slack-sdk/mod.ts";
import { WelcomeMessageDatastore } from "./datastores/messages.ts";
import { MessageSetupWorkflow } from "./workflows/create_welcome_message.ts";
import { SendWelcomeMessageWorkflow } from "./workflows/send_welcome_message.ts";

export default Manifest({
  name: "Welcome Message Bot",
  description:
    "Quick way to setup automated welcome messages for channels in your workspace.",
  icon: "assets/default_new_app_icon.png",
  workflows: [MessageSetupWorkflow, SendWelcomeMessageWorkflow],
  outgoingDomains: [],
  datastores: [WelcomeMessageDatastore],
  botScopes: [
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
    "channels:read",
    "triggers:write",
    "triggers:read",
  ],
});
```

We've provided you all this upfront to streamline the tutorial, but you would likely build up your manifest as you add workflows and datastores to your app.

## Define a workflow for setting up the welcome message

In this step we'll be creating a [workflow](/deno-slack-sdk/guides/creating-workflows) named `MessageSetupWorkflow`. This workflow will contain the functions needed for someone in the channel to create a welcome message with a form.

Create a file named `create_welcome_message.ts` within the `workflows` folder. There you'll add the following workflow definition:

```javascript
// /workflows/create_welcome_message.ts
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { WelcomeMessageSetupFunction } from "../functions/create_welcome_message.ts";

/**
 * The MessageSetupWorkflow opens a form where the user creates a
 * welcome message. The trigger for this workflow is found in
 * `/triggers/welcome_message_trigger.ts`
 */
export const MessageSetupWorkflow = DefineWorkflow({
  callback_id: "message_setup_workflow",
  title: "Create Welcome Message",
  description: " Creates a message to welcome new users into the channel.",
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

The `input_parameters` you need are `interactivity` and `channel`. The `interactivity` parameter enables interactive elements, like the form you'll set up next.

## Add a form for the user to specify the welcome message

You add functions to workflows by using the `addStep` method. In this case, you'll be adding the form the user will interact with. 

This is done using a [Slack function](/deno-slack-sdk/guides/creating-slack-functions). Slack functions give you the ability to add common Slack functionality without the need to do so from scratch.

The Slack function to use here is the [`OpenForm`](/deno-slack-sdk/reference/slack-functions/open_form) function. Add it to your `create_welcome_message.ts` workflow like so:

```javascript
// /workflows/create_welcome_message.ts
/**
 * This step uses the OpenForm Slack function. The form has two
 * inputs -- a welcome message and a channel id for that message to
 * be posted in.
 */
const SetupWorkflowForm = MessageSetupWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Welcome Message Form",
    submit_label: "Submit",
    description: ":wave: Create a welcome message for a channel!",
    interactivity: MessageSetupWorkflow.inputs.interactivity,
    fields: {
      required: ["channel", "messageInput"],
      elements: [
        {
          name: "messageInput",
          title: "Your welcome message",
          type: Schema.types.string,
          long: true,
        },
        {
          name: "channel",
          title: "Select a channel to post this message in",
          type: Schema.slack.types.channel_id,
          default: MessageSetupWorkflow.inputs.channel,
        },
      ],
    },
  },
);
```

This creates a form that will show the following fields:
* "Your welcome message", where the user provides the message as a string of text
* "Select a channel to post this message in", where the user provides the channel for the desired channel.

The user can then submit the form.

## Add a confirmation ephemeral message when submitting the form

When the user submits the form, they'll want confirmation that it is submitted.

You can do this by using the Slack [`SendEphemeralMessage`](/deno-slack-sdk/reference/slack-functions/send_ephemeral_message) function. Add the following step to your `create_welcome_message.ts` workflow:

```javascript
// /workflows/create_welcome_message.ts
/**
 * This step takes the form output and passes it along to a custom
 * function which sets the welcome message up.
 * See `/functions/setup_function.ts` for more information.
 */
MessageSetupWorkflow.addStep(WelcomeMessageSetupFunction, {
  message: SetupWorkflowForm.outputs.fields.messageInput,
  channel: SetupWorkflowForm.outputs.fields.channel,
  author: MessageSetupWorkflow.inputs.interactivity.interactor.id,
});

/**
 * This step uses the SendEphemeralMessage Slack function.
 * An ephemeral confirmation message will be sent to the user
 * creating the welcome message, after the user submits the above
 * form.
 */
MessageSetupWorkflow.addStep(Schema.slack.functions.SendEphemeralMessage, {
  channel_id: SetupWorkflowForm.outputs.fields.channel,
  user_id: MessageSetupWorkflow.inputs.interactivity.interactor.id,
  message:
    `Your welcome message for this channel was successfully created! :white_check_mark:`,
});

export default MessageSetupWorkflow;
```

This function takes the provided `message` text and sends it to the specified user and channel, both pulled from the `OpenForm` function step above.

Wonderful! Now let's build functionality to handle that welcome message once its submitted by a user. 

## Create a datastore to store the welcome message

The message data needs to be accessible at a later time (when a user joins the channel), so it needs to be stored somewhere, like a [datastore](/deno-slack-sdk/guides/using-datastores).

Within your `datastores` folder, create a file named `messages.ts`. Within it, define the datastore:

```javascript
// /datastores/messages.ts
import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export const WelcomeMessageDatastore = DefineDatastore({
  name: "messages",
  primary_key: "id",
  attributes: {
    id: {
      type: Schema.types.string,
    },
    channel: {
      type: Schema.slack.types.channel_id,
    },
    message: {
      type: Schema.types.string,
    },
    author: {
      type: Schema.slack.types.user_id,
    },
  },
});
```

Each `attribute` is a type of information you want to store. In this case, it's the information from the form submission. Next, you'll fill the datastore with that information. 

## Create a custom function to send the message to the datastore

Within your `functions` folder, create a file named `create_welcome_message.ts`. This is where you'll define this [custom function](/deno-slack-sdk/guides/creating-custom-functions). 

The custom function you'll add here will take the form input the user provided and store that information in the created datastore. 

Add the function definition to the `create_welcome_message.ts` file:

```javascript
// /functions/create_welcome_message.ts
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { SlackAPIClient } from "deno-slack-sdk/types.ts";

import { SendWelcomeMessageWorkflow } from "../workflows/send_welcome_message.ts";
import { WelcomeMessageDatastore } from "../datastores/messages.ts";

/**
 * This custom function will take the initial form input, store it
 * in the datastore and create an event trigger to listen for
 * user_joined_channel events in the specified channel.
 */
export const WelcomeMessageSetupFunction = DefineFunction({
  callback_id: "welcome_message_setup_function",
  title: "Welcome Message Setup",
  description: "Takes a welcome message and stores it in the datastore",
  source_file: "functions/create_welcome_message.ts",
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "The welcome message",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Channel to post in",
      },
      author: {
        type: Schema.slack.types.user_id,
        description:
          "The user ID of the person who created the welcome message",
      },
    },
    required: ["message", "channel"],
  },
});
```

This function provides three `properties` as `input_parameters`. These are the three pieces of information you want to pass to the datastore: the welcome message, the channel to post in, and the user ID of the person who created the message.

## Add the custom function's functionality

The actual functionality involves taking those input parameters and putting them into a datastore. Put this right below your function definition within `create_welcome_message.ts`:

```javascript
// /functions/create_welcome_message.ts
export default SlackFunction(
  WelcomeMessageSetupFunction,
  async ({ inputs, client }) => {
    const { channel, message, author } = inputs;
    const uuid = crypto.randomUUID();

    // Save information about the welcome message to the datastore
    const putResponse = await client.apps.datastore.put<
      typeof WelcomeMessageDatastore.definition
    >({
      datastore: WelcomeMessageDatastore.name,
      item: { id: uuid, channel, message, author },
    });

    if (!putResponse.ok) {
      return { error: `Failed to save welcome message: ${putResponse.error}` };
    }

    // Search for any existing triggers for the welcome workflow
    const triggers = await findUserJoinedChannelTrigger(client, channel);
    if (triggers.error) {
      return { error: `Failed to lookup existing triggers: ${triggers.error}` };
    }

    // Create a new user_joined_channel trigger if none exist
    if (!triggers.exists) {
      const newTrigger = await saveUserJoinedChannelTrigger(client, channel);
      if (!newTrigger.ok) {
        return {
          error: `Failed to create welcome trigger: ${newTrigger.error}`,
        };
      }
    }

    return { outputs: {} };
  },
);
```

## Add the custom function to the workflow

Add the custom function you created as a step in the workflow. This connection allows you to use inputs and outputs from previous steps, which is how you'll get the specific pieces of information.

Pivot back to your `create_welcome_message.ts` workflow file. Add the following step:

```javascript
// /workflows/create_welcome_message.ts
/**
 * This step takes the form output and passes it along to a custom
 * function which sets the welcome message up.
 * See `/functions/setup_function.ts` for more information.
 */
MessageSetupWorkflow.addStep(WelcomeMessageSetupFunction, {
  message: SetupWorkflowForm.outputs.fields.messageInput,
  channel: SetupWorkflowForm.outputs.fields.channel,
  author: MessageSetupWorkflow.inputs.interactivity.interactor.id,
});

export default MessageSetupWorkflow;
```

Now you've created a workflow that will:
* let a user fill out a form with information for a welcome message
* store the welcome message information in a datastore

## Create the link trigger

You need to create a [trigger](/deno-slack-sdk/guides/using-triggers) that will start the workflow, which provides a user the form to fill out. 

This app will use a specific type of trigger called a [link trigger](/deno-slack-sdk/guides/creating-link-triggers). Link triggers kick off workflows when a user clicks on their link.

Within your triggers folder, create a file named `create_welcome_message_shortcut.ts`. Place this trigger definition within that file:

```javascript
// triggers/create_welcome_message_shortcut.ts
import { Trigger } from "deno-slack-api/types.ts";
import MessageSetupWorkflow from "../workflows/create_welcome_message.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";

/**
 * This link trigger prompts the MessageSetupWorkflow workflow.
 */
const welcomeMessageTrigger: Trigger<typeof MessageSetupWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Setup a Welcome Message",
  description: "Creates an automated welcome message for a given channel.",
  workflow: `#/workflows/${MessageSetupWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    channel: {
      value: TriggerContextData.Shortcut.channel_id,
    },
  },
};

export default welcomeMessageTrigger;
```

This defines a trigger that will kick off the provided workflow, `message_setup_workflow`, along with an added bonus: it'll pass along the channel ID of the channel it was started in. 

## Create the event trigger to start a second workflow

The workflow to send a message to a user needs to be invoked _after_ the message is created in the workflow. It also needs to be invoked whenever a new user joins the channel.

This calls for using a different type of trigger: an [event trigger](/deno-slack-sdk/guides/creating-event-triggers). Event triggers are only invoked when a certain event happens. In this case, our event is `user_joined_channel`.

Think of your `setup` function as priming everything needed for that message to send. The final piece to set up is this trigger. 

Since it runs at a certain point in a workflow, you'll actually place it within a function file. Place it within the `/functions/create_welcome_message.ts` file:

```javascript
// /functions/create_welcome_message.ts
/**
 * findUserJoinedChannelTrigger returns if the user_joined_channel trigger
 * exists for the "Send Welcome Message" workflow in a channel.
 */
export async function findUserJoinedChannelTrigger(
  client: SlackAPIClient,
  channel: string,
): Promise<{ error?: string; exists?: boolean }> {
  // Collect all existing triggers created by the app
  const allTriggers = await client.workflows.triggers.list({ is_owner: true });
  if (!allTriggers.ok) {
    return { error: allTriggers.error };
  }

  // Find user_joined_channel triggers for the "Send Welcome Message"
  // workflow in the specified channel
  const joinedTriggers = allTriggers.triggers.filter((trigger) => (
    trigger.workflow.callback_id ===
      SendWelcomeMessageWorkflow.definition.callback_id &&
    trigger.event_type === "slack#/events/user_joined_channel" &&
    trigger.channel_ids.includes(channel)
  ));

  // Return if any matching triggers were found
  const exists = joinedTriggers.length > 0;
  return { exists };
}

/**
 * saveUserJoinedChannelTrigger creates a new user_joined_channel trigger
 * for the "Send Welcome Message" workflow in a channel.
 */
export async function saveUserJoinedChannelTrigger(
  client: SlackAPIClient,
  channel: string,
): Promise<{ ok: boolean; error?: string }> {
  const triggerResponse = await client.workflows.triggers.create<
    typeof SendWelcomeMessageWorkflow.definition
  >({
    type: "event",
    name: "User joined channel",
    description: "Send a message when a user joins the channel",
    workflow:
      `#/workflows/${SendWelcomeMessageWorkflow.definition.callback_id}`,
    event: {
      event_type: "slack#/events/user_joined_channel",
      channel_ids: [channel],
    },
    inputs: {
      channel: { value: channel },
      triggered_user: { value: "{{data.user_id}}" },
    },
  });

  if (!triggerResponse.ok) {
    return { ok: false, error: triggerResponse.error };
  }
  return { ok: true };
}
```

This trigger passes the event-related `channel` and `triggered_user` values on to your soon-to-be workflow. With those accessible, you can now build out your next workflow. 

## Create a workflow for sending the welcome message

This second workflow will retrieve the message from the datastore and send it to the channel when a new user joins that channel. 

Navigate back to your `workflows` folder, and create a new file `send_welcome_message.ts`. 

Within that file place the workflow definition:

```javascript
// /workflows/send_welcome_message.ts
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { SendWelcomeMessageFunction } from "../functions/send_welcome_message.ts";

/**
 * The SendWelcomeMessageWorkFlow will retrieve the welcome message
 * from the datastore and send it to the specified channel, when
 * a new user joins the channel.
 */
export const SendWelcomeMessageWorkflow = DefineWorkflow({
  callback_id: "send_welcome_message",
  title: "Send Welcome Message",
  description:
    "Posts an ephemeral welcome message when a new user joins a channel.",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
      },
      triggered_user: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["channel", "triggered_user"],
  },
});
```

This workflow will have two inputs: `channel` and `triggered_user`, both acquired from the trigger invocation.

## Create a custom function that sends the welcome message

Navigate to the `functions` folder, and create a new file called `send_welcome_message.ts`. 

Within that file add the definition for a function that uses the inputs `channel` and `triggered_user`:

```javascript
// /functions/send_welcome_message.ts
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { WelcomeMessageDatastore } from "../datastores/messages.ts";

/**
 * This custom function will pull the stored message from the datastore
 * and send it to the joining user as an ephemeral message in the
 * specified channel.
 */
export const SendWelcomeMessageFunction = DefineFunction({
  callback_id: "send_welcome_message_function",
  title: "Sending the Welcome Message",
  description: "Pull the welcome messages and sends it to the new user",
  source_file: "functions/send_welcome_message.ts",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Channel where the event was triggered",
      },
      triggered_user: {
        type: Schema.slack.types.user_id,
        description: "User that triggered the event",
      },
    },
    required: ["channel", "triggered_user"],
  },
});
```

## Add the custom function's functionality

With the function defined, add the actual functionality right after:


```javascript
// /functions/send_welcome_message.ts
export default SlackFunction(SendWelcomeMessageFunction, async (
  { inputs, client },
) => {
  // Querying datastore for stored messages
  const messages = await client.apps.datastore.query<
    typeof WelcomeMessageDatastore.definition
  >({
    datastore: WelcomeMessageDatastore.name,
    expression: "#channel = :mychannel",
    expression_attributes: { "#channel": "channel" },
    expression_values: { ":mychannel": inputs.channel },
  });

  if (!messages.ok) {
    return { error: `Failed to gather welcome messages: ${messages.error}` };
  }

  // Send the stored messages ephemerally
  for (const item of messages["items"]) {
    const message = await client.chat.postEphemeral({
      channel: item["channel"],
      text: item["message"],
      user: inputs.triggered_user,
    });

    if (!message.ok) {
      return { error: `Failed to send welcome message: ${message.error}` };
    }
  }

  return {
    outputs: {},
  };
});
```

This creates a function that:
* queries the datastore for stored messages
* posts an ephemeral message using the `message` item from the datastore with a matching `channel` channel ID value to the user with the `triggered_user` user ID. 

## Add the custom function to the workflow

With the custom function built, add it to your `send_welcome_message.ts` workflow as a step:

```javascript
// /workflows/send_welcome_message.ts
SendWelcomeMessageWorkflow.addStep(SendWelcomeMessageFunction, {
  channel: SendWelcomeMessageWorkflow.inputs.channel,
  triggered_user: SendWelcomeMessageWorkflow.inputs.triggered_user,
});
```

And with that, you have created the two workflows that contain all the functionality you need to send a custom ephemeral message to a user joining a new channel. 

## Run your Slack app

For now, you'll want to [locally install the app](/deno-slack-sdk/guides/developing-locally) to the workspace. From the command line, within your app's root folder, run the following command:

```
slack run
```

Proceed through the prompts until you have a local server running in that terminal instance. 

It's installed! You can't use it quite yet though.

## Invoke the link trigger

Within a terminal located within that folder, you'll need to create that initial link trigger. You can open a new terminal tab or cancel your running server and restart later if you'd like.

You can do that with the `slack trigger create` command. Make it so.

```
slack trigger create --trigger-def triggers/create_welcome_message_shortcut.ts
```
Since you haven't installed this trigger to a workspace yet, you'll be prompted to install the trigger to a new workspace. Then select an authorized workspace in which to install the app. 

When you select your workspace, you will be prompted to choose an app environment for the trigger. Choose the _Local_ option so you can interact with your app while developing locally. The CLI will then finish installing your trigger.

Once your app's trigger is finished being installed, you will see the following output:

```zsh
📚 App Manifest
   Created app manifest for "welcomebot (local)" in "myworkspace" workspace

⚠️  Outgoing domains
   No allowed outgoing domains are configured
   If your function makes network requests, you will need to allow the outgoing domains
   Learn more about upcoming changes to outgoing domains: https://api.slack.com/changelog

🏠 Workspace Install
   Installed "welcomebot (local)" app to "myworkspace" workspace
   Finished in 1.5s

⚡ Trigger created
   Trigger ID:   Ft0123ABC456
   Trigger Type: shortcut
   Trigger Name: Setup a Welcome Message
   Shortcut URL: 
https://slack.com/shortcuts/Ft0123ABC456/XYZ123
...
```

Copy the URL, paste, and post it in a channel to kick off the first workflow and create a message. 


## Deploy your Slack app

When you're ready to make the app accessible to others, you'll want to [deploy it](/deno-slack-sdk/guides/deploying-to-slack) instead of running it:

```
slack deploy
```

And then create the trigger again, but choosing the _Deployed_ option this time:

```
slack trigger create --trigger-def triggers/create_welcome_message_shortcut.ts
```

Other than that, the steps are the same. 

## Pause and reflect

Congratulations! You've successfully built your friendly neighborhood welcome bot, providing a cozy presence to all who enter your desired channel.

### Next steps

For your next challenge, perhaps consider creating [an app that creates an issue in GitHub](/deno-slack-sdk(/tutorials/github-issues-app)!