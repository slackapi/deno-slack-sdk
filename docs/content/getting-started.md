---
sidebar_label: Getting started
---
# Getting started with the Deno Slack SDK

In the following guide, you'll install the Slack CLI and authorize it in your workspace. Then, you'll use the Slack CLI to scaffold a fully-functional workflow app and run it locally.

Don't have a workspace yet? You can get up and running by provisioning a sandbox with an associated workspace by following [this guide](/docs/developer-sandbox). Come on back when you're ready!

## Step 1: Install the Slack CLI {#install-cli}

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info 
The minimum required Slack CLI version for Enterprise Grid as of September 19th, 2023 is `v2.9.0`. If you attempt to log in with an older version, you'll receive a `cli_update_required` error from the Slack API. Run `slack upgrade` to get the latest version. 
:::

<Tabs groupId="operating-systems">
  <TabItem value="win" label="MacOS & Linux installation">
  
  **Run the automated installer from your terminal window:**

```zsh
curl -fsSL https://downloads.slack-edge.com/slack-cli/install.sh | bash
```

This will install the Slack CLI and all required dependencies, including [Deno](/automation/deno), the 
runtime environment for workflow apps. If you have VSCode installed,
the [VSCode Deno
extension](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
will be installed.


<details>
<summary>Optional: Use an alias for the Slack CLI binary</summary>

If you have another CLI tool in your path called `slack`, you can rename the slack binary to a different name before you add it to your path.

To do this, pass the `-s` argument to the installer script:

```zsh
curl -fsSL https://downloads.slack-edge.com/slack-cli/install.sh | bash -s <your-preferred-alias>
```

The alias you use should come after any flags used in the installation script. For example, if you use both flags noted below to pass a version and skip the Deno installation, your install script might look like this:

```
curl -fsSL https://downloads.slack-edge.com/slack-cli/install.sh | bash -s -- -v 2.1.0 -d <your-preferred-alias>
```

You can also copy the Slack CLI into any folder that is already in your path (such as `/usr/local/bin`&mdash;you can use`echo $PATH` to find these), or add a new folder to your path by listing the folder you installed the Slack CLI to in `/etc/paths`.

If you don't rename the slack binary to a different name, the installation script will detect existing binaries named `slack` and bail if it finds one&mdash;it will not overwrite your existing `slack` binary.

</details>



<details>
<summary>Optional: customize installation using flags</summary>

There are two optional flags available to customize the installation.

1. Specify a version you'd like to install using the version flag, `-v`. The absence of this flag will ensure the latest Slack CLI version is installed.
```
curl -fsSL https://downloads.slack-edge.com/slack-cli/install.sh | bash -s -- -v 2.1.0
```

2. Skip the Deno installation by using the `-d` flag, like this:
```
curl -fsSL https://downloads.slack-edge.com/slack-cli/install.sh | bash -s -- -d
```
</details>



<details>
<summary>Troubleshooting</summary>

#### Errors

Error: _Failed to create a symbolic link! The installer doesn't have write access to /usr/local/bin. Please check permission and try again..._

Solution: Sudo actions within the scripts were removed so as not to create any security concerns. The `$HOME` env var is updated to `/root` &mdash; however, the installer is using `$HOME` for both Deno and the SDK install, which causes the whole install to be placed under `/root`, making both Deno and the SDK unusuable for users without root permissions.
* For users who do not have root permissions, run the sudo actions manually as follows: `sudo mkdir -p -m 775 /usr/local/bin`, then `sudo ln -sf "$slack_cli_bin_path" "/usr/local/bin/$SLACK_CLI_NAME"` where `$slack_cli_bin_path` is typically `$HOME/.slack/bin/slack` and `$SLACK_CLI_NAME` is typically the alias (by default it’s `slack`).
* For users who do have root permissions, you can run the installation script as `sudo curl -fsSL https://downloads.slack-edge.com/slack-cli/install.sh | bash`. In this case, the script is executed as root.

</details>
  
  </TabItem>

  <TabItem value="mac" label="Windows Installation">
  
  **Run the automated installer from Windows PowerShell:**

```zsh
irm https://downloads.slack-edge.com/slack-cli/install-windows.ps1 | iex
```

:::warning

PowerShell is required for installing the Slack CLI on Windows machines; an alternative shell will not work.

:::

This will install the Slack CLI and all required dependencies, including [Deno](/automation/deno), the 
runtime environment for workflow apps. If you have VSCode installed,
the [VSCode Deno
extension](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
will be installed.

<details>
<summary>Optional: Use an alias for the Slack CLI binary</summary>

If you have another CLI tool in your path called `slack`, you can rename the slack binary to a different name before you add it to your path. 

To do this, copy the Slack CLI into any folder that is already in your path, or add a new folder to your path by listing the folder you installed the Slack CLI to in your Environment Variables. You may not have access to edit System variables, so you might need to add it to your account's User variables. You can open the Environment Variables dialog by pressing the `Win`+`R` keys to open the Run window, and then entering the following command: 

```pwsh
rundll32.exe sysdm.cpl,EditEnvironmentVariables
```

You can also use the `-Alias` flag as decribed within **Optional: customize installation using flags**.

</details>



<details>
<summary>Optional: customize the installation using flags</summary>

There are several flags available to customize the installation. Since flags
cannot be passed to remote scripts, you must first download the installation
script to a local file:

```zsh
irm https://downloads.slack-edge.com/slack-cli/install-windows.ps1 -outfile 'install-windows.ps1'
```

The available flags are:

| Flag | What it does | Example |
| :--  | :--          | :--     |
| `-Alias` | Installs the Slack CLI as the provided alias | `-Alias slackcli` will create a binary named `slackcli.exe` and add it to your path |
| `-Version` | Installs a specific version of the Slack CLI | `-Version 2.1.0` installs version `2.1.0` of the Slack CLI |
| `-SkipGit` | If true, will not attempt to install Git when Git is not present | `-SkipGit $true` |
| `-SkipDeno` | If true, will not attempt to install Deno when Deno is not present | `-SkipDeno $true` |

You can also see all available flags by passing `-?` to the installation script:

```zsh
.\install-windows.ps1 -?
```

Here's an example invocation using every flag:

```zsh
.\install-windows.ps1 -Version 2.1.0 -Alias slackcli -SkipGit $true -SkipDeno $true
```

</details>

<details>
<summary>Troubleshooting</summary>

#### Errors

Error: _Not working? You may need to update your session's Language Mode._

Solution: For the installer to work correctly, your PowerShell session's [language mode](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_language_modes?view=powershell-7.3#what-is-a-language-mode) will need to be set to `FullLanguage`. To check your session's language mode, run the following in your PowerShell window: `ps $ExecutionContext.SessionState.LanguageMode`. To run the installer, your session's language mode will need to be `FullLanguage`. If it's not, you can set your session's language mode to `FullLanguage` with the following command: `ps $ExecutionContext.SessionState.LanguageMode = "FullLanguage"`

</details>

  </TabItem>

  <TabItem value="manual" label="Manual Installation">
  
**1. Download and install [Deno](https://deno.land).** Refer to [Install Deno](/automation/deno/install) for more details.

**2. Verify that Deno is installed and in your path.**

```bash
$ deno --version
deno 1.31.1* (release, x86_64-apple-darwin)
v8 10.*
typescript 4.*
```

**3. Download and install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), a dependency of the** `slack` **CLI.**

**4. Download the** `slack` **CLI installer for your environment.**

  <ts-icon class="ts_icon_windows"></ts-icon> &nbsp; <a href="https://downloads.slack-edge.com/slack-cli/slack_cli_2.29.2_windows_64-bit.zip"><strong>Windows (.zip)</strong></a>

  <ts-icon class="ts_icon_apple"></ts-icon> &nbsp; <a href="https://downloads.slack-edge.com/slack-cli/slack_cli_2.29.2_macOS_64-bit.tar.gz"><strong>Download for macOS (.tar.gz)</strong></a>

  <ts-icon class="ts_icon_plug"></ts-icon> &nbsp; <a href="https://downloads.slack-edge.com/slack-cli/slack_cli_2.29.2_linux_64-bit.tar.gz"><strong>Download for Linux (.tar.gz)</strong></a>

**5. Add the** `slack` **CLI to your path.**

:::info

Existing `slack` binary in path? 

If you have another CLI tool in your path called `slack`, we recommend renaming our slack binary to a different name before adding it to your path. See your OS-specific installation tab for more details.

:::


**6. Verify that** `slack` **is installed and in your path.**
```
$ slack version
Using slack v2.29.2
```

**7. Verify that all dependencies have been installed.**

Run the following command:

```
$ slack doctor
```

**A few notes about hooks**

If you have upgraded your CLI version but your `deno-slack-hooks` version is less than `v1.3.0`, when running `slack doctor`, you will see the following near the end of the output:

    ✔ Configurations (your project's CLI settings)
        Project ID: 1a2b3c4d-ef5g-67hi-8j9k1l2m3n4o
                    
    ✘ Runtime (foundations for the application)
        Error: The `doctor` hook was not found (sdk_hook_not_found)
        Suggestion: Ensure this hook is implemented in your `slack.json`

    ✔ Dependencies (requisites for development)
        deno_slack_hooks: 1.2.3 → 1.3.0 (supported version)

In addition, if you attempt to run the `slack run` command without this dependency installed, you will see a similar error in your console:

    🚫 The `start` script was not found (sdk_hook_not_found)

    💡 Suggestion
        Hook scripts are defined in the Slack configuration file ('slack.json').
        Every app requires a 'slack.json' file and you can find a working example at:
        https://github.com/slack-samples/deno-starter-template/blob/main/slack.json

Ensure that `deno-slack-hooks` is installed at the project level and that the version is not less than `v1.3.0`.

**8. [Install the VSCode extension for
   Deno](/automation/deno/install#vscode) (recommended).**

  </TabItem>

</Tabs>


## Step 2: Authorize the Slack CLI {#authorize-cli}

With the Slack CLI installed, authorize the Slack CLI in your workspace with the following command:

```zsh
slack login
```

In your terminal window, you should see an authorization ticket in the form of a
slash command, and a prompt to enter a challenge code:

```zsh
$ slack login

📋 Run the following slash command in any Slack channel or DM
   This will open a modal with user permissions for you to approve
   Once approved, a challenge code will be generated in Slack

/slackauthticket ABC123defABC123defABC123defABC123defXYZ

? Enter challenge code
```

Copy the slash command and paste it into any Slack conversation in the workspace you will be developing in.

When you send the message containing the slash command, a modal will pop up, prompting you to grant certain permissions to the Slack CLI. Click the Confirm button in the modal to move to the next step.

A new modal with a challenge code will appear. Copy that challenge code, and paste it back into your terminal:


```zsh
? Enter challenge code eXaMpLeCoDe

✅ You've successfully authenticated! 🎉
   Authorization data was saved to ~/.slack/credentials.json

💡 Get started by creating a new app with slack create my-app
   Explore the details of available commands with slack help
```

Verify that your Slack CLI is set up by running `slack auth list` in your
terminal window:


```zsh
$ slack auth list

myworkspace (Team ID: T123ABC456)
User ID: U123ABC456
Last updated: 2023-01-01 12:00:00 -07:00
Authorization Level: Workspace
```

You should see an entry for the workspace you just authorized. If you don't, get a new authorization ticket with `slack login` to try again.

You're now ready to begin building workflow apps! In the next step, we'll
get started with a sample app.

## Step 3: Create an app from a template {#create-app}

:::info

**Evaluate third-party apps**
Exercise caution when using third-party applications and automations (those outside of [`slack-samples`](https://github.com/slack-samples)). Review all source code created by third-parties before running `slack create` or `slack deploy`. 

:::

The `create` command is how you create a workflow app.

For this guide, we'll be creating a Slack app using the [Deno Starter Template](https://github.com/slack-samples/deno-starter-template) as a template:

```zsh
slack create my-app --template https://github.com/slack-samples/deno-starter-template
```

The Slack CLI creates an app project folder and fills it with the sample app code. Once it has finished, `cd` into your new project directory:

```zsh
cd my-app
```

Then continue to the next step.

## Step 4: Run the app in local development mode {#local-development-mode}

While building your app, you can see your changes propagated to your workspace
in real-time by running `slack run` within your app's directory.

```
slack run
```

When you execute `slack run`, you'll be asked to select a local environment:

```zsh
? Choose a local environment
> Install to a new workspace or organization
```

Since you've not installed your app to any workspaces, select *Install to a new
workplace*. Then select the workspace you authenticated in.

The Slack CLI will attempt to list any triggers, and in this case, will inform you there are no 
existing triggers installed for the app.

[Triggers](/automation/triggers) are what cause workflows to run. A [link
trigger](/automation/triggers/link) generates a *Shortcut URL* which, when posted in
a channel or added as a bookmark, becomes a link.

Triggers are created from trigger definition files. The Slack CLI will then look for any
trigger definition files and prompt you to select one. In this case, there is
only one trigger: `sample_trigger.ts`. Select it.

```zsh
? Choose a trigger definition file:
> triggers/sample_trigger.ts
  Do not create a trigger
```

Once your app's trigger is created, you will see the following output:

```
⚡ Trigger successfully created!

  Sample trigger (local) Ft0123ABC456 (shortcut)
  Created: 2023-01-01 12:00:00 -07:00 (1 second ago)
  Collaborators: 
    You! @You U123ABC456DE
  Can be found and used by:
    everyone in the workspace
  https://slack.com/shortcuts/Ft0123ABC456/XYZ123
```

The Slack CLI will also start a local development server, syncing changes to your
workspace's development version of your app. You'll know your local development
server is up and running when your terminal window tells you it's `Connected,
awaiting events`.

## Step 5: Use your app {#use}

Grab the `Shortcut URL` you generated in the previous step and paste it in a
public channel in your workspace. You will see the shortcut unfurl with a
"Start Workflow" button. Click the button to execute the shortcut.

In the modal that appears, select a channel, and enter a message. When
you click the "Send message" button, you should see your message appear in the
channel you specified.

When you want to turn _off_ the local development server, use `Ctrl+c` in the
command prompt.

---

## Onward {#start-build}

At this point your Slack CLI is fully authorized and ready to create new projects.
It's time to choose the next path of adventure.

We have curated a [collection of sample apps](/automation/samples). Many have
tutorials. All highlight features of workflow apps. Learn how to:

* design [datastores](/automation/datastores) to store data with the [Virtual
  Running Buddies app](/tutorials/tracks/create-social-app).
* send [event-triggered](/automation/triggers/event) automated
  [messages](/reference/functions/send_message) with the [Welcome Bot
  app](/tutorials/tracks/create-bot-to-welcome-users).
* create [forms](/automation/forms) to receive user input with the [Give Kudos
  app](/tutorials/tracks/give-kudos).

Each tutorial will expose you to many aspects of the workflow automations. If
you'd rather explore the documentation on your own, here are a few places to
start. You can learn how to:

* [deploy your app](/automation/deploy) so you don't need to run it locally.
* [build an app from scratch](/automation/create).
* use workflow apps in conjunction with other services, whether that's with
  [third-party API calls](/automation/faq#third-party) or [external
  authentication](/automation/external-auth).
* use the [Deno Slack SDK](https://github.com/slackapi/deno-slack-sdk) in tandem with the Slack CLI to access the API, additional documentation, and code libraries. You'll first need to download and install [Deno](/automation/deno/install). If you're using VSCode for development, make sure to also download the [Deno extension for VSCode](/automation/deno/install#vscode).