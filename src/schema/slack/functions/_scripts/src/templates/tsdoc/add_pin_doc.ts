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
