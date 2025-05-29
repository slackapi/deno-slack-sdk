import { parseArgs } from "jsr:@std/cli@1.0.17/parse-args";
import { dirname, join, relative } from "jsr:@std/path@1.1.0";

const flags = parseArgs(Deno.args, {
  string: ["import-file", "sdk"],
  default: {
    "import-file": `${Deno.cwd()}/deno.jsonc`,
    "sdk": "./deno-slack-sdk/",
  },
});

const importFilePath = await Deno.realPath(flags["import-file"]);
const importFileDir = dirname(importFilePath);
const sdkDir = await Deno.realPath(flags.sdk);

const importFileJsonIn = await Deno.readTextFile(importFilePath);
console.log(`content in ${importFilePath}:`, importFileJsonIn);

const sdkPackageSpecifier = join(
  relative(importFileDir, sdkDir),
  "/src/",
);

const importMap = JSON.parse(importFileJsonIn);
importMap["imports"]["deno-slack-sdk/"] = sdkPackageSpecifier;

const importMapJsonOut = JSON.stringify(importMap);
console.log("`import file` out content:", importMapJsonOut);
await Deno.writeTextFile(importFilePath, importMapJsonOut);
