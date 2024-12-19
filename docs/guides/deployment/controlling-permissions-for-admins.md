---
slug: /deno-slack-sdk/guides/controlling-permissions-for-admins
---

# Controlling permissions for Admins

<PaidPlanBanner />

As part of the [broader access controls available to administrators](https://slack.com/help/categories/200122103-Workspace-administration#workspace-settings-permissions), administrators can ensure only approved apps are installed and available to users.

## Approval process for admins {#approval-admins}

If a workspace has the [Admin-Approved Apps](https://slack.com/help/articles/222386767-Manage-app-installation-settings-for-your-workspace) feature enabled, apps must be approved by a Workspace Admin (as set in your workspace settings) before they can be deployed.

However, even if a workspace has Admin-Approved Apps enabled, workspace owners can still run `slack deploy` to deploy apps or `slack run` to run apps locally without requesting Admin-Approved Apps permission. The Admin-Approved Apps approval process does not apply to standalone workspaces.

When a developer deploys an app, administrators will receive a notification, either from Slackbot or using the [Admin-Approved Apps API workflow](https://api.slack.com/admins/approvals) as determined by the organization. The approval notification will include which [OAuth scopes](https://api.slack.com/tutorials/tracks/understanding-oauth-scopes-bot) the app is requesting, as well as any outgoing domains the app may want to access.

Outgoing domains are a new concept, and apply only to apps deployed to Slack's managed infrastructure. These are domains the app may require access to &mdash; for example, if a developer writes a [function](/deno-slack-sdk/guides/creating-slack-functions) that makes a request to an external API, they will need to include that API in their outgoing domains. Outgoing domains do not constrain which ports on those domains a function can communicate with. Administrators can now approve or deny apps based on these defined outgoing domains, in the same way they would OAuth scopes.

### Admin-Approved Apps and connector functions for admins {#admin-connectors}

Developers can create apps that call connector functions. These connector functions are contained by another app; for example, if a developer wishes to add a row to a Google spreadsheet or to update that same row, they could call the respective [Google Sheets connector functions](/deno-slack-sdk/reference/connector-functions#google_sheets).

In addition to the approval process for developer apps described above, you can also explicitly approve or deny apps that use connector functions for use in Enterprise Grid workspaces based on the specified connector function. For example, if a developer's app calls a connector function that has not yet been approved for your workspace, you will be notified for approval when the developer attempts to install their app. In this example, you would approve or deny the specific Google Sheets connector function for use in your workspace.

If you deny the connector function, running `manifest validate` will inform the developer that the connector function is denied for use in the workspace. If you approve it, running `manifest validate` will install the specified connector function to the workspace.

For more information and a list of connector functions and their containing apps, refer to [connector functions](/deno-slack-sdk/reference/connector-functions).

### Changes to the APIs {#api-changes}

If you are using the [Admin-Approved Apps APIs](https://api.slack.com/admins/approvals) to manage your app approval process, there will be some changes to the API responses you receive as well as some new parameters that you can send to account for the new concept of outgoing domains that applies to apps deployed to Slack's managed infrastructure.

The following endpoints will now have a `domains` field next to the existing `scopes` field, as a string array:

* [`admin.apps.approved.list`](https://api.slack.com/methods/admin.apps.approved.list)
* [`admin.apps.restricted.list`](https://api.slack.com/methods/admin.apps.restricted.list)
* [`admin.apps.requests.list`](https://api.slack.com/methods/admin.apps.requests.list)

A response would look like this:

```json
"scopes": [
  {
    "name": "app_mentions:read",
    "description": "View messages that directly mention @your_slack_app in conversations that the app is in",
    "token_type": "bot"
  }
],
"domains": ['slack.com'],
```

Additionally, the following endpoints will now have an optional `domains` string array field for including outgoing domains that should be included in the approve or deny request:

* [`admin.apps.approve`](https://api.slack.com/methods/admin.apps.approve)
* [`admin.apps.restrict`](https://api.slack.com/methods/admin.apps.approve)

If the `domains` array is left empty, the method will look up the domains specified by the app.

## Approval process for developers {#approval-developers}

For developers, the most important thing to know is that you may run into extra steps when deploying your apps. If the administrators of your workspace have enabled [Admin-Approved Apps](https://slack.com/help/articles/222386767-Manage-app-installation-settings-for-your-workspace), it means your app requires approval before it can be deployed.

In this case, after you run `slack deploy`, a prompt will notify you via the CLI that admin approval is required on this workspace. You'll also be prompted to enter `y` or `n` to send a request to the workspace administrator for approval to install your app.

Administrators will see which OAuth scopes your app is requesting, as well as which outgoing domains your app is requesting access to. Outgoing domains are specified in the `outgoingDomains` array of your apps `manifest.ts` file as comma-separated strings. Administrators may also ask for an additional description for your app. If this is enabled, you will be asked to provide that information when you deploy your app using the CLI.

Once you have approval, you'll receive a notification from Slackbot, and you can then deploy your app. If you receive a Slackbot notification that your app was denied, reach out to your workspace administrator.

Finally, if your app needs to request a new OAuth scope or outgoing domain, it will again trigger the approval process above. The existing app installation will continue to function, but the new scope or outgoing domain will not be functional until the app is reapproved and redeployed.

### Admin-Approved Apps and connector functions for developers {#dev-connectors}

To request approval for an app that uses a connector function requiring admin approval, perform the following steps (Enterprise Grid workspaces only):

1. Install your app via the CLI. If the app uses a connector function that requires admin approval, you will be prompted with that information about the connector function and asked if you would like to submit a request for approval.
1. Select `Y`. The CLI wil prompt you for a reason; after entering one, an approval request will be created for the admin of the workspace. Running `manifest validate` will show that the connector app is now pending approval.
1. If you enter `N`, the CLI will do nothing, and your app will not be submitted for approval.