import { parse } from "https://deno.land/std@0.185.0/flags/mod.ts";

const flags = parse(Deno.args, {
  string: ["import-map", "sdk"],
  default: {
    "import-map": `${Deno.cwd()}/import_map.json`,
    "sdk": "../deno-slack-sdk/src/",
  },
});

const importMapJsonIn = await Deno.readTextFile(flags["import-map"]);
console.log("`import_map.json` in content:", importMapJsonIn);

const importMap = JSON.parse(importMapJsonIn);
importMap["imports"]["deno-slack-sdk/"] = flags.sdk;

const importMapJsonOut = JSON.stringify(importMap);
console.log("`import_map.json` out content:", importMapJsonOut);
await Deno.writeTextFile(flags["import-map"], importMapJsonOut);
