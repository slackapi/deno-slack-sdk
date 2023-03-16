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
