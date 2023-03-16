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
