# Custom function access

To make a function available so that another user (or many users) can access workflows that reference that function, you'll use the [`function access`](https://tools.slack.dev/slack-cli/reference/slack_function) command. At this time, functions can be made available to:

* _everyone_ in workspaces where the app has access,
* your app's _collaborators_,
* or _specific users_.

In order to enable the [`function access`](https://tools.slack.dev/slack-cli/reference/slack_function) command, your app must have been deployed _at least once before_ attempting to make your function available to others.

:::info[Re-deploy your app after using `function access`]

Anytime you make permission changes to your function using the `function access` command, your app must be redeployed, _each time after_, in order for the updates to be available in your app's workspace.

:::

## Grant access to one person {#single-access}

Given:
- a function with a [callback ID](/automation/functions/custom#fields) of `get_next_song`
- a user with ID `U1234567`

You can make your `get_next_song` function available to the user `U1234567` like this:

```cmd
$ slack function access --name get_next_song --users U1234567 --grant
```

_To revoke access, replace `--grant` with `--revoke`._

## Grant access to multiple people {#multi-access}

Given:
- a function with a [callback ID](/automation/functions/custom#fields) of `calculate_royalties`
- users with the following IDs: `U1111111`, `U2222222`, and `U3333333`

You can make your function `calculate_royalties` available to the above users like this:

```cmd
$ slack function access --name calculate_royalties --users U1111111,U2222222,U3333333 --grant
```

_To revoke access, replace `--grant` with `--revoke`._

## Grant access to all collaborators {#collaborator-access}

Given:
- a function with a [callback ID](/automation/functions/custom#fields) of `notify_escal_team`

You can make your `notify_escal_team` function available to all of your app's [collaborators](https://tools.slack.dev/slack-cli/reference/slack_slack_collaborators) like this:

```cmd
$ slack function access --name notify_escal_team --app_collaborators --grant
```

## Grant access to all workspace members {#all-access}

Given:
- a function with a [callback ID](/automation/functions/custom#fields) of `get_customer_profile`

You can make your `get_customer_profile` function available to everyone in your workspace like this:

```cmd
$ slack function access --name get_customer_profile --everyone --grant
```

## Grant access using the prompt-based approach {#distribute-prompt}

The prompt-based approach allows you to distribute your function to one user, to multiple people, to collaborators, or to everyone in an interactive prompt.

To activate the flow, use the following command in your terminal:

```cmd
$ slack function access
```

Given:
- a function with a [callback ID](/automation/functions/custom#fields) of `reverse`

You will answer the first prompt in the following manner:

#### Choose the name of the function you'd like to distribute

```cmd
> reverse (Reverse)
```
#### Choose who you'd like to to have access to your function

If going from `everyone` or `app_collaborators` **to** specific users, you should be offered the option of adding collaborators to specific users.

```cmd
> specific users (current)
  app collaborators only
  everyone
```
#### Choose an action

```cmd
> granting a user access
  revoking a user's access
```
#### Provide ID(s) of one or more user in your workspace

Given:
- a user's ID in your workspace: `U0123456789`

You will answer the following prompt below:

```cmd
: U0123456789
```
You can add multiple users at the same time. To do this, separate the user IDs with a comma (e.g. `U0123456789`, `UA987654321`).

After you've finished this flow, you'll receive a message indicating the type of distribution you chose.

## Guests and external users {#guests-external}

Guests and external users are limited in the workflows they may run based on the scopes defined for the functions in the workflows. There is a predefined set of scopes that are considered "risky", which guest users cannot run. These scopes include the following:

* [`channels:manage`](/scopes/channels:manage) - create and manage public channels
* [`channels:write.invites`](/scopes/channels:write.invites) - invite members to public channels
* [`groups:write`](/scopes/groups:write) - create and manage private channels
* [`groups:write.invites`](/scopes/groups:write.invites) - invite members to private channels
* [`usergroups:write`](/scopes/usergroups:write)  - create and manage usergroups

If a guest or external user attempts to run a workflow containing a function with one of these scopes, they will receive an error.

## More distribution options {#distribution-options}

For more distributions options, including how to **revoke** access, head to the [distribute command reference](https://tools.slack.dev/slack-cli/reference/slack_function).