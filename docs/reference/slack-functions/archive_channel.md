import SlackFunctionPage from '@site/src/components/SlackFunctionPage';

export const toc = [
{ value: 'Facts', id: 'facts', level: 2 },
{ value: 'Input parameters', id: 'input-parameters', level: 2 },
{ value: 'Output parameters', id: 'output-parameters', level: 2 },
{ value: 'Usage info', id: 'usage-info', level: 2 },
];

<SlackFunctionPage jsonFile="archive_channel">

Not all conversations need to continue forever, so when the project is done, this function archives the channel, preventing new messages from being posted while preserving its history.

### Example workflow step

```ts
const archiveChannelStep = ExampleWorkflow.addStep(
  Schema.slack.functions.ArchiveChannel,
  {
    channel_id: "C0123ABC456",
  },
);
```

</SlackFunctionPage>