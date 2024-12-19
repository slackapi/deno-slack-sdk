---
slug: /deno-slack-sdk/guides/creating-an-interactive-message
---

# Creating an interactive message

<PaidPlanBanner />

Interactive messages are messages containing interactive Block Kit elements. Send interactive messages to users to collect dynamic input from users, and use that input to kick off other parts of your workflows.

Interactive messages are created with Block Kit, and have their interactions reflected by Block Kit action events. 

This page will guide you through adding Block Kit interactivity to your app's message.

✨  **To learn more about Block Kit**, refer to [Building with Block Kit](https://api.slack.com/block-kit/building) and [Interactivity in Block Kit](https://api.slack.com/block-kit/interactivity).

## 1. Create the function {#create-function}

Let's look at the example in the [Deno Request Time Off app](https://github.com/slack-samples/deno-request-time-off). It contains a workflow where one step is sending a message with two button options: **"Approve"** and **"Deny"**. When someone clicks either button, our app will handle these button interactions (which are composed in [Block Kit Actions](https://api.slack.com/reference/block-kit/blocks#actions)) and update the employee with notice that their request was either approved or denied.

First, we'll look at the function definition for [SendTimeOffRequestToManagerFunction](https://github.com/slack-samples/deno-request-time-off/blob/main/functions/send_time_off_request_to_manager/definition.ts) that defines the inputs that will appear in the message, and the outputs from the approver's interaction with the message:

```javascript
import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
/**
 * Custom function that sends a message to the user's manager asking for approval
 * for the time off request. The message includes some Block Kit with two interactive
 * buttons: one to approve, and one to deny.
 */
export const SendTimeOffRequestToManagerFunction = DefineFunction({
  callback_id: "send_time_off_request_to_manager",
  title: "Request Time Off",
  description: "Sends your manager a time off request to approve or deny",
  source_file: "functions/send_time_off_request_to_manager/mod.ts",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      employee: {
        type: Schema.slack.types.user_id,
        description: "The user requesting the time off",
      },
      manager: {
        type: Schema.slack.types.user_id,
        description: "The manager approving the time off request",
      },
      start_date: {
        type: Schema.slack.types.date,
        description: "Time off start date",
      },
      end_date: {
        type: Schema.slack.types.date,
        description: "Time off end date",
      },
      reason: {
        type: Schema.types.string,
        description: "The reason for the time off request",
      },
    },
    required: [
      "employee",
      "manager",
      "start_date",
      "end_date",
      "interactivity",
    ],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});
```

## 2. Add interactive Block Kit elements {#add-block-kit}

Using Block Kit, you can build a message layout that contains two button: **"Approve"** and **"Deny"**. To keep our app tidy, we have the implementation in a [separate file](https://github.com/slack-samples/deno-request-time-off/blob/main/functions/send_time_off_request_to_manager/mod.ts).

Here is the first part that creates the blocks:

```javascript

import { SendTimeOffRequestToManagerFunction } from "./definition.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";
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
      "type": "actions", // This is the type of layout block; learn more about other layout blocks types at https://api.slack.com/reference/block-kit/blocks 
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
    // To be continued in the next step...
```

## 3. Add the message functionality {#post} 

There are two Block Kit parameters that your Block Kit element will use for interactivity with other aspects of your workflow:

* The `action_id` property. This uniquely identifies a particular interactive component. This will be used to route the interactive callback to the correct handler when an interaction happens on that element.
* The `block_id` property.  This uniquely identifies the entire Block Kit element.

Then, we can use the provided Slack client in the function handler to call the [`chat.postMessage`](https://api.slack.com/methods/chat.postMessage) method directly to post our message. The message will contain two buttons the user can interact with: one for **"Approve"** and one for **"Deny"**.

```javascript

  // Send the message to the manager with the Slack client
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
  // Create an 'actions handler', which is a function that will be invoked
  // when specific interactive Block Kit elements (like buttons!) are interacted
  // with.
)
// To be completed in the next step...
```

We return `completed: false` here to ensure the function execution does not complete until the interactivity is complete. The function execution will be completed in the action handler in the next section.

## 4. Add a Block Kit handler to respond to Block Kit element interactions {#blockkit}

Now that we have some interactive components to listen for, let's define a handler to react to interactions with these components. There are two Block Kit handlers:
* the action handler
* the suggestions handler 

### Using the Block actions handler {#block-actions-handler}
When the interactive components are used in a function, we use `addBlockActionsHandler` chained onto the function to handle what happens after the interaction. 

In the same function source file (and "chaining" off our function implementation), we'll define a handler that will listen for actions performed on one of the two interactive components (`APPROVE_ID` and `DENY_ID`) that we'll attach to the message using the [`addBlockActionsHandler`](https://api.slack.com/reference/interaction-payloads/block-actions) helper method.

```javascript
// ... continued from the step above
.addBlockActionsHandler(
  // listen for interactions with components with the following action_ids
  [APPROVE_ID, DENY_ID],
  // interactions with the above two action_ids get handled by the function below
  async function ({ action, body, client }) {
    console.log("Incoming action handler invocation", action);

    const approved = action.action_id === APPROVE_ID;

    // Send manager's response as a message to employee
    const msgResponse = await client.chat.postMessage({
      channel: body.function_data.inputs.employee,
      blocks: [{
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text:
              `Your time off request from ${body.function_data.inputs.start_date} to ${body.function_data.inputs.end_date}` +
              `${
                body.function_data.inputs.reason
                  ? ` for ${body.function_data.inputs.reason}`
                  : ""
              } was ${
                approved ? " :white_check_mark: Approved" : ":x: Denied"
              } by <@${body.user.id}>`,
          },
        ],
      }],
      text: `Your time off request was ${approved ? "approved" : "denied"}!`,
    });
    if (!msgResponse.ok) {
      console.log(
        "Error during requester update chat.postMessage!",
        msgResponse.error,
      );
    }
```

The final piece is to update the manager's message to remove the buttons and reflect the approval state:

```javascript
    // Update the manager's message to remove the buttons and reflect the approval
    // state. Nice little touch to prevent further interactions with the buttons
    // after one of them were clicked.
    const msgUpdate = await client.chat.update({
      channel: body.container.channel_id,
      ts: body.container.message_ts,
      blocks: timeOffRequestHeaderBlocks(body.function_data.inputs).concat([
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `${
                approved ? " :white_check_mark: Approved" : ":x: Denied"
              }`,
            },
          ],
        },
      ]),
    });
    if (!msgUpdate.ok) {
      console.log("Error during manager chat.update!", msgUpdate.error);
    }

    // And now we can mark the function as 'completed' - which is required as
    // we explicitly marked it as incomplete in the main function handler.
    await client.functions.completeSuccess({
      function_execution_id: body.function_data.execution_id,
      outputs: {},
    });
  },
);
```

Remember to mark the function as completed. This is required since we explicitly marked it as incomplete in the main function handler previously.

### Using the Block suggestion handler {#block-suggestion-handler}

Use `addBlockSuggestionHandler` to respond to events that are uniquely created by the [select menu of external data source](https://api.slack.com/reference/block-kit/block-elements#external_select) interactive Block element. Similarly implemented as the Block actions handler above, a user would create a block with the [select menu of external data source](https://api.slack.com/reference/block-kit/block-elements#external_select) element, then chain the handler onto their function. 

Let's take a look at an example; this one posts an inspirational quote. Once invoked, this function will post a message with a drop-down select menu and a button. The options rendered in the select menu will be dynamically loaded from an external API. Here is the function definition:

```javascript
import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const QuoteFunction = DefineFunction({
  callback_id: "quote",
  title: "Inspire Me",
  description: "Get an inspirational quote",
  source_file: "functions/quote/mod.ts", // <-- important! Make sure this is where the logic for your function - which we will write in the next section - exists.
  input_parameters: {
    properties: {
      requester_id: {
        type: Schema.slack.types.user_id,
        description: "Requester",
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "Channel",
      },
    },
    required: [
      "requester_id",
      "channel_id",
    ],
  },
  output_parameters: {
    properties: {
      quote: {
        type: Schema.types.string,
        description: "Quote",
      },
    },
    required: ["quote"],
  },
});
```

With `QuoteFunction` defined, we can add the interactive elements:

```javascript
import { SlackFunction } from "deno-slack-sdk/mod.ts";
// QuoteFunction is the function we defined in the previous section
import { QuoteFunction } from "./definition.ts";

export default SlackFunction(QuoteFunction, async ({ inputs, client }) => {
  console.log("Incoming quote request!");

  await client.chat.postMessage({
    channel: inputs.channel_id,
    blocks: [{
      "type": "actions",
      "block_id": "so-inspired",
      "elements": [{
        type: "external_select",
        placeholder: {
          type: "plain_text",
          text: "Inspire",
        },
        action_id: "ext_select_input",
      }, {
        type: "button",
        text: {
          type: "plain_text",
          text: "Post",
        },
        action_id: "post_quote",
      }],
    }],
  });
  // Important to set completed: false! We should set the function's complete
  // status later - in the action handler responding to the button click
  return {
    completed: false,
  };
});
```

If this feels familiar to the Block actions handler example above, it's because it is! In the same way, we can then chain `addBlockSuggestionHandler` onto the function just as we did with `addBlockActionsHandler`:

```javascript
export default SlackFunction(QuoteFunction, async ({ inputs, client }) => {
  // ... the rest of your QuoteFunction logic here ...
}).addBlockSuggestionHandler(
  "ext_select_input", // The first argument to addBlockActionsHandler can accept an action_id string, among many other formats!
  // Check the API reference at the end of this document for the full list of supported options
  async ({ body, client }) => { // The second argument is the handler function itself
    console.log("Incoming suggestion handler invocation", body);
    // Fetch some inspirational quotes
    const apiResp = await fetch(
      "https://motivational-quote-api.herokuapp.com/quotes",
    );
    const quotes = await apiResp.json();
    console.log("Returning", quotes.length, "quotes");
    const opts = {
      "options": quotes.map((q) => ({
        value: `${q.id}`,
        text: { type: "plain_text", text: q.quote.slice(0, 70) },
      })),
    };
    return opts;
  },
);
```

Using the example above, you could next code what happens after the button click, such as posting the selection to the channel.

## Handling errors {#errors}

It's important to validate the input data you receive from the user.

1. First, validate that the user is authorized to pass the input.
2. Second, validate that the user is passing a value you expect to receive, and nothing more.

## Onward
Now you have some interactivity weaved within your app, hooray!

💻  **For an expanded version of the sample code provided above**, check out our [Request Time Off sample app](https://github.com/slack-samples/deno-request-time-off).

✨  **To learn more about leveraging built-in powers or defining your own**, check out [Slack functions](/deno-slack-sdk/guides/creating-slack-functions) and [custom functions](/deno-slack-sdk/guides/creating-custom-functions).

✨  **For more details about handling events**, check out [creating an interactive modal](/deno-slack-sdk/guides/creating-an-interactive-modal).
