# Function types

Functions are one of the three building blocks that make up workflow apps. You will encounter all three as you navigate the path of building your app:

1. Functions define the actions of your app. (⬅️ you are here)
2. Workflows are a combination of functions, executed in order.
3. Triggers execute workflows.

There are three types of functions:

* [Slack functions](/automation/functions) enable Slack-native actions, like creating a channel or sending a message.
* [Connector functions](/automation/connectors) enable actions native to services outside of Slack. Google Sheets, Dropbox and Microsoft Excel are just a few of the services with available connector functions. Connector functions cannot be used in a workflow intended for use in a Slack Connect channel.
* [Custom functions](#custom) enable developer-specific actions. Read on for more info.

:::info

To protect your organization, external users (those outside your organization connected through Slack Connect) cannot use a workflow that contains [connector steps](/automation/connectors) or [workflow steps](/concepts/workflow-steps) built by your organization. This may manifest in a `home_team_only` warning. Refer to [this help center article](https://slack.com/help/articles/14844871922195-Slack-administration--Manage-workflow-usage-in-Slack-Connect-conversations#enterprise-grid-1) for more details.

:::

### Custom functions {#custom}

Custom functions can be created with the [Deno Slack SDK](/automation/functions/custom) or the [Bolt SDKs](/automation/functions/custom-bolt). Pass in any desired inputs, perform any actions you can code up, and pass on outputs to other parts of your workflows. 

Custom functions also allow your app to create and process workflow steps that users can add in [Workflow Builder](/workflows). Which kind of custom function is available for use depends on which kind of Slack app you're working with. Both types of apps provide a mechanism to connect your app to the outside world via third-party APIs. 

See the following tutorials for assistance:
- [Create a custom workflow step for Workflow Builder: Slack Deno SDK](/tutorials/tracks/wfb-function)
- [Create a custom workflow step for Workflow Builder: Bolt SDK](/tutorials/tracks/bolt-js-custom-function)

If you're starting your app-creation journey on this page and are not quite sure which SDK to choose, let us direct your attention to the [Slack platform overview](/docs).