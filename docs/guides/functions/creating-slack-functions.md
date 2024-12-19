---
slug: /deno-slack-sdk/guides/creating-slack-functions
---

# Creating Slack functions

<PaidPlanBanner />

Slack functions are essentially Slack-native actions, like creating a channel or sending a message. Use them alongside your [custom functions](/deno-slack-sdk/guides/creating-custom-functions) in a [workflow](/deno-slack-sdk/guides/creating-workflows). [Browse our inventory of Slack functions](/deno-slack-sdk/reference/slack-functions).

Slack functions need to be imported from the standard library built into the [Slack Deno SDK](https://github.com/slackapi/deno-slack-sdk)&mdash;all Slack functions are children of the `Schema.slack.functions` object. Just like custom functions, Slack functions can be added to steps in a workflow using the `addStep` method. 

Slack functions define their own inputs and outputs, as detailed for each Slack function in the catalog below.

## Slack functions catalog {#catalog}

The details for each Slack function can be found in our [reference documentation](/deno-slack-sdk/reference/slack-functions).

## Slack function example {#example}

Here's an example of a workflow that creates a new Slack channel using the [`CreateChannel`](/deno-slack-sdk/reference/slack-functions/create_channel) Slack function:

```javascript
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

// Define a workflow that can pass the parameters for the Slack function
const myWorkflow = DefineWorkflow({
  callback_id: "channel-creator",
  title: "Channel Creator",
  input_parameters: {
    properties: { channel_name: { type: Schema.types.string } },
    required: ["channel_name"],
  },
});

const createChannelStep = myWorkflow.addStep(
  Schema.slack.functions.CreateChannel,
  {
    channel_name: myWorkflow.inputs.channel_name,
    is_private: false,
  },
);

export default myWorkflow;
```

## Timeouts for functions

 When building workflows using functions, there is a 60 second timeout for a deployed function and a 15 second timeout for a locally-run function.

 For deployed functions using a `block_suggestion`, `block_actions`, `view_submission`, or `view_closed` payload, there is a 10 second timeout.
 
 If a function has not finished running within its respective time limit, you will see an error in your log. Refer to [logging](/deno-slack-sdk/guides/logging-function-and-app-behavior) for more details.

---

➡️  **To learn how to add a Slack function to a workflow**, head to the [workflows](/deno-slack-sdk/guides/creating-workflows) section.

➡️ **To browse all Slack functions**, head to the [Slack Function reference catalog](/deno-slack-sdk/reference/slack-functions)

✨  **To learn how to create your own _custom_ functions**, head to the [custom functions](/deno-slack-sdk/guides/creating-custom-functions) section.

