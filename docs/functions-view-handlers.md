## View Handlers

Your application's [functions][functions] can do a wide variety of interesting
things: post messages, create channels, or anything available to developers via
the [Slack API][api]. They can even include [interactive components][interactivity]
or pop up a [Modal][modals]. [Modals][modals] are composed of up to three [Views][views].
These [Views][views] can contain form inputs or [interactive components][interactivity].
[Views][views] themselves may also [trigger events][view-events].
This document explores the APIs available to app developers building Run-On-Slack applications
to create [modals][modals] composed of [views][views] and how applications can
respond to the [view submission and closed events][view-events] they can trigger.

If you're already familiar with the main concepts underpinning View Handlers,
then you may want to skip ahead to the [API Reference](#api-reference).

- [View Handlers](#view-handlers)
  - [Requirements](#requirements)
  - [Opening a View](#opening-a-view)
    - [Opening a View from a custom function](#opening-a-view-from-a-custom-function)
    - [Opening a View from a Block Action Handler](#opening-a-view-from-a-block-action-handler)
  - [Adding View Handlers](#adding-view-handlers)
  - [API Reference](#api-reference)
    - [`addViewSubmissionHandler(constraint, handler)`](#addviewsubmissionhandlerconstraint-handler)
      - [`addViewClosedHandler(constraint, handler)`](#addviewclosedhandlerconstraint-handler)

### Requirements

This functionality requires at least version 0.2.0 of the [`deno-slack-sdk`][sdk].

Your app needs to have an existing [function][functions] defined, implemented and working
before you can add interactivity handlers like View Handlers or
[Block Kit Action Handlers][action-handlers] to them.
Make sure you have followed our [functions documentation][functions] and have a
function in your app ready that we can expand with a View Handler.

As part of exploring how View Handlers work, we'll walk through a simple diary
flow example. It is nothing more than a contrived example aimed at showing off
the APIs. A user would trigger our app's function, which would open a view with
a single text input. If the view is submitted with content, the application will
send the user a DM with their inputted content. If the view is closed, the application
will send the user a DM encouraging them not to give up on their diarying habit.

For the purposes of walking through this approval flow example, let us assume the
following [function][functions] definition (that we will store in a file called
`definition.ts` under the `functions/diary/` subdirectory inside your app):

```typescript
import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const DiaryFunction = DefineFunction({
  callback_id: "diary",
  title: "Diary",
  description: "Write a diary entry",
  source_file: "functions/diary/mod.ts", // <-- important! Make sure this is where the logic for your function - which we will write in the next section - exists.
  input_parameters: {
    properties: {
      interactivity: { // <-- important! This gives Slack a hint that your function will create interactive elements like views
        type: Schema.slack.types.interactivity,
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});
```

### Opening a View

[Opening a view via the `views.open` API][views-open] and
[pushing a new view onto the view stack via the `views.push` API][views-push]
both require the use of a [`trigger_id`][trigger-ids]. These are identifiers
representing specific user interactions. Slack uses these to prevent applications
from haphazardly opening modals in users' faces willy-nilly. Without a `trigger_id`,
your application can't create a modal and open a view. FYI `trigger_id`s are also
known as `interactivity_pointer`s.

As such, there are two ways to open a view from inside a Run-On-Slack application:
doing so [from a function directly](#opening-a-view-from-a-function) vs. doing
so [from a Block Action Handler](#opening-a-view-from-a-block-action-handler).
The sections covering each approach below discuss how to retrieve the `trigger_id`
in each scenario.

We will explore implementing our contrived example above by opening a view from
a function. In a section further below, we will also cover
[opening a view from a Block Action Handler](#opening-a-view-from-a-block-action-handler).

#### Opening a View from a custom function

As mentioned in the previous section, we need to have a `trigger_id` handy in
order to open a view. This is why we defined an `interactivity` input in our
function definition earlier: this input will magically provide us with a
`trigger_id`. The property to use as a `trigger_id` exists on inputs with the
type `Schema.slack.types.interactivity` under the `interactivity_pointer` property.
Check out the code below for an example:

```typescript
import { SlackFunction } from "deno-slack-sdk/mod.ts";
// DiaryFunction is the function we defined in the previous section
import { DiaryFunction } from "./definition.ts";

export default SlackFunction(DiaryFunction, async ({ inputs, client }) => {
  console.log('Someone might want to write a diary entry...');

  await client.views.open({
    trigger_id: inputs.interactivity.interactivity_pointer,
    view: {
      "type": "modal",
      "title": {
        "type": "plain_text",
        "text": "Modal title",
      },
      "blocks": [
        {
          "type": "input",
          "block_id": "section1",
          "element": {
            "type": "plain_text_input",
            "action_id": "diary_input",
            "multiline": true,
            "placeholder": {
              "type": "plain_text",
              "text": "What is on your mind today?",
            },
          },
          "label": {
            "type": "plain_text",
            "text": "Diary Entry",
          },
          "hint": {
            "type": "plain_text",
            "text": "Don't worry, no one but you will see this.",
          },
        },
      ],
      "close": {
        "type": "plain_text",
        "text": "Cancel",
      },
      "submit": {
        "type": "plain_text",
        "text": "Save",
      },
      "callback_id": "view_identifier_12", // <-- remember this ID, we will use it to route events to handlers!
      "notify_on_close": true, // <-- this must be defined in order to trigger `view_closed` events!
    },
  });
  // Important to set completed: false! We will set the function's complete
  // status later - in our view submission handler
  return {
    completed: false,
  };
};
```

#### Opening a View from a Block Action Handler

If [Block Kit Action Handlers][action-handlers] is a foreign concept to you, we
recommend first checking out [its documentation][action-handlers] before venturing
deeper into this section.

Similarly to opening a view from a function, doing so from a
[Block Action Handler][action-handlers] is straightforward though slightly
different. It is important to remember that `trigger_id`s represent a unique
user interaction with a particular interactive component within Slack's UI.
As such, when responding to a Block Kit Action interactive component, we don't
want to use your function's `inputs` to retrieve the `interactivity_pointer`,
as we did in the previous section, but rather, we want to retrieve a `trigger_id`
that is unique to the Block Kit interactive component.

Luckily for us, this is provided as a parameter to Block Kit Action Handlers!
You can use the value of `body.interactivity.interactivity_pointer` within an action
handler to open a view, like so:

```typescript
export default SlackFunction(DiaryFunction, async ({ inputs, client }) => {
  // ... the rest of your DiaryFunction logic here ...
}).addBlockActionsHandler(
  'deny_request',
  async ({ action, body, client }) => {
    await client.views.open({
      trigger_id: body.interactivity.interactivity_pointer,
      view: { /* your view object goes here */ },
    });
  });
```

### Adding View Handlers

The [Deno Slack SDK][sdk] - which comes bundled in your generated Run-on-Slack
application - provides a means for defining handlers to execute every time a user
interacts with a view. In this way you can route view-related events to specific
handlers inside your application. The key identifier that we'll need to keep handy
is the `callback_id` we assigned to any views we created. This ID will be the property
that determines which view event handler will respond to incoming view events.

Continuing with our above example, we can now define handlers that will listen
for view submission and closed events and respond accordingly. The code to add
view handlers is "chained" off of your top-level function, and would look like
this:

```typescript
export default SlackFunction(DiaryFunction, async ({ inputs, client }) => {
  // ... the rest of your DiaryFunction logic here ...
}).addViewSubmissionHandler(
    /view/, // The first argument to any of the addView*Handler methods can accept a string, array of strings, or RegExp.
    // This first argument will be used to match the view's `callback_id`
    // Check the API reference at the end of this document for the full list of supported options
    async ({ view, body, token }) => { // The second argument is the handler function itself
      console.log('Incoming view submission handler invocation', body);
    }
  )
  .addViewClosedHandler(
    /view/,
    async({ view, body, token }) => {
      console.log('Incoming view closed handler invocation', body);
    }
  );
```

Importantly, more complex applications will likely be modifying views as users
interact with them: updating the view contents (to e.g. add new form fields),
perhaps pushing a new view onto the view stack to introduce a new UI to the user,
maybe reporting errors to the user for some manner of faulty interaction, or even
clearing the entire view stack altogether. All of these modal interaction responses
are [covered in depth on our API documentation site][modifying] - make sure to
spend the time to understand the concepts presented there.

In particular, modal interactions can be responded to by using the API, or by returning
particularly-crafted responses directly from inside the view handlers. On our
[API site detailing view modification][modifying], these returned view handler
responses are called `response_action`s.

As an example, consider the following two code snippets. They yield identical behavior!

```typescript
export default SlackFunction(DiaryFunction, async ({ inputs, client }) => {
  // ... the rest of your DiaryFunction logic here ...
}).addViewSubmissionHandler(/view/, async ({ client, body }) => {
  // A view submission handler that pushes a new view using the API
  await client.views.push({
    trigger_id: body.trigger_id,
    view: { /* your view object goes here */ },
  });
}).addSubmissionHandler(/view/, async () => {
  // A view submission handler that pushes a new view using the `response_action`
  return {
    response_action: "push",
    view: { /* your view object goes here */ },
  };
});
```

### API Reference

#### `addViewSubmissionHandler(constraint, handler)`

```typescript
SlackFunction({ ... }).addViewSubmissionHandler("my_view_callback_id", async (ctx) => { ... });
```

`addViewSubmissionHandler` registers a view handler based on a `constraint` argument.
If any incoming [`view_submission` event][view-events] matches the `constraint`,
then the specified `handler` will be invoked with the event payload. This allows
for authoring focussed, single-purpose view handlers and provides a concise but
flexible API for registering handlers to specific view interactions.

`constraint` can be either a string, an array of strings, or a regular expression.

- A simple string `constraint` must match a view's `callback_id` exactly.
- An array of strings `constraint` must match a view's `callback_id` to any of
  the strings in the array.
- A regular expression `constraint` must match a view's `callback_id`.

##### `addViewClosedHandler(constraint, handler)`

```typescript
SlackFunction({ ... }).addViewClosedHandler("my_view_callback_id", async (ctx) => { ... });
```

⚠️ IMPORTANT: you must set a view's `notify_on_close` property to `true` for the
`view_closed` event to trigger; by default this property is `false`. See the
[View reference documentation - in particular the Fields section][view-ref] for
more information.

`addViewClosedHandler` registers a view handler based on a `constraint` argument.
If any incoming [`view_closed` event][view-events] matches the `constraint`,
then the specified `handler` will be invoked with the event payload. This allows
for authoring focussed, single-purpose view handlers and provides a concise but
flexible API for registering handlers to specific view interactions.

`constraint` can be either a string, an array of strings, or a regular expression.

- A simple string `constraint` must match a view's `callback_id` exactly.
- An array of strings `constraint` must match a view's `callback_id` to any of
  the strings in the array.
- A regular expression `constraint` must match a view's `callback_id`.

[functions]: ./functions.md
[action-handlers]: ./functions-action-handlers.md
[api]: https://api.slack.com/methods
[block-kit]: https://api.slack.com/block-kit
[interactivity]: https://api.slack.com/block-kit/interactivity
[sdk]: https://github.com/slackapi/deno-slack-sdk
[modals]: https://api.slack.com/surfaces/modals
[views]: https://api.slack.com/surfaces/modals/using
[modifying]: https://api.slack.com/surfaces/modals/using#modifying
[trigger-ids]: https://api.slack.com/interactivity/handling#modal_responses
[view-events]: https://api.slack.com/reference/interaction-payloads/views
[views-methods]: https://api.slack.com/methods?filter=views
[views-open]: https://api.slack.com/methods/views.open
[views-update]: https://api.slack.com/methods/views.update
[views-push]: https://api.slack.com/methods/views.push
[view-ref]: https://api.slack.com/reference/surfaces/views
