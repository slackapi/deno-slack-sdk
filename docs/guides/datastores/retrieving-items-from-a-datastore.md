---
slug: /deno-slack-sdk/guides/retrieving-items-from-a-datastore
---

# Retrieving items from a datastore 

<PaidPlanBanner />

:::tip[Slack CLI commands]
You can also retrieve items from a datastore with the [`datastore get`](/slack-cli/reference/commands/slack_datastore_query), [`datastore bulk-get`](/slack-cli/reference/commands/slack_datastore_bulk-get), and [`datastore query`](/slack-cli/reference/commands/slack_datastore_query) Slack CLI commands. The `datastore query` command even supports exporting data to a [JSON Lines](https://jsonlines.org/) file.

:::

## Retrieve items with `get` and `bulkGet` {#get}

There are two methods for retrieving items in datastores:
- The [`apps.datastore.get`](https://api.slack.com/methods/apps.datastore.get) method is used for single items.
- The [`apps.datastore.bulkGet`](https://api.slack.com/methods/apps.datastore.bulkGet) method is used for multiple items. 

They work quite similarly. Regardless of what you named your `primary_key`, the query will always use the `id` key.

<details open>
<summary>Example: Using the <code>get</code> method to retrieve an item by its <code>primary_key</code> </summary>

```js
// /functions/create_draft/interactivity_handler.ts
...
export const openDraftEditView: BlockActionHandler<
    typeof CreateDraftFunction.definition
> = async ({ body, action, client }) => {
    if (action.selected_option.value == "edit_message_overflow") {
        const id = action.block_id;

        // Get the draft
        const getResp = await client.apps.datastore.get <
            typeof DraftDatastore.definition
            > (
                {
                    datastore: DraftDatastore.name,
                    id: id,
                },
    );
...
```
If the call was successful and data was found, the `item` property in the payload will include the attributes (and their values) from the datastore definition.

```json
{
    "ok": true,
    "datastore": "drafts",
    "item": {
        "id": "906dba92-44f5-4680-ada9-065149e4e930",
        "created_by": "U045A5X302V",
        "message": "This is a test message",
        "channels": [
            "C039ARY976C"
        ],
        "channel": "C038M39A2TV",
        "icon": "",
        "username": "Slackbot",
        "status": "draft",
    }
}
```

If the call was successful but no data was found, the `item` property in the payload will be blank:

```json
{
    "ok": true,
    "datastore": "drafts",
    "item": {}
}
```

</details>

<details open>
<summary>Example: Using the <code>bulkGet</code> method to retrieve multiple items by their <code>primary_key</code> </summary>

```js
// /functions/create_draft/interactivity_handler.ts
...
export const openDraftEditView: BlockActionHandler<
    typeof CreateDraftFunction.definition
> = async ({ body, action, client }) => {
    if (action.selected_option.value == "edit_message_overflow") {
        const id = action.block_id;

        // Get the draft
        const getResp = await client.apps.datastore.bulkGet <
            typeof DraftDatastore.definition
            > (
                {
                    datastore: DraftDatastore.name,
                    ids: [id, "41"]
                },
    );
...
```
If multiple items are returned, the `item` properties will be contained in an `items` array

```json
{
    "ok": true,
    "datastore": "drafts",
    "items": [
        {
            "id": "906dba92-44f5-4680-ada9-065149e4e930",
            "created_by": "U045A5X302V",
            "message": "This is a test message",
            "channels": [
                "C039ARY976C"
            ],
            "channel": "C038M39A2TV",
            "icon": "",
            "username": "Slackbot",
            "status": "draft",
        },
        {
            "id": "906dba92-44f5-4680-ada9-065149e4e930",
            "created_by": "U045A5X302V",
            "message": "This is a test message",
            "channels": [
                "C039ARY976C"
            ],
            "channel": "C038M39A2TV",
            "icon": "",
            "username": "Slackbot",
            "status": "draft",
        }
    ]
}
```

If the call was successful but no data was found, the `items` property in the payload will be blank:

```json
{
    "ok": true,
    "datastore": "drafts",
    "items": []
}
```
</details>

For both methods, if the call was unsuccessful, `ok` will be false and you'll see some information on the error.

```json
{
    "ok": false,
    "error": "datastore_error",
    "errors": [
        {
            "code": "datastore_config_not_found",
            "message": "The datastore configuration could not be found",
            "pointer": "/datastores"
        }
    ]
}
```

It is possible to have records with undefined values, and it's important to be proactive in expecting those situations in your code. Here are some examples of how to code around a potential undefined field while retrieving an item.

This example snippet supports the case where the function returns an optional output:

```js
const getResponse = await client.apps.datastore.get < typeof DraftsDatastore.definition > ({ ...});
const announcementId = getResponse.item.id; // this is the primary key
const announcementIcon = getResponse.item.icon; // icon could be undefined

return {
    outputs: {
        id: announcementId, // id is always defined
        icon: announcementIcon,  // icon must be an optional output of the function
    }
}
```

This example snippet supports the case where the function assigns a default:

```js
const getResponse = await client.apps.datastore.get < typeof DraftsDatastore.definition > ({ ...});
const announcementId = getResponse.item.id; // this is the primary key

// icon could be undefined, so use a fallback
const announcementIcon = getResponse.item.icon ?? "n/a";

return {
    outputs: {
        id: announcementId, // id is always defined
        icon: announcementIcon,  // email is always defined
    }
}
```

And finally, this example snippet supports the case where the function should error:

```js
const getResponse = await client.apps.datastore.get < typeof DraftsDatastore.definition > ({ ...});
const announcementId = getResponse.item.id; // this is the primary key

if (getResponse.item.icon) {
    const announcementIcon = getResponse.item.icon;
    return {
        outputs: {
            id: announcementId,
            icon: announcementIcon
        }
    }
} else {
    return {
        error: "Announcement doesn't have an icon assigned"
    }
}
```

:::warning[Datastore bulk API methods may _partially_ fail]

The `partial_failure` error message indicates that some items were successfully processed while others need to be retried. This is likely due to rate limits. Call the method again with only those failed items.

You'll find a `failed_items` array within the API response. The array contains all the items that failed, in the same format they were passed in. Copy the `failed_items` array and use it in your request. 

:::

## Find items with `query` {#find}

If you need to find data without already knowing the item's `id`, you'll want to run a query. Querying a datastore requires knowledge of a few different components. It's also helpful to brush up on how to use [pagination](#pagination) and [filter expressions](#filter-expressions).

First, let's look at the fields of a datastore query and how they might look in code, then break down the details of each bit.

A Slack datastore query includes the following arguments:

| Parameter | Description | Required |
| --------- | ----------- | -------- |
| `datastore` | A string with the name of the datastore to read the data from | Required |
| `expression` | A DynamoDB filter expression, using DynamoDB's [filter expression syntax](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Scan.html#Scan.FilterExpression)| Optional |
| `expression_attributes` | A map of columns used by the `expression` | Optional |
| `expression_values` | A map of values used by the `expression` | Optional |
| `limit` | The maximum number of entries to return, 1-1000 (both inclusive); default is `100` | Optional |
| `cursor` | The string value to access the next page of results | Optional |

Here's an example of how to query our `drafts` datastore using the [Slack CLI](/slack-cli/guides/installing-the-slack-cli-for-mac-and-linux) and retrieve a list of all the announcements with messages containing "timesheet":

```javascript
const result = await client.apps.datastore.query({
    datastore: "drafts",
    expression: "contains (#message_term, :message)",
    expression_attributes: { "#message_term": "message" },
    expression_values: { ":message": "timesheet" },
});
```

 If that example looks wonky to you; read on while we explain. Under the hood, the [`apps.datastore.query`](https://api.slack.com/methods/apps.datastore.query) API method is a DynamoDB scan, and thereby uses DynamoDB's [filter expression syntax](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Scan.html#Scan.FilterExpression).

Let's break down that previous query example:

The `expression` is the search criteria. The `expression_attributes` object is a map of the columns used for the comparison, and the `expression_values` object is a map of values. The `expression_attributes` property must always begin with a `#`, and the `expression_values` property must always begin with a `:`.

To break that down further, `#message_term` seen here is a variable representing the `message` datastore attribute. So, why not just use `message` in the expression, such that it would be `expression: "message = :message"`? We do this to safeguard against anything that might break the search query, like double quotes or spaces in a name, or using DynamoDB's [reserved words](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html) as attribute names. The second such variable used in the `expression` is `:message`. We see that defined in `expression_values` as the hard-coded value of `"timesheet"`, but it's more likely that you'll use a variable here, perhaps a value obtained from a user interaction. 

 In summary, this query searches for items in the `drafts` datastore that have a value of `"timesheet"` (represented by `:message`) in their `message` attribute (represented by `#message_term`). 

Let's take a look at another example, this one exploring searching a datastore by timestamp. Given this set of data in a datastore:
```json
{
    "id": "foo5",
    "message": "bar5",
    "timestamp": 1671752648
}

{
    "id": "foo4",
    "message": "bar4",
    "timestamp": 1670975048
}

{
   "id": "foo3",
    "message": "bar3",
    "timestamp": 1702511048
}
```

If we run the [Slack CLI](/slack-cli/guides/installing-the-slack-cli-for-mac-and-linux) query:
```bash
slack datastore query '{
  "datastore": "messages",
  "expression": "#timestamp between :time_start AND :time_end",
  "expression_attributes": {"#timestamp":"timestamp"},
  "expression_values": {":time_start":1670975049,":time_end":1702511047}
  }'
```

We will see this object as a result: 
```json
{
    "id": "foo5",
    "message": "bar5",
    "timestamp": 1671752648
}
```
You can use filter expression operators with any of the date types ([`Schema.slack.types.date`](/deno-slack-sdk/reference/slack-types#date), [`Schema.slack.types.timestamp`](/deno-slack-sdk/reference/slack-types#timestamp), and [`Schema.slack.types.message_ts`](/deno-slack-sdk/reference/slack-types#message-ts)), so long as the values passed match the underlying type and format. 

Here is another example of a date query, this one using the [`Schema.slack.types.date`](/deno-slack-sdk/reference/slack-types#date) field.

Given this set of data in a datastore:
```json
{
    "date": "2022-01-02",
    "message": "First message",
    "id": "1"
}

{
    "date": "2023-04-11",
    "message": "Second message",
    "id": "2"
}

{
    "date": "2024-01-01",
    "message": "Third message",
    "id": "3"
}
```

Running this query:
```bash
slack datastore query '{
  "datastore": "messages", 
  "expression": "#date < :date_end", 
  "expression_attributes": {"#date": "date"}, 
  "expression_values": {":date_end": "2023-01-01"}
  }'
```

Will yield this result:
```json
{
    "date": "2022-01-02",
    "message": "First message",
    "id": "1"
}
```

## Pagination {#pagination}

It is strongly recommended to always handle pagination when implementing a query so that you can easily view all of your query results.

The following code snippet from the [Virtual Running Buddies sample app](https://github.com/slack-samples/deno-virtual-running-buddies) shows how to do this:

```javascript
export async function queryRunningDatastore(
    client: SlackAPIClient,
    expressions?: object,
): Promise<{
    ok: boolean;
    items: DatastoreItem<typeof RunningDatastore.definition>[];
    error?: string;
}> {
    const items: DatastoreItem<typeof RunningDatastore.definition>[] = [];
    let cursor = undefined;

    do {
        const runs: DatastoreQueryResponse<typeof RunningDatastore.definition> =
            await client.apps.datastore.query < typeof RunningDatastore.definition > ({
                datastore: RUN_DATASTORE,
                cursor,
                ...expressions,
            });

        if (!runs.ok) {
            return { ok: false, items, error: runs.error };
        }

        cursor = runs.response_metadata?.next_cursor;
        items.push(...runs.items);
    } while (cursor);

    return { ok: true, items };
}
```

Essentially, you'll use the `cursor` parameter to retrieve the next page of your query results.

:::tip

If your initial query has another page of results, the `next_cursor` response parameter is the key returned that will unlock your next page of results. Use this key to query the datastore again and set `cursor` to the value of `next_cursor`.

Remember that filters are applied post-hoc, so you should always be sure to check subsequent pages for results, even if the initial page has fewer results than expected. Continue to the [filter expressions](#filter-expressions) section for more context.

:::

## Filter expressions {#filter-expressions}

Because datastore `query` is a DynamoDB [scan](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Scan.html), all query expressions are essentially filter expressions: it's what you put in the value of the `expression` argument. Filter expressions are applied post-hoc. This is important to understand because it can yield some confusing results; i.e. return fewer results than requested yet have additional pages of results to be queried and [paginated](#pagination). Each query can return a maximum of 1MB of data per page of results, and returns all results of the datastore _before_ applying any filter conditions. The filter conditions are applied to each page of results individually. This is how you could end up with the first page of zero results, yet still have a cursor for a following page of results.

Here is the full list of comparison operators to use in a filter expression, followed by some examples:

| Operator | Description | Example |
| ---------| ----------- | ------- |
| `=` | True if both values are equal | `a = b` |
| `<` | True if the left value is less than but not equal to the right | `a < b` |
| `<=` | True if the left value is less than or equal to the right | `a <= b` |
| `>` | True if the left value is greater than but not equal to the right | `a > b` |
| `>=` | True if the left value is greater than or equal to the right | `a >= b` |
| `BETWEEN ... AND ` | True if one value is greater than or equal to one and less than or equal to another | `#time_stamp BETWEEN :ts1 AND :ts2` |
| `begins_with(str, substr)` | True if a `string` begins with `substring` | `begins_with("#message_term", ":message")` |
| `contains (path, operand)` | True if attribute specified by `path` is a string that contains the `operand` string | `contains (#song, :inputsong)`

:::warning[Expressions can only contain non-primary key attributes]

If you try to write an expression that uses a primary key as its attribute (for example, to pull a single row from a datastore), you will receive a cryptic error. Please use [`apps.datastore.get`](#get) instead. We're hard at work on making these types of errors easier to understand!

:::

Revisiting our `drafts` datastore, here we retrieve all the announcements created by user `C123ABC456`:

```javascript
const result = await client.apps.datastore.query({
    datastore: "drafts",
    expression: "#announcement_creator = :user",
    expression_attributes: { "#announcement_creator": "created_by" },
    expression_values: { ":user": "C123ABC456" },
});
```

If you wanted to verify the query before putting it in your app code, the CLI query for that same search would be:

```bash
slack datastore query '{
  "datastore": "drafts",
  "expression": "#announcement_creator = :user",
  "expression_attributes": { "#announcement_creator": "created_by"},
  "expression_values": {":user": "C123ABC456"}
}'
```

Here's an example of a function that receives a string `message` via an `input` and queries for the announcement record that matches the provided message:

```javascript
const result = await client.apps.datastore.query({
    datastore: "drafts",
    expression: "contains (#message_term, :message)",
    expression_attributes: { "#message_term": "message" },
    expression_values: { ":message": input.message },
});
```

You could also chain expressions together to narrow your results even further:

```javascript
const result = await client.apps.datastore.query({
    datastore: "drafts",
    expression: "contains (#message_term, :message) AND #announcement_creator = :creator",
    expression_attributes: { "#message_term": "message", "#announcement_creator": "created_by" },
    expression_values: { ":message": input.message, ":creator": input.creator },
});
```

## Count items with `count` {#count}

As mentioned above, querying a datastore uses a DynamoDB scan to return an array of matching items for your query results. We also mentioned that each query, i.e. each DynamoDB scan, can return a maximum of 1MB of data per page of results. For that reason, if you have over 1MB of data in your datastore, multiple scans are necessary to paginate through your entire datastore. 

DynamoDB accomplishes this by returning a cursor to start a new scan where you left off with your previous one. Therefore if you wanted to use the `query` method to count all of the matching items in your datastore, you would need to call the `query` command several times, then manually add together the sizes of each array of matching items returned.

Instead, you can use the `count` method to paginate through your datastore and sum up the count of all the items matching your query. If a query is not provided, the count will be equal to the number of items in the entire datastore.

Using the DynamoDB style of syntax, the following example would retrieve the number of records from a datastore called "good_tunes", where "You" is in the song title:

```json
{
    "datastore": "good_tunes",
    "expression": "contains (#song, :keyword)",
    "expression_attributes": { "#song": "song" },
    "expression_values": { ":keyword": "You" }
}
```

The response to the request might look like the following:

```json
{
    "ok": true,
    "datastore": "good_tunes",
    "count": 2
}
```
