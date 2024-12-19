import SlackFunctionPage from '@site/src/components/SlackFunctionPage';

export const toc = [
{ value: 'Facts', id: 'facts', level: 2 },
{ value: 'Input parameters', id: 'input-parameters', level: 2 },
{ value: 'Output parameters', id: 'output-parameters', level: 2 },
{ value: 'Usage info', id: 'usage-info', level: 2 },
];

<SlackFunctionPage jsonFile="remove_user_from_usergroup">

Users have different needs and different teams over time. Sometimes you want to automate removing users from user groups.

## Example workflow step

```
const removeUserFromUsergroupStep = ExampleWorkflow.addStep(
  Schema.slack.functions.RemoveUserFromUsergroup,
  {
    usergroup_id: "S0123ABC456",
    user_ids: ["U111AAA111", "UZZZ999ZZZ"],
  },
);
```

</SlackFunctionPage>
