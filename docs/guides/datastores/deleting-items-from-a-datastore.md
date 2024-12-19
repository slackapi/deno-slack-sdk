---
slug: /deno-slack-sdk/guides/deleting-items-from-a-datastore
---

# Deleting items from a datastore

<PaidPlanBanner />

There are a couple ways you can delete items from a datastore. You can:
- [Delete items with `delete` and `bulkDelete`](#delete)
- [Delete items automatically](#delete-automatically)

:::tip[Slack CLI commands]

You can also delete items from a datastore with the [`datastore delete`](/slack-cli/reference/commands/slack_datastore_delete) and [`datastore bulk-delete`](/slack-cli/reference/commands/slack_datastore_bulk-delete) Slack CLI commands.

:::

## Delete items with `delete` and `bulkDelete` {#delete}

There are two methods for deleting items in datastores:
- The [`apps.datastore.delete`](https://api.slack.com/methods/apps.datastore.delete) method is used for single items.
- The [`apps.datastore.bulkDelete`](https://api.slack.com/methods/apps.datastore.bulkDelete) method is used for multiple items. 

They work quite similarly. In the following examples we'll be deleting items from a datastore via their primary key. Regardless of what you named your `primary_key`, the query will always use the `id` key.

<details open>
<summary>Example: Using the <code>delete</code> method to delete an item by its <code>primary_key</code> </summary>

```js
// Somewhere in your function:
const uuid = "6db46604-7910-4684-b706-ac5929dd16ef";
const response = await client.apps.datastore.delete({
  datastore: "drafts",
  id: uuid,
});

if (!response.ok) {
  const error = `Failed to delete a row in datastore: ${response.error}`;
  return { error };
}
```
</details>

<details open>
<summary>Example: Using the <code>bulkDelete</code> method to delete an item by its <code>primary_key</code> </summary>

```js
// Somewhere in your function:
const uuid = "6db46604-7910-4684-b706-ac5929dd16ef";
const uuid2 = "1111111-1111-1111-1111-111111111111";
const response = await client.apps.datastore.bulkDelete({
  datastore: "drafts",
  ids: [uuid,uuid2]
});

if (!response.ok) {
  const error = `Failed to delete a row in datastore: ${response.error}`;
  return { error };
}
```
</details>

If the call was successful, the payload's `ok` property will be `true`. If it is not successful, it will be `false` and provide an error in the `errors` property.

:::warning[Datastore bulk API methods may _partially_ fail]

The `partial_failure` error message indicates that some items were successfully processed while others need to be retried. This is likely due to rate limits. Call the method again with only those failed items.

You'll find a `failed_items` array within the API response. The array contains all the items that failed, in the same format they were passed in. Copy the `failed_items` array and use it in your request. 

:::

## Delete items automatically {#delete-automatically}

You can set up your datastore to automatically delete records which are old and no longer relevant. This is done with the Time To Live (TTL) feature offered by AWS DynamoDB. Use it to efficiently discard data your app no longer needs.

For any item, define an expiration timestamp and the item will be automatically deleted once that expiration time has passed. 

Notice that we didn't say _immediately deleted_. AWS only guarantees deletion of expired items _48 hours past the expiration date_. If you query your table before 48 hours have passed, do not assume all expired items have been deleted. You can read more about this within the [AWS documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ttl-expired-items.html).

See below for an example on querying a database while filtering out any remaining expired items. 

### Enable and utilize the TTL feature {#enable-ttl}

##### Step 1. Select an attribute to use as the expiration timestamp

You can use a pre-existing attribute or add a new attribute.

The attribute's type _must_ be set as `Schema.slack.types.timestamp` in the datastore definition.

In this example, we're using an attribute called `expire_ts`:

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
    expire_ts: {
      type: Schema.slack.types.timestamp // This line!
    }
  },
  ...
});
```

##### Step 2. Set `time_to_live_attribute` to the selected attribute in the datastore definition

```js
// /datastores/drafts.ts
import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export default DefineDatastore({
  name: "drafts",
  time_to_live_attribute: "expire_ts" // This line!
  primary_key: "id",
  attributes: {
    id: {
      type: Schema.types.string,
    },
    expire_ts: {
      type: Schema.slack.types.timestamp
    },
    message: {
      type: Schema.types.string,
    }
  },
  ...
});
```

##### Step 3. Set `expire_ts` to a value, either programmatically or manually

In this example we're adding an item containing the `expire_ts` key using the [`apps.datastore.put`](https://api.slack.com/methods/apps.datastore.put) method:

```js
    const expiration = 
    const putResp = await client.apps.datastore.put<
      typeof DraftDatastore.definition
    >({
      datastore: DraftDatastore.name,
      item: {
        id: draftId,
        expire_ts: 23456432345,
        message: "Congrats on the promotion Jesse!"
      },
    });
```

##### Step 4. Deploy your app

Use the `slack deploy` command. See [Deploy to Slack](/deno-slack-sdk/guides/deploying-to-slack) for more information.

##### Step 5. Properly query items

As mentioned [above](#delete-automatically), expired items may not be deleted immediately. You'll likely want to filter out those expired items. 

Here is an example of a query that filters out any expired items that have not been automatically deleted yet:

```js
const result = await client.apps.datastore.query({
    datastore: "DraftDatastore", 
    expression: "attribute_not_exists(#expire_ts) OR #expire_ts > :timestamp", 
    expression_attributes: { "#expire_ts": "expire_ts" }, 
    expression_values: { ":timestamp":1708448410 } //Timestamp should be the current time
});
```

To see an example of filtering out expired items via the command line, see the documentation on the [`datastore query`](/slack-cli/reference/commands/slack_datastore_query) command.

### Disable the TTL feature {#disable-ttl}

##### Step 1. Remove `time_to_live_attribute` in the datastore definition

We only commented it out here because showing the absence of something is a bit anticlimactic.

```JS
export default DefineDatastore({
  name: "drafts",
  primary_key: "id",
  attributes: {
    id: {
      type: Schema.types.string,
    },
    //expire_ts: {
    //  type: Schema.slack.types.timestamp
    //}
  },
  ...
});
```

##### Step 2. Deploy your app.

Use the `slack deploy` command. See [Deploy to Slack](/deno-slack-sdk/guides/deploying-to-slack) for more information.

### Change the TTL attribute {#change-ttl}

Due to AWS limitations, changing the TTL attribute is a bit clunky. 

Step 1. [Disable TTL](#disable-ttl)

Step 2. Wait one hour. This wait is because AWS puts time limits on additional changes to the TTL feature. 

Step 3. [Enable TTL again with the new attribute](#enable-ttl)

Don't forget to deploy both when disabling and enabling TTL!
