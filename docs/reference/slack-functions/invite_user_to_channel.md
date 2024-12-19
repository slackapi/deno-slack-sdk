import SlackFunctionPage from '@site/src/components/SlackFunctionPage';

export const toc = [
{ value: 'Facts', id: 'facts', level: 2 },
{ value: 'Input parameters', id: 'input-parameters', level: 2 },
{ value: 'Output parameters', id: 'output-parameters', level: 2 },
{ value: 'Usage info', id: 'usage-info', level: 2 },
];

<SlackFunctionPage jsonFile="invite_user_to_channel" >

This function allows your workflow to add users to a channel. It only works with channels your workflow created.

You can provide the usergroup_ids or user_ids parameters.

## Example workflow step

```ts
const inviteUserToChannelStep = ExampleWorkflow.addStep(
  Schema.slack.functions.InviteUserToChannel,
  {
    channel_ids: ["C0123ABC456"],
    user_ids: ["U111AAA111", "UZZZ999ZZZ"],
  },
);
```

</SlackFunctionPage>
