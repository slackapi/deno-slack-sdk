import {
  ArrayFunctionProperty,
  FunctionProperty,
  FunctionRecord,
  FunctionsPayload,
  ObjectFunctionProperty,
} from "./types.ts";

const FUNCTIONS_JSON_PATH = "functions.json";

const green = "\x1b[92m";
const yellow = "\x1b[38;5;214m";
const red = "\x1b[91m";
const reset = "\x1b[0m";

export const greenText = (text: string) => green + text + reset;
export const yellowText = (text: string) => yellow + text + reset;
export const redText = (text: string) => red + text + reset;

export async function getSlackFunctions(
  functionsPayloadPath: string = FUNCTIONS_JSON_PATH,
): Promise<FunctionRecord[]> {
  const functionsPayload: FunctionsPayload = await Deno.readTextFile(
    functionsPayloadPath,
  ).then(JSON.parse);

  return functionsPayload.functions.filter((fn) => fn.type == "builtin");
}

export function isObjectFunctionProperty(
  property: FunctionProperty,
): property is ObjectFunctionProperty {
  return "properties" in property;
}

export function isArrayFunctionProperty(
  property: FunctionProperty,
): property is ArrayFunctionProperty {
  return "items" in property;
}
