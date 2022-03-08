## Shhhh Secret Block Kit support

This isn't really a secret, but it's pretty low-level, low-effort support in the
SDK for handling both `block_actions` and `view_submission` events. This is
meant to just enable it, but will definitely change in the future. It provides a
basic way to setup handlers for the 2 events listed.

### Grab the secret version

Update your `import_map.json` in your project to use version `0.4.1` or greater:

```json
{
  "imports": {
    "slack-cloud-sdk/": "https://slack.com/cloud/static/common/sdk@0.4.1/"
  }
}
```

(Force your deps to reload via `hermes deno cache --reload project.ts` and
running the VSCode command "Deno Restart Language Server")

### Block Actions

Functions can send messages via calls to `chat.postMessage`, and can include
interactive `blocks`. A block action handler can be setup as follows:

```ts
import { DefineBlockAction } from "slack-cloud-sdk/block-actions/mod.ts";

const myBlockAction = DefineBlockAction({
  { action_id: "review_approval" },
  async ({ client, body }) => {
    const responseURL = body.response_url;
    const userId = body.user.id;

    const resp = await client.response(responseURL, {
      text: `Button was pushed by <@${userId}>!`,
    });
    console.log("update message resp: ", resp);
  },
});
```

Then you can secretly register it on your [project][project] using the secret
`_actions` property:

```ts
// and regiter
Project({
  ...,
  _actions: [myBlockAction]
});
```

The `criteria` for a block action handler can include a `block_id` and/or
`action_id` value to assist in filtering.

### View Submissions

If you happen to open a modal in your block action handler via `views.open`
you'll need a way to setup a submission handler for it. Here ya go:

```ts
const myViewSubmission = {
  callback_id: "test_modal",
  handler: async ({ client, body }) => {
    console.log("view submission handler");
    // you probably shoved some state in here, I usually do
    const { channelId, userId } = JSON.parse(body.view.private_metadata);

    // we had an input for comments in our modal that we wanna grab
    const comments =
      body.view.state.values?.comments_block?.comments_input?.value ??
        "";

    // and we wanna send those comments somewhere
    const resp = await client.call("chat.postMessage", {
      channel: channelId,
      text: `Comments from <@${userId}>:\n>${comments}`,
    });

    console.log("resp", resp);
    // feel free to return an object w/ the standard errors payload if the view submission is invalid
  },
};
```

... and once again, very secretly register it on your [Project][project] via the
`_viewSubmissions` property:

```ts
Project({
  ...,
  _viewSubmissions: [myBlockAction]
});
```

_I'd be shocked if there weren't some rough edges with these 2 handlers, so feel
free to share anything you bump into_

[project]: ./project.md
