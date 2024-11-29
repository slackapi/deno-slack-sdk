# Interactivity overview

Adding interactivity to your app adds a dynamic experience that makes it more substantive than just a bot sending messages. There are a few different ways to achieve interactivity in a workflow app. 

1. Collect user input **[through a form](/automation/forms)** and use it later in the workflow.
2. Create an **[interactive message](/automation/interactive-messages)** with varying options of back-and-forth with the user.
3. Use **[interactive modals](/automation/interactive-modals)** to ask your users questions, allow actions, and update based on the information they give you.

## Basic elements of interactivity {#basic-elements}
All options share some basic elements in common.

* Interactivity parameter
* Blocks with interactive parts
* Interactivity handlers

### Interactivity parameter {#interactivity-parameter}

In order to prevent inundating users with pop-ups they didn't ask for, all app interactivity requires an interactivity parameter. This is the user's consent to interact with the app; only a user's interaction can open a form or modal. 

Whether the user is opening a [form](/automation/forms#add-interactivity), [modal](/automation/interactive-modals#add-interactivity), or sending an [interactive message](/automation/interactive-messages), this looks the same&mdash;including an `input_parameter` of the type `interactivity`. 

:::warning[Not supported in Workflow Builder]

[Custom functions](/automation/functions/custom) that require interactivity inputs are not currently supported in Workflow Builder.

:::

### Interactive blocks {#interactive-blocks}

Both modals and interactive messages allow for [interactive blocks](/reference/block-kit/block-elements), a flexible and dynamic way to create visually appealing app interaction. Check out an example in step 2 of [Creating an interactive message](/automation/interactive-messages#add-block-kit), explore the [Block Kit reference](/reference/block-kit/block-elements) for a menu of interactive options, then try them out in [Block Kit Builder](https://app.slack.com/block-kit-builder/).

### Interactivity handlers {#interactivity-handlers}

An interactive form is a static mechanism that merely gathers information from the user, but modals and messages allow for more of a back-and-forth interaction. This means being able to respond to your user's actions and inputs dynamically. This is achieved by utilizing interactivity handlers. 

Handler name | Description | Where it can be used 
------------ | ----------- | -------------------- 
`BlockActionsHandler` | Used to respond to interactivity that happens within an [interactive block](/reference/block-kit/block-elements). | [`Messages`](/surfaces/messages) [`Modals`](/surfaces/modals)
`BlockSuggestionHandler` | Used alongside a [select menu of external data source](/reference/block-kit/block-elements#external_select) element. | [`Messages`](/surfaces/messages) [`Modals`](/surfaces/modals) 
`ViewSubmissionHandler` | Used to update a modal view after it has been submitted. | [`Modals`](/surfaces/modals) 
`ViewClosedHandler` | Used to update an app after a view has been closed. | [`Modals`](/surfaces/modals)  
`UnhandledEventHandler` | Used as a catch-all for unhandled events. | [`Messages`](/surfaces/messages) [`Modals`](/surfaces/modals) 

:::tip

It's best practice to properly  handle a function's success or error when a modal is submitted or closed. Refer to [creating an interactive modal](/automation/interactive-modals) for more details.

:::

View sample payloads for these handlers in the [Interaction payloads documentation](/reference/interaction-payloads).

## Invoking interactivity handlers {#invoking}

Each handler contains two arguments, a `constraint` and a `handler`, such that its invocation will look like this:
- `addBlockActionsHandler(constraint, handler)`
- `addBlockSuggestionHandler(constraint, handler)`
- `addViewSubmissionHandler(constraint, handler)`
- `addViewClosedHandler(constraint, handler)`
- `addUnhandledEventHandler(constraint, handler)`

If any incoming event matches the `constraint`, the specified handler will be invoked with the event payload. The `handler` arugment is the handler function that you define&mdash;what you want to happen in this event. Every type of handler function has the same context properties available to it, which are the same as the [context properties](/automation/functions/custom#context) available to custom functions. This allows for authoring focused, single-purpose handlers and provides a concise, yet flexible API for registering handlers to specific interactions.

What the `constraint` field allows depends on the type of handler. 

### Block actions and block suggestions {#block-handlers}

For the `BlockActionsHandler` and the `BlockSuggestionHandler`, the `constraint` can be either a `BlockActionConstraintField` or a `BlockActionConstraintObject`. 

`BlockActionConstraintField` can be one of three options.

``` ts
type BlockActionConstraintField = string | string[] | RegExp;
```

- When provided as a `string`, it must match the field exactly.
- When provided as an array of `string`, it must match one of the array values exactly.
- When provided as a `RegExp`, the regular expression must match.

The `BlockActionConstraintObject` contains two properties. 

```ts
type BlockActionConstraintObject = {
  block_id?: BlockActionConstraintField;
  action_id?: BlockActionConstraintField;
};
```

When the `constraint` is provided as an object in the form of a `BlockActionConstraintObject`, it can contain either or both a `block_id` and an `action_id`.
- Each of these properties is a `BlockActionConstraintField` (see above).
- If both the `action_id` and `block_id` properties exist on the constraint, then both `action_id` and `block_id` properties must match any incoming action.
- If only one of these properties is provided, then only the provided property must match.

See an example of the `BlockActionsHandler` and the `BlockSuggestionHandler` in action in the [Creating an interactive message](/automation/interactive-messages) guide.

### View handlers {#view-handlers}

The `constraint` field for the view handlers is a bit different than in the `BlockActionsHandler` and `BlockSuggestionHandler`. 

```ts
SlackFunction({ ... }).addViewSubmissionHandler("my_view_callback_id", async (ctx) => { ... });
```

For view handlers, the `consraint` argument can be either a `string`, `string[]`, or a `RegExp`. 
- A simple `string` constraint must match a view's `callback_id` exactly.
- A `string []` constraint must match a view's `callback_id` to any of the strings in the array.
- A regular expression constraint must match a view's `callback_id`.

### Unhandled handlers {#unhandled-handlers}

The `UnhandledEventHandler` handles everything unaccounted for. It then makes sense that this handler does not accept a `constraint` argument. It does, however, accept the same `handler` argument as the other handlers, which is the handler function you define. Remember, all custom function [context properties](/automation/functions/custom#context) are availalbe for use here. 

```ts

.addUnhandledEventHandler(({ body: _body }) => {
    console.log("unhandled event happened");
    //add some other actions
  })

```

## Next steps {#next-steps}

Ready to get started?

✨ Get started with collecting user input by **[creating a form](/automation/forms)**.

✨ Dazzle your users by sending them an **[interactive message](/automation/interactive-messages)**.

✨ Create some back-and-forth banter with **[interactive modals](/automation/interactive-modals)**.