# Deno Slack SDK

This is the SDK for the Deno Runtime of Slack custom functions.

## Requirements

A recent version of `deno`.

## Documentation

Check out the [`./docs`](./docs) directory!

## Versioning

Releases for this repository follow the [SemVer](https://semver.org/) versioning scheme. The SDK's contract is determined by the top-level exports from `src/mod.ts` and `src/types.ts`. Exports not included in these files are deemed internal and any modifications will not be treated as breaking changes. As such, internal exports should be treated as unstable and used at your own risk.

## Running Tests

If you make changes to this repo, or just want to make sure things are working as desired, you can run:

    deno task test

To get a full test coverage report, run:

    deno task coverage

---

### Getting Help

We welcome contributions from everyone! Please check out our
[Contributor's Guide](.github/CONTRIBUTING.md) for how to contribute in a
helpful and collaborative way.
