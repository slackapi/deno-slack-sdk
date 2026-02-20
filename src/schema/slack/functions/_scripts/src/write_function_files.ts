import {
  SlackFunctionModTemplate,
  SlackFunctionTemplate,
  SlackTestFunctionTemplate,
} from "./templates/mod.ts";
import { getSlackFunctions, greenText, redText } from "./utils.ts";
import type { FunctionRecord } from "./types.ts";

const VALID_FILENAME_REGEX = /^[0-9a-zA-Z_\-]+$/;

async function main() {
  const slackFunctions: FunctionRecord[] = await _internals.getSlackFunctions();

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

      const templateString = _internals.SlackFunctionTemplate(functionRecord);
      const templateTestString = _internals.SlackTestFunctionTemplate(
        functionRecord,
      );

      await _internals.writeTextFile(filename, templateString);
      await _internals.writeTextFile(testFilename, templateTestString);
    }),
  );

  console.log(
    `Generated ${slackFunctions.length} Slack functions with their unit tests`,
  );

  const modString = _internals.SlackFunctionModTemplate(slackFunctions);

  await _internals.writeTextFile("../mod.ts", modString);
  console.log("Updated functions module export");
}

export const _internals = {
  main,
  getSlackFunctions,
  SlackFunctionModTemplate,
  SlackFunctionTemplate,
  SlackTestFunctionTemplate,
  writeTextFile: (
    path: string,
    data: string,
    options?: Deno.WriteFileOptions,
  ): ReturnType<typeof Deno.writeTextFile> => {
    return Deno.writeTextFile(path, data, options);
  },
};

if (import.meta.main) {
  _internals.main();
}
