import SlackFunctionPage from '@site/src/components/SlackFunctionPage';

export const toc = [
{ value: 'Facts', id: 'facts', level: 2 },
{ value: 'Input parameters', id: 'input-parameters', level: 2 },
{ value: 'Output parameters', id: 'output-parameters', level: 2 },
{ value: 'Usage info', id: 'usage-info', level: 2 },
];

<SlackFunctionPage jsonFile="update_channel_topic" >

Change the topic to what's top of mind. Folks like predictable, informative topics. Your workflow must be a member of the conversation.

### Example workflow step

```ts
const updateChannelTopicStep = ExampleWorkflow.addStep(
  Schema.slack.functions.UpdateChannelTopic,
  {
    channel_id: "C0123ABC456",
    topic: "The main idea in mind",
  },
);
```

</SlackFunctionPage>

