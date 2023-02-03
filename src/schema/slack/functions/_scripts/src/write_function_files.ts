import SlackFunctionTemplate from "./template_function.ts";
import SlackTestFunctionTemplate from "./test_template.ts";
import SlackFunctionModTemplate from "./template_mod.ts";
import { getSlackFunctions, greenText } from "./utils.ts";

const slackFunctions = await getSlackFunctions();

// Sorting alphabetically cause only a monster would generate these in a random order
slackFunctions.sort((a, b) => a.callback_id.localeCompare(b.callback_id));

slackFunctions.forEach(async (fn) => {
  console.log(
    `Generating code for Slack Function: ${greenText(fn.callback_id)}`,
  );
  const templateString = SlackFunctionTemplate(fn);
  const filename = `../${fn.callback_id}.ts`;

  await Deno.writeTextFile(filename, templateString);

  console.log(
    `Generating unit test for Slack Function: ${greenText(fn.callback_id)}`,
  );
  const templateTestString = SlackTestFunctionTemplate(fn);
  const testFilename = `../${fn.callback_id}_test.ts`;

  await Deno.writeTextFile(testFilename, templateTestString);
});

console.log(`Wrote ${slackFunctions.length * 2} files`);

const modString = SlackFunctionModTemplate(slackFunctions);

await Deno.writeTextFile("../mod.ts", modString);
console.log("Updated functions module export");
