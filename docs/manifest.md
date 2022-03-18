## Manifest

A Manifest defines your entire Slack application, from its core properties like its name and description to its behavioural
aspects like what [functions][functions] it contains.

### Defining a Manifest

A Manifest can be defined with the top level `Manifest` export. Below is an example, taken from the template application:

```
import { Manifest } from "slack-cloud-sdk/mod.ts";
import { ReverseString } from "./functions/reverse.ts";

Manifest({
  name: "heuristic-tortoise-312",
  description:
    "A demo showing how to use Slack functions",
  icon: "assets/icon.png",
  runtime: "deno1.x",
  botScopes: ["commands", "chat:write", "chat:write.public"],
  functions: [ReverseString],
  tables: [],
  outgoing_domains: [],
});
```

The object passed into the `Manifest` method is the type [`SlackManifestType`][manifest-type]. Check out [its definition][manifest-type]
for the full list of attributes it supports, but the minimum required properties are listed in the table below:

|Property|Type|Description|
|---|---|---|
|`name`|string|Your Slack application name.|
|`description`|string|A short sentence describing your application.|
|`icon`|string|A relative path to an image asset to use for the application's icon.|
|`runtime`|string|Which runtime this application can execute in. Only acceptable value at this point in time is `deno1.x`.|
|`botScopes`|Array<string>|A list of [scopes][scopes], or permissions, the bot requires to function.|

Furthermore, to set up how your application works, you would create
[functions][functions], and register them in the Manifest using the `functions` property
of [`SlackManifestType`][manifest-type] argument used when creating a new `Manifest`.

[functions]: ./functions.md
[manifest-type]: ../src/types.ts#L12
[scopes]: https://api.slack.com/scopes