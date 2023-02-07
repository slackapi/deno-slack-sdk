import SlackFunctionTemplate from "./templates/template_function.ts";
import SlackTestFunctionTemplate from "./templates/test_template.ts";
import SlackFunctionModTemplate from "./templates/template_mod.ts";
import { getSlackFunctions, greenText, loadFunctionsJson } from "./utils.ts";
import { FunctionRecord } from "./types.ts";

const slackFunctions: FunctionRecord[] = getSlackFunctions(
  await loadFunctionsJson(),
);

// Sorting alphabetically cause only a monster would generate these in a random order
slackFunctions.sort((a, b) => a.callback_id.localeCompare(b.callback_id));

slackFunctions.forEach(async (functionRecord: FunctionRecord) => {
  console.log(
    `Generating code for Slack Function: ${
      greenText(functionRecord.callback_id)
    }`,
  );
  const templateString = SlackFunctionTemplate(functionRecord);
  const filename = `../${functionRecord.callback_id}.ts`;

  await Deno.writeTextFile(filename, templateString);

  console.log(
    `Generating unit test for Slack Function: ${
      greenText(functionRecord.callback_id)
    }`,
  );
  const templateTestString = SlackTestFunctionTemplate(functionRecord);
  const testFilename = `../${functionRecord.callback_id}_test.ts`;

  await Deno.writeTextFile(testFilename, templateTestString);
});

console.log(`Wrote ${slackFunctions.length * 2} files`);

const modString = SlackFunctionModTemplate(slackFunctions);

await Deno.writeTextFile("../mod.ts", modString);
console.log("Updated functions module export");
