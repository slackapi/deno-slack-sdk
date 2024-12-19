# Definition bot

<PaidPlanBanner />

Have you ever found yourself in a company or position where it feels like everyone around you is speaking in a language you don’t understand? Where the use of so many acronyms has you drowning in an alphabet soup of obscured meaning? In this tutorial, we’ll walk you through using a [trigger](/deno-slack-sdk/guides/creating-link-triggers), [workflow](/deno-slack-sdk/guides/creating-workflows), [custom function](/deno-slack-sdk/guides/creating-custom-functions), [datastore](/deno-slack-sdk/guides/using-datastores), and [modal view interactivity](/deno-slack-sdk/guides/creating-an-interactive-modal) to create a workflow app that serves as a crowdsourced glossary of acronyms and team vernacular to help you talk the talk while you walk the walk. 

Before we begin, ensure you have the following prerequisites completed:
* Install the [Slack CLI](/deno-slack-sdk/guides/getting-started).
* Run `slack auth list` and ensure your workspace is listed.
* If your workspace is not listed, address any issues by following along with the [Getting started](/deno-slack-sdk/guides/getting-started), then come on back.


## Get started

Let’s get things started by creating a blank app via the CLI. Run the following command in your terminal.

```bash
slack create define-app --template https://github.com/slack-samples/deno-blank-template
```

Next, navigate to the project directory and open it in the code editor of your choice; we like Visual Studio Code.


## Plan your app

Let’s think about the flow of logic in our app. 

We'll need a [trigger](/deno-slack-sdk/guides/using-triggers) to set things in motion, and a [modal](/deno-slack-sdk/guides/creating-an-interactive-modal) to open and ask for a term that the user would like defined. From there, we'll take that term and search for it in a [datastore](/deno-slack-sdk/guides/using-datastores). If it is found, we'll deliver that definition to the user in an updated modal. If it is not found, we'll ask the user if they would like to submit a definition for it.

Because all of these actions will be done with view updates in the same modal, we’ll use one [function](/deno-slack-sdk/guides/creating-custom-functions) with a few view handlers. We’ll also need one [workflow](/deno-slack-sdk/guides/creating-workflows) and one [trigger](/deno-slack-sdk/guides/creating-link-triggers). Let’s start this out by creating the [function](/deno-slack-sdk/guides/creating-custom-functions), the main meat of the app. 


## Write the custom function

Our function will handle the bulk of the logic in this app. Because all of the interaction will be within one modal pop-up, we’ll keep all the logic in one function (as opposed to breaking it out into separate functions strung together by the workflow). Create a folder called `functions` and a file within it, `term_lookup_function.ts`. First we define the function, laying out the expected inputs and outputs.

```javascript
// term_lookup_function.ts

import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { // don’t worry about these for now, we’ll talk about them in a later step
  showConfirmationView,
  showDefinitionSubmissionView,
  showDefinitionView,
} from "./interactivity_handler.ts";

export const TermLookupFunction = DefineFunction({
  callback_id: "term_lookup_function",
  title: "Define a term",
  source_file: "functions/term_lookup_function.ts",
  input_parameters: {
    properties: { interactivity: { type: Schema.slack.types.interactivity } },
    required: ["interactivity"],
  },
  output_parameters: { properties: {}, required: [] },
});
```

The `interactivity` input parameter is essential for allowing the modal to first appear, as well as the subsequent user interactions to happen. `interactivity` gives the app permission to do these actions because the user initiated it. Without this parameter, modal interaction cannot take place. No output parameters are needed because all actions will take place within this function; we will not be passing data to another function. Now, the function implementation. Place this in the same file, after the function definition: 

```javascript
export default SlackFunction(
  TermLookupFunction,
  async ({ inputs, client }) => {
    const response = await client.views.open({
      interactivity_pointer: inputs.interactivity.interactivity_pointer,
      view: {
        "type": "modal",
        "callback_id": "first-page",
        "notify_on_close": false,
        "title": { "type": "plain_text", "text": "Search for a definition" },
        "submit": { "type": "plain_text", "text": "Search" },
        "close": { "type": "plain_text", "text": "Close" },
        "blocks": [
          {
            "type": "input",
            "block_id": "term",
            "element": { "type": "plain_text_input", "action_id": "action" },
            "label": { "type": "plain_text", "text": "Term" },
          },
        ],
      },
    });
    if (response.error) {
      const error =
        `Failed to open a modal in the term lookup workflow. Contact the app maintainers with the following information - (error: ${response.error})`;
      return { error };
    }
    return {
      completed: false,
    };
  },
)
```

This implementation will create the first modal with a title, input block, submit button, and close button. Once the user enters a term in the input field and clicks “submit”, we have to handle that action in a view submission handler, which will use the `callback_id` of the modal to react. We’ll take a look at that in the next step.



## Create show definition submission view

For ease of readability, we’ll put all of our interactivity handlers in a file separate from the main function file. Create a new file in the `functions` folder and call it `interactivity_handler.ts`. But before we get ahead of ourselves, we’ll need to look up the term the user submitted in a [datastore](/deno-slack-sdk/guides/using-datastores). Let’s define that now. Back up to the root directory of your project and create a new folder called `datastores`. Add a file to it called `terms.ts`. This datastore will hold the crowdsourced terms in our app. When a user submits a term, it will be saved in the datastore, and when a user looks for a term, it will be retrieved from the datastore. Define it here:

```javascript 
// terms.ts
import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export const TermsDatastore = DefineDatastore({
  name: "terms",
  primary_key: "id",
  attributes: {
    id: { type: Schema.types.string },
    term: { type: Schema.types.string },
    definition: { type: Schema.types.string },
  },
});
```

Now we’re ready to go back to `interactivity_handler.ts` and define a view submission handler to handle what happens after a user enters a term to be defined and clicks "submit". Let’s call that `showDefinitionView`. The first step we'll need to take in this handler is look up the submitted term in our newly-defined datastore like this:

```javascript
// interactivity_handler.ts

import { ViewSubmissionHandler } from "deno-slack-sdk/functions/interactivity/types.ts";
import { TermLookupFunction } from "./term_lookup_function.ts";
import { TermsDatastore } from "../datastores/terms.ts";

// This handler is invoked after a user submits a term to be defined
export const showDefinitionView: ViewSubmissionHandler<
  typeof TermLookupFunction.definition
> = async ({ view, client }) => {
  const termEntered = view.state.values.term.action.value;

  if (termEntered.length < 1) {
    return {
      response_action: "errors",
      errors: { term_entered: "Must be 1 character or longer" },
    };
  }

  const queryResult = await client.apps.datastore.query({
    datastore: TermsDatastore.name,
    expression: "#term = :term",
    expression_attributes: { "#term": "term" },
    expression_values: { ":term": termEntered },
  });

```
For some helpful guidance on how this query was constructed, check out the [Datastores](/deno-slack-sdk/guides/using-datastores) page. Once the query is run, we have two possible outcomes: the term is found and we return it to the user, or the term is not found and we ask the user if they’d like to submit a definition for it. Here’s the logic for the former:

```javascript
// interactivity_handler.ts

  // If the term is found, display the associated definition
  if (queryResult.items.length >= 1) {
    return {
      response_action: "update",
      view: {
        "type": "modal",
        "callback_id": "second-page",
        "notify_on_close": false,
        "title": { "type": "plain_text", "text": termEntered },
        "close": { "type": "plain_text", "text": "Close" },
        "private_metadata": JSON.stringify({ termEntered }),
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": queryResult.items[0].definition,
            },
          },
        ],
      },
    };
  }
```
This modal will present the user with the definition and a close button only. We don’t provide a submit button here because the modal is only informative; there is no new data to submit. Alternatively, if the term is not found, we’ll present the user with the option to submit a definition for it:

```javascript
// interactivity_handler.ts

  // If the term is not found in the datastore, ask if they'd like to add a definition
  if (queryResult.items.length < 1) {
    return {
      response_action: "update",
      view: {
        "type": "modal",
        "callback_id": "add-definition",
        "notify_on_close": false,
        "title": { "type": "plain_text", "text": termEntered },
        "close": { "type": "plain_text", "text": "Close" },
        "submit": { "type": "plain_text", "text": "Click here to add one" },
        "private_metadata": JSON.stringify({ termEntered }),
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "plain_text",
              "text": `There is currently no definition for ${termEntered}`,
            },
          },
        ],
      },
    };
  }
};
```
Here, we’ve changed the text of the submit button to indicate that clicking it will allow the user to submit a definition of their own. So what happens when they click it? We’ll create another view submission handler for that. Something to make note of: notice how we carry forward the term itself in `private_metadata`. Without this, we would not have access to what term we are defining, since that data was submitted in a prior modal. Also make note of the `callback_id` of the modal; we’ll use that later to call the next handler. 


## Create show definition submission view

Once a user elects to submit a new definition for a term that does not have one, we need a new view to handle the input of that data. This is done through another view submission handler. Let’s call this one `showDefinitionSubmissionView` and add it to the same `interactivity_handler.ts` file that we put our first handler in.

```javascript
// interactivity_handler.ts

// This handler is invoked after a user elects to add a new definition
export const showDefinitionSubmissionView: ViewSubmissionHandler<
  typeof TermLookupFunction.definition
> = ({ view }) => {
  const { termEntered } = JSON.parse(view.private_metadata!);

  if (termEntered.length < 1) {
    return {
      response_action: "errors",
      errors: { term_entered: "Must be 1 character or longer" },
    };
  }

  return {
    response_action: "update",
    view: {
      "type": "modal",
      "callback_id": "definition-submission",
      "notify_on_close": false,
      "title": { "type": "plain_text", "text": termEntered },
      "submit": { "type": "plain_text", "text": "Submit" },
      "close": { "type": "plain_text", "text": "Close" },
      "private_metadata": JSON.stringify({ termEntered }),
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `Add a definition for ${termEntered}`,
          },
        },
        {
          "type": "input",
          "block_id": "definition",
          "element": {
            "type": "plain_text_input",
            "action_id": "action",
            "multiline": true,
          },
          "label": { "type": "plain_text", "text": "Definition" },
        },
        {
          "type": "context",
          "elements": [
            {
              "type": "mrkdwn",
              "text":
                "You can use Slack markdown for this field, like `*bold*` and `_italics_`.",
            },
          ],
        },
      ],
    },
  };
};
```

Once the user submits the button to add a new definition, we present this modal, which provides an input block for their definition, as well as submit and close buttons. Remember the term we stored away in `private_metadata`? We can now retrieve it to use as the title for this modal. We’ll again store it in `private_metadata` so that we can use it in the subsequent modal too. Again, take note of the `callback_id`, we’ll use this later. 



## Create a confirmation view

The final view submission handler to write occurs once the user submits a new definition for the term. First let’s save the submitted definition to the datastore.

```javascript
// interactivity_handler.ts

// This handler is invoked after a new definition is submitted
export const showConfirmationView: ViewSubmissionHandler<
  typeof TermLookupFunction.definition
> = async ({ view, client }) => {
  const { termEntered } = JSON.parse(view.private_metadata!);
  const definition = view.state.values.definition.action.value;

  let saveSuccess: boolean;

  const uuid = crypto.randomUUID();

  const putResponse = await client.apps.datastore.put({
    datastore: TermsDatastore.name,
    item: {
      id: uuid,
      term: termEntered,
      definition: definition,
    },
  });

  if (!putResponse.ok) {
    console.log("Error calling apps.datastore.put:");
    saveSuccess = false;
    return {
      error: putResponse.error,
    };
  } else {
    saveSuccess = true;
  }
```

This means we two different possible outcomes: the save is successful and the user is on their way, or the save is not successful. Here is the former:

```javascript
  if (saveSuccess == true) {
    return {
      response_action: "update",
      view: {
        "type": "modal",
        "callback_id": "completion_successful",
        "notify_on_close": false,
        "title": { "type": "plain_text", "text": `${termEntered} added` },
        "close": { "type": "plain_text", "text": "Close" },
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `We've added ${termEntered} to your company definitions.`,
            },
          },
          {
            "type": "divider",
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `*${termEntered}*\n${definition}`,
            },
          },
        ],
      },
    };
  }
```

And the latter:

```javascript
else {
    return {
      response_action: "update",
      view: {
        "type": "modal",
        "callback_id": "completion_not_successful",
        "notify_on_close": false,
        "title": { "type": "plain_text", "text": "Add definition" },
        "close": { "type": "plain_text", "text": "Close" },
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Something went wrong and the save was not successful.",
            },
          },
        ],
      },
    };
  }
};
```

This concludes the logic for the `interactivity_handler.ts` file. Next, let’s see how these handlers are wired up.



## Write a view closed handler

Back in `functions/term_lookup_function.ts`, we need to add the handler functions we just wrote in `interactivity_handler.ts`. Here’s how that’s done:

```javascript
// term_lookup_function.ts

  .addViewSubmissionHandler(
    ["first-page"],
    showDefinitionView,
  )
  .addViewSubmissionHandler(
    ["add-definition"],
    showDefinitionSubmissionView,
  )
  .addViewSubmissionHandler(
    ["definition-submission"],
    showConfirmationView,
  )
```
The first parameter of each function is the `callback_id` of the modal they respond to. Because these are view submission handlers, when the user clicks the submit button on the modal with the `callback_id` of “first-page”, the `showDefinitionView` submission handler will be called. When the modal with the `callback_id` of “add-definition” is submitted, `showDefinitionSubmissionView` is the handler that is called, and when the modal with the `callback_id` of “definition-submission” is submitted, `showConfirmationView` is the handler that is called. Finally, we’ll add a handler for when a view is closed, a view closed handler. This one is short; add it into the same file right after the functions above.

```javascript
// term_lookup_function.ts

  .addViewClosedHandler(
    ["first-page", "add-definition", "definition-submission"],
    ({ view }) => {
      console.log(`view_closed handler called: ${JSON.stringify(view)}`);
      return { completed: true };
    },
  );
```

This handler takes care of what happens when the view is closed from any of the three handlers we noted in the parameters.



## Implement a workflow

We are now ready to create a workflow as an entry point to our function. Create a new folder at the root of the project called `workflows` and add a file named `definition_workflow.ts`.

```javascript
// definition_workflow.ts

import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { TermLookupFunction } from "../functions/term_lookup_function.ts";

export const DefinitionWorkflow = DefineWorkflow({
  callback_id: "definition_workflow",
  title: "Definition workflow",
  description:
    "A workflow to show you definitions and add them if they don't exist.",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});

DefinitionWorkflow.addStep(TermLookupFunction, {
  interactivity: DefinitionWorkflow.inputs.interactivity,
});

export default DefinitionWorkflow;
```

This is a workflow with only one step. We need to collect `interactivity` as an input parameter to pass along to the function and require no outputs. Next, we’ll update our manifest to declare all that we've created thus far.



## Update the manifest

When we created the app via the CLI initially, a bare bones `manifest.ts` file was created that looks like this: 

```javascript
// manifest.ts

import { Manifest } from "deno-slack-sdk/mod.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * tools.slack.dev/deno-slack-sdk/guides/using-the-app-manifest
 */
export default Manifest({
  name: "define-app",
  description: "A blank template for building Slack apps with Deno",
  icon: "assets/default_new_app_icon.png",
  functions: [],
  workflows: [],
  outgoingDomains: [],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});

```

We’ll add to it now by reporting our function, workflow, datastore, and necessary scopes that the datastore requires. While we’re here, let’s update the description too.

```javascript
import { Manifest } from "deno-slack-sdk/mod.ts";
import { DefinitionWorkflow } from "./workflows/definition_workflow.ts";
import { TermsDatastore } from "./datastores/terms.ts";
import { TermLookupFunction } from "./functions/term_lookup_function.ts";

export default Manifest({
  name: "define-app",
  description:
    "This project allows users to look up and add new definitions of company acronyms and terms.",
  icon: "assets/default_new_app_icon.png",
  functions: [TermLookupFunction],
  workflows: [DefinitionWorkflow],
  datastores: [TermsDatastore],
  outgoingDomains: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
  ],
});

```
The app manifest is the app's configuration. It is very important that this file is structured correctly in order for your app to run smoothly. Each function, workflow, custom type, and datastore defined in an app must be declared in the manifest file.



## Create a trigger

This is our final step before we are able to run our app! We need to add a trigger to kick off the workflow and collect that `interactivity` parameter needed to initiate a modal’s interactivity. Create one more folder at the root of the project and call it `triggers`. Add a file to it and name it `term_definition_trigger`. In it, place the following code: 

```javascript
// term_definition_trigger.ts

import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import { DefinitionWorkflow } from "../workflows/definition_workflow.ts";

const termDefinitionTrigger: Trigger<typeof DefinitionWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Term Definition Trigger",
  description:
    "A trigger that starts the workflow to define a user-entered term",
  workflow: `#/workflows/${DefinitionWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
};

export default termDefinitionTrigger;
```

This is a link trigger that, upon clicking, will initiate the workflow, which will call the function, which will allow the user to search for and add company definitions to our app. To get the link for that link trigger, run the following in your terminal:

```bash
slack trigger create —trigger-def triggers/term_definition_trigger.ts
```

After executing the command, select your app and workspace. The terminal will output a link called a "Shortcut URL", also known as your link trigger. Save that URL; we'll use it later. If you ever lose track of that URL, you can always run the command `slack triggers -info` and select your workspace to find it again.


## Run your app

While in your project’s root directory, run this command in your terminal:

```bash
slack run
```

Choose your app and assign it to your workspace. Then, switch over to the app in Slack and test it out. Remember the link trigger you created earlier? Copy and paste that URL in a message to yourself in Slack. It will unfurl into a button that you can click to initiate the workflow.


## Share your app

Because nobody knows everything, including company jargon, this would be a great app to share with your team. Check out [Deploy to Slack](/deno-slack-sdk/guides/deploying-to-slack) to discover how to share this app with your team. 

## Next steps
For your next challenge, perhaps consider creating an app to [create an issue in GitHub](/deno-slack-sdk(/tutorials/github-issues-app)!