import {
  getDefineFunctionInputs,
  isValidFunctionFile,
  loadFunctionsJson,
  redText,
  yellowText,
} from "./utils.ts";

const slackFunctions = getDefineFunctionInputs(
  await loadFunctionsJson(),
);

// We just need the CallbackIds here
const slackFunctionCallbackIds = new Set(
  slackFunctions.map((slackFunction) => slackFunction.callbackId),
);

const remove_file = async (filePath: string) => {
  try {
    await Deno.remove(filePath);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.warn(`Could not remove file!`);
      console.warn(`File not found: ${yellowText(filePath)}`);
    } else {
      throw error;
    }
  }
};

for await (const file of Deno.readDir(`../`)) {
  if (!isValidFunctionFile(file.name)) {
    continue;
  }
  const callback_id: string = file.name.split(".")[0];
  if (slackFunctionCallbackIds.has(callback_id)) {
    continue;
  }
  console.log(
    `Function ${callback_id} not found in function list, removing file ${
      redText(`${callback_id}.ts`)
    } `,
  );
  await remove_file(`../${callback_id}.ts`);
}
