# Create or remove an app

An app goes through stages of development, from creation to experimentation and development to production. Sometimes a removal happens too.

The [Slack CLI](https://tools.slack.dev/slack-cli) provides a set of commands to make managing these stages a bit easier with the following offerings:

- [`slack create`](#create-app) to create a brand new app
- [`slack app link`](#link-app) to link an existing app to a project
- [`slack delete`](#remove-app) to remove an installed app

## Verify workspace authentication {#verify}

Before you can create (or remove) an app, ensure your CLI is authenticated into the workspace you want to develop in. You can do so with the `slack auth list` command:

```bash
$ slack auth list

myworkspace (Team ID: T123456789)
User ID: U123456789
Last update: 2022-03-24 18:20:47 -07:00
Authorization Level: Workspace

To change your active workspace authorization run slack login
```

## Create an app {#create-app}

With your CLI authenticated into the workspace you want to develop in, the next step is to scaffold an app with the `slack create` command:

```bash
$ slack create my-app
```
The above command will scaffold a new app called `my-app` in a directory with the same name. If you don't pass an app name, `slack` will scaffold an app with a random alphanumeric name.

You will be presented with three options to build from:
* The introductory [Issue Submission](https://github.com/slack-samples/deno-issue-submission) app
* The scaffolded [Deno Starter Template](https://github.com/slack-samples/deno-starter-template)
* The completely blank [Deno Blank Template](https://github.com/slack-samples/deno-blank-template)

:::tip
If you'd like to build from a specific sample app, see [Create an app from a template](#templates) below.
:::

```bash
? Select a template to build from: [Use arrows to move]

> Issue submission (default sample)
  Basic app that demonstrates an issue submission workflow

  Scaffolded project
  Solid foundation that includes a Slack datastore

  Blank project
  A, well.. blank project

  View more samples

  Guided tutorials can be found at api.slack.com/automation/samples
  ```

Once you select an option the Slack CLI will get you set up for success.

```bash
$ slack create my-app

⚙️  Creating a new Slack app in ~/programming/my-app

📦 Installed project dependencies

✨ my-app successfully created

🧭 Explore the documentation to learn more
   Read the README.md or peruse the docs over at api.slack.com/automation
   Find available commands and usage info with `slack help`

📋 Follow the steps below to begin development
   Change into your project directory with `cd my-app`
   Develop locally and see changes in real-time with `slack run`
   When you're ready to deploy for production use `slack deploy`
   Create a trigger to invoke your workflows `slack trigger create`
```

After creating an app, don't forget to `cd` into your app project's directory.

➡️ **To keep building your own app**, learn about your app's manifest in the [manifest](/automation/manifest) section.

⤵️ **To use a sample app as a template instead**, read on!

### Create an app from a template {#templates}

:::warning[Evaluate third-party apps]

Exercise caution before trusting third-party and open source applications and automations (those outside of [`slack-samples`](https://github.com/slack-samples)). Review all source code created by third-parties before running `slack create` or `slack deploy`. 

:::

We have a [collection of sample apps](/automation/samples) containing a bevy of use cases. Find one particularly suited for your needs? Great! You can use it as a template to build from.

Create an app from a template by using the `create` command with the `--template` (or `-t`) flag and passing the link to the template's Github repo.

For example, the following command creates an app using our [Welcome Bot](https://github.com/slack-samples/deno-welcome-bot) app as a template:

```bash
slack create my-welcome-bot-app -t https://github.com/slack-samples/deno-welcome-bot
```

#### Create an app from a specific branch {#branch}

Use a specific branch of a template repo by using the `--branch` (or `-b`) flag and passing the name of a branch:

```bash
slack create my-welcome-bot-app -t https://github.com/slack-samples/deno-welcome-bot -b main
```

---

## Link an app {#link-app}

Apps that were created without the CLI can still be used with the CLI for ease in app management. This requires the `app link` command to save information about the app with the project it exists on:

```bash
slack app link --app A0123456789 --team T0123456789 --environment "deployed"
```

```bash
🏠 An existing app was added to the project
   my-workspace:
      App  ID: A0123456789
      Team ID: T0123456789
      Status:  Installed
```

This command can be used without flags, but the above example would use the app ID "A01234567890" from team "T01234567890" - the team the app was created on - as a "deployed" app. Following selections in commands will reveal this app as an option and it's all set for CLI use!

Another `--environment` option is "local" and this saves apps to `.slack/apps.dev.json`. Local apps are intended for personal development and experimentation while "deployed" apps - saved to `.slack/apps.json` - serve the needs of production.

Just one app ID can exist for each combination of team ID and environment to avoid accidental selections with duplicated possibilities. The provided app ID must also exist for this `link` command to complete with success.

---

## Remove an app {#remove-app}

All good things must come to an end. You can `uninstall` your app if you need to remove an app from a workspace, change app permissions, or `delete` the app in its entirety.

### Uninstall an app from your team {#uninstall-app}

Removing an app from a workspace doesn't have to be a permanent decision. Sometimes uninstalling the app to remove it's active presence in channels is sufficient! This option has the added benefit of reinstallation at a later time without recreating the entire app.

To uninstall an app using the CLI, use the `slack uninstall` command. Then, choose the workspace you want to remove the app from:

```bash
slack uninstall -a A123ABC456 -t T123ABC456
```

```bash
⚠️ Warning
   App (A123ABC456) will be uninstalled from my-workspace (T123ABC456)
   All triggers, workflows, and functions will be deleted
   Datastore records will be persisted

❓ Are you sure you want to uninstall? Yes

🏠 Workspace uninstall
   Uninstalled the app "my-app" from workspace "my-workspace"
```

### Delete an app from your team {#delete-app}

:::danger[Deleting your app _permanently_ deletes all of its data]

Your app's related workflows, functions, and datastores will also be deleted. This decision is final and cannot be undone.

:::

To delete an app using the CLI, use the `slack delete` command:

```bash
slack delete -a A123ABC456 -t T123ABC456
```

```bash
⚠️ Danger zone
   App (A123ABC456) will be permanently deleted
   All triggers, workflows, and functions will be deleted
   All datastores for this app will be deleted
   Once you delete this app, there is no going back

❓ Are you sure you want to delete the app? Yes

🏠 App Uninstall
   Uninstalled the app "my-app" from "my-workspace"

📚 App Manifest
   Deleted the app manifest for "my-app" from "my-workspace"

🏘️ Apps
   This project has no apps
```

## Onward

Your wish is our command! For information about other actions you can perform from the CLI, refer to the [Slack CLI commands guide](https://tools.slack.dev/slack-cli/commands).

Check out more about how to configure your app via the [manifest](/automation/manifest). You can also start building [functions](/automation/functions) to perform some logic, chain them together in [workflows](/automation/workflows), and create [triggers](/automation/triggers) to invoke those workflows.