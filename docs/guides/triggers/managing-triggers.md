---
slug: /deno-slack-sdk/guides/managing-triggers
---

# Managing triggers

<PaidPlanBanner />

All triggers can be updated, deleted, viewed, and have their access restricted in the same way.

## Update a trigger {#update}

### Update a trigger with the CLI {#update_cli}

Make an update to a pre-existing trigger with the CLI by using the `slack trigger update` command. Provide the same payload you used to create the trigger *in its entirety*, in addition to the trigger ID.

```bash
slack trigger update --trigger-id Ft123ABC --trigger-def "path/to/trigger.ts"
```

### Update a trigger at runtime {#update_runtime}

You can update a runtime trigger, but the trigger must be updated in its entirety. Use the same structure as `client.workflows.triggers.create()` but for `client.workflows.triggers.update` with the additional `trigger_id` parameter.

```js
const triggerId = "FtABC123";
const response = await client.workflows.triggers.update<typeof ExampleWorkflow.definition>({
  trigger_id: triggerId,
  type: "<specific-trigger-type>",
  name: "My trigger",
  workflow: "#/workflows/myworkflow",
  inputs: {
    input_name: {
      value: "value",
    }
  }
});
// Error handling example in your custom function
if (response.error) {
  const error = `Failed to update a trigger (id: ${triggerId}) due to ${repsonse.error}`;
  return { error };
}
```

## Delete a trigger {#delete}

### Delete a trigger with the CLI {#delete_cli}

You can delete a trigger with the `slack trigger delete` command.

```bash
slack trigger delete --trigger-id FtABC123
```


### Delete a trigger at runtime {#delete_runtime}

Deleting a runtime trigger deletes that *specific* trigger created in one instance of the workflow. This means that you'll need to have stored the `trigger_id` created for that instance. Your app will continue to be able to create triggers until you remove the relevant code. 

You can delete a runtime trigger by using `client.workflows.triggers.delete()`. 

```js
const response = await client.workflows.triggers.delete({
   trigger_id: "FtABC123"
});
// Error handling example in your custom function
if (response.error) {
  const error = `Failed to delete a trigger due to ${response.error}`;
  return { error };
}
```

## List a trigger {#list}

Triggers created in your local development environment will only work if your application is still running locally. You can view triggers created in your local development environment with the `slack run --show-triggers` command. Triggers created in a deployed environment will not be returned. 

You can use the `slack triggers list` command to view information about your app's triggers, including the trigger ID, name, type, creation, and last updated time. When you use that command, you'll be prompted to select the workspace and then the environment (either local or deployed) for the triggers to list.

## Manage access to a trigger {#manage}

A newly-created trigger is accessible to anyone inside the workspace by default. You can manage who can access the trigger using the `access` Slack CLI command. 

### Grant access {#grant-access}

| Required Flag  | Description                              | Example Argument |
|----------------|------------------------------------------|------------------|
| `--grant`      | A switch to grant access                 |                  |
| `--trigger-id` | The `trigger_id` of the desired trigger  | `Ft123ABC`       |

Set one of the following flags to grant access to different groups. If no flag is selected you will be prompted to select a group within the Slack CLI. 

| Flag                  | Description                                              | Example Argument   |
|-----------------------|----------------------------------------------------------|--------------------|
| `--app-collaborators` | A switch to grant access to all app collaborators        |                    |
| `--channels`          | The channel IDs of channels to be granted access          | `C123ABC, C456DEF` |
| `--everyone`          | A switch to grant access to all workspace members        |                    |
| `--organizations`     | The enterprise IDs of organizations to be granted access | `E123ABC, E456DEF` |
| `--users`             | The user ID of users to be granted access                | `U123ABC, U456DEF` |
| `--workspaces`        | The team IDs of workspaces to be granted access          | `T123ABC, T456DEF` |

You can combine types of named entities (channels, organizations, users, and workspaces) in a single command. For example, the following command grants access to the trigger `FtABC123` for channel `C123ABC`, organization `E123ABC`, user `U123ABC` and workspace `T123ABC`:

```bash
slack trigger access --trigger-id Ft123ABC --channels C123ABC --organizations E123ABC --users U123ABC --workspaces T123ABC --grant
```
### Revoke access {#revoke-access}

| Required Flag  | Description                              | Example Argument |
|----------------|------------------------------------------|------------------|
| `--revoke`     | A switch to revoke access                |                  |
| `--trigger-id` | The `trigger_id` of the desired trigger  | `Ft123ABC`       |

Set one of the following flags to revoke access to different groups. If no flag is selected you will be prompted to select a group within the Slack CLI. 

| Flag              | Description                                                       | Example Argument   |
|-------------------|-------------------------------------------------------------------|--------------------|
| `--channels`      | The channel IDs of channels whose access will be revoked          | `C123ABC, C456DEF` |
| `--organizations` | The enterprise IDs of organizations whose access will be revoked  | `E123ABC, E456DEF` |
| `--users`         | The user IDs of users whose access will be revoked                | `U123ABC, U456DEF` |
| `--workspaces`    | The team IDs of workspaces whose access will be revoked           | `T123ABC, T456DEF` |

The following example command revokes access to the trigger `FtABC123` for users `U123ABC` and `U456DEF` and channels `C123ABC` and `C456DEF`.

```bash
slack trigger access --trigger-id FtABC123 --users U123ABC, U456DEF --channels C123ABC, C456DEF --revoke
```

## Onward

Remember, you won't be able to use any triggers unless your app is active.

✨ **If you're still testing out your app** you'll want to [run your app locally](/deno-slack-sdk/guides/developing-locally).

✨ **If your app is ready to go** you'll want to [deploy it to Slack](/deno-slack-sdk/guides/deploying-to-slack). 
