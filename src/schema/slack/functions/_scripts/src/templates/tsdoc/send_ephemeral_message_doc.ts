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
