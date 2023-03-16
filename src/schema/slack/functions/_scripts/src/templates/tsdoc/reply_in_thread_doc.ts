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
