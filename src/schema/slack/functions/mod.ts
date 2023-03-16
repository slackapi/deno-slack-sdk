/** This file was autogenerated on Thu Mar 16 2023. Follow the steps in src/schema/slack/functions/_scripts/README.md to rebuild **/
import AddPin from "./add_pin.ts";
import AddUserToUsergroup from "./add_user_to_usergroup.ts";
import ArchiveChannel from "./archive_channel.ts";
import CreateChannel from "./create_channel.ts";
import CreateUsergroup from "./create_usergroup.ts";
import Delay from "./delay.ts";
import InviteUserToChannel from "./invite_user_to_channel.ts";
import OpenForm from "./open_form.ts";
import RemoveUserFromUsergroup from "./remove_user_from_usergroup.ts";
import ReplyInThread from "./reply_in_thread.ts";
import SendDm from "./send_dm.ts";
import SendEphemeralMessage from "./send_ephemeral_message.ts";
import SendMessage from "./send_message.ts";
import UpdateChannelTopic from "./update_channel_topic.ts";

const SlackFunctions = {
  /**
   * Pins a message to a channel.
   * @param channel_id - The ID of the channel the message will be pinned to.
   * @param message - The URL or timestamp of the message that will be pinned.
   * @example
   * const addPinStep = ExampleWorkflow.addStep(
   *   Schema.slack.functions.AddPin,
   *   {
   *     channel_id: "C082T4F6S1N",
   *     message: "1645554142.024680",
   *   },
   * );
   *
   * @scopes `pins:write`
   * @see The {@link https://api.slack.com/future/functions#add-pin-to-message add pin to message} documentation.
   */
  AddPin,
  /**
   * Adds a user to a User Group.
   * @param usergroup_id - The ID of the User Group the user will be added to.
   * @param user_id - The ID of the user to add to the User Group. **Deprecating** on April 6th, 2023; use `user_ids` instead.
   * @param user_ids - An array of IDs of the user(s) to add to the User Group.
   * @returns usergroup_id - The ID of the User Group, now with the added user.
   * @example
   * const addUserToUsergroupStep = ExampleWorkflow.addStep(
   *   Schema.slack.functions.AddUserToUsergroup,
   *   {
   *     usergroup_id: "S04UZRV61T8",
   *     user_ids: ["U0R36M8T62", "U0J46F228L0"],
   *   },
   * );
   *
   * @scopes `usergroups:write`
   * @see The {@link https://api.slack.com/future/functions#add-user-to-usergroup add user to a user group} documentation.
   */
  AddUserToUsergroup,
  /**
   * Archives a channel.
   * @param channel_id - The ID of the channel to archive.
   * @returns channel_id - The ID of the archived channel.
   * @example
   * const archiveChannelStep = ExampleWorkflow.addStep(
   *   Schema.slack.functions.ArchiveChannel,
   *   {
   *     channel_id: "C082T4F6S1N",
   *   },
   * );
   *
   * @scopes `channels:write`, `im:write`, `groups:write`, `mpim:write`
   * @see The {@link https://api.slack.com/future/functions#archive-channel archive a channel} documentation.
   */
  ArchiveChannel,
  /**
   * Creates a new channel.
   * @param channel_name - The name of the channel.
   * @param is_private - (Optional) Set to `true` if the channel should be private, `false` if public. Defaults to `false`.
   * @returns channel_id - The ID of the created channel.
   * @example
   * const createChannelStep = ExampleWorkflow.addStep(
   *   Schema.slack.functions.CreateChannel,
   *   {
   *     channel_name: "convo-space-9000",
   *     is_private: false,
   *   },
   * );
   *
   * @remarks The function will attempt to create a channel name that follows Slack's channel name guidelines, but the channel's name may end up being different than the exact string provided.
   * @scopes `channels:manage`, `groups:write`
   * @see The {@link https://api.slack.com/future/functions#create-channel create a channel} documentation.
   */
  CreateChannel,
  /**
   * Creates a new User Group.
   * @param usergroup_name - The name of the User Group to be created.
   * @param usergroup_handle - The `@usergroup` handle.
   * @returns usergroup_id - The ID of the created User Group.
   * @example
   * const createUsergroupStep = ExampleWorkflow.addStep(
   *   Schema.slack.functions.CreateUsergroup,
   *   {
   *     usergroup_name: "Baking enthusiasts",
   *     usergroup_handle: "cookies",
   *   },
   * );
   *
   * @scopes `usergroups:write`
   * @see The {@link https://api.slack.com/future/functions#create-usergroup create a user group} documentation.
   */
  CreateUsergroup,
  /**
   * Delays a workflow for some amount of time.
   * @param minutes_to_delay - Length of time (in minutes).
   * @example
   * const delayStep = ExampleWorkflow.addStep(
   *   Schema.slack.functions.Delay,
   *   {
   *     minutes_to_delay: 12,
   *   },
   * );
   *
   * @scopes _No additional scopes required._
   * @see The {@link https://api.slack.com/future/functions#delay delay} documentation.
   */
  Delay,
  /**
   * Invites a user to a channel.
   * @param channel_id - The ID of the channel to invite the user into. **Deprecating** on April 6th, 2023; use `channel_ids` instead.
   * @param channel_ids - An array of IDs of the channel to invite the user into. This only currently supports a single channel.
   * @param user_id - The ID of the user to add to the User Group. **Deprecating** on April 6th, 2023; use `user_ids` instead.
   * @param user_ids - An array of IDs of the user(s) to invite into the channel.
   * @returns user_ids - If succesful, an array of IDs of the user(s) invited to the channel.
   * @example
   * const inviteUserToChannelStep = ExampleWorkflow.addStep(
   *   Schema.slack.functions.InviteUserToChannel,
   *   {
   *     channel_ids: ["C082T4F6S1N"],
   *     user_ids: ["U0R36M8T62", "U0J46F228L0"],
   *   },
   * );
   *
   * @scopes `channels:manage`, `groups:write`
   * @see The {@link https://api.slack.com/future/functions#invite-user-to-channel invite user to channel} documentation.
   */
  InviteUserToChannel,
  /**
   * Opens a form for the user to interact with.
   * @param title - Title of the form shown to the user (24 characters max).
   * @param fields - Input fields to be shown on the form. See {@link https://api.slack.com/future/forms#element-schema form field element type parameters} for details.
   * @param interactivity - Context about the interactive event that led to opening of the form.
   * @param description - (Optional) Description of the form shown to the user.
   * @param submit_label - (Optional) Label of the submit button that the user will click to submit the form.
   * @returns fields - Values of the input fields filled by the user.
   * @returns interactivity - Context about the form submit action interactive event.
   * @example
   * const openFormStep = GreetingWorkflow.addStep(
   *   Schema.slack.functions.OpenForm,
   *   {
   *     title: "Send a greeting",
   *     interactivity: GreetingWorkflow.inputs.interactivity,
   *     submit_label: "Send",
   *     fields: {
   *       elements: [{
   *         name: "recipient",
   *         title: "Recipient",
   *         type: Schema.slack.types.user_id,
   *       }, {
   *         name: "channel",
   *         title: "Channel to send message to",
   *         type: Schema.slack.types.channel_id,
   *         default: GreetingWorkflow.inputs.channel,
   *       }, {
   *         name: "message",
   *         title: "Message to recipient",
   *         type: Schema.types.string,
   *         long: true,
   *       }],
   *       required: ["recipient", "channel", "message"],
   *     },
   *   },
   * );
   *
   * @remarks The call to `OpenForm` must be the first step in a workflow.
   * @remarks Workflows including an `OpenForm` step require `interactivity` as an input parameter.
   *
   * @scopes _No additional scopes required._
   * @see The {@link https://api.slack.com/future/functions#open-a-form open a form} documentation.
   * @see The {@link https://api.slack.com/future/forms#using-forms using forms} guide.
   * @see The {@link https://api.slack.com/future/forms#element-schema element type parameters} for form fields.
   */
  OpenForm,
  /**
   * Removes a user or multiple users from a User Group.
   * @param usergroup_id - The ID of the User Group to remove the user(s) from.
   * @param user_id - A single user ID to be removed from the User Group. **Deprecating** on April 6th, 2023; use `user_ids` instead.
   * @param user_ids - An array of IDs of the user(s) to add to the User Group.
   * @returns usergroup_id - The ID of the User Group, which no longer contains the user(s).
   * @example
   * const removeUserFromUsergroupStep = ExampleWorkflow.addStep(
   *   Schema.slack.functions.RemoveUserFromUsergroup,
   *   {
   *     usergroup_id: "S04UZRV61T8",
   *     user_ids: ["U0R36M8T62", "U0J46F228L0"],
   *   },
   * );
   *
   * @scopes `usergroups:write`
   * @see The {@link https://api.slack.com/future/functions#remove-user-from-usergroup remove user from user group} documentation.
   */
  RemoveUserFromUsergroup,
  /**
   * Send a message in thread.
   * @param message - A rich text message to send in the thread.
   * @param message_context - An individual instance of a message.
   * @param reply_broadcast - (Optional) Also send the message to channel. Defaults to `false`.
   * @param metadata - (Optional) Eventful information to attach as {@link https://api.slack.com/future/metadata-events message metadata}.
   * @returns message_context - An individual instance of a message.
   * @example
   * const replyInThreadStep = ExampleWorkflow.addStep(
   *   Schema.slack.functions.ReplyInThread,
   *   {
   *     message_context: sendMessageStep.outputs.message_context,
   *     reply_broadcast: false,
   *     message: "Awesome stuff!",
   *   },
   * );
   *
   * @scopes _No additional required scopes._
   * @see The {@link https://api.slack.com/future/functions#reply-in-thread reply in thread} documentation.
   */
  ReplyInThread,
  /**
   * Sends a direct message to a user.
   * @param user_id - User ID to send the message.
   * @param message - The private textual message to send to the recipient.
   * @param thread_ts - (Optional) The `ts` identifier of an existing message to send this message to as a reply. Do not use `ts` values of messages that themselves are replies. **Deprecating** on April 6th, 2023; use {@link https://api.slack.com/future/functions#reply-in-thread the `ReplyInThread` function} to send messages in thread.
   * @param interactive_blocks - (Optional) {@link https://api.slack.com/reference/block-kit/block-elements#button__fields Buttons} to send with the message.
   * @returns message_ts - The channel-specific unique identifier for this message. Doubles as a timestamp for when the message was posted in seconds from the epoch.
   * @returns message_context - An indivdual instance of a message.
   * @returns action - If `interactive_blocks` was provided, the `action` object contains the button properties.
   * @returns interactivity - If `interactive_blocks` is provided, the {@link https://api.slack.com/future/block-events interactivity} context.
   * @example
   * const sendDmStep = ExampleWorkflow.addStep(
   *   Schema.slack.functions.SendDm,
   *   {
   *     user_id: "U0J46F228L0",
   *     message: "Keep it up!",
   *   },
   * );
   *
   * @scopes _No additional required scopes._
   * @see The {@link https://api.slack.com/future/functions#send-direct-message send direct message} documentation.
   */
  SendDm,
  /**
   * Sends an {@link https://api.slack.com/messaging/managing#ephemeral ephemeral message} to a specific channel.
   * @param channel_id - Channel ID to send the message to.
   * @param user_id - The ID of the user that will be able to see the ephemeral message.
   * @param message - The textual message to send to channel.
   * @param thread_ts - (Optional) The `ts` identifier of an existing message to send this ephemeral message to {@link https://api.slack.com/messaging/managing#threading as a reply}. Do not use `ts` values of messages that themselves are replies. **Deprecating** on April 6th, 2023; use {@link https://api.slack.com/future/functions#reply-in-thread the `ReplyInThread` function} to send messages in thread.
   * @returns message_ts - The channel-specific unique identifier for this message. With some wrangling, doubles as a partial timestamp for when the message was posted in seconds from the epoch.
   * @example
   * const sendEphemeralMessageStep = ExampleWorkflow.addStep(
   *   Schema.slack.functions.SendEphemeralMessage,
   *   {
   *     channel_id: "C082T4F6S1N",
   *     user_id: "U0J46F228L0",
   *     message: "You're doing great!",
   *   },
   * );
   *
   * @scopes _No additional required scopes._
   * @see The {@link https://api.slack.com/future/functions#send-ephemeral-message send ephemeral message} documentation.
   */
  SendEphemeralMessage,
  /**
   * Sends a message to a specific channel.
   * @param channel_id - The ID of the Channel to send the message to.
   * @param message - The ID of the user that will be able to see the ephemeral message.
   * @param thread_ts - (Optional) The `ts` identifier of an existing message to send this message to {@link https://api.slack.com/messaging/managing#threading as a reply}. Do not use `ts` values of messages that themselves are replies. **Deprecating** on April 6th, 2023; use {@link https://api.slack.com/future/functions#reply-in-thread the `ReplyInThread` function} to send messages in thread.
   * @param metadata - (Optional) Eventful information to attach as {@link https://api.slack.com/future/metadata-events message metadata}.
   * @param interactive_blocks - (Optional) {@link https://api.slack.com/reference/block-kit/block-elements#button__fields Buttons} to send with the message. Must be wrapped in a block.
   * @returns message_ts - The channel-specific unique identifier for this message, also serves as a confirmation that the message was sent. With some wrangling, doubles as a partial timestamp for when the message was posted in seconds from the epoch.
   * @returns message_context - An indivdual instance of a message.
   * @returns message_link - Permalink URL of the message that was sent.
   * @returns action - If `interactive_blocks` was provided, the `action` object contains the {@link https://api.slack.com/reference/block-kit/block-elements#button__fields button properties}.
   * @returns interactivity - If `interactive_blocks` is provided as an input parameter, the {@link https://api.slack.com/future/block-events interactivity} context becomes available.
   * @example
   * const sendMessageStep = ExampleWorkflow.addStep(
   *   Schema.slack.functions.SendMessage,
   *   {
   *     channel_id: "C082T4F6S1N",
   *     message: "Let's go team!",
   *   },
   * );
   *
   * @remarks This does not allow for direct messages to users, use {@link https://api.slack.com/future/functions#send-direct-message send direct message} instead.
   * @scopes _No additional required scopes._
   * @see The {@link https://api.slack.com/future/functions#send-message send message} documentation.
   */
  SendMessage,
  /**
   * Updates the topic of a channel.
   * @param channel_id - The ID of the channel to have its topic changed.
   * @param topic - The topic to change to.
   * @returns topic - The new topic.
   * @example
   * const updateChannelTopicStep = ExampleWorkflow.addStep(
   *   Schema.slack.functions.UpdateChannelTopic,
   *   {
   *     channel_id: "C082T4F6S1N",
   *     topic: "The main idea in mind",
   *   },
   * );
   *
   * @scopes `channels:manage`, `groups:write`
   * @see The {@link https://api.slack.com/future/functions#update-channel-topic update channel topic} documentation.
   */
  UpdateChannelTopic,
} as const;

export default SlackFunctions;
