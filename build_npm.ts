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
    name: "@slack/deno-slack-sdk",
    version: Deno.args[0],
    description: "Test deno sdk dpendencies",
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
// Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");