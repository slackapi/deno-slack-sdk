/**
 * Adds a user to a User Group.
 * @param usergroup_id - The ID of the User Group the user will be added to.
 * @param user_id - The ID of the user to add to the User Group. **Deprecating** on April 6th, 2023; use `user_ids` instead.
 * @param user_ids - An array of IDs of the user(s) to add to the User Group.
 * @returns usergroup_id - The ID of the User Group, now with the added user.
 * @example
 * const addUserToUsergroupStep = ExampleWorkflow.addStep(
 *   Schema.slack.functions.AddUserToUsergroup,
 *   {
 *     usergroup_id: "S04UZRV61T8",
 *     user_ids: ["U0R36M8T62", "U0J46F228L0"],
 *   },
 * );
 *
 * @scopes `usergroups:write`
 * @see The {@link https://api.slack.com/future/functions#add-user-to-usergroup add user to a user group} documentation.
 */
