import { FunctionsPayload } from "./types.ts";

const FUNCTIONS_JSON_PATH = "functions.json";
const DIRECTORY_PATH_ALLOW_LIST = ["_scripts", "mod.ts"];

const green = "\x1b[92m";
const yellow = "\x1b[38;5;214m";
const red = "\x1b[91m";
const reset = "\x1b[0m";

export const greenText = (text: string) => green + text + reset;
export const yellowText = (text: string) => yellow + text + reset;
export const redText = (text: string) => red + text + reset;

export const isValidFunctionFile = (fileName: string) =>
  !(fileName.endsWith("_test.ts") ||
    DIRECTORY_PATH_ALLOW_LIST.includes(fileName));

export const getSlackFunctions = async () => {
  const functionsPayload: FunctionsPayload = await Deno.readTextFile(
    FUNCTIONS_JSON_PATH,
  ).then(JSON.parse);

  // Filter out any non slack functions (i.e. has an app_id)
  return functionsPayload.functions.filter((fn) => !fn.app_id);
};
