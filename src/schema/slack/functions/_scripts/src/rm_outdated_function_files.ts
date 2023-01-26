import { FunctionsPayload } from "./types.ts";
import { SlackFunctionModTemplate, SlackFunctionTemplate } from "./template.ts";

const yellow = "\x1b[38;5;214m";
const reset = "\x1b[0m";
const colorizeText = (text: string) => yellow + text + reset;

const functionsPayload: FunctionsPayload = await Deno.readTextFile(
  "functions.json",
).then(JSON.parse);

// Filter out any non slack functions (i.e. has an app_id)
const slackFunctionCallbackIds = functionsPayload.functions.filter((fn) =>
  !fn.app_id
).map((slackFunction) => slackFunction.callback_id);

const remove_file = async (filePath: string) => {
  try {
    await Deno.remove(filePath);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.warn(`${filePath} was not found while trying to remove it`);
    } else {
      throw error;
    }
  }
};

for await (const file of Deno.readDir(`../`)) {
  if (file.name.endsWith("_test.ts")) {
    continue;
  }
  if (["_scripts", "mod.ts"].includes(file.name)) {
    continue;
  }
  const callback_id: string = file.name.split(".")[0];
  if (slackFunctionCallbackIds.includes(callback_id)) {
    console.log(file.name);
    continue;
  }
  await remove_file(`../${callback_id}.ts`);
}
