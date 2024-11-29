# Triggers overview

> Triggers are wonderful things!

Triggers are one of the three building blocks that make up workflow apps. You will encounter all three as you navigate the path of building your workflow app:

1. Functions define the actions of your app
2. Workflows are made up of those functions
3. Triggers execute workflows (⬅️ you are here)

Since triggers are what kick off your workflows, you need to have a workflow before you can create a trigger. Acquaint yourself with the [documentation on workflows](/automation/workflows), then head back here. We'll wait!

With the knowledge of workflows within your noggin, let's take a look at how you can implement triggers into your new app.

## Understanding triggers {#understanding}

You will come to many forks in this metaphorical road that is trigger implementation. There are no wrong choices; all roads lead to your own wonderful workflow.

Triggers can be added to workflows in two ways:

* **You can add triggers with the CLI.** These static triggers are created only once. You attach them to your app's workflow, create them with the Slack CLI, and that's that.

* **You can add triggers at runtime.** These dynamic triggers are created at any step of a workflow so they can incorporate data acquired from other workflow steps.

Triggers created for a locally-running app (with the `slack run` command) are distinct from triggers created for an app in a production environment (with the `slack deploy` command).

## Custom trigger paths {#custom-path}

While Slack assumes your triggers will be located in the default `/triggers` directory in the root of your project, it also allows the flexibility to define them elsewhere. In order for Slack to find them, be sure to declare the alternate path in `slack.json` with the `config.trigger-paths` property. It might look like this:

```json
{
  "hooks": {
    ...
  },
  "config": {
    "trigger-paths": ["my-triggers/*.ts"]
  }
}
```

## Trigger types {#types}

There are four types of triggers, each one having its own specific implementation.

:::info 

In a hurry? You can create a basic <a href="/automation/triggers/link">link trigger</a> with a single Slack CLI command!

:::

| Trigger type                     | Use case                                                      |
|----------------------------------|---------------------------------------------------------------|
| [Link triggers](/automation/triggers/link)           | Invoke a workflow from a public channel in Slack              |
| [Scheduled triggers](/automation/triggers/scheduled) | Invoke a workflow at specific time intervals                  |
| [Event triggers](/automation/triggers/event)         | Invoke a workflow when a specific event happens in Slack      |
| [Webhook triggers](/automation/triggers/webhook)     | Invoke a workflow when a specific URL receives a POST request |

## Onward

Each type of trigger has a guide where you will learn how to create that type of trigger. Choose one to move forward:

➡️ **To learn more about link triggers,** read the [link triggers](/automation/triggers/link) documentation or explore the [Give Kudos](/tutorials/tracks/give-kudos) sample app. This sample app uses a link trigger to allow users to open up a form to give a compliment to a user.

✨**To learn more about scheduled triggers,** read the [scheduled triggers](/automation/triggers/scheduled) documentation or explore the [Virtual Running Buddies](/tutorials/tracks/create-social-app) sample app. This app uses a scheduled trigger to post a weekly message to a channel about people's running activity.

✨**To learn more about event triggers,** read the [event triggers](/automation/triggers/event) documentation or explore the [Welcome Bot](/tutorials/tracks/create-bot-to-welcome-users) sample app. This app uses an event trigger to send a message to a user when they join a channel.

✨**To learn more about webhook triggers,** read the [webhook triggers](/automation/triggers/webhook) documentation.