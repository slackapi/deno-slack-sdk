# Announcement bot

Hear ye, hear ye!

In this tutorial, you will learn how to create an app for an announcement bot that helps users draft, edit, and post an announcement to a channel (or channels) in a user's workspace, all while exploring the following workflow app concepts:

* [Custom](/automation/functions/custom) and [built-in](/automation/functions) functions
* [Datastores](/automation/datastores)
* [Workflows](/automation/workflows)
* [Custom types](/automation/types/custom)
* [Triggers](/automation/triggers/link)

For an overview of how the final product will look and function, check out the demo video in the `README.md` of the [GitHub repo](https://github.com/slack-samples/deno-announcement-bot) for this project.

Each Slack app built using the CLI begins with the same steps. Make sure you have everything you need before you call the attention of the masses to deliver your announcement.

* Install the [Slack CLI](https://tools.slack.dev/slack-cli/quickstart).
* Run `slack auth list` and ensure your workspace is listed.
* If your workspace is not listed, address any issues by following along with the [Quickstart](/quickstart), then come on back.


## Choose your adventure

Once those items are complete, you have two possible ways to proceed.

### Use a blank app
You can create a blank app with the Slack CLI using the following command:

```
slack create announcement-bot-app --template https://github.com/slack-samples/deno-blank-template
```

### Use a pre-built app
Or, you can use the pre-built [Announcement Bot app](https://github.com/slack-samples/deno-announcement-bot):

```
slack create announcement-bot-app --template https://github.com/slack-samples/deno-announcement-bot
```

Whichever option you choose, be sure to have the sample app repo open for reference, since we won't cover every file here, for brevity's sake.

Once your new project is ready to go, navigate to your project directory and let's get this show on the road.

## Plan your app

The best way to go about creating a workflow app is to take a bird’s eye view of it and determine:
* What would you like this workflow to accomplish?
* What is your goal?
* How can you break that down into smaller steps and actions?

This is how we will go about showing you this app’s creation, and we think it’s the best way to create workflow apps. To begin, the idea: an app that assists users in sending an announcement to a number of channels. But wait! Just in case they prematurely send it (if that’s you, check out [this help article](https://slack.com/help/articles/115005523006-Set-your-Enter-key-preference) or perhaps [this one](https://slack.com/help/articles/202395258-Edit-or-delete-messages#unsend-a-message)), let’s allow the user to preview and edit the announcement before making it final.

### How can we break this down into smaller steps?
If we think about the flow of the app, here's what happens. The user:
* initiates a workflow
* fills out a form and submits it
* sees a preview where they can edit the message they drafted
* sends the message
* sees a summary posted by the app

The first action will be handled by a [trigger](/automation/triggers/link) and the rest will be handled by [functions](/automation/functions/custom). The execution of the functions will be chained together in a [workflow](/automation/workflows), which essentially dictates which actions happen in which order. Along the way, we'll also add some visual sprinkles to sweeten the app's appearance in the form of [blocks](/reference/block-kit) and talk about the [app manifest](/automation/manifest).

Ready to unroll your proverbial scroll, gather the masses, and announce your next big message? Buckle up and let’s dive in.



## Define and implement the workflow

The [`create_announcement.ts`](https://github.com/slack-samples/deno-announcement-bot/blob/main/workflows/create_announcement.ts) workflow file will give us an idea of the flow of actions. 

The first step to creating a workflow is to define it.
```javascript
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { CreateDraftFunctionDefinition } from "../functions/create_draft/definition.ts";
import { PostSummaryFunctionDefinition } from "../functions/post_summary/definition.ts";
import { PrepareSendAnnouncementFunctionDefinition } from "../functions/send_announcement/definition.ts";

/**
 * A workflow is a set of steps that are executed in order
 * Each step in a workflow is a function.
 * https://api.slack.com/automation/workflows
 *
 * This workflow uses interactivity. Learn more at:
 * https://api.slack.com/automation/forms#add-interactivity
 */
const CreateAnnouncementWorkflow = DefineWorkflow({
  callback_id: "create_announcement",
  title: "Create an announcement",
  description:
    "Create and send an announcement to one or more channels in your workspace.",
  input_parameters: {
    properties: {
      created_by: {
        type: Schema.slack.types.user_id,
      },
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["created_by", "interactivity"],
  },
});
```

This definition tells us that we will use an `interactivity` input parameter. This means that we will be requiring interaction from the user, in this case, to find out information about their announcement. Continuing on:

```javascript
// Step 1: Open a form to create an announcement using Slack function, OpenForm
// For more on Slack functions
// https://api.slack.com/reference/functions
const formStep = CreateAnnouncementWorkflow
  .addStep(Schema.slack.functions.OpenForm, {
    title: "Create an announcement",
    description:
      "Create a draft announcement. You will have the opportunity to preview & edit it in channel before sending.\n\n_Want to create a richer announcement? Use <https://app.slack.com/block-kit-builder|Block Kit Builder> and paste the full payload into the message input below._",
    interactivity: CreateAnnouncementWorkflow.inputs.interactivity,
    submit_label: "Preview",
    fields: {
      elements: [{
        name: "message",
        title: "Message",
        type: Schema.types.string,
        description: "Compose your message using plain text, mrkdwn, or blocks",
        long: true,
      }, {
        name: "channels",
        title: "Destination channel(s)",
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.channel_id,
        },
        description: "The channels where your announcement will be posted",
      }, {
        name: "channel",
        title: "Draft channel",
        type: Schema.slack.types.channel_id,
        description:
          "The channel where you and your team can preview & edit the announcement before sending",
      }, {
        name: "icon",
        title: "Custom emoji icon",
        type: Schema.types.string,
        description:
          "Emoji to override the default app icon. Must use the format &colon;robot_face&colon; to be applied correctly.",
      }, {
        name: "username",
        title: "Custom username",
        type: Schema.types.string,
        description: "Name to override the default app name",
      }],
      required: ["message", "channels", "channel"],
    },
  });
```

The first step you see here is the `OpenForm` [Slack function](/reference/functions/open_form), which handles collecting input from the user. You might be wondering why we defined this step as a variable called `formStep` instead of adding the step to the workflow, which is also a viable option. If you want to use any information collected in this function, you will need to store it in a variable to retrieve it later. We'll see this in the next step, where we'll add a step to handle drafting the announcement.

```javascript
// Step 2: Create a draft announcement
// This step uses a custom function published by this app
// https://api.slack.com/automation/functions/custom
const draftStep = CreateAnnouncementWorkflow.addStep(
  CreateDraftFunctionDefinition,
  {
    created_by: CreateAnnouncementWorkflow.inputs.created_by,
    message: formStep.outputs.fields.message,
    channels: formStep.outputs.fields.channels,
    channel: formStep.outputs.fields.channel,
    icon: formStep.outputs.fields.icon,
    username: formStep.outputs.fields.username,
  },
);
```

 Notice how we're now accessing the information stored in the previous step's function via the `formStep.outputs.fields` property. This is how you pass data between functions. Don't worry about the particulars of `CreateDraftFunctionDefinition` just yet; we'll get to that in a bit. For now, we're just mapping out the flow of the entire app. Next, we'll send the announcement.

```javascript
// Step 3: Send announcement(s)
const sendStep = CreateAnnouncementWorkflow.addStep(
  PrepareSendAnnouncementFunctionDefinition,
  {
    message: draftStep.outputs.message,
    channels: formStep.outputs.fields.channels,
    icon: formStep.outputs.fields.icon,
    username: formStep.outputs.fields.username,
    draft_id: draftStep.outputs.draft_id,
  },
);
```

As you can see, we've added another step to the workflow; this one is called `PrepareSendAnnouncementFunctionDefinition`, in which we're using data collected from both the function stored in `formStep` and `draftStep`. One final step:

```javascript
// Step 4: Post message summary of announcement
CreateAnnouncementWorkflow.addStep(PostSummaryFunctionDefinition, {
  announcements: sendStep.outputs.announcements,
  channel: formStep.outputs.fields.channel,
  message_ts: draftStep.outputs.message_ts,
});
```

This step sends a summary of the posted announcement using data from all three prior steps. Looking back on our code, we've defined a workflow and added steps to gather data from the user, draft the announcement, send it, and post a summary of it. Satisfied with this flow, we have one more line to add to our workflow file:

```javascript
export default CreateAnnouncementWorkflow;
```

Awesome. Let's check out the particulars of these functions in the next section.


## Define and implement functions

Now that we know the goal of what we're building and how we'll break it down, let's take a closer look at those different functions we identified in the workflow: 
* `OpenForm`
* `CreateDraftFunctionDefinition`
* `PrepareSendAnnouncementFunctionDefinition`
* `PostSummaryFunctionDefinition`

### OpenForm

The `OpenForm` function is a [Slack function](https://api.slack.com/reference/functions/open_form) that allows us to collect information from the user. We saw its definition in the workflow, but let's look at it again here: 

```javascript
// This function exists in /workflows/create_announcement.ts
const formStep = CreateAnnouncementWorkflow
  .addStep(Schema.slack.functions.OpenForm, {
    title: "Create an announcement",
    description:
      "Create a draft announcement. You will have the opportunity to preview & edit it in channel before sending.\n\n_Want to create a richer announcement? Use <https://app.slack.com/block-kit-builder|Block Kit Builder> and paste the full payload into the message input below._",
    interactivity: CreateAnnouncementWorkflow.inputs.interactivity,
    submit_label: "Preview",
    fields: {
      elements: [{
        name: "message",
        title: "Message",
        type: Schema.types.string,
        description: "Compose your message using plain text, mrkdwn, or blocks",
        long: true,
      }, {
        name: "channels",
        title: "Destination channel(s)",
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.channel_id,
        },
        description: "The channels where your announcement will be posted",
      }, {
        name: "channel",
        title: "Draft channel",
        type: Schema.slack.types.channel_id,
        description:
          "The channel where you and your team can preview & edit the announcement before sending",
      }, {
        name: "icon",
        title: "Custom emoji icon",
        type: Schema.types.string,
        description:
          "Emoji to override the default app icon. Must use the format &colon;robot_face&colon; to be applied correctly.",
      }, {
        name: "username",
        title: "Custom username",
        type: Schema.types.string,
        description: "Name to override the default app name",
      }],
      required: ["message", "channels", "channel"],
    },
  });
```

We've defined the necessary inputs - `title`, `description`, `interactivity`, `submit_label`, and `fields`. The `fields` property represents what information we want to collect from the user. As you can see, we've required the user to minimally include `message`, `channels` to which to send the message, and a `channel` where the draft should post. 

### CreateDraftFunctionDefinition

Our next function, `CreateDraftFunctionDefinition`, is a [custom function](/automation/functions/custom). If you're following along in the sample code, navigate to the `/functions/create_draft` directory. For easier reading, we've split the function into three files - `definition.ts`, `handler.ts`, and `blocks.ts`. Technically speaking, you could combine the `definition.ts` and `handler.ts` files, but we like the visual separation in order to keep files shorter and easier to digest. Let's dive into the definition.

```javascript
// /functions/create_draft/definition.ts

import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const CREATE_DRAFT_FUNCTION_CALLBACK_ID = "create_draft";
/**
 * This is a custom function manifest definition which
 * creates and sends an announcement draft to a channel.
 *
 * More on defining functions here:
 * https://api.slack.com/automation/functions/custom
 */
export const CreateDraftFunctionDefinition = DefineFunction({
  callback_id: CREATE_DRAFT_FUNCTION_CALLBACK_ID,
  title: "Create a draft announcement",
  description:
    "Creates and sends an announcement draft to channel for review before sending",
  source_file: "functions/create_draft/handler.ts",
  input_parameters: {
    properties: {
      created_by: {
        type: Schema.slack.types.user_id,
        description: "The user that created the announcement draft",
      },
      message: {
        type: Schema.types.string,
        description: "The text content of the announcement",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "The channel where the announcement will be drafted",
      },
      channels: {
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.channel_id,
        },
        description: "The channels where the announcement will be posted",
      },
      icon: {
        type: Schema.types.string,
        description: "Optional custom bot icon to use display in announcements",
      },
      username: {
        type: Schema.types.string,
        description: "Optional custom bot emoji avatar to use in announcements",
      },
    },
    required: [
      "created_by",
      "message",
      "channel",
      "channels",
    ],
  },
  output_parameters: {
    properties: {
      draft_id: {
        type: Schema.types.string,
        description: "Datastore identifier for the draft",
      },
      message: {
        type: Schema.types.string,
        description: "The content of the announcement",
      },
      message_ts: {
        type: Schema.types.string,
        description: "The timestamp of the draft message in the Slack channel",
      },
    },
    required: ["draft_id", "message", "message_ts"],
  },
});
```

This file defines the function's six `input_parameters` and their types (four of which are required), as well as its three `output_parameters`, all of which are required. Let's check out what this function does in `handler.ts`, starting with just the first part:

```javascript
// /functions/create_draft/handler.ts

import { SlackFunction } from "deno-slack-sdk/mod.ts";

import { CreateDraftFunctionDefinition } from "./definition.ts";
import { buildDraftBlocks } from "./blocks.ts";
import {
  confirmAnnouncementForSend,
  openDraftEditView,
  prepareSendAnnouncement,
  saveDraftEditSubmission,
} from "./interactivity_handler.ts";
import { ChatPostMessageParams, DraftStatus } from "./types.ts";

import DraftDatastore from "../../datastores/drafts.ts";

/**
 * This is the handling code for the CreateDraftFunction. It will:
 * 1. Create a new datastore record with the draft
 * 2. Build a Block Kit message with the draft and send it to input channel
 * 3. Update the draft record with the successful sent drafts timestamp
 * 4. Pause function completion until user interaction
 */
export default SlackFunction(
  CreateDraftFunctionDefinition,
  async ({ inputs, client }) => {
    const draftId = crypto.randomUUID();

    // 1. Create a new datastore record with the draft
    const putResp = await client.apps.datastore.put<
      typeof DraftDatastore.definition
    >({
      datastore: DraftDatastore.name,
      // @ts-ignore expected fix in future release - otherwise missing non-required items throw type error
      item: {
        id: draftId,
        created_by: inputs.created_by,
        message: inputs.message,
        channels: inputs.channels,
        channel: inputs.channel,
        icon: inputs.icon,
        username: inputs.username,
        status: DraftStatus.Draft,
      },
    });

    if (!putResp.ok) {
      const draftSaveErrorMsg =
        `Error saving draft announcement. Contact the app maintainers with the following information - (Error detail: ${putResp.error})`;
      console.log(draftSaveErrorMsg);

      return { error: draftSaveErrorMsg };
    }
```

Here we see the `SlackFunction` defined with the `CreateDraftFunctionDefinition` we previously explored. `SlackFunction` is the necessary mechanism we need to use in order to interact with the [SlackAPI](/automation/apicalls), via the `client` property.

We haven't yet covered the datastore setup, so file that away in your brain for now; just know that it's a place where we'll store and retrieve data for this app's use. Take a minute to notice those properties on `item`. Hey those look familiar! `message`, `channels`, `channel`, `icon`, and `username` were all the inputs we collected in the `OpenForm` function step of the workflow. Next up: Build a Block Kit message with draft announcement, and send it to the input channel.

```javascript
    // 2. Build a Block Kit message with draft announcement and send it to input channel
    const blocks = buildDraftBlocks(
      draftId,
      inputs.created_by,
      inputs.message,
      inputs.channels,
    );

    const params: ChatPostMessageParams = {
      channel: inputs.channel,
      blocks: blocks,
      text: `An announcement draft was posted`,
    };

    if (inputs.icon) {
      params.icon_emoji = inputs.icon;
    }

    if (inputs.username) {
      params.username = inputs.username;
    }

    const postDraftResp = await client.chat.postMessage(params);
    if (!postDraftResp.ok) {
      const draftPostErrorMsg =
        `Error posting draft announcement to ${params.channel}. Contact the app maintainers with the following information - (Error detail: ${postDraftResp.error})`;
      console.log(draftPostErrorMsg);

      return { error: draftPostErrorMsg };
    }
```

This step handles posting the draft announcement given the message we collected from the user to the draft channel they requested, through the [`postMessage`](/methods/chat.postMessage) API method. Read more about how blocks work [over here](/block-kit). Next up, let's update that draft record:

```javascript

    // 3. Update the draft record with the successful sent drafts timestamp
    const putResp2 = await client.apps.datastore.put<
      typeof DraftDatastore.definition
    >({
      datastore: DraftDatastore.name,
      // @ts-expect-error expecting fix in future SDK release
      item: {
        id: draftId,
        message_ts: postDraftResp.ts,
      },
    });

    if (!putResp2.ok) {
      const draftUpdateErrorMsg =
        `Error updating draft announcement timestamp for ${draftId}. Contact the app maintainers with the following information - (Error detail: ${putResp2.error})`;
      console.log(draftUpdateErrorMsg);

      return { error: draftUpdateErrorMsg };
    }

    /**
     * IMPORTANT! Set `completed` to false in order to pause function's complete state
     * since we will wait for user interaction in the button handlers below.
     * Steps after this step in the workflow will not execute until we
     * complete our function.
     */
    return { completed: false };
  },
).addBlockActionsHandler(
  /**
   * These are additional interactivity handlers for events triggered
   * by a users interaction with Block Kit elements:
   */
  "preview_overflow",
  openDraftEditView,
).addViewSubmissionHandler(
  "edit_message_modal",
  saveDraftEditSubmission,
).addBlockActionsHandler(
  "send_button",
  confirmAnnouncementForSend,
).addViewSubmissionHandler(
  "confirm_send_modal",
  prepareSendAnnouncement,
);
```

That last bit is important - we're pausing the function's completion in order to wait for an edit or confirmation to send.

### PrepareSendAnnouncementFunctionDefinition
Let's take a look at the next function, located in `/functions/send_announcement`. Here's its definition:

```javascript
// /functions/send_announcement/definition.ts

import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { AnnouncementCustomType } from "../post_summary/types.ts";

export const SEND_ANNOUNCEMENT_FUNCTION_CALLBACK_ID = "send_announcement";
/**
 * This is a custom function definition that sends an
 * announcement to the supplied channel
 *
 * More on custom function definition here:
 * https://api.slack.com/automation/functions/custom
 */
export const PrepareSendAnnouncementFunctionDefinition = DefineFunction({
  callback_id: SEND_ANNOUNCEMENT_FUNCTION_CALLBACK_ID,
  title: "Send an announcement",
  description: "Sends a message to one or more channels",
  source_file: "functions/send_announcement/handler.ts",
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "The content of the announcement",
      },
      channels: {
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.channel_id,
        },
        description: "The destination channels of the announcement",
      },
      icon: {
        type: Schema.types.string,
        description: "Optional custom bot icon to use display in announcements",
      },
      username: {
        type: Schema.types.string,
        description: "Optional custom bot emoji avatar to use in announcements",
      },
      draft_id: {
        type: Schema.types.string,
        description: "The datastore ID of the draft message if one was created",
      },
    },
    required: [
      "message",
      "channels",
    ],
  },
  output_parameters: {
    properties: {
      announcements: {
        type: Schema.types.array,
        items: {
          type: AnnouncementCustomType,
        },
        description:
          "Array of objects that includes a channel ID and permalink for each announcement successfully sent",
      },
    },
    required: ["announcements"],
  },
});
```

Whoa, what's that `AnnouncementCustomType`?! Nothing to worry about, my dearest Slack dev. That's a [custom type](/automation/types/custom) that workflow apps allow us to define to suit our specialized needs. We can see its definition over in `/functions/post_summary/types.ts`:

```javascript
// /functions/post_summary/types.ts

import { DefineType, Schema } from "deno-slack-sdk/mod.ts";

/**
 * This is a Slack Custom type for an Announcement
 * For more on defining Custom types:
 *
 * https://api.slack.com/automation/types/custom
 */
export const AnnouncementCustomType = DefineType({
  name: "Announcement",
  type: Schema.types.object,
  properties: {
    channel_id: {
      type: Schema.slack.types.channel_id,
    },
    success: {
      type: Schema.types.boolean,
    },
    permalink: {
      type: Schema.types.string,
    },
    error: {
      type: Schema.types.string,
    },
  },
  required: ["channel_id", "success"],
});

/**
 * Corresponding TS typing for use elsewhere
 */
export type AnnouncementType = {
  channel_id: string;
  success: boolean;
  permalink?: string;
  error?: string;
};
```

Let's check out the implementation of that function to see how it sends the announcement:

```javascript
// /functions/send_announcement/handler.ts

import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { SlackAPIClient } from "deno-slack-api/types.ts";

import { PrepareSendAnnouncementFunctionDefinition } from "./definition.ts";
import { buildAnnouncementBlocks, buildSentBlocks } from "./blocks.ts";

import { AnnouncementType } from "../post_summary/types.ts";
import { ChatPostMessageParams, DraftStatus } from "../create_draft/types.ts";

import DraftDatastore from "../../datastores/drafts.ts";
import AnnouncementsDatastore from "../../datastores/announcements.ts";

/**
 * This is the handling code for PrepareSendAnnouncementFunction. It will:
 * 1. Send announcement to each channel supplied
 * 2. Updates the status of the announcement in the
 */

export default SlackFunction(
  PrepareSendAnnouncementFunctionDefinition,
  async ({ inputs, client }) => {
    // Array to gather chat.postMessage responses
    // deno-lint-ignore no-explicit-any
    const chatPostMessagePromises: Promise<any>[] = [];

    // Incoming draft_id to link all announcements that are
    // part of the same draft. If a draft_id was not provided,
    // create a new identifier for this announcements.
    const draft_id = inputs.draft_id || crypto.randomUUID();

    const blocks = buildAnnouncementBlocks(inputs.message);

    for (const channel of inputs.channels) {
      const params: ChatPostMessageParams = {
        channel: channel,
        blocks: blocks,
        text: `An announcement was posted`,
      };

      if (inputs.icon) {
        params.icon_emoji = inputs.icon;
      }

      if (inputs.username) {
        params.username = inputs.username;
      }

      const announcementRes = sendAndSaveAnnouncement(params, draft_id, client);
      chatPostMessagePromises.push(announcementRes);
    }

    const announcements = await Promise.all(chatPostMessagePromises);

    // Update draft if one was created
    if (inputs.draft_id) {
      const { item } = await client.apps.datastore.put<
        typeof DraftDatastore.definition
      >({
        datastore: DraftDatastore.name,
        // @ts-ignore expected fix in future release - otherwise missing non-required items throw type error
        item: {
          id: inputs.draft_id,
          status: DraftStatus.Sent,
        },
      });

      const blocks = buildSentBlocks(
        item.created_by,
        inputs.message,
        inputs.channels,
      );

      await client.chat.update({
        channel: item.channel,
        ts: item.message_ts,
        blocks: blocks,
      });
    }

    return { outputs: { announcements: announcements } };
  },
);
```

Here we see the message being posted as well as updating the draft in the datastore. Continuing on:

```javascript
/**
 * This method send an announcement to a channel, gets its permalink, and stores the details in the datastore
 * @param params parameters used in the chat.postMessage request
 * @param draft_id ID of the draft announcement that is being posted
 * @returns promise with summary
 */

async function sendAndSaveAnnouncement(
  params: ChatPostMessageParams,
  draft_id: string,
  client: SlackAPIClient,
): Promise<AnnouncementType> {
  let announcement: AnnouncementType;

  // Send it
  const post = await client.chat.postMessage(params);

  if (post.ok) {
    console.log(`Sent to ${params.channel}`);

    // Get permalink to message for use in summary
    const { permalink } = await client.chat.getPermalink({
      channel: params.channel,
      message_ts: post.ts,
    });

    announcement = {
      channel_id: params.channel,
      success: true,
      permalink: permalink,
    };
  } // There was an error sending the announcement
  else {
    console.log(`Error sending to ${params.channel}: ${post.error}`);
    announcement = {
      channel_id: params.channel,
      success: false,
      error: post.error,
    };
  }

  // Save each announcement to DB even if there was an error posting
  await client.apps.datastore.put<typeof AnnouncementsDatastore.definition>({
    datastore: AnnouncementsDatastore.name,
    item: {
      id: crypto.randomUUID(),
      draft_id: draft_id,
      success: post.ok,
      error_message: post.error,
      channel: post.channel,
      message_ts: post.ts,
    },
  });

  return announcement;
}
```

You might be wondering why this function returns the announcement if it's already been posted and updated in the datastore. Ah, but remember back to the app workflow when we had one final step of the flow? We post the announcement and then we post a summary of the announcement to the user who initiated the workflow. We'll use that output in our final function. Read on to see how.

### PostSummaryFunctionDefinition
Now let's head on over to `/functions/post_summary` to check out the function's definition in `definition.ts`:

```javascript
// /functions/post_summary/definition.ts

import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { AnnouncementCustomType } from "./types.ts";

export const POST_ANNOUNCEMENT_FUNCTION_CALLBACK_ID = "post_summary";
/**
 * This is a custom function manifest definition that posts a summary of the
 * announcement send status to the supplied channel
 *
 * More on custom function definition here:
 * https://api.slack.com/automation/functions/custom
 */
export const PostSummaryFunctionDefinition = DefineFunction({
  callback_id: POST_ANNOUNCEMENT_FUNCTION_CALLBACK_ID,
  title: "Post announcement summary",
  description: "Post a summary of all sent announcements ",
  source_file: "functions/post_summary/handler.ts",
  input_parameters: {
    properties: {
      announcements: {
        type: Schema.types.array,
        items: {
          type: AnnouncementCustomType,
        },
        description:
          "Array of objects that includes a channel ID and permalink for each announcement successfully sent",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "The channel where the summary should be posted",
      },
      message_ts: {
        type: Schema.types.string,
        description:
          "Options message timestamp where the summary should be threaded",
      },
    },
    required: [
      "announcements",
      "channel",
    ],
  },
  output_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
      },
      message_ts: {
        type: Schema.types.string,
      },
    },
    required: ["channel", "message_ts"],
  },
});
```

Notice the input parameters include an array of `announcements`. That is sourced from the `output_parameters` of the function executed prior to this one in the workflow - `PrepareSendAnnouncementFunctionDefinition`. Now that we've drafted, edited, and sent the announcement to the requested channels, we can use the last function to post a summary. Here's what that definition looks like: 

```javascript
// /functions/post_summary/definition.ts
import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { AnnouncementCustomType } from "./types.ts";

export const POST_ANNOUNCEMENT_FUNCTION_CALLBACK_ID = "post_summary";
/**
 * This is a custom function manifest definition that posts a summary of the
 * announcement send status to the supplied channel
 *
 * More on custom function definition here:
 * https://api.slack.com/automation/functions/custom
 */
export const PostSummaryFunctionDefinition = DefineFunction({
  callback_id: POST_ANNOUNCEMENT_FUNCTION_CALLBACK_ID,
  title: "Post announcement summary",
  description: "Post a summary of all sent announcements ",
  source_file: "functions/post_summary/handler.ts",
  input_parameters: {
    properties: {
      announcements: {
        type: Schema.types.array,
        items: {
          type: AnnouncementCustomType,
        },
        description:
          "Array of objects that includes a channel ID and permalink for each announcement successfully sent",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "The channel where the summary should be posted",
      },
      message_ts: {
        type: Schema.types.string,
        description:
          "Options message timestamp where the summary should be threaded",
      },
    },
    required: [
      "announcements",
      "channel",
    ],
  },
  output_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
      },
      message_ts: {
        type: Schema.types.string,
      },
    },
    required: ["channel", "message_ts"],
  },
});
```

Refer back to the workflow definition at any point to see where this function, or any given function, is receiving its input parameters, as well as where its output parameters go. Let's continue on to the handler of this function:

```javascript
// /functions/post_summary/handler.ts

import { SlackFunction } from "deno-slack-sdk/mod.ts";

import { buildSummaryBlocks } from "./blocks.ts";
import { PostSummaryFunctionDefinition } from "./definition.ts";

/**
 * This is the handling code for PostSummaryFunction. It will:
 * 1. Post a message in thread to the draft announcement message
 * with a summary of announcement's sent
 * 2. Complete this function with either required outputs or an error
 */
export default SlackFunction(
  PostSummaryFunctionDefinition,
  async ({ inputs, client }) => {
    const blocks = buildSummaryBlocks(inputs.announcements);

    // 1. Post a message in thread to the draft announcement message
    const postResp = await client.chat.postMessage({
      channel: inputs.channel,
      thread_ts: inputs.message_ts || "",
      blocks: blocks,
      unfurl_links: false,
    });
    if (!postResp.ok) {
      const summaryTS = postResp ? postResp.ts : "n/a";
      const postSummaryErrorMsg =
        `Error posting announcement send summary: ${summaryTS} to channel: ${inputs.channel}. Contact the app maintainers with the following - (Error detail: ${postResp.error})`;
      console.log(postSummaryErrorMsg);

      // 2. Complete function with an error message
      return { error: postSummaryErrorMsg };
    }

    const outputs = {
      channel: inputs.channel,
      message_ts: postResp.ts,
    };

    // 2. Complete function with outputs
    return { outputs: outputs };
  },
);
```

This function handles sending a summary to the user of the announcement they drafted and sent to their selected channels. This concludes our dive into the functions of this app. Let's take a deeper look at the datastores holding our announcement data in the next section.


## Define datstores

Two different datastores are needed for this application - one for drafts and one for announcements. 

### Drafts datastore

Let's first navigate to `/datastores` to check out the contents of `drafts.ts`:

```javascript
import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

/**
 * Datastores are a Slack-hosted location to store
 * and retrieve data for your app.
 * https://api.slack.com/automation/datastores
 */
export default DefineDatastore({
  name: "drafts",
  primary_key: "id",
  attributes: {
    id: {
      type: Schema.types.string,
    },
    created_by: {
      type: Schema.slack.types.user_id,
    },
    message: {
      type: Schema.types.string,
    },
    channels: {
      type: Schema.types.array,
      items: {
        type: Schema.slack.types.channel_id,
      },
    },
    channel: {
      type: Schema.slack.types.channel_id,
    },
    message_ts: {
      type: Schema.types.string,
    },
    icon: {
      type: Schema.types.string,
    },
    username: {
      type: Schema.types.string,
    },
    status: {
      type: Schema.types.string, // possible statuses are draft, sent
    },
  },
});
```

You can read more about interacting with datastores on the [datastores page](/automation/datastores), but the gist of it is that it's a Slack-hosted place to store data. In this definition, we see that this particular datastore has nine attributes - what you might consider fields in a database. Each attribute's type is listed along with its definition above.

### Announcements datastore

The second datastore - `announcements` - is defined in `/datastores/announcements.ts` and looks like this: 

```javascript
import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

/**
 * Datastores are a Slack-hosted location to store
 * and retrieve data for your app.
 * https://api.slack.com/automation/datastores
 */
export default DefineDatastore({
  name: "announcements",
  primary_key: "id",
  attributes: {
    id: {
      type: Schema.types.string,
    },
    draft_id: {
      type: Schema.types.string,
    },
    success: {
      type: Schema.types.boolean,
    },
    error_message: {
      type: Schema.types.string,
    },
    channel: {
      type: Schema.slack.types.channel_id,
    },
    message_ts: {
      type: Schema.types.string,
    },
  },
});
```

If you refer back to `/functions/send_announcement/handler.ts` you'll see that this datastore is used to keep a record of all announcements, regardless of their success status. To play around more with datastores outside of your code, check out the datastore [commands](/automation/cli/commands#datastore).


## Kick things off with a trigger

Triggers invoke workflows, so they're pretty important. In this app we'll be using a [link trigger](/automation/triggers/link), but you should know there are four types of [triggers](/automation/triggers) available. Navigate to `/triggers/create_announcement.ts` and let's check it out.

```javascript
import { Trigger } from "deno-slack-api/types.ts";
import CreateAnnouncementWorkflow from "../workflows/create_announcement.ts";

/**
 * This is a definition file for a shortcut link trigger
 * For more on triggers and other trigger types:
 * https://api.slack.com/automation/triggers
 */
const trigger: Trigger<
  typeof CreateAnnouncementWorkflow.definition
> = {
  type: "shortcut",
  name: "Create an announcement",
  description:
    "Create and send an announcement to one or more channels in your workspace.",
  workflow: "#/workflows/create_announcement",
  inputs: {
    created_by: {
      value: "{{data.user_id}}",
    },
    interactivity: {
      value: "{{data.interactivity}}",
    },
  },
};

export default trigger;
```

Next, run the trigger command in the terminal:

```bash
slack trigger create --trigger-def triggers/create_announcement.ts
```

After executing the command, select your app and workspace. The terminal will output a link called a "Shortcut URL", also known as your link trigger. Save that URL; we'll use it later. If you ever lose track of that URL, you can always run the command `slack triggers -info` and select your workspace to find it again.


## Report app contents in the app manifest

We've got one last stop to highlight before running this application, and that is the [app manifest](/automation/manifest). The manifest is located in the root directory of your project. Navigating to it in the sample project, its contents look like this: 

```javascript
import { Manifest } from "deno-slack-sdk/mod.ts";
import AnnouncementDatastore from "./datastores/announcements.ts";
import DraftDatastore from "./datastores/drafts.ts";
import { AnnouncementCustomType } from "./functions/post_summary/types.ts";
import CreateAnnouncementWorkflow from "./workflows/create_announcement.ts";

export default Manifest({
  name: "Announcement Bot",
  description: "Send an announcement to one or more channels",
  icon: "assets/icon.png",
  outgoingDomains: ["cdn.skypack.dev"],
  datastores: [DraftDatastore, AnnouncementDatastore],
  types: [AnnouncementCustomType],
  workflows: [
    CreateAnnouncementWorkflow,
  ],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "chat:write.customize",
    "datastore:read",
    "datastore:write",
  ],
});
```

The app manifest is the app's configuration. It is very important that this file is structured correctly in order for your app to run smoothly. Each function, custom type, and datastore defined in an app must be declared in the manifest file.


## Deploy your app

Ready to see this thing in action? Let's use development mode to run this workflow in Slack. Start it off with this command in your terminal:

```bash
slack run
```

After you've chosen your app and assigned it to your workspace, you can switch over to the app in Slack and test it out. Remember the link trigger you created earlier? Copy and paste that URL in a message to yourself in Slack. It will unfurl into a button that you can click to initiate the workflow.


## You did it!

Awww yea, you did it! You made it through the tutorial and are successfully sending announcements (but, you know, not too many...) to your workspace channels. Great job!

## Next steps

For your next challenge, perhaps consider creating [a bot to welcome users to your workspace](/tutorials/tracks/create-bot-to-welcome-users)!