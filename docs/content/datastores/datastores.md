# Create and interact with a datastore

Datastores are a Slack-hosted way to store data for your workflow apps. They are available for workflow apps only.

Datastores are backed by [DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html), a secure and performant NoSQL database. DynamoDB's data model uses three basic types of data units: tables, items, and attributes. Tables are collections of items, and items are collections of attributes. You will see how a collection of attributes comprises an item when we define a datastore later in this page.

## Initializing a datastore {#create}

To initialize a datastore:
1. [Define](#define) the datastore
2. [Add](#manifest) it to your manifest

### 1. Define the datastore {#define}

To keep your app tidy, datastores can be defined in their own source files just like [custom functions](/automation/functions/custom).

If you don't already have one, create a `datastores` directory in the root of your project, and inside, create a source file to define your datastore.

Throughout this page, we'll use the example of the [Announcement bot sample app](https://github.com/slack-samples/deno-announcement-bot/tree/main). First, we'll create a datastore called `Drafts` and define it in a file named `drafts.ts`. It will hold information about an announcement the user drafts to send to a channel:

```js
// /datastores/drafts.ts
import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

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

Datastores can contain three primary properties. The `primary_key` property is the only one that is required. When using additional optional properties, make sure to handle them properly to avoid running into any TypeScript errors in your code.

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `name`  | String | A string to identify your datastore | Optional |
| `primary_key` | String | The attribute to be used as the datastore's unique key; ensure this is an actual attribute that you have defined | Required |
| `attributes` | Object (see below) | Properties to scaffold your datastore's columns | Optional |
| `time_to_live_attribute` | String | An optional attribute used as a Time To Live (TTL) feature to [delete datastore items automatically](/automation/datastores-delete#delete-automatically) when set to a property of type `Schema.slack.types.timestamp`, which represents the item's expiration. | Optional |

Attributes can be [custom types](/automation/types/custom), [Slack types](/automation/types), and the following basic schema types:
* array
* boolean
* int
* number
* object
* string

:::warning[No nullable support]

If you use a built-in Slack type for an attribute, there is no nullable support. For example, let's say you use `channel_id` for an attribute and at some point in your app, you'd like to clear out the `channel_id` for a given item. You cannot do this with a Slack built-in type. Change the data type to be a string if you'd like to support a null or empty value.

:::

### 2. Add the datastore to your app's manifest {#manifest}

The last step in initializing your datastore is to add it to the `datastores` property in your manifest and include the required datastore bot scopes.

To do that, first add the `datastores` property to your manifest if it does not exist, then list the datastores you have defined. Second, add the following datastore permission scopes to the `botScopes` property:

* `datastore:read`
* `datastore:write`

Here's an example manifest definition for the above `drafts` datastore in the [Announcement bot sample app](https://github.com/slack-samples/deno-announcement-bot/tree/main):

```js
import { Manifest } from "deno-slack-sdk/mod.ts";
// Import the datastore definition
import AnnouncementDatastore from "./datastores/announcements.ts";
import DraftDatastore from "./datastores/drafts.ts";
import { AnnouncementCustomType } from "./functions/post_summary/types.ts";
import CreateAnnouncementWorkflow from "./workflows/create_announcement.ts";

export default Manifest({
  name: "Announcement Bot",
  description: "Send an announcement to one or more channels",
  icon: "assets/icon.png",
  outgoingDomains: ["cdn.skypack.dev"],
  datastores: [DraftDatastore, AnnouncementDatastore], // Add the datastore to this list
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

Note that we've also added the required `datastore:read` and `datastore:write` bot scopes.

:::info

Updates to an existing datastore that could result in data loss (removal of an existing datastore or attribute from the app) may require the use of the force flag (`--force`) when re-deploying the app. See [schema_compatibility_error](/automation/cli/errors#schema_compatibility_error) for more information.

:::

---

## Importing data to a datastore {#import}

You can import data from a [JSON Lines](https://jsonlines.org/) file to a datastore using the [`datastore bulk-put`](/automation/cli/commands#datastore-bulk-put) command with the `--from-file` flag. For example: 

```
slack datastore bulk-put '{"datastore": "running_datastore"}' —-from-file /path/to/file.jsonl
```

See the [Add items to a datastore guide](/automation/datastores-add) for more information on the API method underlying this command. 

---

## Exporting data from a datastore {#export}

You can export data from a datastore to a [JSON Lines](https://jsonlines.org/) file using the [`datastore query`](automation/cli/commands#datastore-query) command with the `--to-file` flag. For example: 

```
slack datastore query '{"datastore": "running_datastore"}' —-to-file /path/to/file.jsonl
```

See the [Retrieve items from a datastore guide](/automation/datastores-retrieve) for more information on the API method underlying this command. 

---

## Counting items in a datastore {#count} 

You can count the number of items in a datastore that match a query by using the [`datastore count`](/automation/cli/commands#datastore-count) command. This command handles paginating through an entire datastore to return the number of matched items (rather than the items themselves, as with the `datastore query` command).

See the [Count items in a datastore guide](/automation/datastores-retrieve#count) for more information on the API method underlying this command. 

---

## Interacting with a datastore {#interact}

There are two ways to interact with your app's datastore.

➡️  **To interact with your datastore through the command-line tool**, see the [datastore commands](/automation/cli/commands#datastore) section on the commands page.

⤵️ **To interact with your datastore within a [custom function](/automation/functions/custom)**, keep reading.

Interacting with your app's datastore requires hitting the `SlackAPI`. To do this from within your code, we first need to import a mechanism that will allow us to call the `SlackAPI`. That mechanism is `SlackFunction`. First we import it into our function file from the `deno-slack-sdk` package, then we add a `SlackFunction` into our code. `SlackFunction` contains a property, `client`, which allows us to call the datastore. 

You can find examples of this in the [Slack API methods guide](/automation/apicalls) and [Add items to a datastore guide](/automation/datastores-add). 

In all interactions with your datastore, double and triple-check the exact spelling of the fields in the datastore definition match your query, lest you should receive an error.

When interacting with your datastore, it may be helpful to first visualize its structure. In our `drafts` example, let's say we have stored the following users and their drafted announcements:

| id | created_by | message | channels | channel | message_ts | icon | username | status |
| -- | -------| -----| --- | --- | ---- | ----- | ------ | ---- |
| `906dba92-44f5-4680-ada9-065149e4e930` | `U045A5X302V` | `This is a test message` | `["C038M39A2TV"]` | `C039ARY976C`| `1691513323.119209` | | `Slackbot` | `sent` |
| `b8457c38-4401-4dd1-b979-a0e56f7c9a3d` | `BR75C7X4P90` | `Remember to submit your timesheets` | `["C038M39A2TV"]` | `C039ARY976C` | `1691520476.091369` | `:robot_face:` | `The Boss` | `draft` |
| `194a52d8-c75b-4eff-9f8f-4c40292cd9e7` | `G98I9345NI2` | `Happy Friday, team!` | `["D870D2223M23"]` | `D870D2223M23` | `2172813323.142610` | `:t-rex:`| `Slackasaurus Bot` | `sent` |

:::warning[Beware of SQL injection]
Be sure to sanitize any strings received from a user and **never** use untrusted data in your query expressions.
:::

---

## Generic types for datastores {#generic-types}

You can provide your datastore's definition as a generic type, which will provide some automatic typing on the arguments and response:

```js
import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export const DraftDatastore = DefineDatastore({
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
      type: Schema.types.string, 
    },
  },
});
```

You can use the result of your `DefineDatastore()` call as the type in a function by using its `definition` property:

```js
import { DraftDatastore } from "../datastores/drafts.ts";
...
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
    ...
```

By using typed methods, the `datastore` property (e.g. `DraftDatastore.datastore`) will enforce that its value matches the datastore definition's `name` property across methods and the `item` matches the definition's `attributes` in arguments and responses. Also, for `get()` and `delete()`, a property matching the `primary_key` will be expected as an argument.

---

## Onward {#onward}

Ready to start manipulating data with your workflows? We've got a guide for each type of activity:

* [Add items to a datastore](/automation/datastores-add)
* [Retrieve items from a datastore](/automation/datastores-retrieve)
* [Delete items from a datastore](/automation/datastores-delete)
* [Delete items from a datastore automatically](/automation/datastores-delete#delete-automatically)
---

## Deleting a datastore {#delete-datastore}
If you need to delete a datastore completely, for instance you've changed the primary key, you have a couple of options. Datastores do support primary key changes, so first try using the `--force` flag on a [datastore CLI](/automation/cli/commands#datastores) operation if the Slack CLI informs you that the datastore has changed. Otherwise, do the following:

Step 1. Remove the datastore definition from the app's manifest.

Step 2. Run `slack deploy`.

Step 3. Modify the datastore definition to your heart's content and add it back into the app's manifest.

Step 4. Run `slack deploy` again.

---

## Troubleshooting {#troubleshooting}

If you're looking to audit or query your datastore from the terminal without having to go through code, see the [datastore commands](/automation/cli/commands#datastores).

If you're getting errors, check the following:

* The primary key is formatted as a string
* The datastore is included in the manifest's `datastores` property
* The datastore bot scopes are included in the manifest (`datastore:read` and `datastore:write`)
* The spelling of the fields in your query match exactly the spelling of the fields in the datastore's definition

:::info
The information stored when initializing your datastore using `slack run` will be completely separate from the information stored in your datastore when using `slack deploy`.

:::