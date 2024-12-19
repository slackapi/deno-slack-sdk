import SlackFunctionPage from '@site/src/components/SlackFunctionPage';

export const toc = [
{ value: 'Facts', id: 'facts', level: 2 },
{ value: 'Input parameters', id: 'input-parameters', level: 2 },
{ value: 'Output parameters', id: 'output-parameters', level: 2 },
{ value: 'Usage info', id: 'usage-info', level: 2 },
];

<SlackFunctionPage jsonFile="channel_canvas_create">

This function creates a channel canvas. The `canvas_create_type` will default to blank if not provided.

In order to use this Slack function in a coded workflow, you must do the following:

1. The channel in which you want to create a canvas by using this function must be created by your coded workflow as a step before this function is called. You can use the [`create_channel`](/deno-slack-sdk/reference/slack-functions/create_channel) Slack function to do this.

2. The invoking user (i.e., the end-user triggering the workflow) must be a member of the newly-created channel before this function executes. There are two recommended ways of doing this:

    * The [`create_channel`](/deno-slack-sdk/reference/slack-functions/create_channel) Slack function accepts a `manager_ids` parameter where you can assign a user as a channel manager. This allows you to automatically add a user to a channel when creating it.

    * You could call the [`invite_user_to_channel`](/deno-slack-sdk/reference/slack-functions/invite_user_to_channel) Slack function after the [`create_channel`](/deno-slack-sdk/reference/slack-functions/create_channel) Slack function completes to invite the invoking user to the channel.

In addition, the app calling this function will need the following App Home features configured in its manifest file:

```ts
features: {
  appHome: {
    messagesTabEnabled: true,
    messagesTabReadOnlyEnabled: false,
  },
},
```

For information about the expanded_rich_text type that you can use to update your canvases, refer to [expanded_rich_text](/deno-slack-sdk/reference/slack-types#expandedrichtext).

### Example workflow step

```ts
const createChannelCanvasStep = ExampleWorkflow.addStep(
  Schema.slack.functions.ChannelCanvasCreate,
  {
    channel_id: "CHAN123456",
    canvas_create_type: "template",
    canvas_template_id: "TEM123456",
    content: { inputs.content }
  },
);
```

</SlackFunctionPage>
