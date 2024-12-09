# App manifest

An app's [manifest](/concepts/manifests) is where you can configure its name and scopes, declare the functions your app will use, and [more](#manifest-properties). 

The manifest file, named `manifest.ts` is located within the root of your directory. Inside the manifest file, you will find an `export default Manifest` block that defines the app's configuration. 

For an example, below is an annotated version of the manifest for our [Hello World app](https://github.com/slack-samples/deno-hello-world):

```javascript
// manifest.ts
import { Manifest } from "deno-slack-sdk/mod.ts";
// Import your workflow
import GreetingWorkflow from "./workflows/greeting_workflow.ts";

export default Manifest({
  
  // This is the internal name for your app.
  // It can contain spaces (e.g., "My App")
  name: "deno-hello-world",

  // A description of your app that will help users decide whether to use it.
  description: "A sample that demonstrates using a function, workflow and trigger to send a greeting",

  // Your app's profile picture that will appear in the Slack client.
  icon: "assets/default_new_app_icon.png",

  // A list of all workflows your app will use.
  workflows: [GreetingWorkflow],

  // If your app communicates to any external domains, list them here.
  outgoingDomains: [], // e.g., myapp.tld

  // Bot scopes can be declared here.
  // For the beta, you can keep these as-is.
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
```

## Manifest properties {#manifest-properties}

|Property|Type|Description| Required? |
|---|---|---|-----|
| `name` | String | The internal name for your app. It can contain spaces (e.g., "My App") | Required |
| `description` |String| A short sentence describing your application. A description of your app that will help users decide whether to use it | Required |
| `icon` | String | A relative path to an image asset to use for the app's icon. Your app's profile picture that will appear in the Slack client. Note this icon is only used if the app is deployed with `slack deploy`. | Required |
| `botScopes` | Array of Strings | A list of bot [scopes](/scopes?filter=granular_bot), or permissions, the app's functions require | Required |
| `displayName` | String | A custom name for the app to be displayed that's different from the `name` | Optional |
| `longDescription` | String| A more detailed description of your application | Optional |
| `backgroundColor` | String | A six digit combination of numbers and letters (the hexadecimal color code) that make up the color of your app background e.g., "#000000" is the color black | Optional |
| `functions` | Array | A list of all functions your app will use | Optional |
| `workflows` | Array | A list of all workflows your app will use | Optional |
| `outgoingDomains` | Array of Strings | As of [`v1.15.0`](/changelog#entry-november_2022_0): if your app communicates to any external domains, list them here. If you make API calls to `slack.com`, it does not need to be explicitly listed. e.g., myapp.tld | Optional |
| `events` | Array | A list of all event structures that the app is expecting to be passed via [Message Metadata](/metadata/using) | Optional |
| `types` | Array | A list of all [custom types](/automation/types/custom) your app will use | Optional |
| `datastores` | Array | A list of all [Datastores](/automation/datastores) your app will use | Optional |
| `features` | Object | A configuration object of your app features | Optional |

### More on outgoing domains {#outgoing-domains}

[Deno](/automation/deno/install) requires explicit permission to access external resources. Therefore, to make HTTP requests to external domains, you'll need to add the domain to your app manifest as an outgoing domain. Otherwise, you may run into a `PermissionDenied: Detected missing network permissions` error.

## Function definitions in the manifest {#functions}

You may also see some function definitions in the manifest file. While [Slack functions](/automation/functions) _can_ be defined here, to keep your code tidy, we recommend defining your functions in their own respective source files in your app's `/functions` directory.

Regardless of where you define them, each function your app uses must be declared in the manifest.

## The Messages tab {#messages-tab}

By default, apps created with `slack create` will include both a read-only Messages tab and an About tab within Slack.

You can use the [Slack function](/automation/functions) [`SendDm`](/reference/functions/send_dm) to send users direct messages from your app&mdash;which will appear for them in the app's Messages tab.

Your app's Messages tab will be enabled and read-only by default. If you'd like to disable read-only mode and/or disable the Messages tab completely, add the optional `features` property to your manifest definition like this:

```javascript
// manifest.ts
import { Manifest } from "deno-slack-sdk/mod.ts";
import GreetingWorkflow from "./workflows/greeting_workflow.ts";

export default Manifest({
  name: "deno-hello-world",
  description:
    "A sample that demonstrates using a function, workflow and trigger to send a greeting",
  icon: "assets/default_new_app_icon.png",
  workflows: [GreetingWorkflow],
  outgoingDomains: [],
  // Add this ------
  features: {
    appHome: {
      messagesTabEnabled: false,
      messagesTabReadOnlyEnabled: false,
    },
  },
  // ---------------
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
```
---

➡️ **To keep building your new app**, head to the [Slack functions](/automation/functions) section.