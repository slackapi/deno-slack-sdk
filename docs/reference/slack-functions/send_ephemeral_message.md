import SlackFunctionPage from '@site/src/components/SlackFunctionPage';

export const toc = [
{ value: 'Facts', id: 'facts', level: 2 },
{ value: 'Input parameters', id: 'input-parameters', level: 2 },
{ value: 'Output parameters', id: 'output-parameters', level: 2 },
{ value: 'Usage info', id: 'usage-info', level: 2 },
];

<SlackFunctionPage jsonFile="send_ephemeral_message" >

Sends an [ephemeral message](https://api.slack.comhttps://api.slack.com/surfaces/messages#ephemeral) to a specific channel. This lets a user see what your workflow has to say without everyone in the conversation having to see it or it becoming part of the conversation's record.

### Example workflow step

```ts
const sendEphemeralMessageStep = ExampleWorkflow.addStep(
  Schema.slack.functions.SendEphemeralMessage,
  {
    channel_id: "C082T4F6S1N",
    user_id: "U0J46F228L0",
    message: "Someone in this conversation is not accurately representing reality. Converse further with care.",
  },
);
```

</SlackFunctionPage>
