import SlackFunctionTemplate from "./templates/template_function.ts";
import SlackTestFunctionTemplate from "./templates/test_template.ts";
import SlackFunctionModTemplate from "./templates/template_mod.ts";
import {
  getDefineFunctionInputs,
  greenText,
  loadFunctionsJson,
} from "./utils.ts";
import { DefineFunctionInput } from "./types.ts";

const slackFunctions: DefineFunctionInput[] = getDefineFunctionInputs(
  await loadFunctionsJson(),
);

// Sorting alphabetically cause only a monster would generate these in a random order
slackFunctions.sort((a, b) => a.callbackId.localeCompare(b.callbackId));

slackFunctions.forEach(async (dfi: DefineFunctionInput) => {
  console.log(
    `Generating code for Slack Function: ${greenText(dfi.callbackId)}`,
  );
  const templateString = SlackFunctionTemplate(dfi);
  const filename = `../${dfi.callbackId}.ts`;

  await Deno.writeTextFile(filename, templateString);

  console.log(
    `Generating unit test for Slack Function: ${greenText(dfi.callbackId)}`,
  );
  const templateTestString = SlackTestFunctionTemplate(dfi);
  const testFilename = `../${dfi.callbackId}_test.ts`;

  await Deno.writeTextFile(testFilename, templateTestString);
});

console.log(`Wrote ${slackFunctions.length * 2} files`);

const modString = SlackFunctionModTemplate(slackFunctions);

await Deno.writeTextFile("../mod.ts", modString);
console.log("Updated functions module export");
