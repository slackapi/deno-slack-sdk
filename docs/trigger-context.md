## Trigger Context
Triggers have contextual data that is available to be mapped into a [workflow][workflows]'s input parameters. This is done via the `.withInputs()` function when configuring a trigger.

```ts
trigger.withInputs(ctx => ({
  // mapping message shortcut text into a workflow parameter
  parameter_1: ctx.data.message.text
}))
```

Every trigger type has it's own context object that represents the unique data associated with it. They are all wrapped in a consistent trigger envelope that looks like this:

```ts
{
  type: string, // trigger-type, i.e. "shortcut"
  data: {
    ... // trigger-type specific payloads
  }
}
```

Each of the unique `data` payloads are listed below according to their trigger type, and can be referenced from the `ctx` object of `withInputs()` underneath the `ctx.data` object. For example, a shortcut's `user_id` is referenced as `ctx.data.user_id`


## `shortcut` data payload

```ts
{
  channel_id: string, // channel shortcut was run in
  user_id: string, // user who ran the shortcut
}
```

## `message_shortcut` data payload

```ts
{
  channel_id: string, // channel shortcut was run in
  user_id: string, // user who ran the shortcut
  message: {
    ts: string, // message ts value
    text: string, // message text
    user_id: string, // message author's user_id
  }
}
```

## `slack#/events/reaction_added` data payload

```ts
{
  event_type: "slack#/events/reaction_added",
  channel_id: string, // channel reaction was added in
  user_id: string, // user who added the reaction
  reaction: string, // reaction, i.e. ":smile:"
  message_ts: string, // message ts
}
```

## `slack#/events/message_metadata_posted` data payload

```ts
{
  event_type: "slack#/events/message_metadata_posted",
  channel_id: string, // channel message metadata was posted in
  user_id: string, // user who posted the message metadata
  message_ts: string, // message ts
  metadata: {
    event_type: string, // value of posted metadata.event_type
    event_payload: any, // value of metadata.event_payload
  }
}
```

[workflows]: ./workflows.md
