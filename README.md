<h1 align="center">
  Deno Slack SDK
  <br>
</h1>

<p align="center">
  <i align="center">This is the SDK for the Deno Runtime of Slack custom functions.</i>
</p>

<p align="center">
    <img alt="deno.land version" src="https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Flatest-version%2Fx%2Fdeno_slack_sdk%2Fmod.ts">
    <img alt="deno dependencies" src="https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Fupdates%2Fx%2Fdeno_slack_sdk%2Fmod.ts">
    <img alt="Samples Integration Type-checking" src="https://github.com/slackapi/deno-slack-sdk/workflows/Samples%20Integration%20Type-checking/badge.svg">
  </a>
</p>

## Requirements

A recent version of `deno`.

## Versioning

Releases for this repository follow the [SemVer](https://semver.org/) versioning
scheme. The SDK's contract is determined by the top-level exports from
`src/mod.ts` and `src/types.ts`. Exports not included in these files are deemed
internal and any modifications will not be treated as breaking changes. As such,
internal exports should be treated as unstable and used at your own risk.

## Running Tests

If you make changes to this repo, or just want to make sure things are working
as desired, you can run:

    deno task test

To get a full test coverage report, run:

    deno task coverage

---

### Getting Help

We welcome contributions from everyone! Please check out our
[Contributor's Guide](.github/CONTRIBUTING.md) for how to contribute in a
helpful and collaborative way.
