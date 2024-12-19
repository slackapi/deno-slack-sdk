---
slug: /deno-slack-sdk/guides/logging-function-and-app-behavior
---

# Logging function and app behavior

When building workflow apps, you can use both function-level and app-level logging to troubleshoot and debug your app.

## Local app logs {#local-logging}

When developing locally, you can log information to the console of the terminal window where you are running your development server with calls to `console.log`. Calls to `console.log` are processed while your local developer server is running.

Let's use the [Virtual Running Buddies sample app](https://github.com/slack-samples/deno-virtual-running-buddies) as an example. Say you'd like to print out items that are getting stored in your datastore to verify that you're getting the type of data you expect. Within the `log_run.ts` file, we'll add a `console.log` call to the function that logs a run and stores it in the datastore as follows:

```javascript
// log_run.ts
export default SlackFunction(LogRunFunction, async ({ inputs, client }) => {
  const { distance, rundate, runner } = inputs;
  const uuid = crypto.randomUUID();

  const putResponse = await client.apps.datastore.put({
    datastore: RUN_DATASTORE,
    item: {
      id: uuid,
      runner: runner,
      distance: distance,
      rundate: rundate,
    },
  });

  if (!putResponse.ok) {
    return { error: `Failed to store run: ${putResponse.error}` };
  }
  console.log(putResponse); // add this line
  return { outputs: {} };
});
```

Now when you run your app locally, you'll see output similar to the following in your terminal window:

```bash
✨  yourname123 of Your DevEnv
Connected, awaiting events
2023-03-29 07:51:07 [info] [Wf050D7QTLR5] (Trace=Tr050M6Y6QF8) Execution started for workflow 'Log a run'
2023-03-29 07:51:07 [info] [Wf050D7QTLR5] (Trace=Tr050M6Y6QF8) Executing workflow step 1 of 3
2023-03-29 07:51:07 [info] [Fn010N] (Trace=Tr050M6Y6QF8) Function execution started for builtin function 'Open a form'
2023-03-29 07:51:17 [info] [Fn010N] (Trace=Tr050M6Y6QF8) Function execution completed for function 'Open a form'
2023-03-29 07:51:18 [info] [Wf050D7QTLR5] (Trace=Tr050M6Y6QF8) Execution completed for workflow step 'Open a form'
2023-03-29 07:51:19 [info] [Wf050D7QTLR5] (Trace=Tr050M6Y6QF8) Executing workflow step 2 of 3
{
  ok: true,
  datastore: "running_datastore",
  item: {
    runner: "ABC123DEF45",
    id: "abcd1234-ef56-gh78-ij91-klmnop234567",
    distance: 4.5,
    rundate: "2023-03-29"
  }
}
2023-03-29 07:51:19 [info] [Fn050TKLQJ3V] (Trace=Tr050M6Y6QF8) Function execution started for app function 'Log a run'
2023-03-29 07:51:20 [info] [Fn050TKLQJ3V] (Trace=Tr050M6Y6QF8) Function execution completed for function 'Log a run'
2023-03-29 07:51:21 [info] [Wf050D7QTLR5] (Trace=Tr050M6Y6QF8) Execution completed for workflow step 'Log a run'
2023-03-29 07:51:22 [info] [Wf050D7QTLR5] (Trace=Tr050M6Y6QF8) Executing workflow step 3 of 3
2023-03-29 07:51:22 [info] [Fn0102] (Trace=Tr050M6Y6QF8) Function execution started for builtin function 'Send a message to channel'
2023-03-29 07:51:24 [info] [Fn0102] (Trace=Tr050M6Y6QF8) Function execution completed for function 'Send a message to channel'
2023-03-29 07:51:25 [info] [Wf050D7QTLR5] (Trace=Tr050M6Y6QF8) Execution completed for workflow step 'Send a message to channel'
2023-03-29 07:51:25 [info] [Fn051HE94GSU] (Trace=Tr050TQV7ERG) Function execution completed for function 'Log a run'
2023-03-29 07:51:25 [info] [Wf050D7QTLR5] (Trace=Tr050M6Y6QF8) Execution completed for workflow 'Log a run'
```

Running `console.log` emits information that _you_ provide for your app to emit. If you want to see logs for _all_ your app's activity, you'll need to install your app and run `slack activity`. 

Once you run `slack activity` and select your workspace and local app environment, you'll see output similar to the following in your terminal window:

```bash
✨  yourname123 of Your DevEnv
2023-03-29 07:51:07 [info] [Wf050D7QTLR5] (Trace=Tr050M6Y6QF8) Execution started for workflow 'Log a run'
2023-03-29 07:51:07 [info] [Wf050D7QTLR5] (Trace=Tr050M6Y6QF8) Executing workflow step 1 of 3
2023-03-29 07:51:07 [info] [Fn010N] (Trace=Tr050M6Y6QF8) Function execution started for builtin function 'Open a form'
2023-03-29 07:51:17 [info] [Fn010N] (Trace=Tr050M6Y6QF8) Function execution completed for function 'Open a form'
2023-03-29 07:51:18 [info] [Wf050D7QTLR5] (Trace=Tr050M6Y6QF8) Execution completed for workflow step 'Open a form'
2023-03-29 07:51:19 [info] [Wf050D7QTLR5] (Trace=Tr050M6Y6QF8) Executing workflow step 2 of 3
2023-03-29 07:51:19 [info] [Fn050TKLQJ3V] (Trace=Tr050M6Y6QF8) Function execution started for app function 'Log a run'
2023-03-29 07:51:20 [info] [Fn050TKLQJ3V] (Trace=Tr050M6Y6QF8) Function execution completed for function 'Log a run'
2023-03-29 07:51:21 [info] [Wf050D7QTLR5] (Trace=Tr050M6Y6QF8) Execution completed for workflow step 'Log a run'
2023-03-29 07:51:22 [info] [Wf050D7QTLR5] (Trace=Tr050M6Y6QF8) Executing workflow step 3 of 3
2023-03-29 07:51:22 [info] [Fn0102] (Trace=Tr050M6Y6QF8) Function execution started for builtin function 'Send a message to channel'
2023-03-29 07:51:24 [info] [Fn0102] (Trace=Tr050M6Y6QF8) Function execution completed for function 'Send a message to channel'
2023-03-29 07:51:25 [info] [Wf050D7QTLR5] (Trace=Tr050M6Y6QF8) Execution completed for workflow step 'Send a message to channel'
2023-03-29 07:51:25 [info] [Fn051HE94GSU] (Trace=Tr050TQV7ERG) Function execution completed for function 'Log a run'
2023-03-29 07:51:25 [info] [Wf050D7QTLR5] (Trace=Tr050M6Y6QF8) Execution completed for workflow 'Log a run'
```

✨  **For more information about developing locally**, refer to [local development](/deno-slack-sdk/guides/developing-locally).

## Deployed app logs {#deployed-logging}

After your app is deployed, all calls to `console.log` will be captured remotely, and will be emitted along with the last seven days of your app's activity via the `slack activity` command **only**. 

Once deployed, invoke some of your app's workflows, run `slack activity`, then select your workspace and deployed app environment. In your output, you'll see all of your calls to `console.log` in addition to the workflow steps and function executions, [external auth information](/deno-slack-sdk/guides/integrating-with-services-requiring-external-authentication), and any errors encountered when running your app.

✨  **For more information about deploying your app**, refer to [deploy to Slack](/deno-slack-sdk/guides/deploying-to-slack).

