/**
 * Creates a new User Group.
 * @param usergroup_name - The name of the User Group to be created.
 * @param usergroup_handle - The `@usergroup` handle.
 * @returns usergroup_id - The ID of the created User Group.
 * @example
 * const createUsergroupStep = ExampleWorkflow.addStep(
 *   Schema.slack.functions.CreateUsergroup,
 *   {
 *     usergroup_name: "Baking enthusiasts",
 *     usergroup_handle: "cookies",
 *   },
 * );
 *
 * @scopes `usergroups:write`
 * @see The {@link https://api.slack.com/future/functions#create-usergroup create a user group} documentation.
 */
