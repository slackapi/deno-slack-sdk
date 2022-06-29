import { pascalCase } from "https://deno.land/x/case@v2.1.0/mod.ts";
import SchemaTypes from "../../../../schema_types.ts";
import SlackSchemaTypes from "../../../schema_types.ts";
import { FunctionParameter, FunctionRecord } from "./types.ts";

type StringObject = Record<string, string>;

const autogeneratedComment = () => {
  const time = new Date();
  return `/** This file was autogenerated on ${time.toDateString()}. Follow the steps in src/schema/slack/functions/README.md to rebuild **/`;
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

const typeMap = {
  SchemaTypes: SchemaTypes,
  SlackTypes: SlackSchemaTypes,
} as Record<string, StringObject>;

const schemaTypeMap = Object.entries(typeMap).reduce(
  (acc, [schemaKey, schemaTypes]) => {
    for (const typeKey in schemaTypes) {
      const val = schemaTypes[typeKey];
      acc[val] = `${schemaKey}.${typeKey}`;
    }
    return acc;
  },
  {} as StringObject,
);

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
    import { DefineFunction } from "../../../functions/mod.ts";${schemaTypesImport}${slackSchemaTypesImport}

    export default DefineFunction(
      {
        callback_id: "slack#/functions/${fn.callback_id}",
        source_file: "",
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
  return `${functionName}: ${functionName}`;
};
