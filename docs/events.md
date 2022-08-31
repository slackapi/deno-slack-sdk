## Events

Custom Events provide Schema validation for an App's [message metadata](https://api.slack.com/metadata).

### Defining a Event

Events can be defined with the top level `DefineEvent` export. Events must be set up as an `object `type or a [`custom Type`][types] of an `object` type. Below is an example of setting up a custom Event that can be used during an incident.

```ts
const IncidentEvent = DefineEvent({
  name: "incident",
  title: "Incident",
  type: Schema.types.object,
  properties: {
    id: {
      type: Schema.types.string,
      minLength: 3,
    },
    title: {
      type: Schema.types.string,
    },
    summary: {
      type: Schema.types.string,
    },
    severity: {
      type: Schema.types.string,
    },
    date_created: {
      type: Schema.types.number,
    },
  },
  required: ["id", "title", "summary", "severity"],
});
```

### Registering an Event to the App

To register the newly defined event, add it to the array assigned to the `events`
parameter while defining the [`Manifest`][manifest].

Note: All custom Events **must** be registered to the [Manifest][manifest] in
order for them to be used. There is no automated registration for Events.

```ts
Manifest({
  ...
  events: [IncidentEvent],
});
```

### Referencing Events

There are two places where you can reference your events:
1. Posting a message to Slack
2. Creating a Message Metadata Trigger

#### Posting a message to Slack
Event validation happens against the App's manifest when and App posts a message to Slack using the `metadata` parameter. If the `event_type` matches a custom Event specified in the App's manifest, it will validate that all required parameters are provided. If it doesn't meet the validation standards, a warning will be returned in the response and the metadata will be dropped from the message.

```ts
// At workflow authoring time
// This example assumes all required values are passed to the workflow's inputs
MyWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: MyWorkflow.inputs.channel_id,
  message: "We have an incident!",
  metadata: {
    event_type: IncidentEvent,
    event_payload: {
      id: MyWorkflow.inputs.incident_id,
      title: MyWorkflow.inputs.incident_title,
      summary: MyWorkflow.inputs.incident_summary,
      severity: MyWorkflow.inputs.incident_severity,
      date_created: MyWorkflow.inputs.incident_date, // Since this isn't required, it doesn't need to exist to pass validation
    }
  }
});
```

```ts
// At function runtime
// This example assumes all required values are passed to the function's inputs
client.chat.postMessage({
  {
  channel_id: inputs.channel_id,
  message: "We have an incident!",
  metadata: {
    event_type: IncidentEvent,
    event_payload: {
      id: inputs.incident_id,
      title: inputs.incident_title,
      summary: inputs.incident_summary,
      severity: inputs.incident_severity,
      date_created: inputs.incident_date, // Since this isn't required, it doesn't need to exist to pass validation
    }
  }
})
```

#### Creating a Message Metadata Trigger

Now that the app has a defined schema for the event, a trigger can be created to watch for any message posted with the expected metadata. When the schema is met, the trigger will execute a workflow

```ts
// A Trigger Definition file for the CLI
import { IncidentEvent } from "./manifest.ts"

const trigger: Trigger = {
  type: "event",
  name: "Incident Metadata Posted",
  inputs: {
    id: "{{data.metadata.event_payload.incident_id}}",
    title: "{{data.metadata.event_payload.incident_title}}",
    summary: "{{data.metadata.event_payload.incident_summary}}",
    severity: "{{data.metadata.event_payload.incident_severity}}",
    date_created: "{{data.metadata.event_payload.incident_date}}"
  },
  workflow: "#/workflows/start_incident",
  event: {
    event_type: "slack#/events/message_metadata_posted",
    metadata_event_type: IncidentEvent,
    channel_ids: ["C012354"] // The channel that needs to be watched for message metadata being posted
  },
};

export default trigger;
```

[datastores]: ./datastores.md
[functions]: ./functions.md
[manifest]: ./manifest.md
[types]: ./types.md
[workflows]: ./workflows.md
