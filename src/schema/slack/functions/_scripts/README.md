# Generating Slack Function Source Files

This script will generate the necessary function TypeScript files in the
`schema/slack/functions` directory, i.e.
`schema/slack/functions/send_message.ts`. It will also update the
`schema/slack/functions/mod.ts` file to import/export all of the defined
functions.

## Instructions

1. First, you'll need to grab a payload from `functions.list` and place the
   response in a `functions.json` file inside of this `_scripts` directory.

2. With this `_scripts` directory as your working directory, run the generate
   script:

```
> generate
```

3. This will output something like the following:

```
Generating code for Slack Function: add_pin
Generating code for Slack Function: add_user_to_usergroup
Generating code for Slack Function: archive_channel
Generating code for Slack Function: create_channel
Generating code for Slack Function: create_usergroup
Generating code for Slack Function: delay
Generating code for Slack Function: invite_user_to_channel
Generating code for Slack Function: rename_channel
Generating code for Slack Function: send_ephemeral_message
Generating code for Slack Function: send_message
Generating code for Slack Function: update_channel_topic
Wrote 11 files
Updated functions module export
Formatting Slack function files...
Linting Slack function files...
```

If it completes without any linter errors, you should be good to go, with new,
formatted and linted TypeScript files for all of the Slack Functions included in
your `functions.json` payload. If there are any unexpected linting issues, you
may need to go into those files and manually resolve any problems.
