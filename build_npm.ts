// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./src/mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "test-deno-slack-sdk",
    version: Deno.args[0],
    description: "Deno Slack SDK published to NPM to be consumed in node Slack apps",
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