import SlackFunctionPage from '@site/src/components/SlackFunctionPage';

export const toc = [
{ value: 'Facts', id: 'facts', level: 2 },
{ value: 'Input parameters', id: 'input-parameters', level: 2 },
{ value: 'Output parameters', id: 'output-parameters', level: 2 },
{ value: 'Usage info', id: 'usage-info', level: 2 },
];

<SlackFunctionPage jsonFile="canvas_update_content">

This function updates the content of a canvas. Either `canvas_id` or `channel_id` must be provided, but not both. Which one is needed is based on the `canvas_update_type`. If the `canvas_update_type` is set to standalone, then a `canvas_id` should be provided. If `canvas_update_type` is set to `channel_canvas`, then a `channel_id` should be provided. The default value of `canvas_update_type` is standalone.

The app using this function will need the following App Home features set in the app manifest file:

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
const updateCanvasStep = ExampleWorkflow.addStep(
  Schema.slack.functions.CanvasUpdateContent,
  {
    action: "append",
    content: { inputs.content },
    canvas_update_type: "standalone",
    canvas_id: "CAN1234ABC"
  },
);
```

</SlackFunctionPage>

