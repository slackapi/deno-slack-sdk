# Open authorization

<PaidPlanBanner />

This tutorial guides you through setting up [external authentication](/deno-slack-sdk/guides/integrating-with-services-requiring-external-authentication) in an app via OAuth2. The sample app for this tutorial demonstrates multi-stage workflows for requesting and collecting feedback on messages that starts with the press of a reaction, with responses stored dynamically in a Google Sheet. Because the focus of this tutorial is setting up OAuth2, we won't be going through every workflow and function, but you can check them out in the [sample app repo on GitHub](https://github.com/slack-samples/deno-simple-survey).

✨  **First time creating a workflow app?** Try a basic app to build your confidence, such as [Hello World](/deno-slack-sdk/tutorials/hello-world-app)!

Before we begin, ensure you have the following prerequisites completed:
* Install the [Slack CLI](/deno-slack-sdk/guides/getting-started).
* Run `slack auth list` and ensure your workspace is listed.
* If your workspace is not listed, address any issues by following along with the [Getting started](/deno-slack-sdk/guides/getting-started), then come on back.

## Choose your adventure

After you've [installed the command-line interface](/deno-slack-sdk/guides/getting-started) you have two ways you can get started:

### Use a blank app

You can create a blank app with the Slack CLI using the following command:

```bash
slack create simple-survey-app --template https://github.com/slack-samples/deno-blank-template
```

### Use a pre-built app

Or, you can use the pre-built [Simple Survey app](https://github.com/slack-samples/deno-simple-survey):

```bash
slack create simple-survey-app --template https://github.com/slack-samples/deno-simple-survey
```

Because this tutorial will not go through creating all of the files, a pre-built app might be easiest to follow along with. 

Once you have your new project ready to go, change into your project directory.

## Explore the app structure

Let's take a look at what's inside our new "Simple Survey" project directory:

```
assets/
datastores/
deno.jsonc
deno.lock
external_auth/
functions/
import_map.json
LICENSE
manifest.ts
README.md
slack.json
triggers/
workflows/
```

The first place to direct your attention are the `datastores`, `functions`, `triggers`, and `workflows` folders. These are where the definitions and implementations for the inner workings of your app live. As you might have guessed, the `external_auth` folder is where we'll define our external authentication.

The next place to look is the `manifest.ts` file. This contains your app's manifest, which is where we can configure things like bot scopes and tell our app about our workflows. We'll return to the manifest a bit later.

Other items in the project include:
* `.slack/`: a home for internal configuration files, scripts hooks, and the app SDK. This directory must be checked into your version control. You'll also notice a `.slack/apps.dev.json` once you begin building: this file is in `.gitignore` and should not be checked in to version control.
* `import_map.json`: a helper file for Deno that specifies where modules should be imported from.
* `assets/`: a place to store assets related to the project. This is a great place to store the icon that your app will display when users interact with it.

## Explore the supported workflows

This app's functionality is centered around six workflows. While we won't go into detail on all of them, it's important to know how they all fit together so that we can understand the flow of data later on. Here are the workflows:
* **Prompt survey creation**: Ask if a user wants to create a survey when a 📋 reaction is added to a message.
* **Create a survey**: Respond to the reacted message with a feedback form and make a new spreadsheet to store responses.
* **Respond to a survey**: Open the feedback form and store responses in the spreadsheet.
* **Remove a survey**: Delete messages with survey and surveying users for reaction events.
* **Event configurator**: Update the channels to survey and surveying users for reaction events.
* **Maintenance job**: A daily run workflow that ensures bot user membership in channels specified for event reaction triggers. Recommended for production-grade operations.

Now that we've covered the app's basic structure, let's look at hooking up OAuth2 by first preparing our Google services.

## Get your Google credentials

With [external authentication](/deno-slack-sdk/guides/integrating-with-services-requiring-external-authentication), you can programmatically interact with Google services and APIs from your app.

The client credentials needed for these interactions can be collected from a Google Cloud project with OAuth enabled and with access to the appropriate services.

### Create a Google Cloud Project

Begin by creating a new project from the [Google Cloud resource manager](https://console.cloud.google.com/cloud-resource-manager), then enable the Google Sheets API for this project.

Next, create an OAuth consent screen for your app. The "User Type" and other required app information can be configured as you wish. No additional scopes need to be added here, and you can add test users for development if you want.

Client credentials can be collected by creating an OAuth client ID with an application type of "Web application". Under the "Authorized redirect URIs" section, add https://oauth2.slack.com/external/auth/callback, then click "Create".

You'll use these newly-created client credentials in the next steps.

## Define your OAuth2 provider

Next up, we'll define the OAuth2 provider. Open `/external_auth/google_provider.ts` to see how that's done.

Take your client ID and add it as the value for `client_id` where it's marked below.

```javascript
// google_provider.ts

import { DefineOAuth2Provider, Schema } from "deno-slack-sdk/mod.ts";

/**
 * External authentication uses the OAuth 2.0 protocol to connect with
 * accounts across various services. Once authenticated, an access token
 * can be used to interact with the service on behalf of the user.
 */
const GoogleProvider = DefineOAuth2Provider({
  provider_key: "google",
  provider_type: Schema.providers.oauth2.CUSTOM,
  options: {
    "provider_name": "Google",
    "authorization_url": "https://accounts.google.com/o/oauth2/auth",
    "token_url": "https://oauth2.googleapis.com/token",
    "client_id": "", // TODO: Add your Client ID here!
    "scope": [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    "authorization_url_extras": {
      "prompt": "consent",
      "access_type": "offline",
    },
    "identity_config": {
      "url": "https://www.googleapis.com/oauth2/v1/userinfo",
      "account_identifier": "$.email",
    },
  },
});

export default GoogleProvider;
```
Once complete, your app needs to be deployed to Slack in order to create an environment for storing your external authentication client secret and access token. Run the following in your terminal: 

```bash
slack deploy
```

Running these commands will warn you that a client secret must be added for your OAuth2 provider. Don't worry about that for now; we'll take care of this in a future step!

## Add the provider to your app manifest

At the root of every app, there exists an app manifest, which defines how an app presents itself.

The app [manifest](/deno-slack-sdk/guides/using-the-app-manifest) is where we configure the app's name and scopes, and declare which workflows our app uses. We will also need to add our new provider as an `externalAuthProvider`. 

```javascript
// manifest.ts

import { Manifest } from "deno-slack-sdk/mod.ts";

import GoogleProvider from "./external_auth/google_provider.ts";
import SurveyDatastore from "./datastores/survey_datastore.ts";

import ConfiguratorWorkflow from "./workflows/configurator.ts";
import MaintenanceJobWorkflow from "./workflows/maintenance_job.ts";

import AnswerSurveyWorkflow from "./workflows/answer_survey.ts";
import CreateSurveyWorkflow from "./workflows/create_survey.ts";
import RemoveSurveyWorkflow from "./workflows/remove_survey.ts";
import PromptSurveyWorkflow from "./workflows/prompt_survey.ts";

export default Manifest({
  name: "Simple Survey",
  description: "Gather input and ideas at the press of a reacji",
  icon: "assets/default_new_app_icon.png",
  externalAuthProviders: [GoogleProvider], //Here is where we tell our app about the Google provider.
  datastores: [SurveyDatastore],
  workflows: [
    ConfiguratorWorkflow,
    MaintenanceJobWorkflow,
    AnswerSurveyWorkflow,
    CreateSurveyWorkflow,
    PromptSurveyWorkflow,
    RemoveSurveyWorkflow,
  ],
  outgoingDomains: ["sheets.googleapis.com"],
  botScopes: [
    "channels:join",
    "chat:write",
    "chat:write.public",
    "commands",
    "datastore:read",
    "datastore:write",
    "reactions:read",
    "triggers:read",
    "triggers:write",
  ],
});
```

Now that the provider is created and added to the manifest, we can encrypt and store the client secret. 

## Encrypt and store the client secret

With your client secret ready, run the following command in your terminal, replacing GOOGLE_CLIENT_SECRET with your own secret:

```bash
slack external-auth add-secret --provider google --secret GOOGLE_CLIENT_SECRET
```

When prompted to select an app, choose the `dev` app only if you are running locally.

If everything was successful, the CLI will let you know:
```
✨  successfully added external auth client secret for google
```

## Initiate OAuth2 flow

With your Google project created and the Client ID and secret set, you're ready to initiate the OAuth flow!

If all the right values are in place, the following command will prompt you to choose an app, select a provider (hint: choose the Google one), then pick the Google account you want to authenticate with. This will open a browser window for you to complete the OAuth2 sign-in flow according to your provider's requirements. You'll know you're successful when your browser sends you to the oauth2.slack.com page stating that your account was successfully connected.

```bash
slack external-auth add
```

Verify that a token has been created by re-running the `external-auth add` command. If you see `Token Exists? Yes`, then token creation was successful.

You're nearly ready to create surveys at the press of a reaction!

## Use in a custom function

If you refer back to the workflow overview we explored in Step 1 above, you'll recall that after the survey creation is prompted, the `create_survey` workflow gets kicked off. We'll now look at how that workflow gets the token and passes it through the app to be used for communicating with Google services, demonstrating how it is used in both a custom function and a workflow.

Turning your attention to `create_survey.ts`, you will see that the first step in the workflow is calling the `CreateGoogleSheetFunctionDefinition`.

```javascript
// /workflows/create_survey.ts

...

// Step 1: Create a new Google spreadsheet
const sheet = CreateSurveyWorkflow.addStep(
  CreateGoogleSheetFunctionDefinition,
  {
    google_access_token_id: {},
    title: CreateSurveyWorkflow.inputs.parent_ts,
  },
);

...
```

That function's definition looks like this:

```javascript
// /functions/create_google_sheet.ts

import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Custom functions can gather OAuth access tokens from external
 * authentication to perform individualized actions on external APIs.
 */
export const CreateGoogleSheetFunctionDefinition = DefineFunction({
  callback_id: "create_google_sheet",
  title: "Create spreadsheet",
  description: "Create a new Google Sheet",
  source_file: "functions/create_google_sheet.ts",
  input_parameters: {
    properties: {
      google_access_token_id: {
        type: Schema.slack.types.oauth2,
        oauth2_provider_key: "google",
      },
      title: {
        type: Schema.types.string,
        description: "The title of the spreadsheet",
      },
    },
    required: ["google_access_token_id", "title"],
  },
    output_parameters: {
    properties: {
      google_spreadsheet_id: {
        type: Schema.types.string,
        description: "Newly created spreadsheet ID",
      },
      google_spreadsheet_url: {
        type: Schema.types.string,
        description: "Newly created spreadsheet URL",
      },
      reactor_access_token_id: {
        type: Schema.types.string,
        description: "The Google access token ID of the reactor",
      },
    },
    required: [
      "google_spreadsheet_id",
      "google_spreadsheet_url",
      "reactor_access_token_id",
    ],
  },
});

...

```

This function takes an input parameter of `google_access_token_id`, which is the `Schema.slack.types.oauth2` type. Using this type indicates to the app that there must be OAuth2 provider defined inside this application and set up for this parameter. The value of the `oauth2_provider_key` property on this parameter must match the `provider_key` for an OAuth2 provider. For this app, that is "google."

When the function receives the desired `oauth2` input, it can use the API client's provided `apps.auth.external.get` method to retrieve any stored third party token or credential secret, like this: 

```javascript
// create_google_sheet.ts

...

export default SlackFunction(
  CreateGoogleSheetFunctionDefinition,
  async ({ inputs, client }) => {
    // Collect Google access token
    const auth = await client.apiCall("apps.auth.external.get", {
      external_token_id: inputs.google_access_token_id,
    });

    if (!auth.ok) {
      return { error: `Failed to collect Google auth token: ${auth.error}` };
    }

    // Create spreadsheet
    const url = "https://sheets.googleapis.com/v4/spreadsheets";
    const sheets = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${auth.external_token}`,
      },
      body: JSON.stringify({
        properties: { title: `Slack Survey - ${inputs.title}` },
        sheets: [{
          properties: { title: "Responses" },
          data: [{
            rowData: [{
              values: [
                { userEnteredValue: { stringValue: "Submitted" } },
                { userEnteredValue: { stringValue: "Impression" } },
                { userEnteredValue: { stringValue: "Comments" } },
              ],
            }],
          }],
        }],
      }),
    });

    const body = await sheets.json();
    if (body.error) {
      return {
        error: `Failed to create the survey spreadsheet: ${body.error.message}`,
      };
    }

    return {
      outputs: {
        google_spreadsheet_id: body.spreadsheetId,
        google_spreadsheet_url: body.spreadsheetUrl,
        reactor_access_token_id: inputs.google_access_token_id,
      },
    };
  },
);
```

Note how this function returns the `google_access_token_id` as an output, called `reactor_access_token_id`. This will be important in the next step, where we'll see how the token is used as an input to a workflow.

## Use the auth token in a workflow

The `CreateGoogleSheetFunctionDefinition` we explored above is called from `CreateSurveyWorkflow`. Looking back at that workflow, we see that its second step - calling the `CreateTriggerFunctionDefinition` - takes the `reactor_access_token_id` as a parameter, which we now know was an output of `CreateGoogleSheetFunctionDefinition`(also known as the OAuth2 token ID). If we dive into how `CreateTriggerFunctionDefinition` uses that, we'll see how to use the credential as a workflow input. 

```javascript
// /functions/create_survey_trigger.ts

...

export default SlackFunction(
  CreateTriggerFunctionDefinition,
  async ({ inputs, client }) => {
    const { google_spreadsheet_id, reactor_access_token_id } = inputs;

    const trigger = await client.workflows.triggers.create<
      typeof AnswerSurveyWorkflow.definition
    >({
      type: "shortcut",
      name: "Survey your thoughts",
      description: "Share your thoughts about this post",
      workflow: `#/workflows/${AnswerSurveyWorkflow.definition.callback_id}`,
      inputs: {
        interactivity: { value: "{{data.interactivity}}" },
        google_spreadsheet_id: { value: google_spreadsheet_id },
        reactor_access_token_id: { value: reactor_access_token_id }, //Here it is used in calling a workflow
      },
    });

    if (!trigger.ok || !trigger.trigger.shortcut_url) {
      return {
        error: `Failed to create link trigger for the survey: ${trigger.error}`,
      };
    }

    return {
      outputs: {
        trigger_id: trigger.trigger.id,
        trigger_url: trigger.trigger.shortcut_url,
      },
    };
  },
);

```

After the definition of this function, we see how the `reactor_access_token_id` is used, and that is as an input to a workflow! Excellent. Turn your attention to the `/workflows/answer_survey.ts` file to see how that token ID is used in a workflow definition:

```javascript
// answer_survey.ts

import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { SaveResponseFunctionDefinition } from "../functions/save_response.ts";

/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * This workflow uses interactivity.
 */
const AnswerSurveyWorkflow = DefineWorkflow({
  callback_id: "answer_survey",
  title: "Respond to a survey",
  description: "Add comments and feedback to a survey",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
      google_spreadsheet_id: {
        type: Schema.types.string,
        description: "Spreadsheet ID for storing survey results",
      },
      reactor_access_token_id: {
        type: Schema.types.string,
        description: "External authentication access token for the reactor",
      },
    },
    required: [
      "interactivity",
      "google_spreadsheet_id",
      "reactor_access_token_id",
    ],
  },
});

...

```

The `reactor_access_token_id` is then used in the implementation of the workflow by passing it along, just like any other input parameter, to a step in the workflow:

```javascript
// answer_survey.ts

...

// Step 2: Append responses to the spreadsheet
AnswerSurveyWorkflow.addStep(SaveResponseFunctionDefinition, {
  reactor_access_token_id: AnswerSurveyWorkflow.inputs.reactor_access_token_id,
  google_spreadsheet_id: AnswerSurveyWorkflow.inputs.google_spreadsheet_id,
  impression: response.outputs.fields.impression,
  comments: response.outputs.fields.comments,
});

export default AnswerSurveyWorkflow;

```

Now you have seen how a Google token ID can be obtained from the app, used in a custom function, and used in a workflow.

To complete the connection process, you need to let your app know what authenticated account you'll be using for specific workflows.

For this app, only `CreateSurveyWorkflow` requires a configured external Google account, so we can set that up with our freshly-authed account. To do so, run the following:

```sh
slack external-auth select-auth
```

Select the workspace and app environment for your app, then select the `#/workflows/create_survey` workflow to give it access to your Google account. Select the same provider and the external account that you authenticated with above.

At last &mdash; you're all set to survey. Let's run our app!

## Run your app

If you embarked on this tutorial with a blank app, complete your app files using the [sample app](https://github.com/slack-samples/deno-simple-survey) as your guide. If you used a pre-built app, we're ready to run it!

To see this app in action, run the following command in your terminal: 
```bash
slack run
```

After you've chosen your app and assigned it to your workspace, you can switch over to the app in Slack and try it out. This app is triggered by reactions in Slack, so it should be ready to use once deployed (as opposed to apps that need [link triggers](/deno-slack-sdk/guides/creating-link-triggers) to run). 

## Next steps

Congratulations, you've added OAuth2 to a workflow app! Where do you go from here?

Consider taking a deep dive into our [External authorization](/deno-slack-sdk/guides/integrating-with-services-requiring-external-authentication) documentation.

Perhaps try another tutorial, like creating a [social app to log runs with virtual running buddies](/deno-slack-sdk/tutorials/virtual-running-buddies-app).