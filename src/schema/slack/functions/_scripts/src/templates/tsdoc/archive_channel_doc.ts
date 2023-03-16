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
