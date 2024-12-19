import SlackFunctionPage from '@site/src/components/SlackFunctionPage';

export const toc = [
{ value: 'Facts', id: 'facts', level: 2 },
{ value: 'Input parameters', id: 'input-parameters', level: 2 },
{ value: 'Output parameters', id: 'output-parameters', level: 2 },
{ value: 'Usage info', id: 'usage-info', level: 2 },
];

<SlackFunctionPage jsonFile="share_canvas" >

This function allows you to share a canvas to users and channels.

The app using this function will need the following App Home features set in the app manifest file:

```yaml
features: {
  appHome: {
    messagesTabEnabled: true,
    messagesTabReadOnlyEnabled: false,
  },
},
```

For information about the `expanded_rich_text` type that you can use to update your canvases, refer to [expanded_rich_text](/deno-slack-sdk/reference/slack-types#expandedrichtext).

## Example workflow step

```ts
const shareCanvasStep = ExampleWorkflow.addStep(
  Schema.slack.functions.ShareCanvas,
  {
    canvas_id: "CAN123456",
    channel_ids: ["C111AAA111","C222BBB222"],
    user_ids: ["U333DDD333","U444EEE444"],
    access_level: "edit",
    message: [
      {
        "type": "rich_text",
        "elements": [
          {
            "type": "rich_text_section",
            "elements": [{
              "type": "text",
              "text": "Sharing the create canvas",
            }],
          },
        ],
      },
    ],
  },
);
```


</SlackFunctionPage>

