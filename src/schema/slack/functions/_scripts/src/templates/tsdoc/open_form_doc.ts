/**
 * Opens a form for the user to interact with.
 * @param title - Title of the form shown to the user (24 characters max).
 * @param fields - Input fields to be shown on the form. See {@link https://api.slack.com/future/forms#element-schema form field element type parameters} for details.
 * @param interactivity - Context about the interactive event that led to opening of the form.
 * @param description - (Optional) Description of the form shown to the user.
 * @param submit_label - (Optional) Label of the submit button that the user will click to submit the form.
 * @returns fields - Values of the input fields filled by the user.
 * @returns interactivity - Context about the form submit action interactive event.
 * @example
 * const openFormStep = GreetingWorkflow.addStep(
 *   Schema.slack.functions.OpenForm,
 *   {
 *     title: "Send a greeting",
 *     interactivity: GreetingWorkflow.inputs.interactivity,
 *     submit_label: "Send",
 *     fields: {
 *       elements: [{
 *         name: "recipient",
 *         title: "Recipient",
 *         type: Schema.slack.types.user_id,
 *       }, {
 *         name: "channel",
 *         title: "Channel to send message to",
 *         type: Schema.slack.types.channel_id,
 *         default: GreetingWorkflow.inputs.channel,
 *       }, {
 *         name: "message",
 *         title: "Message to recipient",
 *         type: Schema.types.string,
 *         long: true,
 *       }],
 *       required: ["recipient", "channel", "message"],
 *     },
 *   },
 * );
 *
 * @remarks The call to `OpenForm` must be the first step in a workflow.
 * @remarks Workflows including an `OpenForm` step require `interactivity` as an input parameter.
 *
 * @scopes _No additional scopes required._
 * @see The {@link https://api.slack.com/future/functions#open-a-form open a form} documentation.
 * @see The {@link https://api.slack.com/future/forms#using-forms using forms} guide.
 * @see The {@link https://api.slack.com/future/forms#element-schema element type parameters} for form fields.
 */
