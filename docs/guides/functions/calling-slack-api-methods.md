---
slug: /deno-slack-sdk/guides/calling-slack-api-methods
---

# Calling Slack API methods

<PaidPlanBanner />

With workflow apps, you can interface with the Slack API we've come to know and love. While building, you can access and make calls to the Slack API via the `client` context property of a `SlackFunction`. Think of `SlackFunction` as a utility employed for implementing [custom functions](/deno-slack-sdk/guides/creating-custom-functions). It ensures input validity, provides auto-complete functionality, and manages the app's access token so you don't have to (you can thank us later).

To use the `client` context property, import `SlackFunction` from `deno-slack-sdk` to your custom function file and add the `client` context property to your `SlackFunction`, as shown below. Only the `inputs` and `client` context properties are shown in this example, but other context properties you might want to include are outlined on the [custom functions](/deno-slack-sdk/guides/creating-custom-functions#context) page.

```js
// functions/example_function.ts
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const ExampleFunctionDefinition = DefineFunction({
  callback_id: "example_function_def",
  title: "Example function",
  source_file: "functions/example_function.ts",
});

export default SlackFunction(
  ExampleFunctionDefinition,
  ({ inputs, client }) => { // Add `client` here

  // ...
```

The `client` property allows you to access the Slack API in one of two ways:

- `client.<noun>.<verb>` (e.g., `client.chat.postMessage`)
- `client.apiCall('<nounVerb>')` (e.g., `client.apiCall('chat.postMessage', {/* ... */});`)

These API calls return a promise, so be sure to `await` their responses. A promise in TypeScript allows for asynchronous programming - handling multiple tasks at the same time. 

For example, let's look at our sample app, [Deno Request Time Off](https://github.com/slack-samples/deno-request-time-off), and send a message to a user's manager to request time off:

```js
// functions/send_time_off_request_to_manager/definition.ts
import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

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
        type: "slack#/types/date",
        description: "Time off start date",
      },
      end_date: {
        type: "slack#/types/date",
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

// functions/send_time_off_request_to_manager/mod.ts

import { SendTimeOffRequestToManagerFunction } from "./definition.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";
import BlockActionHandler from "./block_actions.ts";
import { APPROVE_ID, DENY_ID } from "./constants.ts";
import timeOffRequestHeaderBlocks from "./blocks.ts";

export default SlackFunction(
  SendTimeOffRequestToManagerFunction,
  async ({ inputs, client }) => {
    console.log("Forwarding the following time off request:", inputs);

    // ...

    // Send the message to the manager
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
  }
  
    // ...
```

Most API endpoints require specific [permission scopes](https://api.slack.com/scopes). Add scopes to your app by listing them in the `botScopes` property of your [manifest](/deno-slack-sdk/guides/using-the-app-manifest).

## Slack API methods
You can call any Slack API method that is accessible via a [bot token](https://api.slack.com/concepts/token-types#bot) listed in the [method documentation](https://api.slack.com/methods). On those pages, you will discover more ways to access Slack API methods, but for use within workflow apps, we recommend using `SlackFunction` outlined here.

## Next up
➡️ **To learn more about the custom functions** you can implement using `SlackFunction`, check out [custom functions](/deno-slack-sdk/guides/creating-custom-functions).
