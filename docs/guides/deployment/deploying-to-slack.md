---
slug: /deno-slack-sdk/guides/deploying-to-slack
---

# Deploying to Slack

<PaidPlanBanner />

Your apps can be deployed to Slack's managed infrastructure by running the `slack deploy` command at the root of your project.

No local development server is started when running the `slack deploy` command, and your app will have a different ID than the one created for your app if you previously ran the `slack run` command. For more details about the differences between local and deployed apps, refer to [team collaboration](/deno-slack-sdk/guides/collaborating-with-teammates).

:::info 

`npm` dependencies are supported but are still in beta, so ensure that you test any `npm:` specifiers when using the `slack deploy` command (the `slack run` command is not affected).

:::

## Using the `slack deploy` command {#slack-deploy}

When you run the `slack deploy` command and you are logged into a Slack Enterprise Grid, you may also be asked to select a workspace within your organization to deploy your app to (default is all workspaces).

You may also specify a workspace within your organization to grant your app access to with the `--org-workspace-grant` flag.

The Slack CLI will package up your app and deploy it to the workspace you specify. At that point, anyone in your workspace will be able to find and add your app by navigating to **Apps > Manage > Browse apps**.

:::info

The `slack deploy` command behavior may vary slightly based on the operating system used.

:::

### Function access {#function-access}

To make a function available so that another user (or group of users) can access workflows that reference your function after you deploy your app, you can execute the `slack function access` command. After choosing your workspace, you'll also be prompted to select which function you want to deploy, as well as who you would like to give access to your function -- app collaborators only, specific users, or everyone. Your function will then be accessible to those users the next time you deploy your app.

✨  **For more information about function access**, refer to [custom function access](/deno-slack-sdk/guides/controlling-access-to-custom-functions).

:::info

Workflow apps are currently not eligible for distributing to the Slack Marketplace.

:::

## Redeploying your app {#re-deploy}

If you need to make any changes to your app, you must redeploy it using the `slack deploy` command again.

In addition, if administrators of your workspace have enabled [Admin-Approved Apps](https://slack.com/help/articles/222386767-Manage-app-installation-settings-for-your-workspace), it means your app will need approval before it can be deployed or redeployed to your workspace.

✨  **For more information about getting your app approved**, check out [access controls for developers](/deno-slack-sdk/guides/controlling-permissions-for-admins#dev-connectors).
