---
slug: /deno-slack-sdk/guides/creating-functions
---

# Creating functions

<PaidPlanBanner />

Functions are one of the three building blocks that make up workflow apps. You will encounter all three as you navigate the path of building your app:

1. Functions define the actions of your app. (⬅️ you are here)
2. Workflows are a combination of functions, executed in order.
3. Triggers execute workflows.

There are three types of functions:

* **[Slack functions](/deno-slack-sdk/guides/creating-slack-functions)** enable Slack-native actions, like creating a channel or sending a message.
* **[Connector functions](/deno-slack-sdk/guides/creating-connector-functions)** enable actions native to services outside of Slack. Google Sheets, Dropbox and Microsoft Excel are just a few of the services with available connector functions. Connector functions cannot be used in a workflow intended for use in a Slack Connect channel.
* **[Custom functions](/deno-slack-sdk/guides/creating-custom-functions)** enable developer-specific actions. Pass in any desired inputs, perform any actions you can code up, and pass on outputs to other parts of your workflows.

Custom functions also allow your app to create and process workflow steps that users can add in Workflow Builder. See the [Workflow Builder custom step tutorial](/deno-slack-sdk/tutorials/workflow-builder-custom-step/) for instruction.