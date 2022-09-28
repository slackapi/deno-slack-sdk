// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
  typeCheck: false,
  entryPoints: ["./src/mod.ts"],
  outDir: "./npm",
  // ensures that the emitted package is compatible with node v14 later
  compilerOptions: {
    target: "ES2020"
  },
  shims: {
    // see JS docs for overview and more options
    deno: true,
    // custom shims
    custom: [{
      package: {
        name: "node-fetch",
        // Please see: https://www.npmjs.com/package/node-fetch-commonjs
        version: "2.6.7", 
      },
      globalNames: [{
        name: "fetch",
        exportName: "default"
      }]
    }],
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
  },
});

// post build steps
Deno.copyFileSync("README.md", "npm/README.md");
