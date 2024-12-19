import SlackFunctionPage from '@site/src/components/SlackFunctionPage';

export const toc = [
{ value: 'Facts', id: 'facts', level: 2 },
{ value: 'Input parameters', id: 'input-parameters', level: 2 },
{ value: 'Output parameters', id: 'output-parameters', level: 2 },
{ value: 'Usage info', id: 'usage-info', level: 2 },
];

<SlackFunctionPage jsonFile="create_usergroup">


Create a new user group. You can add members to it later.

### Example workflow step

```ts
const createUsergroupStep = ExampleWorkflow.addStep(
  Schema.slack.functions.CreateUsergroup,
  {
    usergroup_name: "Baking enthusiasts",
    usergroup_handle: "cookies",
  },
);
```

</SlackFunctionPage>

