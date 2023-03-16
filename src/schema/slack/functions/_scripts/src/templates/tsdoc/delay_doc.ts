/**
 * Delays a workflow for some amount of time.
 * @param minutes_to_delay - Length of time (in minutes).
 * @example
 * const delayStep = ExampleWorkflow.addStep(
 *   Schema.slack.functions.Delay,
 *   {
 *     minutes_to_delay: 12,
 *   },
 * );
 *
 * @scopes _No additional scopes required._
 * @see The {@link https://api.slack.com/future/functions#delay delay} documentation.
 */
