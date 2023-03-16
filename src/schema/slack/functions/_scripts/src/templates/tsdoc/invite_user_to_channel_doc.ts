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
