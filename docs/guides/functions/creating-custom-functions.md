---
slug: /deno-slack-sdk/guides/creating-custom-functions
---

# Creating custom functions

<PaidPlanBanner />

Custom functions are how you define custom workflow steps.

They have three main components:

* **Inputs**, which can come from a workflow's [trigger](/deno-slack-sdk/guides/using-triggers) or the outputs of a previous step
* **Logic**, which is your own code that carries out your instructions,
* **Outputs**, which allows your function to pass on the result of its computations to follow-on steps in Workflow Builder

:::info

To protect your organization, external users (those outside your organization connected through Slack Connect) cannot use a workflow that contains [connector steps](/deno-slack-sdk/reference/connector-functions) or [workflow steps](https://api.slack.com/concepts/workflow-steps) built by your organization. This may manifest in a `home_team_only` warning. Refer to [this help center article](https://slack.com/help/articles/14844871922195-Slack-administration--Manage-workflow-usage-in-Slack-Connect-conversations#enterprise-grid-1) for more details.

:::

## Define a custom function {#define}

Functions are defined via the `DefineFunction` method, which is part of the [Slack SDK](https://github.com/slackapi/deno-slack-sdk) that is included with every newly-created project. Both the definition and implementation for your functions should live in the same file, so to keep your app organized, put all your function files in a `functions` folder in your app's root folder.

Let's take a look at the [`greeting_function.ts`](https://github.com/slack-samples/deno-hello-world/blob/main/functions/greeting_function.ts) within the [Hello World](https://github.com/slack-samples/deno-hello-world) sample app:

```javascript
// /slack-samples/deno-hello-world/functions/greeting_function.ts
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const GreetingFunctionDefinition = DefineFunction({
  callback_id: "greeting_function",
  title: "Generate a greeting",
  description: "Generate a greeting",
  source_file: "functions/greeting_function.ts",
  input_parameters: {
    properties: {
      recipient: {
        type: Schema.slack.types.user_id,
        description: "Greeting recipient",
      },
      message: {
        type: Schema.types.string,
        description: "Message to the recipient",
      },
    },
    required: ["message"],
  },
  output_parameters: {
    properties: {
      greeting: {
        type: Schema.types.string,
        description: "Greeting for the recipient",
      },
    },
    required: ["greeting"],
  },
});
```

Note that we import `DefineFunction`, which is used for defining our function, and also `SlackFunction`, which we'll use to implement our function in the [Implement a custom function](#implement) section.


### Custom function fields {#fields}

| Field | Description | Required? |
| ---- | ------------------ | --- |
| `callback_id` | A unique string identifier representing the function; max 100 characters. No other functions in your application may share a callback ID. Changing a function's callback ID is not recommended, as the function will be removed from the app and created under the new callback ID, breaking any workflows referencing the old function. | Required |
| `title` | A string to nicely identify the function. Max 255 characters. | Required |
| `source_file` | The relative path from the project root to the function handler file (i.e., the source file). _Remember to update this if you start nesting your functions in folders._ | Required |
| `description` | A succinct summary of what your function does. | Optional |
| [`input_parameters`](#input-output) | An object which describes one or more input parameters that will be available to your function. Each top-level property of this object defines the name of one input parameter available to your function.| Optional |
| [`output_parameters`](#input-output) | An object which describes one or more output parameters that will be returned by your function. Each top-level property of this object defines the name of one output parameter your function makes available. | Optional |

#### Input and output parameters {#input-output}

Functions can (and generally should) declare inputs and outputs. Inputs are declared in the `input_parameters` property, and outputs are declared in the `output_parameters` property.

A custom function's `input_parameters` and `output_parameters` properties have two sub-properties:
* `required`, which is how you can ensure that a function requires a specific parameter.
* `properties`, where you can list the specific parameters that your function accounts for.

Parameters are listed in the `properties` sub-property. The value for a parameter needs to be an object with further sub-properties:
  * `type`: The type of the input parameter. This can be a [built-in type](/deno-slack-sdk/reference/slack-types) or a [custom type](/deno-slack-sdk/guides/creating-a-custom-type) that you define.
  * `description`: A string description of the parameter.

For example, if you have an input parameter named `customer_id` that you want to be required, you can do so like this:

```javascript
input_parameters: {
  properties: {
    customer_id: {
      type: Schema.types.string,
      description: "The customer's ID"
    }
  },
  required: ["customer_id"]
}
```

If your input or output parameter is a [custom type](/deno-slack-sdk/guides/creating-a-custom-type) with required sub-properties, use the `DefineProperty` function to to ensure that each sub-property's required status is respected. Let's look at an example. Given an `input_parameter` of `msg_context` with three sub-properties, `message_ts`, `channel_id`, and `user_id`, this is how we would ensure that `message_ts` is required:

```javascript
const messageAlertFunction = DefineFunction({
   ...
   input_parameters: {
     properties: {
       msg_context: DefineProperty({
         type: Schema.types.object,
         properties: {
           message_ts: { type: Schema.types.string },
           channel_id: { type: Schema.types.string },
           user_id: { type: Schema.types.string },
         },
         required: ["message_ts"]
       })
     }
   },
 });
```

:::warning[Object types are not supported within Workflow Builder at this time]

If your function will be used within Workflow Builder, we suggest not using the Object types at this time. Check out [Typescript-friendly type definitions](/deno-slack-sdk/guides/creating-a-custom-type#define-property) for more details.

:::

While, strictly speaking, input and output parameters are optional, they are a common and standard way to pass data between functions and nearly any function you write will expect at least one input and pass along an output.

Functions are similar in philosophy to Unix system commands: they should be minimalist, modular, and reusable. Expect the output of one function to eventually become the input of another, with no other frame of reference.

After defining your custom function, declare it in your app's manifest file:

```javascript
// /manifest.ts

// Import the function
import { GreetingFunctionDefinition } from "./functions/greeting_function.ts"

// ...

export default Manifest({
  //...
  functions: [GreetingFunctionDefinition],
  //...
});
```

Once your function is defined in your app's manifest file, the next step is to implement the function in its respective source file.

## Implement a custom function {#implement}

To keep your project tidy, implement your functions in the same source file in which you defined them.

Implementation involves creating a `SlackFunction` default export. This example is again from the [`greeting_function.ts`](https://github.com/slack-samples/deno-hello-world/blob/main/functions/greeting_function.ts) within the [Hello World](https://github.com/slack-samples/deno-hello-world) sample app:

```javascript
// /slack-samples/deno-hello-world/functions/greeting_function.ts

}); // end of DefineFunction

export default SlackFunction(
  // Pass along the function definition from earlier in the source file
  GreetingFunctionDefinition,
  ({ inputs }) => { // Provide any context properties, like `inputs`, `env`, or `token`
    // Implement your function
    const { recipient, message } = inputs;
    const salutations = ["Hello", "Hi", "Howdy", "Hola", "Salut"];
    const salutation =
      salutations[Math.floor(Math.random() * salutations.length)];
    const greeting =
      `${salutation}, <@${recipient}>! :wave: Someone sent the following greeting: \n\n>${message}`;

    // Don't forget any required output parameters
    return { outputs: { greeting } };
  },
);
```

It is important to store your environment variables, as custom functions deployed to Slack will not run with the `--allow-env` permission. When locally running your app using `slack run`, the CLI will automatically load your local `.env` file and populate the `env` function input parameter. However, when deploying your app using `slack deploy`, the values you added using `slack env add` will be available in the `env` function input parameter. Refer to [environment variables](/slack-cli/guides/using-environment-variables-with-the-slack-cli) for more information.

Similarly, when using a [locally running your app](/deno-slack-sdk/guides/developing-locally), you can use `console.log` to emit information to the console. However, when your app is [deployed to production](/deno-slack-sdk/guides/deploying-to-slack), any `console.log` commands are available via `slack activity`. Check out our [Logging](/deno-slack-sdk/guides/logging-function-and-app-behavior) page for more.

When composing your functions, you can:

* leverage external APIs, and even store API credentials, using the CLI's [`slack env add`](/slack-cli/reference/commands/slack_env_add) command
* [call Slack API methods](/deno-slack-sdk/guides/calling-slack-api-methods) or [third-party APIs](https://api.slack.com/faq#third-party)
* store and retrieve data from [datastores](/deno-slack-sdk/guides/using-datastores)

You can also encapsulate your business logic separately from the function handler, then import what you need and build your functions that way.


:::info[Function timeouts]

When building workflows using functions, there is a 60 second timeout for a deployed function and a 15 second timeout for a locally-run function.

For deployed functions using a `block_suggestion`, `block_actions`, `view_submission`, or `view_closed` payload, there is a 10 second timeout.

If a top-level custom function has not finished running within its respective time limit, you will see an error in your log. Refer to [logging](/deno-slack-sdk/guides/logging-function-and-app-behavior) for more details. This error may differ when running the function locally versus a deployed function. For example, a function that calls a third-party API could complete outside of the timeout and return after Slack has already marked the function as timed out. Locally, this may result in a `token_revoked` error. If deployed, it would return an error that the timeout was reached.
 
If an [interactivity handler function](/deno-slack-sdk/guides/adding-interactivity#interactivity-handlers) times out, an error will render in the Slack client, but not in the logs. 

:::

### Function context properties {#context}

Your function handler's context supports several properties that you can use by declaring them.

Here are all the context properties available:

| Property | Kind | Description |
| ----- | ---- | ----------- |
| `env` | String | Represents environment variables available to your function's execution context. A locally running app gets its `env` properties populated via the local `.env` file. A deployed app gets its `env` properties populated via the CLI's [`slack env add`](/slack-cli/reference/commands/slack_env_add) command. |
| `inputs` |  Object | Contains the input parameters you defined as part of your function definition. |
| `client` |  Object | An API client ready for use in your function. Useful for [calling Slack API methods](/deno-slack-sdk/guides/calling-slack-api-methods). |
| `token` | String | Your application's access token.|
| `event` |  Object | Contains the full incoming event details. |
| `team_id` | String | The ID of your Slack workspace, i.e. T123ABC456. |
| `enterprise_id` | String | The ID of the owning enterprise organization, i.e. "E123ABC456". Only applicable for [Slack Enterprise Grid](https://api.slack.com/enterprise/grid) customers, otherwise its value will be set to an empty string. |

The object returned by your function supports the following properties:

| Property | Kind | Description |
| ------ | ---- | ----------- |
| `error` | String | Indicates the error that was encountered. If present, the function will return an error regardless of what is passed to outputs. |
| `outputs` | Object | Exactly matches the structure of your function definition's output_parameters. This is required unless an error is returned. |
| `completed` | Boolean | Indicates whether or not the function is completed. This defaults to `true`. |


➡️  **To keep building your app**, head to the [workflows](/deno-slack-sdk/guides/creating-workflows) section to learn how to add a custom function to a workflow.

➡️  **To learn how to distribute your custom function**, refer to the [custom function access guide](/deno-slack-sdk/guides/controlling-access-to-custom-functions)!

---

## Graceful errors {#error-handling}

To ensure that errors in your function are handled gracefully, consider wrapping your logic in a try-catch block, and ensure you're returning an empty `outputs` property along with an `error` property:

```js
import { SlackFunction } from "deno-slack-sdk/mod.ts";
import type { GetCustomerNameFunction } from "../manifest.ts";
import { GetCustomerInfo } from "../mycorp/get_customer_info.ts";

export default SlackFunction(
  GetCustomerNameFunction,
  async ({inputs, client}) => {
  console.log(`Getting profile for customer ID ${inputs.customer_id}...`);
  let response;
  try {
    response = await GetCustomerInfo(inputs.customer_id);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return {
        error: `Could not find customer where ID == ${inputs.customer_id}!`,
        outputs: {},
      };
    }
  }
  return {
    outputs: {
      first_name: response?.first_name,
      last_name: response?.last_name,
    },
  };
});

```

```js
// mycorp/get_customer_info.ts
export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
}
export default function GetCustomerInfo(id: number): Customer {
  if (id == 1) {
    const customer: Customer = {
      id: 1,
      first_name: "Some",
      last_name: "Person",
    };

    // Maybe here there's some third-party API we call
    return customer;
  } else {
    throw new Deno.errors.NotFound();
  }
}
```

## Testing custom functions {#testing}

During development, you may want to test your [custom functions](/deno-slack-sdk/guides/creating-custom-functions) before deploying them to production. You can do this by creating a unit test for each custom function you want to validate. Since we're developing in the [Deno](/deno-slack-sdk/guides/installing-deno) environment, we'll be working with the [`Deno.test` API](https://deno.land/manual/basics/testing#writing-tests).

Let's go through a couple of examples from our sample apps.

Using the `SlackFunctionTester`, we can specify the inputs to a function and then verify the outputs that function provides in order to ensure it is working properly. In other words, the `SlackFunctionTester` allows us to create the context for our function so that we can pass in the necessary parameters in order to test that function. Let's get started!

---

The first thing we'll do is create a new test file named after our function.

For example, in the [Hello World sample app](https://github.com/slack-samples/deno-hello-world), the file containing our function is called [`greeting_function.ts`](https://github.com/slack-samples/deno-hello-world/blob/main/functions/greeting_function.ts), and the file containing our test for the function is called [`greeting_function_test.ts`](https://github.com/slack-samples/deno-hello-world/blob/main/functions/greeting_function_test.ts).

We'll import our function into the test file as follows:

```javascript
import GreetingFunction from "./greeting_function.ts";
```

Then, we'll import `SlackFunctionTester` into the test file:

```javascript
import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
```

And, one more import &mdash; the specific Deno assertion method that we'll be using from the `Deno.test` API. In this case, we'll need the `assertEquals` method:

```javascript
import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
```

We can initialize an instance of the `SlackFunctionTester` we mentioned earlier to create a context for our function:

```javascript
const { createContext } = SlackFunctionTester("greeting_function");
```

To summarize our structure, here is the original file containing our function:

```javascript
// greeting_function.ts

import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const GreetingFunctionDefinition = DefineFunction({
  callback_id: "greeting_function",
  title: "Generate a greeting",
  description: "Generate a greeting",
  source_file: "functions/greeting_function.ts",
  input_parameters: {
    properties: {
      recipient: {
        type: Schema.slack.types.user_id,
        description: "Greeting recipient",
      },
      message: {
        type: Schema.types.string,
        description: "Message to the recipient",
      },
    },
    required: ["message"],
  },
  output_parameters: {
    properties: {
      greeting: {
        type: Schema.types.string,
        description: "Greeting for the recipient",
      },
    },
    required: ["greeting"],
  },
});

export default SlackFunction(
  GreetingFunctionDefinition,
  ({ inputs }) => {
    const { recipient, message } = inputs;
    const salutations = ["Hello", "Hi", "Howdy", "Hola", "Salut"];
    const salutation =
      salutations[Math.floor(Math.random() * salutations.length)];
    const greeting =
      `${salutation}, <@${recipient}>! :wave: Someone sent the following greeting: \n\n>${message}`;
    return { outputs: { greeting } };
  },
);
```

And here we have our test file with the items we imported and our instance of the `SlackFunctionTester`:

```javascript
// greeting_function_test.ts

import GreetingFunction from "./greeting_function.ts";
import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";

const { createContext } = SlackFunctionTester("greeting_function");

Deno.test("Greeting function test", async () => {
  const inputs = { message: "Welcome to the team!" };
  const { outputs } = await GreetingFunction(createContext({ inputs }));
  assertEquals(
    outputs?.greeting.includes("Welcome to the team!"),
    true,
  );
});
```

Once we pass in the text we expect our function to output, we compare the two values, then check to see if the values are indeed a match.

---

Let's look at another example, this time from the [GitHub Issue sample app](https://github.com/slack-samples/deno-github-functions).

Similarly to the Hello World example, we have a file containing our function called [`create_issue.ts`](https://github.com/slack-samples/deno-github-functions/blob/main/functions/create_issue.ts), and a file containing our test for the function, which is called [`create_issue_test.ts`](https://github.com/slack-samples/deno-github-functions/blob/main/functions/create_issue_test.ts). Let's look at the test file below:

```javascript
// create_issue_test.ts

import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";
import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
// import our original function as a handler
import handler from "./create_issue.ts";

mf.install();

mf.mock("POST@/api/apps.auth.external.get", () => {
  return new Response(`{"ok": true, "external_token": "example-token"}`);
});

mf.mock("POST@/repos/slack-samples/deno-github-functions/issues", () => {
  return new Response(
    `{"number": 123, "html_url": "https://www.example.com/expected-html-url"}`,
    {
      status: 201,
    },
  );
});

const { createContext } = SlackFunctionTester("create_issue");
const env = { logLevel: "CRITICAL" };

Deno.test("Create a GitHub issue with given inputs", async () => {
  const inputs = {
    githubAccessTokenId: {},
    url: "https://github.com/slack-samples/deno-github-functions",
    githubIssue: {
      title: "The issue title",
    },
  };
  const { outputs } = await handler(createContext({ inputs, env }));
  // Assert whether the collection of mocked URL responses we use as inputs matches the outputs from our function.
  assertEquals(outputs?.GitHubIssueNumber, 123);
  assertEquals(
    outputs?.GitHubIssueLink,
    "https://www.example.com/expected-html-url",
  );
});
```

This sample makes API calls to both Slack and GitHub, and therefore requires special mocking in its test. In the test, we'll import a module called [mock fetch](https://deno.land/x/mock_fetch). This module mocks Deno's [`fetch`](https://deno.land/manual/examples/fetch_data) method, which is used to make HTTP requests. We will use `mock_fetch` to mock the responses of the Slack API.

✨  **For more information about mocking responses**, refer to [mocking](https://deno.land/manual/basics/testing/mocking#mocking) and [mock_fetch](https://deno.land/x/mock_fetch).

### Running a test {#run-test}

From the command line, run [`deno test`](https://deno.land/manual/basics/testing#running-tests) and call the file that contains your test function, as in the following example:

```
$ deno test greeting_function_test.ts
```

If you're in the base directory for your project, run this command as follows:

```
$ deno test functions/greeting_function_test.ts
```

If you want to run all of your function tests, run this command without any file names as follows:

```
$ deno test
```

✨  **For more information about Deno's built-in test runner**, refer to [testing](https://deno.land/manual/basics/testing).

### Integrating a test into your CI/CD pipeline {#cicd-test}

For more information, refer to [Setting up CI/CD with the Slack CLI](/slack-cli/guides/setting-up-ci-cd-with-the-slack-cli).
