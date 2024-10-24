# Message metadata events

[Message metadata](/metadata) can connect your workflows to events happening within Slack. By doing so you can automate tasks within your workflows.

Message metadata will take the form of the custom message metadata event types you create. There are three steps to integrate a custom event type:

1. [Define](#define) the custom event type in its own file
1. [Register](#register) the custom event type in your app's manifest
1. [Use](#use) the custom event type in a trigger or function

## 1. Define a custom event type {#define}

When integrating message metadata into your app, you may want some additional type safety. [Custom message metadata event types](/reference/metadata) provide a way for apps to validate message metadata against a schema that you define.

First, let's create a new file to store the custom event type's definition. In this example, we'll create `event_types/incident.ts`.

The first thing we'll do in the file is to import `DefineEvent` and `Schema` from the SDK. Then, we'll use `DefineEvent` to create our event's definition. An example definition is as follows:

```javascript
// event_types/incident.ts
import { DefineEvent, Schema } from "deno-slack-sdk/mod.ts";

const IncidentEvent = DefineEvent({
  name: "my_incident_event",
  title: "Incident",
  type: Schema.types.object,
  properties: {
    id: { type: Schema.types.string },
    title: { type: Schema.types.string },
    summary: { type: Schema.types.string },
    severity: { type: Schema.types.string },
    date_created: { type: Schema.types.number },
  },
  required: ["id", "title", "summary", "severity"],
  // Set this to false to force the validation to catch any additional properties
  additionalProperties: false,
});

export default IncidentEvent;
```

For the `type` property, events can be one of two kinds: the built-in `Schema.types.object` type, or a [custom type](/automation/types/custom) that you define. If you go with a custom type, set the `type` property as your custom type &mdash; just don't forget to also import that custom type definition in your app's manifest.

✨  **For more information about the app manifest**, refer to [app manifest](/automation/manifest).

## 2. Register a custom event type {#register}

Before your app can use your custom event type, you'll need to register it with your app's manifest. To register the newly-defined custom event type, add it to the `events` array of your [manifest](/automation/manifest) definition:

```javascript
// manifest.ts
import IncidentEvent from "./event_types/incident.ts";

export default Manifest({
  name: "my_incident_app",
  description: "An app that uses a custom event type",
  icon: "assets/default_new_app_icon.png",
  workflows: [SampleWorkflow],
  outgoingDomains: [],
  datastores: [SampleDatastore],
  events: [IncidentEvent], // Our custom event type
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
    "metadata.message:read",
  ],
});
```

## 3. Use a custom event type {#use}

There are two ways you can use your custom event type:

* [by posting a message to Slack](#posting)
* [by creating a message metadata trigger](#trigger)

### Posting a message to Slack {#posting}

When you post a message to Slack using the [`metadata` parameter](/methods/chat.postMessage#arg_metadata), if the `event_type` matches the `name` of a custom event type specified in your app's manifest, Slack's servers will validate that all of the required parameters are provided. If the required parameters are not provided, a warning will be returned in the response. The message will still be posted, but without the message metadata since it didn't pass validation.

There are two ways to post a message in Slack:

* [from within a custom function](#custom-function)
* [as one of your workflow's steps](#workflow-step)

#### Posting a message from within a custom function {#custom-function}

Here's an example of using your custom event type while calling `client.chat.postMessage()` from within a [custom function](/automation/functions/custom):

```javascript
// functions/my_incident_function.ts
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import IncidentEvent from "../event_types/incident.ts";

export const MyFunctionDefinition = DefineFunction({
  callback_id: "my_incident_function",
  title: "my incident function",
  source_file: "functions/my_incident_function.ts",
  input_parameters: {
    properties: {
      channel_id: { type: Schema.slack.types.channel_id },
      incident_id: { type: Schema.types.string },
      incident_title: { type: Schema.types.string },
      incident_summary: { type: Schema.types.string },
      incident_severity: { type: Schema.types.string },
      incident_date: { type: Schema.slack.types.timestamp },
    },
    required: ["channel_id"],
  },
  output_parameters: {
    properties: {},
    required: []
  },
});

export default SlackFunction(
  MyFunctionDefinition,
  async ({ inputs, client }) => {
    // This example assumes all required values are passed to the function's inputs
    const response = await client.chat.postMessage({
      channel: inputs.channel_id,
      text: "We have an incident!",
      metadata: {
        // Our custom event type
        event_type: IncidentEvent,
        event_payload: {
          id: inputs.incident_id,
          title: inputs.incident_title,
          summary: inputs.incident_summary,
          severity: inputs.incident_severity,
          // This isn't required, so it doesn't need to exist to pass validation
          date_created: inputs.incident_date,
        },
      },
    });
    if (response.error) {
      const error = `Failed to post a message with metadata: ${response.error}`;
      return { error };
    }
    // Do something meaningful here!
    return { outputs: {} };
  },
);
```
#### Posting a message as one of your workflow's steps {#workflow-step}

Here's an example of using your custom event type with the [Slack function `SendMessage`](/reference/functions/send_message) as one of your workflow's steps:

```javascript
// workflows/my_workflow.ts
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import IncidentEvent from "../event_types/incident.ts";

export const MyWorkflow = DefineWorkflow({
  callback_id: "my_workflow",
  title: "My workflow",
  input_parameters: {
    properties: {
      channel_id: { type: Schema.slack.types.channel_id },
      incident_id: { type: Schema.types.string },
      incident_title: { type: Schema.types.string },
      incident_summary: { type: Schema.types.string },
      incident_severity: { type: Schema.types.string },
      incident_date: { type: Schema.slack.types.timestamp },
    },
    required: ["channel_id"],
  },
});

// This example assumes all required values are passed to the workflow's inputs
MyWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: MyWorkflow.inputs.channel_id,
  message: "We have an incident!",
  metadata: {
    // Our custom event type
    event_type: IncidentEvent,
    event_payload: {
      id: MyWorkflow.inputs.incident_id,
      title: MyWorkflow.inputs.incident_title,
      summary: MyWorkflow.inputs.incident_summary,
      severity: MyWorkflow.inputs.incident_severity,
      // This isn't required, so it doesn't need to exist to pass validation
      date_created: MyWorkflow.inputs.incident_date,
    },
  },
});
```

### Creating a message metadata trigger {#trigger}

A trigger can be created to watch for any message posted with a metadata event type matching your custom event type. When a match is found, that trigger will execute its configured workflow as in the following example:

```javascript
// triggers/incident_metadata_posted.ts
import { Trigger } from "deno-slack-api/types.ts";
import MyWorkflow from "../workflows/my_workflow.ts";
import IncidentEvent from "../event_types/incident.ts";

const trigger: Trigger<typeof MyWorkflow.definition> = {
  type: "event",
  name: "Incident Metadata Posted",
  inputs: {
    incident_id: { value: "{{data.metadata.event_payload.id}}" },
    incident_title: { value: "{{data.metadata.event_payload.title}}" },
    incident_summary: { value: "{{data.metadata.event_payload.summary}}" },
    incident_severity: { value: "{{data.metadata.event_payload.severity}}" },
    incident_date: { value: "{{data.metadata.event_payload.incident_date}}" },
  },
  // This is the workflow that will be kicked off
  workflow: `#/workflows/${MyWorkflow.definition.callback_id}`,
  event: {
    event_type: "slack#/events/message_metadata_posted",
    // Our custom event type
    metadata_event_type: IncidentEvent,
    // The channel we're watching for message metadata being posted
    channel_ids: ["C123ABC456"],
  },
};

export default trigger;
```

:::info

[Event triggers](/automation/triggers/event) such as the one above that listen for message metadata require the `metadata.message:read` scope to be added to the `botScopes` property of your [manifest definition](/automation/manifest).

:::

✨  **For more information about custom types**, refer to [custom types](/automation/types/custom).

✨  **For more information about event triggers**, refer to [event triggers](/automation/triggers/event).