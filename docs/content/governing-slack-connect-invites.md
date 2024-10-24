# Governing Slack Connect invites

This guide will show you how to create a Slack workflow to automate the process of governing [Slack Connect](/apis/connect) invitations. 

## Prerequisites 

You'll need to have admin access to your Slack workspace to continue! Complete the following steps to allow workflow automations to interact with your Slack Connect invitations. 

1. In the Admin Dashboard, under **Slack Connect Settings**, enable the “Apply automation rules before channel invitations are sent” preference within **Slack Connect Settings** in the Admin Dashboard. 
2. To allow users to request invites, in the Admin Dashboard, under **Slack Connect Settings**, then **Channels**, enable the "Sending Invitations with Permission to Post Only" or "Sending Invitations with permission to post, invite and more" preference.

In addition, please consider the following before proceeding:

* Only external invites sent by members of your organization to channels owned by your organization will be governed by these automation tools. 
* MPDM to Private Channel conversions are not considered invitations and will not be governed by automation rules. We recommend you review your policy around MPDM to Private Channel changes (under **Slack Connect Settings**).
* Admins and owners and those who have the permission to approve Slack Connect invitations have implicit approval to send invitation requests, meaning their invitations will not be held and subject to automation rules.
* Requests to Invite from Bots that have the [`conversations.connect:manage`](/scopes/conversations.connect:manage) scope will implicitly be sent and will not be held and subject to automation rules.
* Admin request messages will be directed to the same channels or individuals as specified under “Who can approve requests and manage channels?” and “Send requests to…” under **Approving Channel Invitations**.

## Setting up your workflow app {#setting-up}

### 1. Create a Deno Slack SDK app from the Slack CLI {#create}

If you haven't yet, install and authorize the [Slack CLI](/automation/quickstart). 

Then use the `create` Slack CLI command to create a workflow app. 

```
slack create my-app
```

### 2. Add the `conversations.connect:manage` scope {#add-scope}

Scopes are added to workflows via the manifest. Modify the `botScopes` array to include the [`conversations.connect:manage`](/scopes/conversations.connect:manage) scope.

```js
  botScopes: ["conversations.connect:manage"],
```


## Creating the workflow {#workflow}

### 1. Define a function with input and output parameters for handling invite requests {#define-function}

[Functions](/automation/functions) are the building blocks of workflow apps. We'll be using a [custom function](/automation/functions/custom) to utilize the Slack Connect API methods. Let's define the function now. 

```js
import { DefineWorfklow, Schema } from "deno-slack-sdk/mod.ts";
import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";

export const RequestInfoFunction = DefineFunction({
  callback_id: "request_info_function",
  title: "Request to Invite",
  description: "Handle the requested invites",
  source_file: "functions/request_info.ts",
  input_parameters: {
    properties: {
      invite_request: {
        type: Schema.types.object,
      },
    },
    required: ["invite_request"],
  },
  output_parameters: {
    properties: {
      result: {
        type: Schema.types.string,
      },
    },
    required: ["result"],
  },
});
```

### 2. Define the main logic to handle Slack Connect Invitation Requests {#define-logic}

You can filter invitees, automatically approving or denying certain requests. 

This is done using two Web API methods:

* [`conversations.requestSharedInvite.approve`](/methods/conversations.requestSharedInvite.approve)
* [`conversations.requestSharedInvite.deny`](/methods/conversations.requestSharedInvite.deny)

In this example the filtering is based on their email domains.

```js
// Define some constants to be used for domain filtering logic.
const ALLOWED_EMAIL_DOMAINS = ["@slack-corp.com", "@approved-vendor.com"];
const BLOCKED_EMAIL_DOMAINS = ["@danger.com"];
const REQUEST_REASON_EMAIL_DOMAINS = ["@gmail.com"];

const filterInvites = (invitees: any[], domains: string[]) =>
  invitees.filter((invite: any) =>
  domains.some((domain) => invite.email.endsWith(domain))
  );

const handleInvites = async (client: any, invites: any[], action: string, message?: string) => {
  for (const invite of invites) { 
    const response = await client.apiCall(`conversations.requestSharedInvite.${action}`,             {     invite_id: invite.invite_id,
      message,
}); 
}};
```

You also have the ability to prompt the user for additional information via a form link when needed.

```js
const postReasonRequestMessage = async (client: any, userId: string) => {
  // This code snippet sends a message to the user with a link to a form 
  // prompting for more information.
  const response = await client.chat.postMessage({
    channel: userId, // Use the userId of the requesting user
    text: "Provide more info about SC channel request",
    blocks: [
      { "type": "header",
        "text": {
            "type": "plain_text",
            "text": "Slack Connect Request Details",
         },
      },
      { "type": "context",
        "elements": [
           {
              "type": "mrkdwn",
              "text": "Provide the following details about the requested invitees.",
           }
         ],
      },
      { "type": "actions",
        "elements": [
           {
              "type": "button",
              "text": {
                 type: "plain_text",
                 text: "Start",
                 emoji: true,
              },
              action_id: "open_form",
              value: "value1_approve",
              style: "primary",
           }
         ],
      },
    ],
  });

  return {
    completed: false,
  };
};
```

Let's use these features now in a custom function. 

### 3. Define the main function {#define-main-function}

This function uses the filters previously created to automatically sort invites. 

The `BLOCKED_EMAIL_DOMAINS` values are denied, the `ALLOWED_EMAIL_DOMAINS` values are approved, and the the `REQUEST_REASON_EMAIL_DOMAINS` values are followed up with a prompt asking for additional information with the info set up in the previous instruction step using a [Block Kit actions handler](/automation/interactive-modals#open-block-kit-action).

```js
export default SlackFunction(RequestInfoFunction,
  async ({ inputs, tokens, env }) => {
    const invitees = inputs.invite_request.result.target_users;
    const client = SlackAPI(token, { slackApiUrl: env.SLACK_API_URL });

    // Filter invitees based on email domain.
    const denyInvites = filterInvites(invitees, BLOCKED_EMAIL_DOMAINS);
    const approveInvites = filterInvites(invitees, ALLOWED_EMAIL_DOMAINS);
    const requiresReasonInvites = filterInvites(invitees, REQUEST_REASON_EMAIL_DOMAINS);

    await handleInvites(client, approveInvites, "approve");
    await handleInvites(client, denyInvites, "deny", "The recipients are not part of a pre-approved organization to work with.");

    // Auto-approve or deny based on blocked or allow domain criteria.
    // Prompt for more information if meets needs more info status.
    if (requiresReasonInvites.length) {
       const userId = inputs.invite_request.result.actor.id;
       await postReasonRequestMessage(client, inputs.invite_request.actor.id);
    }

   return { completed: false };
 },
)
 .addBlockActionsHandler(
   "open_form",
   async ({ inputs: _inputs, body, token, env }) => {
	const formMetadata = {
	  ts: body?.message?.ts ?? "",
	  message_channel_id: body?.channel?.id ?? "",
	};

     // Handle button click to open a form for additional information.
     const client = SlackAPI(token, { slackApiUrl: env.SLACK_API_URL });

     // Build form that requests a reason for the invite
     const view_payload = {
	interactivity_pointer: body.interactivity.interactivity_pointer,
       view: {
	  private_metadata: JSON.stringify(formMetadata),
	  type: "modal",
	  title: {
		type: "plain_text",
		text: "Details about the Connecting Teams",
		},
	  submit: {
		type: "plain_text",
		text: "Submit",
	  },
	  blocks: [
		{
		  "type": "section",
		  "text": {
			"type": "mrkdwn",
			"text": "Additional information",
		  },
		},
		{
		  "type": "divider",
		},
		{
		  "type": "input",
		  "block_id": "reason_block",
		  "element": {
			"type": "plain_text",
			"action_id": "reason_input",
			"multiline": true,
			"placeholder": {
				"type": "plain_text",
				"text": "Please provide a reason for this invitation.",
			},
		  },
		  "label": {
			"type": "plain_text",
			"text": "Reason",
		  },
		},
	  ],
	}
     };
  },
 )
 .addViewSubmissionHandler(
   "approval_info_modal",
   async ({ body, view, token, env, inputs }) => {
 	// Handle View Submission
	// Update the Slackbot message to end workflow submissions
	const privateMetadata = JSON.parse(view.private_metadata ?? "");

	const client = SlackAPI(token, {
	  slackApiUrl: env.SLACK_API_URL,
	});


      // Update message to user to show that submission was made with the reason
	const resp = await client.chat.update({
	  channel: privateMetadata.message_channel_id,
	  ts: privateMetadata.ts,
	  as_user: true,
	  text: "Provide more info about SC channel request",
	  blocks: [
		{
		  "type": "header",
		  "text": {
			"type": "plain_text",
			"text": "Slack Connect Approval Details",
		  },
		},
		{
		  "type": "context",
		  "elements": [
{
  "type": "mrkdwn",
  "text": "Thank you for your submission :white_check_mark:",
			},
		  ],
		},
	  ],
	});

	// TODO: Handle user input in the way you want
	const reasonForInviteRequest = view.state.values.reason_block.reason_input.value;
  },
);
```

### 4. Define the workflow {#define-workflow}

With the desired functionality achieved in the custom function, now it needs to be added to a workflow. The following defines a workflow and adds the `RequestInfoFunction` as a step. 

```js
import { DefineWorfklow, Schema } from "deno-slack-sdk/mod.ts";
import { RequestInfoFunction } from "../functions/request_info.ts";

const InviteRequested = DefineWorkflow({
  callback_id: "invite_requested_workflow",
  title: "Invite Requested Workflow",
  description: "",
  input_parameters: {
    properties: {
      invite_request: {
        type: Schema.types.object,
        description: "A requested invite and its metadata",
      },
    },
    required: [],
  },
});

// This is the step that makes the workflow process that invite request as defined in the // main function.
InviteRequested.addStep(RequestInfoFunction, {
  invite_request: InviteRequested.inputs.invite_request,
});

export default InviteRequested;
```

### 5. Create the event trigger {#event-trigger}

Workflows are only invoked by [triggers](/automation/triggers). We'll be using an [event trigger](/automation/triggers/event) to listen for the [`shared_channel_invite_requested`](/events/shared_channel_invite_requested) event to invoke the created workflow. 

```js
import { Trigger } from "deno-slack-api/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import InviteRequested from "../workflows/invite_requested.ts";

const inviteRequestedTrigger: Trigger<typeof InviteRequested.definition> = {
 type: TriggerTypes.Event,
 name: "InviteRequested",
 description: "Gather details about the requested invite",
 workflow: "#/workflows/invite_requested_workflow",
 event: {
   event_type: "slack#/events/shared_channel_invite_requested",
   team_ids: ["<team_id>"],
},
inputs: {
  invite_request: {
    value: "{{data}}",
  },
},
};

export default inviteRequestedTrigger;
```

✅ Function

✅ Workflow

✅ Trigger

And look at that, you've assembled all the parts of a workflow app! Now you'll just need to decide how to use it.

## Onward {#onward}

➡️ **To learn how to deploy your workflow app**, head over to the [Deploy your app](/automation/deploy) page.

✨ **To learn more about using Slack Web API methods in your workflows**, head over to the [Slack API calls](/automation/apicalls) page. 