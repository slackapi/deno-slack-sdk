---
slug: /deno-slack-sdk/guides/creating-connector-functions
---

# Creating connector functions

Connectors are step functions for workflows that behave like [Slack functions](/deno-slack-sdk/guides/creating-slack-functions) for services external to Slack. They take inputs and perform work for you when added as steps to your [workflows](/deno-slack-sdk/guides/creating-workflows).

We recommend understanding the systems and APIs you're integrating with before setup.

:::info

To protect your organization, external users (those outside your organization connected through Slack Connect) cannot use a workflow that contains connector functions built by your organization. This may manifest in a `home_team_only` warning. Refer to [this help center article](https://slack.com/help/articles/14844871922195-Slack-administration--Manage-workflow-usage-in-Slack-Connect-conversations#enterprise-grid-1) for more details.

:::

[Browse all Connector functions here](/deno-slack-sdk/reference/connector-functions)
