import { getSlackFunctions, greenText } from "./utils.ts";
import { SlackTestFunctionTemplate } from "./test_template.ts";

const slackFunctions = await getSlackFunctions();

// Sorting alphabetically cause only a monster would generate these in a random order
slackFunctions.sort((a, b) => a.callback_id.localeCompare(b.callback_id));

const fileExists = async (filePath: string) => {
  try {
    await Deno.stat(filePath);
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    } else {
      console.error(error);
      throw error;
    }
  }
};

await slackFunctions.forEach(async (fn) => {
  const testFilePath = `../${fn.callback_id}_test.ts`;
  if (await fileExists(testFilePath)) {
    return;
  }
  console.log(
    `Generating unit test for Slack Function: ${greenText(fn.callback_id)}`,
  );
  const templateTestString = SlackTestFunctionTemplate(fn.callback_id);

  await Deno.writeTextFile(testFilePath, templateTestString);
});
