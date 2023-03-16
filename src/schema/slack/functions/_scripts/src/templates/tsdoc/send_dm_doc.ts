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
