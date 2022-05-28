import { FunctionParameter, FunctionsPayload } from "./types.ts";
import { SlackFunctionModTemplate, SlackFunctionTemplate } from "./template.ts";
import SchemaTypes from "../../../../schema_types.ts";
import SlackSchemaTypes from "../../../schema_types.ts";

const yellow = "\x1b[38;5;214m";
const reset = "\x1b[0m";
const colorText = (text: string) => yellow + text + reset;

const functionsPayload: FunctionsPayload = await Deno.readTextFile(
  "functions.json",
).then(JSON.parse);

// Filter out any non slack functions (i.e. has an app_id)
let slackFunctions = functionsPayload.functions.filter((fn) => !fn.app_id);

/*
  START: Temp filter out functions that use unsupported types
*/

const supportedTypes = {
  ...SchemaTypes,
  ...SlackSchemaTypes,
} as Record<string, unknown>;
const listOfSupportedTypes = Object.values(supportedTypes);
const isSupportedType = (type: string) => listOfSupportedTypes.includes(type);

const isUnsupportedParam = (param: FunctionParameter) => {
  if (!isSupportedType(param.type)) {
    console.log(`  ${param.type} is not supported`);
    return true;
  } else if (
    param.type === SchemaTypes.array &&
    !isSupportedType(param.items.type)
  ) {
    console.log(`  Array of ${param.items.type} is not supported`);
    return true;
  }
  return false;
};

slackFunctions = slackFunctions.filter((fn) => {
  const id = colorText(fn.callback_id);
  const fnParams = [
    ...fn.input_parameters ?? [],
    ...fn.output_parameters ?? [],
  ];
  console.log(`Checking ${id} built-in for unsupported params:`);
  const hasUnsupportedParams = fnParams.some(isUnsupportedParam);
  hasUnsupportedParams
    ? console.log(`  Cannot generate file: ${id}`)
    : console.log("  None found, generating file");
  return !hasUnsupportedParams;
});

/*
  END: Temp filter out functions that use unsupported types
*/

// Sorting alphabetically cause only a monster would generate these in a random order
slackFunctions.sort((a, b) => a.callback_id.localeCompare(b.callback_id));

await slackFunctions.forEach(async (fn) => {
  console.log(
    `Generating code for Slack Function: ${colorText(fn.callback_id)}`,
  );
  const templateString = SlackFunctionTemplate(fn);
  const filename = `../${fn.callback_id}.ts`;

  await Deno.writeTextFile(filename, templateString);
});

console.log(`Wrote ${slackFunctions.length} files`);

const modString = SlackFunctionModTemplate(slackFunctions);

await Deno.writeTextFile("../mod.ts", modString);
console.log("Updated functions module export");
