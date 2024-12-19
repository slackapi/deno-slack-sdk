# Deno Slack SDK

<PaidPlanBanner />

You can create Slack-hosted workflows written in TypeScript using the [Deno Slack SDK](https://github.com/slackapi/deno-slack-sdk).

Workflows are a combination of functions, executed in order.

There are a three types of functions:
- **Slack functions** enable Slack-native actions, like creating a channel or sending a message.
- **Connector functions** enable actions native to services _outside_ of Slack. Google Sheets, Dropbox and Microsoft Excel are a few of the services with available connector functions.
- **Custom functions** enable developer-specific actions. Pass in any desired inputs, perform any actions you can code up, and pass on outputs to other parts of your workflows.

Workflows are invoked via triggers. You can invoke workflows:
- via a link within Slack,
- on a schedule,
- when specified events occurs, 
- or via webhooks. 

Workflows make use of specifically-designed features of the Slack platform such as [datastores](/deno-slack-sdk/guides/using-datastores), a Slack-hosted way to store data.

While in development, you can keep your project mostly to yourself, or share it with a close collaborator. If your Slack admin requires approval of app installations, they’ll need to approve what you’re creating first.

:::warning

The app management UI on `api.slack.com/apps` doesn’t support configuring workflow apps. Also, workflow apps are currently not eligible for listing in the Slack Marketplace.

::::

## Getting help

These docs have lots of information on the Deno Slack SDK. Please explore!

If you otherwise get stuck, we're here to help. The following are the best ways to get assistance working through your issue:

* [Issue Tracker](http://github.com/slackapi/deno-slack-sdk/issues) for questions, bug reports, feature requests, and general discussion related to Bolt for JavaScript. Try searching for an existing issue before creating a new one.
* [Email](mailto:support@slack.com) our developer support team: `support@slack.com`.


## Contributing

These docs live within the [Deno Slack SDK](https://github.com/slackapi/deno-slack-sdk/) repository and are open source.

We welcome contributions from everyone! Please check out our
[Contributor's Guide](https://github.com/slackapi/deno-slack-sdk/blob/main/.github/contributing.md) for how to contribute in a helpful and collaborative way.