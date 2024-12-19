---
slug: /deno-slack-sdk/guides/collaborating-with-teammates 
---

# Collaborating with teammates

<PaidPlanBanner />

Have multiple developers working on an app? Never fear! Teams can collaborate when building and deploying workflow apps.

## Deploy the app to make it available to collaborators {#deploy-to-collaborators}

Let's say you're working along on an app and you realize it's going to need several types of triggers. Your teammate Luke is the resident trigger expert, so you ask if he'll jump in and help you out, to which he enthusiastically agrees&mdash;hooray!

The first thing you'll do is to deploy your app using the `slack deploy` command.

✨  **For directions on how to deploy your app**, refer to [deploy to Slack](/deno-slack-sdk/guides/deploying-to-slack).

This will create an `apps.json` configuration file in your `.slack` folder (this folder may be hidden). This file contains information about your deployed apps, such as the installed workspace, the app name, the app ID, and the team ID. You'll want to check this file into version control in case you want to collaborate on the same deployed apps with others; if two or more people want to deploy or update the same app on the same workspace, the `apps.json` contents must be the same for everyone.

## Add collaborators {#collaborators}

Now, as long as Luke is in the same workspace as you, you can add Luke as a collaborator on your app right from the Slack CLI by entering the `slack collaborator add` command along with their email address or user ID. Choose your deployed environment, and voilà! Luke is now a collaborator on your app. To double-check, you can run the `slack collaborator list` command and choose your deployed environment&mdash;you should see yourself and Luke in the list.

In the meantime, Luke can clone the GitHub repository containing the files that comprise your app, including the `apps.json` file, to their local machine. If Luke also wants to deploy the app to the same workspace as you, they will have to run the `slack login` command within that workspace. Once logged in, Luke will have the same access to run the `slack deploy` command (and other Slack CLI commands) as you.

## Develop locally {#develop}

Both you and Luke can now develop locally on your unique instances of the app. Use the `slack run` command while working to see your changes in real-time within your local environment.

✨  **For information about developing locally**, refer to [local development](/deno-slack-sdk/guides/developing-locally).

### App instances {#app-instances}

Worthy of note is that there are now three instances of your app in existence:

* The deployed version of the app that exists within your shared workspace
* Your local version of the app
* Luke's local version of the app

:::info

Both your local projects will include an `apps.dev.json` file in your respective `.slack` folders, which are unique to your app and your local development environments. These files are only for local development and **should not** be checked into version control.

:::

## Deploy updates to production {#deploy-to-production}

Once you and Luke have completed development, either you or Luke can deploy the app to production by running the `slack deploy` command. 

However, be aware that this could lead to a situation in which Luke makes a change and runs the `slack deploy` command--and at the same time, you make a different, unrelated change and run the `slack deploy` command. Since you're both deploying the same app, the second deploy will overwrite the first. It is therefore important to either automate or coordinate your deployments with care. Teamwork makes the dream work!