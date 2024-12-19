# GitHub issues app

<PaidPlanBanner />

In this tutorial, you'll learn how to build a workflow app to create an issue in Github. We'll walk you through sequencing the right workflow steps together and building a function to call GitHub's APIs. Even if you're not looking to create issues on Github, you'll learn how you might invoke any third-party API from a function.

If creating issues on GitHub is actually what you want to do, then all you'll need to do is deploy your app when you're done customizing it. By following a form with a custom function that calls [an eminent endpoint by GitHub](https://docs.github.com/en/rest/issues/issues#create-an-issue), we can create an issue and close it ourselves!

Some features you’ll acquaint yourself with while building this app include:

* [Functions](/deno-slack-sdk/guides/creating-slack-functions): the building blocks of common Slack functionality.
* [Workflows](/deno-slack-sdk/guides/creating-workflows): a set of steps for calling your functions that are executed in order.
* [Custom functions](/deno-slack-sdk/guides/creating-custom-functions): building blocks that _you_ define!
* [Triggers](/deno-slack-sdk/guides/using-triggers): for kicking off your workflows.

Before we begin, ensure you have the following prerequisites completed:
* Install the [Slack CLI](/deno-slack-sdk/guides/getting-started).
* Run `slack auth list` and ensure your workspace is listed.
* If your workspace is not listed, address any issues by following along with the [Getting started](/deno-slack-sdk/guides/getting-started), then come on back.


## Choose your adventure

After you've [installed the command-line interface](/deno-slack-sdk/guides/getting-started), you have two ways you can get started:

### Use a blank app

You can create a blank app with the Slack CLI using the following command:

```bash
slack create github-functions-app --template https://github.com/slack-samples/deno-blank-template
```

### Use a pre-built app

Or, you can use the pre-built [GitHub Functions app](https://github.com/slack-samples/deno-github-functions):

```
slack create github-functions-app --template https://github.com/slack-samples/deno-github-functions
```

### Change your directory

Once you have your new project ready to go, change into your project directory.

## Create a GitHub personal access token

A personal access token is required when calling the GitHub API. Create a new token for this tutorial by visiting your developer settings on [GitHub](https://github.com/settings/tokens).

Since your personal access token will be used in this tutorial, all issues created from the workflow will appear to have been created by your account.

### Select required scopes

To access public repositories, create a new personal token [on GitHub](https://github.com/settings/tokens) with the following scopes:

+ `public_repo`, `repo:invite`
+ `read:org`
+ `read:user`, `user:email`
+ `read:enterprise`

To prevent `404: Not Found` errors when attempting to access private repositories, the `repo` scope must also be selected.

## Add the token to your environment variables

When developing locally, you can store your API credentials by adding your GitHub token to your app's environment variables. To do this, create a file called `.env` in the root directory of your project, and add your token to the file as follows:

```bash
GITHUB_TOKEN=ghp_1234AbCd5678
```

For more information, refer to [using environment variables with the Slack CLI](/slack-cli/guides/using-environment-variables-with-the-slack-cli).

## Define the custom function

Defining the definitions and manifest of our app gives us a birds-eye view before we dive into building. Open your text editor (we recommend VSCode with the Deno plugin) and point to the directory we created earlier.

Since the workflow we're creating revolves around creating a new GitHub issue, we'll begin by defining a [custom function](/deno-slack-sdk/guides/creating-custom-functions) with the inputs we know (the repository and information about the issue) and the outputs we expect (the issue number and link).

The `DefineFunction` method will allow us to define the attributes that comprise this function. Here, we'll describe the attributes seen by other people and used by workflows, as well as the input and output types.

```javascript
// functions/create_issue/definition.ts

import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

const CreateIssueDefinition = DefineFunction({
  callback_id: "create_issue",
  title: "Create GitHub issue",
  description: "Create a new GitHub issue in a repository",
  source_file: "functions/create_issue/mod.ts",
  input_parameters: {
    properties: {
      url: {
        type: Schema.types.string,
        description: "Repository URL",
      },
      title: {
        type: Schema.types.string,
        description: "Issue Title",
      },
      description: {
        type: Schema.types.string,
        description: "Issue Description",
      },
      assignees: {
        type: Schema.types.string,
        description: "Assignees",
      },
    },
    required: ["url", "title"],
  },
  output_parameters: {
    properties: {
      GitHubIssueNumber: {
        type: Schema.types.number,
        description: "Issue number",
      },
      GitHubIssueLink: {
        type: Schema.types.string,
        description: "Issue link",
      },
    },
    required: ["GitHubIssueNumber", "GitHubIssueLink"],
  },
});

export default CreateIssueDefinition;
```

The source code for `functions/create_issue/mod.ts` is shared in Step 4, but keep this definition in mind until then! Or rush ahead and write the function! We won't mind. 😉


## Scaffold your workflow

Start by defining the workflow and outlining the steps. We'll add functions and inputs to these steps later.

```javascript
// workflows/create_new_issue.ts

import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

const CreateNewIssueWorkflow = DefineWorkflow({
  callback_id: "create_new_issue_workflow",
  title: "Create new issue",
  description: "Create a new GitHub issue",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity", "channel"],
  },
});

/* Step 1 - Open a form */
// const issueFormData = CreateNewIssueWorkflow.addStep( ... );

/* Step 2 - Create a new issue */
// const issue = CreateNewIssueWorkflow.addStep( ... );

/* Step 3 - Post the new issue to channel */
// CreateNewIssueWorkflow.addStep( ... );

export default CreateNewIssueWorkflow;
```


## Make your manifest

Import and add these definitions to your app's manifest.

```javascript
// manifest.ts

import { Manifest } from "deno-slack-sdk/mod.ts";
import CreateIssueDefinition from "./functions/create_issue/definition.ts";
import CreateNewIssueWorkflow from "./workflows/create_new_issue.ts";

export default Manifest({
  name: "Workflows for GitHub",
  description: "Bringing oft-used GitHub functionality into Slack",
  icon: "assets/icon.png",
  functions: [CreateIssueDefinition],
  workflows: [CreateNewIssueWorkflow],
  outgoingDomains: [],
  // If your organization uses a separate Github enterprise domain, add that domain to this list
  // so that functions can make API calls to it.
  outgoingDomains: ["api.github.com"],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
```

## Collect user input

You can call functions in an ordered sequence by adding them to your workflow.

The Slack function [`OpenForm`](/deno-slack-sdk/reference/slack-functions/open_form) can be used to collect input data that is used by later steps in the workflow.

```javascript
// workflows/create_new_issue.ts

...

/* Step 1 - Open a form */
const issueFormData = CreateNewIssueWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Create an issue",
    interactivity: CreateNewIssueWorkflow.inputs.interactivity,
    submit_label: "Create",
    description: "Create a new issue inside of a GitHub repository",
    fields: {
      elements: [{
        name: "url",
        title: "Repository URL",
        description: "The GitHub URL of the repository",
        type: Schema.types.string,
      }, {
        name: "title",
        title: "Issue title",
        type: Schema.types.string,
      }, {
        name: "description",
        title: "Issue description",
        type: Schema.types.string,
      }, {
        name: "assignees",
        title: "Issue assignees",
        description:
          "GitHub username(s) of the user(s) to assign the issue to (separated by commas)",
        type: Schema.types.string,
      }],
      required: ["url", "title"],
    },
  },
);
```

## Call your custom function

The second step of the workflow calls our custom function to create an issue on GitHub. Similar to other steps, the definition of this function is provided, along with the inputs to the function.

```javascript
// workflows/create_new_issue.ts
import CreateIssueDefinition from "../functions/create_issue/definition.ts";

...

/* Step 2 - Create a new issue */
const issue = CreateNewIssueWorkflow.addStep(CreateIssueDefinition, {
  url: issueFormData.outputs.fields.url,
  title: issueFormData.outputs.fields.title,
  description: issueFormData.outputs.fields.description,
  assignees: issueFormData.outputs.fields.assignees,
});
```

Notice how the input of this function uses the output from the form in our previous step! The output of this step &mdash; the values to be returned from our custom function &mdash; will be used to construct and post a message with the basic details of a newly-created issue.


## Post the GitHub response

The Slack function [`SendMessage`](/deno-slack-sdk/reference/slack-functions/send_message) can be used to post details about the newly-created issue in the channel.

```javascript
// workflows/create_new_issue.ts

...

/* Step 3 - Post the new issue to channel */
CreateNewIssueWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: CreateNewIssueWorkflow.inputs.channel,
  message:
    `Issue #${issue.outputs.GitHubIssueNumber} has been successfully created\n` +
    `Link to issue: ${issue.outputs.GitHubIssueLink}`,
});
```

## Craft the custom function

Here's where you can take input from Slack, apply custom code to it, and return it back to a workflow.

Copy and paste the following code into `functions/create_issue/mod.ts`. The `mod.ts` filename is a convention to declare the entry point to your function in `functions/create_issue`.

```javascript
// functions/create_issue/mod.ts

import { SlackFunction } from "deno-slack-sdk/mod.ts";
import CreateIssueDefinition from "./definition.ts";

// https://docs.github.com/en/rest/issues/issues#create-an-issue
export default SlackFunction(
  CreateIssueDefinition,
  async ({ inputs, env }) => {
    const headers = {
      Accept: "application/vnd.github+json",
      Authorization: "Bearer " + env.GITHUB_TOKEN,
      "Content-Type": "application/json",
    };

    const { url, title, description, assignees } = inputs;

    try {
      const { hostname, pathname } = new URL(url);
      const [_, owner, repo] = pathname.split("/");

      // https://docs.github.com/en/enterprise-server@3.3/rest/guides/getting-started-with-the-rest-api
      const apiURL = hostname === "github.com"
        ? "api.github.com"
        : `${hostname}/api/v3`;
      const issueEndpoint = `https://${apiURL}/repos/${owner}/${repo}/issues`;

      const body = JSON.stringify({
        title,
        body: description,
        assignees: assignees?.split(",").map((assignee: string) => {
          return assignee.trim();
        }),
      });

      const issue = await fetch(issueEndpoint, {
        method: "POST",
        headers,
        body,
      }).then((res: Response) => {
        if (res.status === 201) return res.json();
        else throw new Error(`${res.status}: ${res.statusText}`);
      });

      return {
        outputs: {
          GitHubIssueNumber: issue.number,
          GitHubIssueLink: issue.html_url,
        },
      };
    } catch (err) {
      console.error(err);
      return {
        error:
          `An error was encountered during issue creation: \`${err.message}\``,
      };
    }
  },
);
```

For the curious, this function dissects input from the workflow's form, then makes a POST API request to the ["Create an issue" GitHub API endpoint](https://docs.github.com/en/rest/issues/issues#create-an-issue). The result of this API call is then returned as output as defined in the function definition (`functions/creation_issue/definition.ts`); otherwise an error is returned.

## Create a trigger

Triggers are how workflows are invoked. Each workflow can have multiple triggers.

There are four types of triggers: [link triggers](/deno-slack-sdk/guides/creating-link-triggers), [scheduled triggers](/deno-slack-sdk/guides/creating-event-triggers), [event triggers](/deno-slack-sdk/guides/creating-event-triggers), and [webhook triggers](/deno-slack-sdk/guides/creating-webhook-triggers). A link trigger is what we'll be using. 

Link triggers are an interactive type, which means they require a user to manually start them. Define your link trigger in a separate file in a `triggers` folder called `create_new_issue_shortcut.ts`:

```javascript
// triggers/create_new_issue_shortcut.ts

import { Trigger } from "deno-slack-api/types.ts";
import CreateNewIssueWorkflow from "../workflows/create_new_issue.ts";

const createNewIssueShortcut: Trigger<
  typeof CreateNewIssueWorkflow.definition
> = {
  type: "shortcut",
  name: "Create GitHub issue",
  description: "Create a new GitHub issue in a repository",
  workflow: "#/workflows/create_new_issue_workflow",
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
    channel: {
      value: "{{data.channel_id}}",
    },
  },
};

export default createNewIssueShortcut;
```

Run the `trigger create` command in your terminal:

```cmd
slack trigger create --trigger-def "triggers/create_new_issue_shortcut.ts"
```

After executing this command, select your workspace and choose the _Local_ app environment. When the process completes, you'll be given a link called "shortcut URL." This is your _link trigger_ for this workflow on this workspace. Save that URL for when you start testing.

## Run your code to test and tweak

Here's the step we're going to leave you, but this is where your development experience will begin as you alter, test, falter, alter, and test again.

You're building along and your workflow should be, too. You can use development mode to run this workflow in Slack directly from the machine you're reading this from now:

```bash
slack run
```

After you've chosen your development app and assigned it to your workspace, you can switch over to your Slack app and try out your new workflow.

In Slack, you'll want to use the _link trigger_ you created earlier. Once you paste its URL into the message box and post it, it'll unfurl and give you a button to invoke the workflow.

## Next steps

For your next challenge, perhaps consider creating an app your users can use to [request time off](/deno-slack-sdk/tutorials/request-time-off-app)!