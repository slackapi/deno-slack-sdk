import SlackFunctionPage from '@site/src/components/SlackFunctionPage';

export const toc = [
{ value: 'Facts', id: 'facts', level: 2 },
{ value: 'Input parameters', id: 'input-parameters', level: 2 },
{ value: 'Output parameters', id: 'output-parameters', level: 2 },
{ value: 'Usage info', id: 'usage-info', level: 2 },
];

<SlackFunctionPage jsonFile="add_user_to_usergroup">

Your workspace has user groups and you want to automate adding users to them in workflows? This function is here to make your user groups grow!

### Example workflow step
Here is an example of how to use this function in a workflow step.

```ts
const addUserToUsergroupStep = ExampleWorkflow.addStep(
  Schema.slack.functions.AddUserToUsergroup,
  {
    usergroup_id: "S0123ABC456",
    user_ids: ["U111AAA111", "U999ZZZ999"],
  },
);
```

</SlackFunctionPage>
