# Generating Slack function source files

This script will generate the necessary function TypeScript files along with
their tests in the `schema/slack/functions` directory, i.e.
`schema/slack/functions/send_message.ts` and
`schema/slack/functions/send_message_test.ts`. It will also update the
`schema/slack/functions/mod.ts` file to import/export all of the defined
functions. It will also remove outdated function TypeScript files but not their
corresponding test, the tests must be removed manually.

## Instructions

1. First, you'll need to grab a payload from `functions.list` and place the
   response in a `functions.json` file inside of this `_scripts` directory.

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
