# Generating Slack function source files

This script will generate the necessary built-in function TypeScript files along with
their tests in the `schema/slack/functions` directory, i.e.
`schema/slack/functions/send_message.ts` and
`schema/slack/functions/send_message_test.ts`. It will also update the
`schema/slack/functions/mod.ts` file to import/export all of the defined
functions. It will also remove outdated function TypeScript files but not their
corresponding test, the tests must be removed manually.

## Instructions

1. First, you'll need to grab a payload from the `functions.list` HTTP API and
   place the response in a `functions.json` file inside of this `_scripts` directory.
   Typically, for public releases of this SDK, this is done using the API tester on
   https://api.slack.com/methods with a production workspace access token that does
   not use any special toggles or experiments. This is to ensure that we expose function
   definitions only for publicly-available built-in functions.
  - Note that if you want to generate built-in function definitions based on
    non-publicly-available functions, such as those only available in dev or behind
    a toggle, then you will need to retrieve the `functions.list` payload from dev (if
    applicable) and/or with an access token from a workspace with the relevant toggles/
    experiments (if applicable). This may apply in cases where you want to test pre-release
    or hidden built-in function definitions. Any such built-in functions should NOT be sent
    as pull requests to this repo, but is rather intended for internal development.
2. With this `_scripts` directory as your working directory, run the generate
   script:

   ```sh
   > ./generate
   ```

3. This will output something like the following:

   ```txt
   Cleaning folder directory
   Generating code & tests for Slack function: add_pin
   Generating code & tests for Slack function: add_user_to_usergroup
   Generating code & tests for Slack function: archive_channel
   Generating code & tests for Slack function: create_channel
   Generating code & tests for Slack function: create_usergroup
   Generating code & tests for Slack function: delay
   Generating code & tests for Slack function: invite_user_to_channel
   Generating code & tests for Slack function: open_form
   Generating code & tests for Slack function: remove_user_from_usergroup
   Generating code & tests for Slack function: reply_in_thread
   Generating code & tests for Slack function: send_dm
   Generating code & tests for Slack function: send_ephemeral_message
   Generating code & tests for Slack function: send_message
   Generating code & tests for Slack function: update_channel_topic
   Generated 14 Slack functions with their unit tests
   Updated functions module export
   Formatting Slack function files...
   Linting Slack function files...
   ```

If it completes without any linter errors, you should be good to go, with new,
formatted and linted TypeScript files for all of the Slack functions included in
your `functions.json` payload. If there are any unexpected linting issues, you
may need to go into those files and manually resolve any problems.
