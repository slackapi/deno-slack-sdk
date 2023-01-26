import { SlackFunctionModTemplate, SlackFunctionTemplate } from "./template.ts";
import { getSlackFunctions, greenText } from "./utils.ts";

const slackFunctions = await getSlackFunctions();

// Sorting alphabetically cause only a monster would generate these in a random order
slackFunctions.sort((a, b) => a.callback_id.localeCompare(b.callback_id));

await slackFunctions.forEach(async (fn) => {
  console.log(
    `Generating code for Slack Function: ${greenText(fn.callback_id)}`,
  );
  const templateString = SlackFunctionTemplate(fn);
  const filename = `../${fn.callback_id}.ts`;

  await Deno.writeTextFile(filename, templateString);
});

console.log(`Wrote ${slackFunctions.length} files`);

const modString = SlackFunctionModTemplate(slackFunctions);

await Deno.writeTextFile("../mod.ts", modString);
console.log("Updated functions module export");
