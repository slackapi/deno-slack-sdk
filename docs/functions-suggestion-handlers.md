## Block Kit Suggestion Handlers

Your application's [functions][functions] can do a wide variety of interesting
things: post messages, create channels, or anything available to developers via
the [Slack API][api]. One of the more compelling features available to app developers
is the ability to use [Block Kit][block-kit] to add richness and depth to messages
in Slack. Even better, [Block Kit][block-kit] supports a variety of [interactive components][interactivity]!
This document explores the how to implement responding to interactions with
[external-data-sourced Block Kit drop-down menus](https://api.slack.com/reference/block-kit/block-elements#external_select).

If you're already familiar with the main concepts underpinning Block Kit Suggestion Handlers,
then you may want to skip ahead to the [`addBlockSuggestionHandler()` method API Reference](#api-reference).

1. [Requirements](#requirements)
2. [Posting a Message with Block Kit Elements](#posting-a-message-with-block-kit-elements)
3. [Adding Block Action Handlers](#adding-block-action-handlers)
4. [API Reference](#api-reference)
    - [`addBlockSuggestionHandler()`](#addblocksuggestionhandlerconstraint-handler)

### Requirements

Your app needs to have an existing [Function][functions] defined, implemented and working
before you can add interactivity handlers like Block Kit Suggestion Handlers to them.
Make sure you have followed our [Functions documentation][functions] and have a
function in your app ready that we can expand with interactivity. Familiarity with
the [Block Kit Actions Handlers](./functions-action-handlers.md) would be a huge
plus as the handling Block Kit Actions and handling Block Kit Suggestions is practically
identical.

As part of exploring how Block Kit Suggestion Handlers work, we'll walk through an
example that posts an inspirational quote. A user would trigger our app's function,
which would post a message with a drop down select menu and a button. The options
rendered in the select menu will be dynamically loaded from an external API. Finally,
when someone has selected a drop-down menu option and clicked the button, our app
can post the selection to the channel (note: for the purposes of describing how to
respond to the select menu interactions, we won't cover handling the button click
or posting the selection in this document).

For the purposes of walking through this example, let us assume the following
[Function][functions] definition (that we will store in a file called `definition.ts`
under the `functions/quote/` subdirectory inside your app):

```typescript
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

### Posting a Message with Block Kit Elements

First, we need a message that has some [interactive components][interactivity]
from [Block Kit][block-kit] included! We can modify one of our app's [Functions][functions]
to post a message that includes some interactive components - including our external
select drop down menu. Here's an example function (which we will assume exists in
a `mod.ts` file under the `functions/quote/` subdirectory in your app) that posts
a message with a external data select drop down menu:

```typescript
import { SlackFunction } from "deno-slack-sdk/mod.ts";
// QuoteFunction is the function we defined in the previous section
import { QuoteFunction } from "./definition.ts";

export default SlackFunction(QuoteFunction, async ({ inputs, client }) => {
  console.log('Incoming quote request!');

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
      },
      {
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

The key bit of information we need to remember before moving on to adding a
suggestion handler are the `action_id` and `block_id` properties defined in the `blocks`
payload. Using these IDs, we will be able to differentiate between the different
Block Kit components that users interacted with in this message.

### Adding Block Suggestion Handlers

The [Deno Slack SDK][sdk] - which comes bundled in your generated Run-on-Slack
application - provides a means for defining a handler to execute every time a user
interacts with an interactive Block Kit element created by your function.

Continuing with our above example, we can now define a handler that will listen
for interactions with the external data drop down menu. The code to add a Block Kit
suggestion handler is "chained" off of your top-level function, and would look like this:

```typescript
export default SlackFunction(QuoteFunction, async ({ inputs, client }) => {
  // ... the rest of your QuoteFunction logic here ...
}).addBlockSuggestionHandler(
  "ext_select_input", // The first argument to addBlockActionsHandler can accept an action_id string, among many other formats!
  // Check the API reference at the end of this document for the full list of supported options
  async ({ body, client }) => { // The second argument is the handler function itself
    console.log('Incoming suggestion handler invocation', body);
    // Fetch some inspirational quotes
    const apiResp = await fetch("https://motivational-quote-api.herokuapp.com/quotes");
    const quotes = await apiResp.json();
    console.log('Returning', quotes.length, 'quotes');
    const opts = {
      "options": quotes.map((q) => ({value: `${q.id}`, text: {type:"plain_text", text: q.quote.slice(0,70)}}))
    };
    return opts;
  }
);
```

### API Reference

##### `addBlockSuggestionHandler(constraint, handler)`

```typescript
SlackFunction({ ... }).addBlockSuggestionHandler({ block_id: "mah-buttons", action_id: "approve_request"}, async (ctx) => { ... });
```

`addBlockSuggestionHandler` registers a block suggestion handler based on a `constraint`
argument. If any incoming suggestion events match the `constraint`, then the specified
`handler` will be invoked with the suggestion payload. This allows for authoring focussed,
single-purpose suggestion handlers and provides a concise but flexible API for registering
handlers to specific external-data-sourced drop down menu.

`constraint` is of type [`BlockActionConstraint`][constraint], which itself can
be either a [`BlockActionConstraintField`](#blockactionconstraintfield) or a [`BlockActionConstraintObject`](#blockactionconstraintobject).

If a [`BlockActionConstraintField`](#blockactionconstraintfield) is used as the
value for `constraint`, then this will be matched against the incoming action's
`action_id` property.

[`BlockActionConstraintObject`](#blockactionconstraintobject) is a more complex
object used to match against actions. It contains nested `block_id` and `action_id`
properties - both optional - that are used to match against the incoming suggestion.

###### `BlockActionConstraintField`

```typescript
type BlockActionConstraintField = string | string[] | RegExp;
```

- when provided as a `string`, it must match the field exactly.
- when provided as an array of `string`s, it must match one of the array values exactly.
- when provided as a `RegExp`, the regular expression must match.

###### `BlockActionConstraintObject`

```typescript
type BlockActionConstraintObject = {
  block_id?: BlockActionConstraintField;
  action_id?: BlockActionConstraintField;
};
```

This object can contain two properties, both optional: `action_id` and/or `block_id`.
The type of each property is [`BlockActionConstraintField`](#blockactionconstraintfield).

If both `action_id` and `block_id` properties exist on the `constraint`, then both
`action_id` and `block_id` properties _must match_ any incoming suggestion. If only
one of these properties is provided, then only the provided property must match.

[functions]: ./functions.md
[api]: https://api.slack.com/methods
[block-kit]: https://api.slack.com/block-kit
[interactivity]: https://api.slack.com/block-kit/interactivity
[sdk]: https://github.com/slackapi/deno-slack-sdk
[constraint]: ../src/functions/routers/types.ts#L53-L62
