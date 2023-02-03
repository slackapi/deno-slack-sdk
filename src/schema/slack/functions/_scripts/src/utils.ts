import {
  ParameterDefinition,
} from "../../../../../parameters/definition_types.ts";
import {
  ManifestFunctionParameters,
  ManifestFunctionSchema,
} from "../../../../../manifest/manifest_schema.ts";
import {
  DefineFunctionInput,
  FunctionParameter,
  FunctionRecord,
  FunctionsPayload,
} from "./types.ts";

const FUNCTIONS_JSON_PATH = "functions.json";
const DIRECTORY_PATH_ALLOW_LIST = ["_scripts", "mod.ts"];

const green = "\x1b[92m";
const yellow = "\x1b[38;5;214m";
const red = "\x1b[91m";
const reset = "\x1b[0m";

export const greenText = (text: string) => green + text + reset;
export const yellowText = (text: string) => yellow + text + reset;
export const redText = (text: string) => red + text + reset;

export function isValidFunctionFile(fileName: string) {
  return !(fileName.endsWith("_test.ts") ||
    DIRECTORY_PATH_ALLOW_LIST.includes(fileName));
}

export async function loadFunctionsJson(): Promise<FunctionsPayload> {
  return await Deno.readTextFile(
    FUNCTIONS_JSON_PATH,
  ).then(JSON.parse);
}

export function getDefineFunctionInputs(
  functionsPayload: FunctionsPayload,
): DefineFunctionInput[] {
  // Filter out any non slack functions (i.e. has an app_id) parse to DefineFunctionInput
  return functionsPayload.functions.reduce<DefineFunctionInput[]>(
    (result, fn) => {
      if (!fn.app_id) {
        result.push(getDefineFunctionInput(fn));
      }
      return result;
    },
    [],
  );
}

const getParameterDefinition = (
  param: FunctionParameter,
): ParameterDefinition => {
  // deno-lint-ignore no-explicit-any
  const paramDef: { [key: string]: any } = {
    type: param.type,
  };
  if (param.description) {
    paramDef.description = param.description;
  }
  if (param.items) {
    paramDef.items = param.items;
  }
  if (param.properties) {
    paramDef.properties = {};
    Object.entries(param.properties).forEach(([propertyKey, propertyValue]) => {
      paramDef.properties[propertyKey] = getParameterDefinition(propertyValue);
    });
    paramDef.additionalProperties = param.additionalProperties;
    paramDef.required = param.required;
  }
  return paramDef as ParameterDefinition;
};

const getManifestFunctionParameters = (
  functionParameters: FunctionParameter[],
): ManifestFunctionParameters => {
  return {
    properties: Object.fromEntries<ParameterDefinition>(
      functionParameters.map((p) => [p.name!, getParameterDefinition(p)]),
    ),
    required: functionParameters.filter((p) => p.is_required).map(
      (p) => p.name!,
    ),
  };
};

export function getManifestFunctionSchema(
  functionRecord: FunctionRecord,
): ManifestFunctionSchema {
  return {
    source_file: "",
    title: functionRecord.title,
    description: functionRecord.description,
    input_parameters: getManifestFunctionParameters(
      functionRecord.input_parameters,
    ),
    output_parameters: getManifestFunctionParameters(
      functionRecord.output_parameters,
    ),
  };
}

export function getDefineFunctionInput(
  functionRecord: FunctionRecord,
): DefineFunctionInput {
  return {
    ...getManifestFunctionSchema(functionRecord),
    ...{
      callbackId: functionRecord.callback_id,
    },
  };
}
