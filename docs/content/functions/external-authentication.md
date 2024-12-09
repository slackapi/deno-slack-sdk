# External authentication

When you need to integrate with external services that require authentication, you can use the Slack CLI to encrypt and to store OAuth2 credentials. This enables your app to access information from another service without exchanging passwords, but rather, tokens.

## What is OAuth2, and why should you use it? {#what-is-oauth}

OAuth2 stands for Open Authorization 2.0. It is a standard protocol designed to allow apps to access resources hosted by other apps on behalf of a user. Unlike basic authorization, where you share a password with a user, OAuth2 uses access tokens to verify a user's identity. For providers that require it, Slack offers PKCE and HTTP Basic Auth support, as you will see in the [OAuth2 provider `options` properties](#options-properties) section below.

The following steps guide you through integrating your app with an external service using [Google](https://developers.google.com/identity/protocols/oauth2) as an example.

### 1. Obtain your OAuth2 credentials {#credentials}

The first step is to obtain your OAuth2 credentials. To do that, create a new OAuth2 credential with the external service you'll be integrating with.

For our example, navigate to the [Google API Console](https://console.cloud.google.com/projectselector2/apis/dashboard?supportedpurview=project) to obtain your OAuth2 **client ID** and **client secret**.

If you're asked to provide a **redirect URL**, use the following:

```
https://oauth2.slack.com/external/auth/callback
```

When you're done creating your credential, copy the credential's **client ID** and **client secret**, then head to your [manifest](/automation/manifest) file (`manifest.ts`).

### 2. Define your OAuth2 provider {#define}

Next, tell your app about your OAuth2 provider by defining an **OAuth2 provider** within your app. Inside your app's manifest, import `DefineOAuth2Provider`. Then, create a new provider instance.

An example provider instance for Google is below. You can define it right in your manifest, or put it in its own file and import it into the manifest.

```js
// manifest.ts
import { DefineFunction, DefineOAuth2Provider, DefineWorkflow, Manifest, Schema,} from "deno-slack-sdk/mod.ts";
// ...

// Define a new OAuth2 provider
// Note: replace <your_client_id> with your actual client ID
// if you're following along and creating an OAuth2 provider for
// Google.
const GoogleProvider = DefineOAuth2Provider({
  provider_key: "google",
  provider_type: Schema.providers.oauth2.CUSTOM,
  options: {
    provider_name: "Google",
    authorization_url: "https://accounts.google.com/o/oauth2/auth",
    token_url: "https://oauth2.googleapis.com/token",
    client_id: "<your_client_id>.apps.googleusercontent.com",
    scope: [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    authorization_url_extras: {
      prompt: "consent",
      access_type: "offline",
    },
    identity_config: {
      url: "https://www.googleapis.com/oauth2/v1/userinfo",
      account_identifier: "$.email",
      http_method_type: "GET",
    },
    use_pkce: false,
  },
});
// ...
```

OAuth2 provider properties are described in the tables below.

#### OAuth2 provider properties {#properties}

| Field           | Type                      | Description | Required? |
|-----------------|---------------------------|-------------|-----------|
| `provider_key`  | `string`                  | The unique string identifier for a provider. An app cannot have two providers with the same unique identifier. Changing unique identifiers will be treated as the deletion of a provider. Providers with active tokens cannot be deleted. | Required |
| `provider_type` | `Schema.providers.oauth2` | The only supported provider type value at this time is `Schema.providers.oauth2.CUSTOM`. | Required |
| `options`       | `object`                  | Object with further provider-specific details. See the [table below](#options-properties). | Required |

##### OAuth2 provider `options` properties {#options-properties}

| Field                      | Type     | Description | Required? |
|----------------------------|----------|-------------|-----------|
| `provider_name`            | `string` | The name of your provider. | Required |
| `client_id`                | `string` | The client ID from your provider. | Required |
| `authorization_url`        | `string` | An OAuth2 requirement to complete the OAuth2 flow and to direct the user to the provider consent screen. | Required |
| `scope`                    | `array`  | An OAuth2 requirement to complete the OAuth2 flow and to grant only the scopes provided to the access token. | Required |
| `identity_config`          | `object` | Used to obtain user identity by finding the account associated with the access token. See the [table below](#identity-properties) for details. | Required |
| `token_url`                | `string` | An OAuth2 requirement to complete the OAuth2 flow and to exchange the code with an access token. | Required |
| `token_url_config`         | `object` | An object that can further define a `use_basic_auth_scheme` object, which contains a solitary boolean property, `use_basic_auth_scheme`, that defines whether HTTP Basic Authentication should be used with the `token_url` field above. Defaults to `false`. | Optional |
| `authorization_url_extras` | `object` | HTTP request query parameters to attach to the `authorization_url`. Set object key names as query parameter names and object key values as query parameter values. | Optional |
| `use_pkce`                 | `boolean`| Specifies if the provider uses PKCE. Defaults to `false`. | Optional |

#### OAuth2 provider `identity_config` properties {#identity-properties}

| Field                | Type     | Description | Required? |
|----------------------|----------|-------------|-----------|
| `url`                | `string` | The endpoint the provider exposes to fetch the user identity. It is used to identify the authenticated user. | Required |
| `account_identifier` | `string` | The field name in the response from the above `url` field representing the user identity. | Required |
| `headers`            | `object` | Extra HTTP headers to attach to the request to the `url` field. Set object key names as header names and object key values as header values. Note: the `Authorization` header is automatically set by Slack. | Optional |
| `http_method_type`   | `string` | The HTTP method to employ when sending a request to the identity `url`. Defaults to `GET`. Acceptable values include `GET` or `POST`. | Optional |
| `body`               | `object` | HTTP body parameters that the identity `url` expects. Only used if `http_method_type` is set to `POST`. Set object key names as body parameter name and object key values as body parameter values. | Optional |

:::info

The `identity_config` field is used to extract an `external_user_id`; this value is then used to allow a single user to issue multiple tokens for multiple provider accounts. If a Slack user with multiple accounts extracts the same `external_user_id` from the provider for each of their accounts, the existing token will be overwritten, and they will not be able to use multiple accounts.

:::

### 3. Add your OAuth2 provider to your manifest {#adding-provider}

In your manifest file, insert the newly-defined provider into the `externalAuthProviders` property (if that property doesn't exist yet, go ahead and create it):

```js
export default Manifest({
  //...
  // Tell your app about your OAuth2 providers here:
  externalAuthProviders: [GoogleProvider],
  //...
});
```

Now, with your OAuth2 provider defined and your manifest configured to use it, you can encrypt and store your client secret so that your app's users can utilize the OAuth2 authorization flow.

### 4. Encrypt and store your client secret {#client-secret}

Your app needs to be deployed to Slack once in order to create a place to store your encrypted client secret. Run the `slack deploy` command in your terminal window:

```zsh
slack deploy
```

This command will bring up a list of [currently authorized workspaces](/automation/quickstart#authorize-cli). Select the workspace where your app will exist, and wait for the CLI to finish deploying.

When finished, stay in your terminal window to add your client secret for the newly-defined provider, ensuring that you wrap the secret string in double quotes as follows:

```zsh
slack external-auth add-secret --provider google --secret "GOCSPX-abc123..."
```

Running the `add-secret` command will bring up a list of workspaces available to you. Find and select the workspace you recently deployed your app to; you'll know it's the workspace you recently installed the app in by locating the item in the list with your app's name and ID (e.g., `myapp A01BC...`) rather than "App is not installed to this workspace."

:::info

If you get a `provider_not_found` error, go back to your manifest file and check to make sure that you included your OAuth2 provider in the `externalAuthProviders` properties of your manifest definition.

:::

If everything was successful, the CLI will let you know:

```
✨  successfully added external auth client secret for google
```

Great! With your app configured to interact with your defined OAuth2 provider, we can now initialize the OAuth2 sign-in flow, connecting your external provider to your Slack app.

### 5. Initialize the OAuth2 flow {#initialize-oauth-flow}

Once your provider's client secret has been added, it's time to create a token for your app to interact with your OAuth2 provider with [`external-auth add`](https://tools.slack.dev/slack-cli/reference/slack_external-auth_add).

Run the following command:

```
slack external-auth add
```

This will display a list of workspaces your app is deployed to. Select the one you're currently working in. Upon selection, you'll be provided a list of all providers that have been defined for this app, along with whether there's a secret and token.

```
$ slack external-auth add

? Select a provider  [Use arrows to move, type to filter]
> Provider Key: google
  Provider Name: Google
  Client ID: <your_id>.apps.googleusercontent.com
  Client Secret Exists? Yes
  Token Exists? No
```

If you have just created a provider, you'll notice that it reports no tokens existing. Let's
go ahead and create a token by initializing the OAuth2 sign-in flow.

Select the provider you're working on, which will open a browser window for you to complete the OAuth2 sign-in flow according to your provider's requirements. You'll know you're successful when your browser sends you to a `oauth2.slack.com` page stating that your account was successfully connected.

Verify that a valid token has been created by re-running the [`external-auth add`](https://tools.slack.dev/slack-cli/reference/slack_external-auth_add) command:

```
slack external-auth add

? Select a provider  [Use arrows to move, type to filter]
> Provider Key: google
  Provider Name: Google
  Client ID: <your_id>.apps.googleusercontent.com
  Client Secret Exists? Yes
  Token Exists? Yes
```

If you see `Token Exists? Yes`, that means a valid auth token has been created, and you're ready to use OAuth2 in your app! Exit out of this command flow by entering `Ctrl+C` in your terminal &mdash; otherwise you'll be guided through the OAuth2 sign-in flow again.

### 6. Add OAuth2 to your function {#function}

Your [custom functions](/automation/functions/custom) can leverage your provider's token
by configuring it to receive a `Schema.slack.types.oauth2` type as an input parameter to your function's definition.

Here's how that might look if we were to use the sample function from the [starter template](https://github.com/slack-samples/deno-starter-template):

```js
// functions/sample_function.ts
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const SampleFunctionDefinition = DefineFunction({
  callback_id: "sample_function",
  title: "Sample function",
  description: "A sample function",
  source_file: "functions/sample_function.ts",
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "Message to be posted",
      },
      // Define token here
      googleAccessTokenId: {
        type: Schema.slack.types.oauth2,
        oauth2_provider_key: "google",
      },
      user: {
        type: Schema.slack.types.user_id,
        description: "The user invoking the workflow",
      },
    },
    required: ["user"],
  },
  output_parameters: {
    properties: {
      updatedMsg: {
        type: Schema.types.string,
        description: "Updated message to be posted",
      },
    },
    required: ["updatedMsg"],
  },
});

export default SlackFunction(
  SampleFunctionDefinition, // Define custom function
  async ({ inputs, client }) => {
    // Get the token:
    const tokenResponse = await client.apps.auth.external.get({
      external_token_id: inputs.googleAccessTokenId,
    });
    if (tokenResponse.error) {
      const error =
        `Failed to retrieve the external auth token due to ${tokenResponse.error}`;
      return { error };
    }

    // If the token was retrieved successfully, use it:
    const externalToken = tokenResponse.external_token;
    // Make external API call with externalToken
    const response = await fetch("https://somewhere.tld/myendpoint", {
      headers: new Headers({
        "Authorization": `Bearer ${externalToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      }),
    });
    if (response.status != 200) {
      const body = await response.text();
      const error =
        `Failed to call my endpoint! (status: ${response.status}, body: ${body})`;
      return { error };
    }

    // Do something here
    const myApiResponse = await response.json();
    const updatedMsg =
      `:newspaper: Message for <@${inputs.user}>!\n\n>${myApiResponse}`;

    return { outputs: { updatedMsg } };
  },
);
```

### 7. Include OAuth2 input in a workflow step {#workflow}

Next, while configuring your workflow, choose the persona whose auth you want to use when the workflow runs. To do this, pass an object with a `credential_source` to the OAuth2 input in the step configuration.

:::info

Slack will automatically inject the correct token ID into the OAuth2 input property based on the selected `credential_source`; you **do not** need to provide a token ID here.

:::

#### Using end user tokens {#end-user-tokens}
If you would like the workflow to use the account of the end user running the workflow, use `credential_source: "END_USER"`. 

The end user will be asked to authenticate with the external service in order to connect and grant Slack access to their account before running the workflow. This workflow can only be started by a [Link Trigger](/automation/triggers/link), as this is the only type of trigger guaranteed to originate directly from an end-user interaction.

```js
// Somewhere in your workflow's implementation:
const sampleFunctionStep = SampleWorkflow.addStep(SampleFunctionDefinition, {
  user: SampleWorkflow.inputs.user,
  googleAccessTokenId: {
    credential_source: "END_USER"
  },
});
```

#### Using developer tokens {#developer-tokens}
If you would like the workflow to use the account of one of the app collaborators, use `credential_source: "DEVELOPER"`.

```js
// Somewhere in your workflow's implementation:
const sampleFunctionStep = SampleWorkflow.addStep(SampleFunctionDefinition, {
  user: SampleWorkflow.inputs.user,
  googleAccessTokenId: {
    credential_source: "DEVELOPER"
  },
});
```

After deploying the manifest changes above, you have to select a specific account for each of your workflows in this app. Assuming that you had run `slack external-auth add` before to add an external account, use the command `slack external-auth select-auth` as shown below:

```
slack external-auth select-auth
? Select a workspace <workspace_name> <workspace_id>
? Choose an app environment Deployed <app_id>
? Select a workflow Workflow: #/workflows/<workspace_name>
  Providers:
        Key: google, Name: Google, Selected Account: None

? Select a provider Key: google, Name: Google, Selected Account: None
? Select an external account Account: <your_id>@gmail.com, Last Updated: 2023-05-30

✨  Workflow #/workflows/<workspace_name> will use developer account <your_id>@gmail.com when making calls to google APIs
```

Multiple collaborators can exist for the same app and each collaborator can create a token using the `slack external-auth add` command. To select the appropriate collaborator account to run a specific workflow, the same `slack external-auth select-auth` command can be used. However, a collaborator needs to set up their own account using `slack external-auth select-auth` command by invoking this command. i.e. a collaborator cannot use `slack external-auth select-auth` to select auth for a workflow on behalf of another collaborator for the same app. 

A collaborator can remove their account by running `slack external-auth remove` command. This would automatically delete the existing selected auths for each of the workflows that were using it. Therefore, in such a case, `slack external-auth select-auth` command would be needed to be invoked again before executing the relevant workflows successfully later.

### 8. Force refreshing a token programmatically {#force-refresh}

If you ever want to force a refresh of your external token as a part of error handling, retry mechanism, or something similar, you can use the sample code below:

```js
// Somewhere in your functions error handling and retry logic:
const result = await client.apps.auth.external.get({
  external_token_id: inputs.googleAccessTokenId,
  force_refresh: true // default force_refresh is false
});
```
### 9. Deleting a token programmatically {#delete-programmatically}

If you ever want to delete your external token programmatically, you can use the sample code below. Bear in mind that once a token is deleted, all workflows that were previously using the token will no longer work.

<div class="apiDocsCalloutCard">
  <i class="ts_icon c-icon c-icon--info-circle"></i>
  <div>

This will *not* revoke the token from the provider's system. It will only delete the reference to the token from Slack and prevent it from being used within the external authentication system.

  </div>
</div>

```js
  // Somewhere in your function:
  await client.apps.auth.external.delete({
    external_token_id: inputs.googleAccessTokenId,
  });
```

## Delete external auth tokens {#delete-tokens}

If you'd like to delete your tokens and remove OAuth2 authentication from your Slack app, the following commands will allow you to do so:

| Command                                                              | Description                                                        |
|----------------------------------------------------------------------|--------------------------------------------------------------------|
| `$ slack external-auth remove`                                       | Choose a provider to delete tokens for from the list displayed.     |
| `$ slack external-auth remove --all`                                 | Delete all tokens for the app by specifying the `--all` flag.         |
| `$ slack external-auth remove --provider provider_name --<app_name>` | Delete all tokens for a provider by specifying the `--provider` flag. |

:::info

This will *not* revoke the token from the provider's system. It will only delete the reference to the token from Slack and prevent it from being used within the external authentication system.

:::

## Troubleshooting {#troubleshooting}

You can view external authentication logs via `slack activity`. These logs contain information about errors encountered by users during the OAuth2 exchange and workflow execution. Below are some common errors:

| Error    | Description |
|----------|-------------|
| `access_token_exchange_failed` | An error was returned from the configured `token_url`. |
| `external_user_identity_not_found` | The configured `account_identifier` was not found in user identity response. |
| `internal_error` | An internal system error happened. Please reach out to Slack if this occurs consistently. |
| `invalid_identity_config_response` | `url` in the configured `identity_config` returned an invalid response. |
| `invalid_token_response` | `token_url` returned an invalid response. |
| `missing_client_secret` | Optional client secret was found for this provider. |
| `no_refresh_token` | Token to refresh the expired access token does not exist. |
| `oauth2_callback_error` | The OAuth2 provider returned an error.    |
| `oauth2_exchange_error` | There was an error while obtaining the OAuth2 token from the configured provider. |
| `scope_mismatch_error` | Slack was not able to find an OAuth2 token that matched the `scope` configured on your provider. |
| `token_not_found` | Slack was not able to find an OAuth2 token for this user and provider. |

## Next Steps {#next-steps}

Check out the following sample projects to see how real-world workflow apps use OAuth:
* [Timesheet approval app](https://github.com/slack-samples/deno-timesheet-approval) uses Google Sheets to store information collected in a workflow form from Slack users
* [Simple survey app](https://github.com/slack-samples/deno-simple-survey) uses Google Sheets to store survey responses
* [GitHub functions repo](https://github.com/slack-samples/deno-github-functions) brings oft-used GitHub functionality - such as creating new issues - to Slack using functions and workflows
