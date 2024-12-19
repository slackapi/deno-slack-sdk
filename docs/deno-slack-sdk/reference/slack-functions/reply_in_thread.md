import SlackFunctionPage from '@site/src/components/SlackFunctionPage';

export const toc = [
{ value: 'Facts', id: 'facts', level: 2 },
{ value: 'Input parameters', id: 'input-parameters', level: 2 },
{ value: 'Output parameters', id: 'output-parameters', level: 2 },
{ value: 'Usage info', id: 'usage-info', level: 2 },
];

<SlackFunctionPage jsonFile="reply_in_thread" >

Based on certain conditions, you can reply to a message in-thread.

## Example workflow step

```
const replyInThreadStep = ExampleWorkflow.addStep(
  Schema.slack.functions.ReplyInThread,
  {
    message_context: sendMessageStep.outputs.message_context,
    reply_broadcast: false,
    message: "Thank you for submitting a message to #sos, Gilligan.",
  },
);
```

To reply in-thread with buttons, they must be wrapped in a block (example: [section block](https://api.slack.com/reference/block-kit/blocks#section)). Then, use the [`workflow_button`](https://api.slack.com/reference/block-kit/block-elements#workflow_button) element.

### Example workflow step with interactive blocks

```ts
const replyInThreadButton = ExampleWorkflow.addStep(
  Schema.slack.functions.ReplyInThread,
  {
    message_context: sendMessageStep.outputs.message_context,
    reply_broadcast: false,
    message: "Please confirm your request for help in #sos.",
    interactive_blocks: [
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Click to confirm",
        },
        "accessory": {
          "type": "workflow_button",
          "text": {
            "type": "plain_text",
            "text": "Confirm",
          },
          "action_id": "button-action-id-custom",
          "workflow": {
            "trigger": {
              "url":
                "https://slack.com/shortcuts/Ft0123ABC456/xyz...zyx",
            },
          },
        },
      },
    ]
  },
);
```

</SlackFunctionPage>
