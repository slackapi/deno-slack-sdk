## Datastores

### Defining a Datastore

Datastores can be defined with the top level `DefineDatastore` export. Below is
an example of setting up a Datastore:

```ts
import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export const ReversalsDatastore = DefineDatastore({
  name: "reversals",
  attributes: {
    id: {
      type: Schema.types.string,
    },
    original: {
      type: Schema.types.string,
    },
    reversed: {
      type: Schema.types.string,
    },
  },
  primary_key: "id",
});
```

### Registering a Datastore to the App

To register the newly defined Datastore, add it to the array assigned to the
`datastores` parameter while defining the [`Manifest`][manifest].

```ts
export default Manifest({
  name: "admiring-ox-50",
  description: "Reverse a string",
  icon: "assets/icon.png",
  functions: [ReverseFunction],
  outgoingDomains: [],
  datastores: [ReversalsDatastore],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
  ],
});
```

Note: Registering a Datastore will automatically add `datastore:read` and
`datastore:write` to the App's defined `botScopes`.

### Using a Datastore in your custom function code

Now that you have a Datastore all set up, you can use it in your
[`functions`][functions]! Import the
[deno-slack-api](https://github.com/slackapi/deno-slack-api) library,
instantiate your client, and make an API call to one of the Datastore endpoints!

```ts
import { SlackAPI } from "deno_slack_api/mod.ts";

const reverse = async ({ inputs, env, token }: any) => {
  const original = inputs.stringToReverse;
  const recordId = crypto.randomUUID();
  const reversed = inputs.stringToReverse.split("").reverse().join("");

  const client = SlackAPI(token, {});
  const putResp = await client.apiCall("apps.datastore.put", {
    datastore: "reversals",
    item: {
      id: recordId,
      original,
      reversed,
    },
  });
  if (!putResp.ok) {
    return await {
      completed: false,
      error: putResp.error,
    };
  }
  ...
```

[functions]: ./functions.md
[manifest]: ./manifest.md
