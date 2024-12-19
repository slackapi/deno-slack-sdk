import SlackFunctionPage from '@site/src/components/SlackFunctionPage';

export const toc = [
{ value: 'Facts', id: 'facts', level: 2 },
{ value: 'Input parameters', id: 'input-parameters', level: 2 },
{ value: 'Output parameters', id: 'output-parameters', level: 2 },
{ value: 'Usage info', id: 'usage-info', level: 2 },
];

<SlackFunctionPage jsonFile="send_message" >

Sends a message to a specific channel. The `message` input only supports non-interactive [`rich_text`](/deno-slack-sdk/reference/slack-types#rich-text).

This function returns a timestamp of the new message, which also serves as a confirmation that the message was sent.

:::info[Direct messages]

The `send_message` function does not allow for direct messages to users &mdash; use the [`send_dm`](/deno-slack-sdk/reference/slack-functions/send_dm) function instead. 

:::

### Adding interactivity with buttons {#buttons}

The `interactive_blocks` input only supports the [`button`](https://api.slack.com/reference/block-kit/block-elements#button) and [`workflow_button`](https://api.slack.com/reference/block-kit/block-elements#workflow_button) [interactive blocks](https://api.slack.com/reference/block-kit/block-elements).

Ensure that you do not use non-interactive elements via the `interactive_blocks` input, as this could cause unintended behavior.

If you include a button in the message, the function execution will not continue until a user clicks on that button.

### Example

To collect a formatted message from your end users and send it as-is, you can use a form to collect the formatted text, and a Slack function to send it:

```ts
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

export const RichTextWorkflow = DefineWorkflow({
  callback_id: "rich_text_workflow",
  title: "rich-text input workflow",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
      channel: { type: Schema.slack.types.channel_id },
    },
    required: ["interactivity", "channel"],
  },
});

const inputForm = RichTextWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Send formatted message",
    interactivity: RichTextWorkflow.inputs.interactivity,
    submit_label: "Send formatted message",
    fields: {
      elements: [
        {
          name: "formattedInput",
          title: "Formatted input",
          type: Schema.slack.types.rich_text,
        },
        {
          name: "channel",
          title: "Post in:",
          type: Schema.slack.types.channel_id,
          default: RichTextWorkflow.inputs.channel,
        },
      ],
      required: ["channel", "formattedInput"],
    },
  },
);

RichTextWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: inputForm.outputs.fields.channel,
  message: inputForm.outputs.fields.formattedInput,
  interactive_blocks: [{
    "type": "actions",
    "elements": [
      {
        "type": "button",
        "text": { "type": "plain_text", "text": "Approve" },
        "style": "primary",
        "value": "approve",
        "action_id": "approve_button",
      },
    ],
  }],
});
```

Here's an example with just regular text:

```javascript
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

export const createAnnouncement = DefineWorkflow({
  callback_id: "create-announcement",
  title: "Workflow for creating announcements",
  input_parameters: { properties: {}, required: [] },
});

const sendPreview = createAnnouncement.addStep(
  Schema.slack.functions.SendMessage,
  {
    channel_id: "CTLC2K3JS",
    message: "Good to see you here!",
  },
);
```

### Example action payload {#action-payload}

```js
{
  "action_id": "WaXA",
  "block_id": "=qXel",
  "text": {
    "type": "plain_text",
    "text": "View",
    "emoji": true
  },
  "value": "click_me_123",
  "type": "button",
  "action_ts": "1548426417.840180"
}
```

</SlackFunctionPage>
