import SlackFunctionPage from '@site/src/components/SlackFunctionPage';

export const toc = [
{ value: 'Facts', id: 'facts', level: 2 },
{ value: 'Input parameters', id: 'input-parameters', level: 2 },
{ value: 'Output parameters', id: 'output-parameters', level: 2 },
{ value: 'Usage info', id: 'usage-info', level: 2 },
];

<SlackFunctionPage jsonFile="delay" >

Delay a workflow for some amount of time. Good things come to those who wait.

## Example workflow step

```ts
const delayStep = ExampleWorkflow.addStep(
  Schema.slack.functions.Delay,
  {
    minutes_to_delay: 12,
  },
);
```

</SlackFunctionPage>

