import { FunctionsPayload } from "./types.ts";
import { SlackFunctionModTemplate, SlackFunctionTemplate } from "./template.ts";

const yellow = "\x1b[38;5;214m";
const reset = "\x1b[0m";
const colorText = (text: string) => yellow + text + reset;

const functionsPayload: FunctionsPayload = await Deno.readTextFile(
  "functions.json",
).then(JSON.parse);

// Filter out any non slack functions (i.e. has an app_id)
const slackFunctions = functionsPayload.functions.filter((fn) => !fn.app_id);

// Sorting alphabetically cause only a monster would generate these in a random order
slackFunctions.sort((a, b) => a.callback_id.localeCompare(b.callback_id));

await slackFunctions.forEach(async (fn) => {
  console.log(
    `Generating code for Slack Function: ${colorText(fn.callback_id)}`,
  );
  const templateString = SlackFunctionTemplate(fn);
  const filename = `../${fn.callback_id}.ts`;

  await Deno.writeTextFile(filename, templateString);
});

console.log(`Wrote ${slackFunctions.length} files`);

const modString = SlackFunctionModTemplate(slackFunctions);

await Deno.writeTextFile("../mod.ts", modString);
console.log("Updated functions module export");
