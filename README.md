<h1 align="center">
  Deno Slack SDK
  <br>
</h1>

<p align="center">
    <img alt="deno.land version" src="https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Flatest-version%2Fx%2Fdeno_slack_sdk%2Fmod.ts">
    <img alt="deno dependencies" src="https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Fupdates%2Fx%2Fdeno_slack_sdk%2Fmod.ts">
    <img alt="Samples Integration Type-checking" src="https://github.com/slackapi/deno-slack-sdk/workflows/Samples%20Integration%20Type-checking/badge.svg">
  </a>
</p>

A Deno SDK to build Slack apps with the latest platform features. Read the
[Quickstart Guide](https://api.slack.com/automation/quickstart) and look at our
[code samples](https://api.slack.com/automation/samples) to learn how to build
apps.

## Versioning

Releases for this repository follow the [SemVer](https://semver.org/) versioning
scheme. The SDK's contract is determined by the top-level exports from
`src/mod.ts` and `src/types.ts`. Exports not included in these files are deemed
internal and any modifications will not be treated as breaking changes. As such,
internal exports should be treated as unstable and used at your own risk.

## Setup

Make sure you have a development workspace where you have permission to install
apps. **Please note that the features in this project require that the workspace
be part of [a Slack paid plan](https://slack.com/pricing).**

### Install the Slack CLI

You need to install and configure the Slack CLI. Step-by-step instructions can
be found on our
[install & authorize page](https://api.slack.com/automation/cli/install).

## Creating an app

Create a blank project by executing

```zsh
slack create my-app --template slack-samples/deno-blank-template

cd my-app/
```

The `manifest.ts` file contains the app's configuration. This file defines
attributes like app name, description and functions.

### Create a [function](https://api.slack.com/automation/functions/custom)

```zsh
mkdir ./functions && touch ./functions/hello_world.ts
```

```ts
// Contents of ./functions/hello_world.ts
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const HelloWorldFunctionDef = DefineFunction({
  callback_id: "hello_world_function",
  title: "Hello World",
  source_file: "functions/hello_world.ts",
  input_parameters: {
    properties: {},
    required: [],
  },
  output_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "Hello world message",
      },
    },
    required: ["message"],
  },
});

export default SlackFunction(
  HelloWorldFunctionDef,
  () => {
    return {
      outputs: { message: "Hello World!" },
    };
  },
);
```

`DefineFunction` is used to define a custom function and provide Slack with the
information required to use it.

`SlackFunction` uses the definition returned by `DefineFunction` and the your
custom executable code to export a Slack usable custom function.

### Create a [workflow](https://api.slack.com/automation/workflows)

```zsh
mkdir ./workflows && touch ./workflows/hello_world.ts
```

```ts
// Contents of ./workflows/hello_world.ts
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { HelloWorldFunctionDef } from "../functions/hello_world.ts";

const HelloWorldWorkflowDef = DefineWorkflow({
  callback_id: "hello_world_workflow",
  title: "Hello World Workflow",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["channel"],
  },
});

const helloWorldStep = HelloWorldWorkflowDef.addStep(HelloWorldFunctionDef, {});

HelloWorldWorkflowDef.addStep(Schema.slack.functions.SendMessage, {
  channel_id: HelloWorldWorkflowDef.inputs.channel,
  message: helloWorldStep.outputs.message,
});

export default HelloWorldWorkflowDef;
```

`DefineWorkflow` is used to define a workflow and provide Slack with the
information required to use it.

`HelloWorldWorkflow.addStep` is used to add a step to the workflow, here we add
your `HelloWorldFunction` and then the `SendMessage` Slack Function that will
post the `message` to slack.

### Update the [manifest](https://api.slack.com/automation/manifest)

```ts
// Contents of manifest.ts
import { Manifest } from "deno-slack-sdk/mod.ts";
import HelloWorldWorkflow from "./workflows/hello_world.ts";

export default Manifest({
  name: "my-app",
  description: "A Hello World app",
  icon: "assets/default_new_app_icon.png",
  workflows: [HelloWorldWorkflow],
  outgoingDomains: [],
  botScopes: ["chat:write", "chat:write.public"],
});
```

`Manifest` is used to define your apps Manifest and provides Slack with the
information required to create it.

### Create a [trigger](https://api.slack.com/automation/triggers)

```zsh
mkdir ./triggers && touch ./triggers/hello_world.ts
```

```ts
// Contents of ./triggers/hello_world.ts
import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import HelloWorldWorkflow from "../workflows/hello_world.ts";

const trigger: Trigger<typeof HelloWorldWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Reverse a string",
  description: "Starts the workflow to reverse a string",
  workflow: `#/workflows/${HelloWorldWorkflow.definition.callback_id}`,
  inputs: {
    channel: {
      value: TriggerContextData.Shortcut.channel_id,
    },
  },
};

export default trigger;
```

## Running an app

```zsh
slack run
```

When prompted, create the `triggers/hello_world.ts` trigger! This will send your
trigger configuration to Slack.

Post the `Hello world shortcut trigger` in a slack message and **use it**

## Getting Help

[This documentation](https://api.slack.com/automation) has more information on
basic and advanced concepts of the Deno Slack SDK.

If you otherwise get stuck, we're here to help. The following are the best ways
to get assistance working through your issue:

- [Issue Tracker](https://github.com/slackapi/deno-slack-sdk/issues?q=is%3Aissue)
  for questions, bug reports, feature requests, and general discussion. **Try
  searching for an existing issue before creating a new one.**
- Email our developer support team: `support@slack.com`

## Contributing

Contributions are more then welcome please look at the
[contributing guidelines](.github/CONTRIBUTING.md) for more info!
