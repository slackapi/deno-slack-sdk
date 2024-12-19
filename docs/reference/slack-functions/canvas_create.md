import SlackFunctionPage from '@site/src/components/SlackFunctionPage';

export const toc = [
{ value: 'Facts', id: 'facts', level: 2 },
{ value: 'Input parameters', id: 'input-parameters', level: 2 },
{ value: 'Output parameters', id: 'output-parameters', level: 2 },
{ value: 'Usage info', id: 'usage-info', level: 2 },
];

<SlackFunctionPage jsonFile="canvas_create">

This function creates a canvas. If `canvas_create_type` is not passed, it is set as blank.

The app using this function will need the following App Home features set in the app manifest file:

```yaml
features: {
  appHome: {
    messagesTabEnabled: true,
    messagesTabReadOnlyEnabled: false,
  },
},
```

For information about the expanded_rich_text type that you can use to create your canvases, refer to [expanded_rich_text](/deno-slack-sdk/reference/slack-types#expandedrichtext).

### Example workflow step

```ts
const createCanvasStep = ExampleWorkflow.addStep(
  Schema.slack.functions.CanvasCreate,
  {
    title: "My new canvas",
    owner_id: "PERSON12345",
    canvas_create_type: "blank",
    content: { inputs.content }
  },
);
```

</SlackFunctionPage>
