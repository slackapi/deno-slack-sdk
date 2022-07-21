## Block Kit Action Handlers

Your application's [functions][functions] can do a wide variety of interesting
things: post messages, create channels, or anything available to developers via
the [Slack API][api]. One of the more compelling features available to app developers
is the ability to use [Block Kit][block-kit] to add richness and depth to messages
in Slack. Even better, [Block Kit][block-kit] supports a variety of [interactive components][interactivity]!
This document explores the APIs available to app developers building Run-On-Slack applications
to leverage these [interactive components][interactivity] and how applications can respond to user interactions
with these [interactive components][interactivity].

If you're already familiar with the main concepts underpinning Block Kit Action Handlers,
then you may want to skip ahead to the [`BlockActionsRouter` API Reference](#api-reference).

### Requirements

Your app needs to have an existing [Function][functions] defined, implemented and working
before you can add interactivity handlers like Block Kit Action Handlers to them.
Make sure you have followed our [Functions documentation][functions] and have a
function in your app ready that we can expand with a Block Kit Action Handler.

As part of exploring how Block Kit Action Handlers work, we'll walk through an
approval flow example. A user would trigger our app's function, which would post
a message with two buttons: Approve and Deny. Once someone clicks either button,
our app will handle these button interactions - these Block Kit Actions - and
update the original message with either an "Approved!" or "Denied!" text.

For the purposes of walking through this approval flow example, let us assume the
following [Function][functions] definition:

```typescript
import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const ApprovalFunction = DefineFunction({
  callback_id: "review_approval",
  title: "Approval",
  description: "Get approval for a request",
  source_file: "functions/approval/mod.ts",
  input_parameters: {
    properties: {
      requester_id: {
        type: Schema.slack.types.user_id,
        description: "Requester",
      },
      approval_channel_id: {
        type: Schema.slack.types.channel_id,
        description: "Approval channel",
      },
    },
    required: [
      "requester_id",
      "approval_channel_id",
    ],
  },
  output_parameters: {
    properties: {
      approved: {
        type: Schema.types.boolean,
        description: "Approved",
      },
      reviewer: {
        type: Schema.slack.types.user_id,
        description: "Reviewer",
      },
      message_ts: {
        type: Schema.types.string,
        description: "Request Message TS",
      },
    },
    required: ["approved", "reviewer", "message_ts"],
  },
});
```

### Posting a Message with Block Kit Elements

First, we need a message that has some [interactive components][interactivity]
from [Block Kit][block-kit] included! We can modify one of our app's [Functions][functions]
to post a message that includes some interactive components. Here's an example function
that posts a message with two buttons: an approval button, and a deny button:

```typescript
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import { SlackAPI } from "deno-slack-api/mod.ts";
// ApprovalFunction is the function we defined in the previous section
import { ApprovalFunction } from "./definition.ts";

const approval: SlackFunctionHandler<typeof ApprovalFunction.definition> =
  async ({ inputs, token, env }) => {
    console.log('Incoming approval!');
    // A Slack API client, so that we can make API calls to Slack
    const client = SlackAPI(token, {
      slackApiUrl: env.SLACK_API_URL,
    });
    const resp = await client.chat.postMessage({
      channel: inputs.approval_channel_id,
      blocks: [{
        "type": "actions",
        "block_id": "mah-buttons",
        "elements": [{
          type: "button",
          text: {
            type: "plain_text",
            text: "Approve",
          },
          action_id: "approve_request",
          style: "primary",
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Deny",
          },
          action_id: "deny_request",
          style: "danger",
        }],
      }],
    });
    // Important to set completed: false! We will set the function's complete
    // status later - in our action handler
    return {
      completed: false,
    };
  };
```

The key bit of information we need to remember before moving on to adding an
action handler are the `action_id` and `block_id` properties defined in the `blocks`
payload. Using these IDs, we will be able to differentiate between the different
button components that users interacted with in this message.

### Defining a Block Actions Router

The [Deno Slack SDK][sdk] - which comes bundled in your generated Run-on-Slack
application - provides a `BlockActionsRouter`. This is a helpful utility to "route"
different Block Kit interactions to specific action handlers inside your application.

Continuing with our above example, we can now define a `BlockActionsRouter` that
will listen for actions on one of the interactive components we attached to the
message our main function posted: either the approve button being clicked or the
deny button being clicked. This code would live in the same file as our main function
code, and would look like this:

```typescript
import { BlockActionsRouter } from "deno-slack-sdk/mod.ts";
// We must pass in the function definition for our main function (we imported this in the earlier example code)
// when creating a new `BlockActionsRouter`
const ActionsRouter = BlockActionsRouter(ApprovalFunction);
// Now can use the router's addHandler method to register different handlers based on action properties like
// action_id or block_id
export const blockActions = ActionsRouter.addHandler(
  ['approve_request', 'deny_request'], // The first argument to addHandler can accept an array of action_id strings
  async ({ action, body, token, env }) => { // The second argument is the handler function itself
    console.log('Incoming action handler invocation', action);
    const client = SlackAPI(token, {
      slackApiUrl: env.SLACK_API_URL,
    });

    const outputs = {
      reviewer: body.user.id,
      // Based on which button was pressed - determined via action_id - we can
      // determine whether the request was approved or not.
      approved: action.action_id === "approve_request",
      message_ts: body.message.ts,
    };

    // Remove the button from the original message using the chat.update API
    // and replace its contents with the result of the approval.
    const updateMsgResp = await client.chat.update({
      channel: body.function_data.inputs.approval_channel_id,
      ts: outputs.message_ts,
      blocks: [{
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `${
              approved ? " :white_check_mark: Approved" : ":x: Denied"
            } by <@${outputs.reviewer}>`,
          },
        ],
      }],
    });

    // And now we can mark the function as 'completed' - which is required as
    // we explicitly marked it as incomplete in the main function handler.
    await client.functions.completeSuccess({
      function_execution_id: body.function_data.execution_id,
      outputs,
    });
});
```

Now when you run your app and trigger your function, you have the basics in place
to provide interactivity between your application and users in Slack!

### API Reference

[functions]: ./functions.md
[api]: https://api.slack.com/methods
[block-kit]: https://api.slack.com/block-kit
[interactivity]: https://api.slack.com/block-kit/interactivity
[sdk]: https://github.com/slackapi/deno-slack-sdk
