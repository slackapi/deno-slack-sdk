import { pascalCase } from "https://deno.land/x/case@v2.1.0/mod.ts";
import SchemaTypes from "../../../../schema_types.ts";
import SlackSchemaTypes from "../../../schema_types.ts";
import { FunctionParameter, FunctionRecord } from "./types.ts";

// TODO: Add a timestamp to this
const autogeneratedComment = () => {
  return "/** This is an autogenerated file. Run ./.slack/sdk/schema/slack/functions/_scripts/generate to rebuild **/";
};

const templatizeRequiredParams = (params: FunctionParameter[]) => {
  const requiredParams: string[] = params.filter((p) => p.is_required).map(
    (p) => p.name,
  );

  return JSON.stringify(requiredParams);
};

const templatizeParams = (
  params: FunctionParameter[],
  useTypeValue = false,
) => {
  const paramEntries = params.map((p) => templatizeParam(p, useTypeValue)).join(
    ",",
  );
  return `{ ${paramEntries} }`;
};

const schemaTypeMap: Record<string, string> = {
  [SchemaTypes.string]: "SchemaTypes.string",
  [SchemaTypes.integer]: "SchemaTypes.integer",
  [SchemaTypes.number]: "SchemaTypes.number",
  [SchemaTypes.boolean]: "SchemaTypes.boolean",
  [SchemaTypes.object]: "SchemaTypes.object",
  [SchemaTypes.array]: "SchemaTypes.array",
  [SlackSchemaTypes.user_id]: "SlackTypes.user_id",
  [SlackSchemaTypes.channel_id]: "SlackTypes.channel_id",
  [SlackSchemaTypes.usergroup_id]: "SlackTypes.usergroup_id",
  [SlackSchemaTypes.timestamp]: "SlackTypes.timestamp",
  [SlackSchemaTypes.blocks]: "SlackTypes.blocks",
};

const appendItems = (param: FunctionParameter) => {
  if (param.items) {
    return `items:{
       type: "${param.items.type}"
    },`;
  }
  return "";
};

const templatizeParam = (param: FunctionParameter, useTypeValue = false) => {
  const paramDef = `{
    type: ${useTypeValue ? `"${param.type}"` : schemaTypeMap[param.type]},
    description: "${param.description}",
    ${appendItems(param)}
  }`;
  return `${param.name}: ${paramDef}`;
};

const getSchemaTypeImport = (fn: FunctionRecord) => {
  const needsImport = [
    ...fn?.input_parameters ?? [],
    ...fn?.output_parameters ?? [],
  ].some((p) => (Object.values(SchemaTypes) as string[]).includes(p.type));

  return needsImport ? 'import SchemaTypes from "../../schema_types.ts";' : "";
};

const getSlackSchemaTypeImport = (fn: FunctionRecord) => {
  const needsImport = [
    ...fn?.input_parameters ?? [],
    ...fn?.output_parameters ?? [],
  ].some((p) => (Object.values(SlackSchemaTypes) as string[]).includes(p.type));

  return needsImport ? 'import SlackTypes from "../schema_types.ts";' : "";
};
export const SlackFunctionTemplate = (fn: FunctionRecord) => {
  const schemaTypesImport = getSchemaTypeImport(fn);
  const slackSchemaTypesImport = getSlackSchemaTypeImport(fn);

  let paramsString = "";
  if (fn.input_parameters) {
    paramsString = `input_parameters: {
      required: ${templatizeRequiredParams(fn.input_parameters)},
      properties: ${templatizeParams(fn.input_parameters, false)}
    }`;
  }
  if (fn.output_parameters) {
    if (paramsString !== "") {
      paramsString += ",";
    }
    paramsString += `output_parameters: {
      required: ${templatizeRequiredParams(fn.output_parameters)},
      properties: ${templatizeParams(fn.output_parameters, false)}
    }`;
  }

  return `
${autogeneratedComment()}
import { DefineFunctionStatic } from "../../../functions/mod.ts";${schemaTypesImport}${slackSchemaTypesImport}

export default DefineFunctionStatic(
  "slack#/functions/${fn.callback_id}",
  {
    title: "${fn.title}",
    description: "${fn.description}",
    ${paramsString}
  },
);

`;
};

export const SlackFunctionModTemplate = (slackFunctions: FunctionRecord[]) => {
  const callbackIds = slackFunctions.map((fn) => fn.callback_id);
  const importStrings = callbackIds.map(renderImport).join("\n");

  const functionProps = slackFunctions.map((fn) =>
    renderFunctionPropWithType(fn)
  )
    .join(",");

  return `
${autogeneratedComment()}
import { SlackFunction } from '../../../functions/mod.ts'
import { ParameterSetDefinition, RequiredParameters } from "../../../parameters/mod.ts";
${importStrings}

const SlackFunctions = {
  ${functionProps}
} as const;

export default SlackFunctions;
`;
};

const renderImport = (callbackId: string) => {
  const functionName = pascalCase(callbackId);
  return `import ${functionName} from "./${callbackId}.ts";`;
};

const renderFunctionPropWithType = (fn: FunctionRecord) => {
  const functionName = pascalCase(fn.callback_id);
  const inputParams = fn.input_parameters || [];
  const outputParams = fn.output_parameters || [];
  const inputs = Object.keys(inputParams).length > 0
    ? templatizeParams(inputParams, true)
    : "ParameterSetDefinition";
  const outputs = Object.keys(outputParams).length > 0
    ? templatizeParams(outputParams, true)
    : "ParameterSetDefinition";

  const requiredInputs = (fn.input_parameters || []).filter((p) =>
    p.is_required
  ).map((p) => `"${p.name}"`);
  const requiredInputsType = requiredInputs.length > 0
    ? `(${requiredInputs.join("|")})[]`
    : `RequiredParameters<ParameterSetDefinition>`;
  const requiredOutputs = (fn.output_parameters || []).filter((p) =>
    p.is_required
  ).map((p) => `"${p.name}"`);
  const requiredOutputsType = requiredOutputs.length > 0
    ? `(${requiredOutputs.join("|")})[]`
    : `RequiredParameters<ParameterSetDefinition>`;

  // TODO: Update `RequiredParameters<ParameterSetDefinition>` to be typed w/ required inputs/outputs, i.e. ("channel_id"|"text")[]
  return `${functionName}: ${functionName} as SlackFunction<
    ${inputs},
    ${outputs},
    ${requiredInputsType},
    ${requiredOutputsType}
  >`;
};
