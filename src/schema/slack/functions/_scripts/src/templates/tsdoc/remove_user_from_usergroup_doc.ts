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
