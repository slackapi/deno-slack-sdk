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
