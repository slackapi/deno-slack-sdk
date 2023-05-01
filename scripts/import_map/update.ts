import { parse } from "https://deno.land/std@0.185.0/flags/mod.ts";

const flags = parse(Deno.args, {
  string: ["import-map", "sdk"],
  default: {
    "import-map": `${Deno.cwd()}/import_map.json`,
    "sdk": "../deno-slack-sdk/src/",
  },
});

const importMap = JSON.parse(await Deno.readTextFile(flags["import-map"]));
importMap["imports"]["deno-slack-sdk/"] = flags.sdk;
await Deno.writeTextFile(flags["import-map"], JSON.stringify(importMap));
