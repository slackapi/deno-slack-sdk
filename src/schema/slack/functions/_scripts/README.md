# Generating Slack function source files

This script will generate the necessary function TypeScript files along with
their tests in the `schema/slack/functions` directory, i.e.
`schema/slack/functions/send_message.ts` and
`schema/slack/functions/send_message_test.ts`. It will also update the
`schema/slack/functions/mod.ts` file to import/export all of the defined
functions. It will also remove outdated function TypeScript files but not their
corresponding test, the tests must be removed manually.

## Instructions

1. First, you'll need to grab the response from `functions.categories.list` API
   method tester:

- Choose a session token from a public production enterprise grid workspace that
  is NOT enrolled in the `hermes_next` toggle. Recommend using the Slack DevRel
  production enterprise grid token.
- Pass the `category_type=builtins_categories` parameter to this API.
- Now for the super annoying part: for each builtin category, you will need to
  manually call _another_ API and assemble a functions list yourself:
  - Grab the response from `functions.categories.steps.list` API method tester,
    using the same session token as earlier in this step, passing each
    `category_id` retrieved earlier into this API call.
  - Copy the `functions` array elements from each response into a fresh
    `{"functions":[]}` array in `functions.json`, slowly building up a list of
    all builtin functions.

2. With this `_scripts` directory as your working directory, run the generate
   script:

   ```sh
   > ./generate
   ```

3. For now, the script will only generate warnings if it encounters hidden
   parameters. If you see warnings around hidden parameters, carefully review
   the generated output. As much as possible, we want to prevent hidden
   parameters from being released. At the same time, we have released hidden
   parameters in this SDK in the past, and so for backwards compatibility
   reasons, we have kept them in. As such, **ensure no new hidden parameters are
   introduced**.

If it completes without any linter errors, you should be good to go, with new,
formatted and linted TypeScript files for all of the Slack functions included in
your `functions.json` payload. If there are any unexpected linting issues, you
may need to go into those files and manually resolve any problems.
