import SlackFunctionPage from '@site/src/components/SlackFunctionPage';

export const toc = [
{ value: 'Facts', id: 'facts', level: 2 },
{ value: 'Input parameters', id: 'input-parameters', level: 2 },
{ value: 'Output parameters', id: 'output-parameters', level: 2 },
{ value: 'Usage info', id: 'usage-info', level: 2 },
];

<SlackFunctionPage jsonFile="canvas_copy">

This function copies a canvas. The app using this function will need the following App Home features set in the app manifest file:

```yaml
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
const copyCanvasStep = ExampleWorkflow.addStep(
  Schema.slack.functions.CanvasCopy,
  {
    canvas_id: "CAN87654",
    title: "My new canvas",
    owner_id: "ABC123456"
  },
);
```

</SlackFunctionPage>