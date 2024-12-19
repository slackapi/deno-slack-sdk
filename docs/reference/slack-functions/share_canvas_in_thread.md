import SlackFunctionPage from '@site/src/components/SlackFunctionPage';

export const toc = [
{ value: 'Facts', id: 'facts', level: 2 },
{ value: 'Input parameters', id: 'input-parameters', level: 2 },
{ value: 'Output parameters', id: 'output-parameters', level: 2 },
{ value: 'Usage info', id: 'usage-info', level: 2 },
];

<SlackFunctionPage jsonFile="share_canvas_in_thread" >

This function allows you to share a canvas in a thread.

The app using this function will need the following App Home features set in the app manifest file:

```
features: {
  appHome: {
    messagesTabEnabled: true,
    messagesTabReadOnlyEnabled: false,
  },
},
```

### Example workflow step:

```
const shareCanvasStep = ExampleWorkflow.addStep(
  Schema.slack.functions.ShareCanvasInThread,
  {
    canvas_id: "CAN123456",
    access_level: "edit",
	message_context: inputs.messageContext,
    message: { inputs.message }
  },
);
```

</SlackFunctionPage>
