import SlackFunctionPage from '@site/src/components/SlackFunctionPage';

export const toc = [
{ value: 'Facts', id: 'facts', level: 2 },
{ value: 'Input parameters', id: 'input-parameters', level: 2 },
{ value: 'Output parameters', id: 'output-parameters', level: 2 },
{ value: 'Usage info', id: 'usage-info', level: 2 },
];

<SlackFunctionPage jsonFile="add_bookmark">

### Example workflow step

```ts
const addBookmarkStep = ExampleWorkflow.addStep(
  Schema.slack.functions.AddBookmark,
  {
    channel_id: "C0123ABC456",
    name: "Great Wisconsin Cheese Festival",
    link: "https://cheesefest.org/",
  },
);
```


</SlackFunctionPage>
