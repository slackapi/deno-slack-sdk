// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
  typeCheck: false,
  test: false,
  entryPoints: ["./src/mod.ts"],
  outDir: "./npm",
  // ensures that the emitted package is compatible with node v14 later
  compilerOptions: {
    lib: ["es2022.error"], // fix ErrorOptions not exported
    target: "ES2020",
  },
  shims: {
    // see JS docs for overview and more options
    deno: true,
    // Shim fetch, File, FormData, Headers, Request, and Response 
    undici: true,
  },
  package: {
    // package.json properties
    name: "@slack/deno-slack-sdk",
    version: Deno.args[0],
    description: "Official library for using Deno Slack SDK in node Slack apps",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/slackapi/deno-slack-sdk.git",
    },
    bugs: {
      url: "https://github.com/slackapi/deno-slack-sdk/issues",
    },
    // sets the minimum engine to node v14
    // as of writing, dnt transpilation-generated code
    // seems to only be able to successfully compile as far back ES2020
    engines: {
      "node": ">=14.20.1",
      "npm": ">=6.14.15",
    },
  },
});

// post build steps
Deno.copyFileSync("README.md", "npm/README.md");
