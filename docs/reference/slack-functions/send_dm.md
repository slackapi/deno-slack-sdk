import SlackFunctionPage from '@site/src/components/SlackFunctionPage';

export const toc = [
{ value: 'Facts', id: 'facts', level: 2 },
{ value: 'Input parameters', id: 'input-parameters', level: 2 },
{ value: 'Output parameters', id: 'output-parameters', level: 2 },
{ value: 'Usage info', id: 'usage-info', level: 2 },
];

<SlackFunctionPage jsonFile="send_dm">

Sends a message directly to a user, from your workflow.

If you include a button in the direct message, the function execution will not continue until an end user clicks on that button.

### Example workflow step

```
const sendDmStep = ExampleWorkflow.addStep(
  Schema.slack.functions.SendDm,
  {
    user_id: "U123ABC456",
    message: "Don't give up. Never surrender. Except the cookies. Surrender the cookies.",
  },
);
```

### Example action payload 

```
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

