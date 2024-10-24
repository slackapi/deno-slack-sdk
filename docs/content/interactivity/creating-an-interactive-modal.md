# Creating an interactive modal

A [modal](/surfaces/modals) is similar to an alert box, pop-up, or dialog box within Slack. Modals capture and maintain focus within Slack until the user submits or closes the modal. This makes them a powerful piece of app functionality for engaging with users.

Interactive modals are modals containing interactive [Block Kit elements](/block-kit). Modals have a larger catalog of available interactive Block Kit elements than messages.

Modals can be opened via a Block Kit interaction or a [link trigger](/automation/triggers/link). A modal is updated by View events (close and submit) to reflect the user's inputs as they interact with the modal.

This guide will use the an example file from our [deno-code-snippets](https://github.com/slack-samples/deno-code-snippets) repository.

✨ **If you'd like a full sample app that uses modal interactivity**, check out the [Simple Survey sample app](https://github.com/slack-samples/deno-simple-survey). 

## Add `interactivity` to your function definition {#add-interactivity}

A function needs to have an `interactivity` parameter added to have interactive functionality. The `interactivity` parameter is required to ensure users don't experience any unexpected or unwanted modals appearing&mdash;only their interaction can open a modal. The `interactivity` parameter is short-lived for this same reason, meaning as a developer you will need to keep grabbing a new one from the user as continued consent to modal views and updates.

For modals, `interactivity` takes the form of the unique identifier `interactivity_pointer`. There are two different ways to retrieve and consume an `interactivity_pointer` when working with modals.

1. When opening a modal view via [link trigger](/automation/triggers/link), add a property with the type `Schema.slack.types.interactivity` to the `properties` object within a function's `input_parameters`. Your function can then access that interactivity event via your function argument's `inputs.interactivity.interactivity_pointer`. Note that in this example, the function argument is named `interactivity`, but you may choose to name it anything, so long as you use that name to access the `interactivity_pointer`.
2. When opening or updating a modal view from a block or view event, use the `interactivity_pointer` provided as part of the `body` of the block or view event payload, _not_ from the `inputs` parameter. Your function can access it via `body.interactivity.interactivity_pointer`. You will also see an example of this in the [Opening a modal based on a Block Kit action](#open-block-kit-action) section below. 

In our example file [`/Block_Kit_Modals/functions/demo.ts`](https://github.com/slack-samples/deno-code-snippets/blob/main/Block_Kit_Modals/functions/demo.ts), `interactivity` is added to the function's input parameters, since the modal is opened via link trigger:

```javascript
// /functions.demo.ts

import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const def = DefineFunction({
  callback_id: "block-kit-modal-demo",
  title: "Block Kit modal demo",
  source_file: "Block_Kit_Modals/functions/demo.ts",
  input_parameters: {
    properties: { interactivity: { type: Schema.slack.types.interactivity } },
    required: ["interactivity"],
  },
  output_parameters: { properties: {}, required: [] },
});
// To be continued ...
```

## Build a modal view {#build}

Modal views are constructed partially using [Block Kit](/block-kit) pieces. That view will then be placed within an API call later on. 

Below is our example modal:

```javascript
view: {
  "type": "modal",
  // Note that this ID can be used for dispatching view_submission and view_closed events.
  "callback_id": "first-page",
  // This option is required to be notified when this modal is closed by the user
  "notify_on_close": true,
  "title": { "type": "plain_text", "text": "My App" },
  // Not all modals need a submit button, but since we want to collect input, we do
  "submit": { "type": "plain_text", "text": "Next" },
  "close": { "type": "plain_text", "text": "Close" },
  "blocks": [
    {
      "type": "input",
      "block_id": "first_text",
      "element": { "type": "plain_text_input", "action_id": "action" },
      "label": { "type": "plain_text", "text": "First" },
    },
  ],
},
```

Check out [Using the block suggestion handler](/automation/interactive-messages#block-suggestion-handler) on the [Interactive messages](/automation/interactive-messages) page to learn how to use the Block Kit element [select menu of external data source](/reference/block-kit/block-elements#external_select). Its use in modals and messages is similar.

## Open a modal within your function {#open}

With interactivity added to the function definition, we can open the interactive modal view. A view is opened using the [`views.open`](/methods/views.open) method. 

A modal view can be opened based on either of the following, causing your function to run:

* a trigger (for example, clicking on a link trigger)
* a previous Block Kit action (for example, clicking a button in a message)

Our example uses the first method.

Some important considerations to note so that you can ensure your modal isn't left floating in the vast sea of suspended modals:

1. Take note of the `callback_id`. We'll use it to define modal view handlers that react to `view_open` or `view_closed` events later.
1. Set `notify_on_close` to `true` in order to trigger a `view_closed` event.

### Open a modal based on a trigger {#open-trigger}

View this example in [demo.ts](https://github.com/slack-samples/deno-code-snippets/blob/cb432c83a539b9675e3dc7d9ec7c641c68a62a93/Block_Kit_Modals/functions/demo.ts):
```javascript
// demo.ts

export default SlackFunction(
  def,
  // ---------------------------
  // The first handler function that opens a modal.
  // This function can be called when the workflow executes the function step.
  // ---------------------------
  async ({ inputs, client }) => {
    // Open a new modal with the end-user who interacted with the link trigger
    const response = await client.views.open({
      interactivity_pointer: inputs.interactivity.interactivity_pointer,
      view: {
        "type": "modal",
        // Note that this ID can be used for dispatching view_submission and view_closed events.
        "callback_id": "first-page",
        // This option is required to be notified when this modal is closed by the user
        "notify_on_close": true,
        "title": { "type": "plain_text", "text": "My App" },
        "submit": { "type": "plain_text", "text": "Next" },
        "close": { "type": "plain_text", "text": "Close" },
        "blocks": [
          {
            "type": "input",
            "block_id": "first_text",
            "element": { "type": "plain_text_input", "action_id": "action" },
            "label": { "type": "plain_text", "text": "First" },
          },
        ],
      },
    });
    if (response.error) {
      const error =
        `Failed to open a modal in the demo workflow. Contact the app maintainers with the following information - (error: ${response.error})`;
      return { error };
    }
    return {
      // To continue with this interaction, return false for the completion
      completed: false,
    };
  },
)
```

Make sure to set the return to `completed: false`. You'll then set it to `true` later in your modal view event handler.

### Open a modal based on a Block Kit action {#open-block-kit-action}

Alternatively, a modal view can be opened using a Block Kit action handler. Below is the code structure for doing so:

```javascript
export default SlackFunction(ConfigureEventsFunctionDefinition, async ({ inputs, client }) => {

// "my_button" is the action_id of the Block element from which the action originated
).addBlockActionsHandler(["my_button"], async ({ body, client }) => {
  const openingModal = await client.views.open({
    interactivity_pointer: body.interactivity.interactivity_pointer,
    view,
  });
  if (openingModal.error) {
    return await client.functions.completeError({ function_execution_id: body.function_data.execution_id, error});
  }
});
```

## Update the modal view {#update}

With your defined modal view equipped with a `callback_id`, you can implement a modal view event handler to respond to interactions with your modal view. To respond to a `view_submission` event (the action of the user clicking the **Submit** button in your modal), use [`addViewSubmissionHandler`](https://github.com/slackapi/deno-slack-sdk/blob/main/docs/functions-view-handlers.md#addviewsubmissionhandlerconstraint-handler).

The handler can update or push a view in two ways:
* by making a call to the [`views.update`](/methods/views.update) API method or the [`views.push`](/methods/views.push) API method.
* by setting the [`response_action`](/surfaces/modals/using#updating_response) property on the object returned by your interactivity handler.

In addition to the `view_submission` and `view_closed` events, you can also update views using the `block_actions` and `options` events via the Block Kit action and suggestion handlers, respectively. Refer to [Add a Block Kit handler to respond to Block Kit element interactions](/automation/interactive-messages#blockkit) for more details.

In the examples below, the [`addViewSubmissionHandler`](https://github.com/slackapi/deno-slack-sdk/blob/main/docs/functions-view-handlers.md#addviewsubmissionhandlerconstraint-handler) method registers a handler to push a new view on to the [view stack](/surfaces/modals#lifecycle).

The first code snippet shows how to push a new view by calling `views.push`:

```javascript
// ...
.addViewSubmissionHandler(
  "first-page", // The callback_id of the modal
  async ({ inputs, client, body }) => {
    const response = await client.views.push({
      interactivity_pointer: body.interactivity.interactivity_pointer,
      view, 
    });
  },
)
// ...
```

The second code snippet shows how to use `response_action` to do the same thing. Both result in identical behavior!

```javascript
// ...
.addViewSubmissionHandler(
  "first-page", // The callback_id of the modal
  async () => {
    return {
      response_action: "push",
      view, 
    };
  },
)
// ...
```

In our example, we'll be using the second way&mdash;updating `response_action`&mdash;to provide a second modal view when the first modal data is submitted. 

### Example: updating with a new interactive modal {#update-interactive}
In this example, notice how we extract the input values from the prior view using `view.state.values`. This is a property of the [view interaction payload](/reference/interaction-payloads/views).

```javascript
  // ---------------------------
  // The handler that can be called when the above modal data is submitted.
  // It saves the inputs from the first page as private_metadata,
  // and then displays the second-page modal view.
  // ---------------------------
  .addViewSubmissionHandler(["first-page"], ({ view }) => {
    // Extract the input values from the view data
    const firstText = view.state.values.first_text.action.value;
    // Input validations
    if (firstText.length < 20) {
      return {
        response_action: "errors",
        // The key must be a valid block_id in the blocks on a modal
        errors: { first_text: "Must be 20 characters or longer" },
      };
    }
    // Successful. Update the modal with the second page presentation
    return {
      response_action: "update",
      view: {
        "type": "modal",
        "callback_id": "second-page",
        // This option is required to be notified when this modal is closed by the user
        "notify_on_close": true,
        "title": { "type": "plain_text", "text": "My App" },
        "submit": { "type": "plain_text", "text": "Next" },
        "close": { "type": "plain_text", "text": "Close" },
        // Hidden string data, which is not visible to end-users
        // You can use this property to transfer the state of interaction
        // to the following event handlers.
        // (Up to 3,000 characters allowed)
        "private_metadata": JSON.stringify({ firstText }),
        "blocks": [
          // Display the inputs from "first-page" modal view
          {
            "type": "section",
            "text": { "type": "mrkdwn", "text": `First: ${firstText}` },
          },
          // New input block to receive text
          {
            "type": "input",
            "block_id": "second_text",
            "element": { "type": "plain_text_input", "action_id": "action" },
            "label": { "type": "plain_text", "text": "Second" },
          },
        ],
      },
    };
  })
```

### Example: updating with a static confirmation modal {#update-static}

```javascript
  // ---------------------------
  // The handler that can be called when the second modal data is submitted.
  // It displays the completion page view with the inputs from
  // the first and second pages.
  // ---------------------------
  .addViewSubmissionHandler(["second-page"], ({ view }) => {
    // Extract the first-page inputs from private_metadata
    const { firstText } = JSON.parse(view.private_metadata!);
    // Extract the second-page inputs from the view data
    const secondText = view.state.values.second_text.action.value;
    // Displays the third page, which tells the completion of the interaction
    return {
      response_action: "update",
      view: {
        "type": "modal",
        "callback_id": "completion",
        // This option is required to be notified when this modal is closed by the user
        "notify_on_close": true,
        "title": { "type": "plain_text", "text": "My App" },
        // This modal no longer accepts further inputs.
        // So, the "Submit" button is intentionally removed from the view.
        "close": { "type": "plain_text", "text": "Close" },
        // Display the two inputs
        "blocks": [
          {
            "type": "section",
            "text": { "type": "mrkdwn", "text": `First: ${firstText}` },
          },
          {
            "type": "section",
            "text": { "type": "mrkdwn", "text": `Second: ${secondText}` },
          },
        ],
      },
    };
  })
```

## Success: closing a modal {#close-modal}

To respond to a `view_closed` event (the action of the user clicking the **Close** button on your modal), use [`addViewClosedHandler`](/reference/interaction-payloads/views#view_closed) and add a call to the [`functions.completeSuccess`](/methods/functions.completeSuccess) method to explicitly mark the function as complete like this:

```javascript
  // ---------------------------
  // The handler that can be called when the second modal data is closed.
  // If your app runs some resource-intensive operations on the backend side,
  // you can cancel the ongoing process and/or tell the end-user
  // what to do next in DM and so on.
  // ---------------------------
  .addViewClosedHandler(
    ["first-page", "second-page", "completion"],
    ({ view }) => {
      console.log(`view_closed handler called: ${JSON.stringify(view)}`);

      return await client.functions.completeSuccess({
            function_execution_id: body.function_data.execution_id,
            outputs: {},
      });
    },
  );
```

Remember, for an app to receive `view_closed` events, the view must set the `notify_on_close` option to `true` when it is initially opened or updated. 

## Error: handling an error {#errors}

 If the function execution was not successful, you can add a call to the [`functions.completeError`](/methods/functions.completeError) method to raise an error like so:

```javascript
const response = await client.functions.completeError({
  function_execution_id: body.function_data.execution_id,
  error: "Error completing function",
});
```

Once you have opened a modal and handled your modal views, you may decide that you'd like to display any potential data validation error messages to your users. It is important to validate the inputs you receive from the user: first, that the user is authorized to pass the input, and second, that the user is passing a value you expect to receive and nothing more.

As long as your submission handler returns an error object defined [on this page](/surfaces/modals/using#displaying_errors), the error messages you include in that object will be displayed right next to the relevant form fields based on their field IDs.

## Stop a workflow {#stop-workflow}

As discussed earlier, a function either completes successfully or fails with an error — and it's best practice to handle those events. However, there may be some cases in which you would like to stop a workflow early as a "quick fix" without necessarily calling [`functions.completeSuccess`](/methods/functions.completeSuccess) or [`functions.completeError`](/methods/functions.completeError). For example, when handling a modal view that the user closes prematurely:

* the drawback with calling `functions.completeSuccess` in this scenario is that the rest of the functions in your workflow now require additional logic to handle undefined or null outputs.
* the drawback with calling `functions.completeError` in this scenario is that when the user closes the modal prematurely (for example, they realize they don't have time to enter all the required details for the modal inputs), then all your admins are pinged by SlackBot with the resulting error.

So, what to do instead? Well, essentially, you can do nothing at all:

```javascript
export default SlackFunction(..., ...)
  .addViewClosedHandler("first-page", () => ({ client, body }) {
    // clean up stuff
   console.log('user closed modal view prematurely');
   // do nothing
  })
  ```

With the above solution, the modal view closes, an entry in your activity log is made (when `console.log` is called), and the workflow simply doesn't continue on. That said, it's generally best practice to handle function successes and errors when possible to ensure things are tidied up and there are no functions left hanging in the ether.

## Onward
You now have some shiny new modal views weaved within your app, and are on a course to providing a wonderful user experience.

✨  **To learn more about other interactivity options**, refer to the [Interactivity overview](/automation/interactivity).