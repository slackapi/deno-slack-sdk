# Local development

As you're developing your workflow app, you can see your changes propagated to your workspace in real-time by using the `slack run` command. We refer to the workspace you develop in as your _local_ environment, and the workspace you deploy your app to as your _deployed_ environment.

You are not required to deploy your app. In fact, you might never need to use the `slack deploy` command — maybe there's something you want to do just one single time, or only when you need to — you can use `slack run` for that.

Otherwise, you should think of your local environment as a development environment. We even append the string `(local)` to the end of your app's name when running in this context.

## Using the `slack run` command {#slack-run}

When you enter `slack run` from the root directory of a project and you are logged into a Slack Enterprise Grid, you may also be asked to select a workspace within your organization to grant your app access to.

If administrators of your workspace have enabled [Admin-Approved Apps](/automation/admin), it means your app will need approval before it can be installed to your workspace.

✨  **For information about getting your app approved**, refer to [access controls for developers](/automation/admin#developers).

The Slack CLI will then start a local development server and establish a connection to the `(local)` version of your app. Check that your instance of the Slack CLI is logged in to the desired workspace by running `slack auth list`.

To start the local development server, use the `slack run` command:

```
$ slack run
```

You'll know your development server is ready when your terminal says the following:

`Connected, awaiting events`

To turn off the development server, enter `Ctrl`+`c` in the command line.

## Creating link triggers in local development {#local-triggers}

Link triggers are unique to each installed version of your app. This means that their "shortcut URLs" will differ across each workspace, as well as between local and [deployed](/automation/deploy) apps.

When creating a trigger, you must select the workspace you'd like to create the trigger in. Each workspace has a development version (denoted by `(local)`), as well as a deployed version.

✨  **For more information about link triggers**, refer to [access controls for developers](/automation/triggers/link).

If your app has any triggers created within that development environment, they'll be listed when you run the `slack run` command. If you only created triggers within a production environment using the `slack deploy` command, they will not appear.

## Creating triggers with the `slack run` command {#cli-trigger-prompt}

If you have not used the `slack triggers create` command to create a trigger prior to running the `slack run` command, you will receive a prompt in the Slack CLI to do so.

Let's say you've created a Slack app and tried to run the `slack run` command without first creating a trigger. The Slack CLI will ask you which workspace you'd like to run your app in, and will then prompt you to choose a trigger definition file. If you choose a file, the trigger will be created and the app will run. If you do not choose a trigger definition file or if you do not yet have one created, a trigger will not be created. No worries either way, as your app will still continue with the run operation.

## App visibility {#visibility}

As discussed above, once you create an app and run it using the `slack run` command, a link trigger will be generated for your app. Once that link trigger is posted in a public channel within your workspace, other channel members can click it and interact with your app even though your app has not been deployed.
