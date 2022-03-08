## Project

A Project defines your entire Slack application, from its core properties like its name and description to its behavioural
aspects like what [triggers][triggers] its functionality.

### Defining a Project

A Project can be defined with the top level `Project` export. Below is an example, taken from the template application:

```
import { Project } from "slack-cloud-sdk/mod.ts";
import { ReverseString } from "./functions/reverse.ts";
import { ReverseEchoString } from "./workflows/reverse_echo.ts";
import { ReverseEchoShortcut } from "./triggers/reverse_echo_shortcut.ts";

Project({
  name: "heuristic-tortoise-312",
  description:
    "A demo showing how to use Slack workflows, functions, and triggers",
  icon: "assets/icon.png",
  runtime: "deno1.x",
  botScopes: ["commands", "chat:write", "chat:write.public"],
  functions: [ReverseString],
  workflows: [ReverseEchoString],
  triggers: [ReverseEchoShortcut],
  tables: [],
  outgoingDomains: [],
});
```

The object passed into the `Project` method is the type [`SlackProjectType`][project-type]. Check out [its definition][project-type]
for the full list of attributes it supports, but the minimum required properties are listed in the table below:

|Property|Type|Description|
|---|---|---|
|`name`|string|Your Slack application name.|
|`description`|string|A short sentence describing your application.|
|`icon`|string|A relative path to an image asset to use for the application's icon.|
|`runtime`|string|Which runtime this application can execute in. Only acceptable value at this point in time is `deno1.x`.|
|`botScopes`|Array<string>|A list of [scopes][scopes], or permissions, the bot requires to function.|

Furthermore, to set up how your application works, you would create and define [triggers][triggers], [workflows][workflows]
and [functions][functions], and register them in the Project using the `triggers`, `workflows` and `functions` properties
of [`SlackProjectType`][project-type] argument used when creating a new `Project`.

[triggers]: ./triggers.md
[workflows]: ./workflows.md
[functions]: ./functions.md
[project-type]: ../src/types.ts#L20
[scopes]: https://api.slack.com/scopes
