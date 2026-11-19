# Generating Slack function source files

This script will generate the necessary function TypeScript files along with
their tests in the `schema/slack/functions` directory, i.e.
`schema/slack/functions/send_message.ts` and
`schema/slack/functions/send_message_test.ts`. It will also update the
`schema/slack/functions/mod.ts` file to import/export all of the defined
functions. It will also remove outdated function TypeScript files but not their
corresponding test, the tests must be removed manually.

## Instructions

1. First, you'll need to grab the response from `functions.list` API method
   tester:

- Choose a session token from a public production enterprise grid workspace that
  is NOT enrolled in any beta toggles. Recommend using the Slack DevRel
  production enterprise grid token.
- Use `builtins` as the value for the `function_type` parameter to this API.
- Copy the response into a `functions.json` file in this directory.

2. With this `_scripts` directory as your working directory, run the generate
   script:

   ```sh
   > ./generate
   ```

If it completes without any linter errors, you should be good to go, with new,
formatted and linted TypeScript files for all of the Slack functions included in
your `functions.json` payload. If there are any unexpected linting issues, you
may need to go into those files and manually resolve any problems.
