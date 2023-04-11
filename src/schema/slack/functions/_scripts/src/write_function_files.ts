import SlackFunctionTemplate from "./templates/template_function.ts";
import SlackTestFunctionTemplate from "./templates/test_template.ts";
import SlackFunctionModTemplate from "./templates/template_mod.ts";
import { getSlackFunctions, greenText, redText } from "./utils.ts";
import { FunctionRecord } from "./types.ts";

const VALID_FILENAME_REGEX = /^[0-9a-zA-Z_\-]+$/;

const slackFunctions: FunctionRecord[] = await getSlackFunctions();

// Sorting alphabetically cause only a monster would generate these in a random order
slackFunctions.sort((a, b) => a.callback_id.localeCompare(b.callback_id));

await Promise.all(
  slackFunctions.map(async (functionRecord: FunctionRecord) => {
    console.log(
      `Generating code & tests for Slack function: ${
        greenText(functionRecord.callback_id)
      }`,
    );
    if (!VALID_FILENAME_REGEX.test(functionRecord.callback_id)) {
      console.log(
        `${redText("FAILURE:")} Invalid characters in callback_id: ${
          redText(functionRecord.callback_id)
        }`,
      );
      return;
    }
    const filename = `../${functionRecord.callback_id}.ts`;
    const testFilename = `../${functionRecord.callback_id}_test.ts`;

    const templateString = SlackFunctionTemplate(functionRecord);
    const templateTestString = SlackTestFunctionTemplate(functionRecord);

    await Deno.writeTextFile(filename, templateString);
    await Deno.writeTextFile(testFilename, templateTestString);
  }),
);

console.log(
  `Generated ${slackFunctions.length} Slack functions with their unit tests`,
);

const modString = SlackFunctionModTemplate(slackFunctions);

await Deno.writeTextFile("../mod.ts", modString);
console.log("Updated functions module export");
