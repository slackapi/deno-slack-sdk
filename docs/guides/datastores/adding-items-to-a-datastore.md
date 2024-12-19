---
slug: /deno-slack-sdk/guides/adding-items-to-a-datastore
---

# Adding items to a datastore

<PaidPlanBanner />

There are a few ways you can add information to a datastore. You can:
- [Create or replace items with `put` and `bulkPut`](#create-replace)
- [Create or update items with `update`](#update)

There's an important distinction between these methods! The `put` and `bulkPut` methods _replace_ entire existing items, while the `update` method will only _update_ the provided attributes for items. Be careful to not accidentally lose information when using the `put` and `bulkPut` methods. 

:::tip[Slack CLI commands]
You can also add items to a datastore with the [`datastore put`](/slack-cli/reference/commands/slack_datastore_put), [`datastore bulk-put`](/slack-cli/reference/commands/slack_datastore_bulk-put), and [`datastore update`](/slack-cli/reference/commands/slack_datastore_update) Slack CLI commands. The `datastore bulk-put` command even supports importing data from a [JSON Lines](https://jsonlines.org/) file.

:::

## Create or replace items with `put` and `bulkPut` {#create-replace}

There are two methods for creating and replacing items in datastores:
- The [`apps.datastore.put`](https://api.slack.com/methods/apps.datastore.put) method is best for single items.
- The [`apps.datastore.bulkPut`](https://api.slack.com/methods/apps.datastore.bulkPut) method is best for multiple items. 

They work quite similarly.

<details open>
<summary>Example: Using the <code>put</code> method</summary>

```js
    const putResp = await client.apps.datastore.put<
      typeof DraftDatastore.definition
    >({
      datastore: DraftDatastore.name,
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
```
</details>

<details open>
<summary>Example: Using the <code>bulkPut</code> method</summary>

```js
    const putResp = await client.apps.datastore.bulkPut<
      typeof DraftDatastore.definition
    >({
      datastore: DraftDatastore.name,
      items: [
        {
          id: draftId,
          created_by: inputs.created_by,
          message: inputs.message,
          channels: inputs.channels,
          channel: inputs.channel,
          icon: inputs.icon,
          username: inputs.username,
          status: DraftStatus.Draft,
        },
        {
          id: draftId2,
          created_by: inputs.created_by,
          message: inputs.message,
          channels: inputs.channels,
          channel: inputs.channel,
          icon: inputs.icon,
          username: inputs.username,
          status: DraftStatus.Draft,
        },
      ]
    });
```
</details>

That's the general format for each method - but let's look a full example to help connect the dots. 

In this example, we create a custom function that creates and sends an announcement draft to a channel. Values for each of the datastore's attributes are passed in to create that announcement draft. 

First is the custom function definition:

```js
// /functions/create_draft/definition.ts
import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const CREATE_DRAFT_FUNCTION_CALLBACK_ID = "create_draft";
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

Next we have the handler function for `CreateDraftFunction`. With it, we create a new datastore record using the `put` method:

```js
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
    ...
```

If the call was successful, the payload's `ok` property will be `true`, and the `item` or `items` property will return a copy of the data you just inserted:

```json
{
  "ok": true,
  "datastore": "drafts",
  "item": {
    "id": "906dba92-44f5-4680-ada9-065149e4e930",
    "created_by": "U045A5X302V",
    "message": "This is a test message",
    "channels": ["C039ARY976C"],
    "channel": "C038M39A2TV",
    "icon": "",
    "username": "Slackbot",
    "status": "draft",
  }
}
```

If the call was not successful, the payload's `ok` property will be `false`, and you will have a error `code` and `message` property available:

```json
{
  "ok": false,
  "error": "datastore_error",
  "errors": [
    {
      "code": "some_error_code",
      "message": "A description of the error",
      "pointer": "/datastore/drafts"
    }
  ]
}
```

:::warning[Datastore bulk API methods may _partially_ fail]

The `partial_failure` error message indicates that some items were successfully processed while others need to be retried. This is likely due to rate limits. Call the method again with only those failed items.

You'll find a `failed_items` array within the API response. The array contains all the items that failed, in the same format they were passed in. Copy the `failed_items` array and use it in your request. 

:::

If you're adding new data via the `put` or `bulkPut` method, provide each item with a new primary key value in the `id` property. If you're updating an existing items, provide the `id` of each item you wish to replace. Note that a `put` or `bulkPut` request replaces each entire specified object, if it exists.

:::info["This datastore size is _just right_"]

The total allowable size of an item (all fields in a record) must be less than 400 KB.

:::

## Create or update an item with `update` {#update}

Updating only some of an item's attributes is done with the [`apps.datastore.update`](https://api.slack.com/methods/apps.datastore.update) API method. Let's see how that works by passing in values for only some of the datastore's attributes:

```js
// /functions/create_draft_interactivity_handler.ts
...
export const saveDraftEditSubmission: ViewSubmissionHandler<
  typeof CreateDraftFunction.definition
> = async (
  { inputs, view, client },
) => {
  // Get the datastore draft ID from the modal's private metadata
  const { id, thread_ts } = JSON.parse(view.private_metadata || "");

  const message = view.state.values.message_block.message_input.value;

  // Update the saved message
  const updateResp = await client.apps.datastore.update({
    datastore: DraftDatastore.name,
    item: {
      id: id,
      message: message, // This call will update only the message of the draft announcement
    },
  });

  if (!updateResp.ok) {
    const updateDraftMessageErrorMsg =
      `Error updating draft ${id} message. Contact the app maintainers with the following - (Error detail: ${putResp.error})`;
    console.log(updateDraftMessageErrorMsg);
    return;
  }
  ...
```

If the call was successful, the payload's `ok` property will be `true`, and the `item` property will return a copy of the updated data:

```json
{
  "ok": true,
  "datastore": "drafts",
  "item": {
    "id": "906dba92-44f5-4680-ada9-065149e4e930",
    "created_by": "U045A5X302V",
    "message": "This is a message that will be sent",
    "channels": ["C039ARY976C"],
    "channel": "C038M39A2TV",
    "icon": "",
    "username": "Slackbot",
    "status": "draft",
  }
}
```

If the call was not successful, the payload's `ok` property will be `false`, and you will have a error `code` and `message` property available:

```json
{
  "ok": false,
  "error": "datastore_error",
  "errors": [
    {
      "code": "some_error_code",
      "message": "A description of the error",
      "pointer": "/datastore/drafts"
    }
  ]
}
```

If an item with the provided `id` doesn't exist in the datastore, `update` will insert the item using the provided attributes.
