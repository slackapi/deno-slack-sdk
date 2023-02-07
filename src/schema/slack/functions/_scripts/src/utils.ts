import {
  ParameterDefinition,
  TypedObjectProperties,
} from "../../../../../parameters/definition_types.ts";
import {
  ManifestFunctionParameters,
  ManifestFunctionSchema,
} from "../../../../../manifest/manifest_schema.ts";
import {
  DefineFunctionInput,
  FunctionParameter,
  FunctionProperty,
  FunctionRecord,
  FunctionsPayload,
} from "./types.ts";

type ParameterDefinitionProxy = {
  type: string;
  [key: string]:
    | string
    | boolean
    | string[]
    | { type: string }
    | TypedObjectProperties;
};

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
  param: FunctionProperty,
): ParameterDefinition => {
  const paramDef: ParameterDefinitionProxy = {
    type: param.type,
  };
  if (param.description) {
    paramDef.description = param.description;
  }
  if ("items" in param) {
    paramDef.items = param.items;
  }
  if ("properties" in param) {
    const properties: TypedObjectProperties = {};
    Object.entries(param.properties).forEach(([propertyKey, propertyValue]) => {
      properties[propertyKey] = getParameterDefinition(propertyValue);
    });
    paramDef.additionalProperties = param.additionalProperties;
    paramDef.required = param.required;
    paramDef.properties = properties;
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
      (p) => p.name,
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
    callbackId: functionRecord.callback_id,
    ...getManifestFunctionSchema(functionRecord),
  };
}
