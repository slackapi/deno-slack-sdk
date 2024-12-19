import SlackFunctionPage from '@site/src/components/SlackFunctionPage';

export const toc = [
{ value: 'Facts', id: 'facts', level: 2 },
{ value: 'Input parameters', id: 'input-parameters', level: 2 },
{ value: 'Output parameters', id: 'output-parameters', level: 2 },
{ value: 'Usage info', id: 'usage-info', level: 2 },
];

<SlackFunctionPage jsonFile="add_pin">

### Example workflow step

```ts
const addPinStep = ExampleWorkflow.addStep(
  Schema.slack.functions.AddPin,
  {
    channel_id: "C123ABC456",
    message: "1645554142.024680",
  },
);
```

</SlackFunctionPage>
