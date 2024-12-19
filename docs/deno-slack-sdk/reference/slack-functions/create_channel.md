import SlackFunctionPage from '@site/src/components/SlackFunctionPage';

export const toc = [
{ value: 'Facts', id: 'facts', level: 2 },
{ value: 'Input parameters', id: 'input-parameters', level: 2 },
{ value: 'Output parameters', id: 'output-parameters', level: 2 },
{ value: 'Usage info', id: 'usage-info', level: 2 },
];

<SlackFunctionPage jsonFile="create_channel" >

Your automations may create channels as part of a workflow using this Slack function.

Consider the `channel_name` you specify as merely a suggestion. If it's taken, Slack might append characters to it. Or if you provide some kind of characters Slack doesn't use for channel names, they might be munged.

To set the channel managers as part of the newly created channel, specify one or more IDs in an array to `manager_ids`.

### Example workflow step

```ts
const createChannelStep = ExampleWorkflow.addStep(
  Schema.slack.functions.CreateChannel,
  {
    channel_name: "broadcast-jesse-promotion",
    is_private: false,
  },
);
```

</SlackFunctionPage>
