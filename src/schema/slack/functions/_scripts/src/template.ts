import { pascalCase } from "https://deno.land/x/case@v2.1.0/mod.ts";
import { ICustomType } from "../../../../../types/types.ts";
import SchemaTypes from "../../../../schema_types.ts";
import SlackSchemaTypes from "../../../schema_types.ts";
import { InternalSlackTypes } from "../../../types/custom/mod.ts";
import { FunctionParameter, FunctionRecord } from "./types.ts";

type AllowedTypeValue = ICustomType | string;
type AllowedTypeValueObject = Record<string, AllowedTypeValue>;

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

const typeMap: Record<string, AllowedTypeValueObject> = {
  SchemaTypes,
  SlackTypes: SlackSchemaTypes,
  InternalSlackTypes,
};

const schemaTypeMap = Object.entries(typeMap).reduce<AllowedTypeValueObject>(
  (acc, [schemaKey, schemaTypes]) => {
    for (const typeKey in schemaTypes) {
      const val = schemaTypes[typeKey];
      if (val instanceof Object) {
        acc[val.id] = `${schemaKey}.${typeKey}`;
      } else {
        acc[val] = `${schemaKey}.${typeKey}`;
      }
    }
    return acc;
  },
  {},
);

const appendItemsOrProperties = (param: FunctionParameter) => {
  if (param.properties) {
    const properties = Object.entries(param.properties).reduce<string>(
      (acc, [propertyKey, propertyValue]) => {
        if (acc) acc += "\n";
        acc += `${propertyKey}: ${getParamDef(propertyValue, false)},`;
        return acc;
      },
      "",
    );
    const propertyString = `properties: {${properties}}`;
    const additionalPropertyString =
      // deno-lint-ignore no-prototype-builtins
      param.hasOwnProperty("additionalProperties")
        ? `\n, additionalProperties: ${param.additionalProperties}`
        : "";
    return propertyString + additionalPropertyString;
  }
  if (param.items) {
    return `items:{
       type: "${param.items.type}"
    },`;
  }
  return "";
};

const getParamDef = (param: FunctionParameter, useTypeValue = false) => {
  return `{
    type: ${
    useTypeValue ? `"${param.type}"` : schemaTypeMap[getParamType(param.type)]
  },
    ${param.description ? `description: "${param.description}",` : ""}
    ${appendItemsOrProperties(param)}
  }`;
};

const templatizeParam = (param: FunctionParameter, useTypeValue = false) => {
  const paramDef = getParamDef(param, useTypeValue);
  return `${param.name}: ${paramDef}`;
};

const getSchemaTypeImport = (fn: FunctionRecord) =>
  hasParamsFromTypeObject(fn, SchemaTypes)
    ? 'import SchemaTypes from "../../schema_types.ts";'
    : "";

const getSlackSchemaTypeImport = (fn: FunctionRecord) =>
  hasParamsFromTypeObject(fn, SlackSchemaTypes)
    ? 'import SlackTypes from "../schema_types.ts";'
    : "";

const getInternalSlackSchemaTypeImport = (fn: FunctionRecord) =>
  hasParamsFromTypeObject(fn, InternalSlackTypes)
    ? 'import { InternalSlackTypes } from "../types/custom/mod.ts";'
    : "";

const getParamType = (type: string | ICustomType): string =>
  type instanceof Object ? type.id : type;

/** @description returns a list of all fn parameters */
const getParameterList = (fn: FunctionRecord) => [
  ...fn?.input_parameters ?? [],
  ...fn?.output_parameters ?? [],
];

/** @description Whether or not a fn uses parameters from a defined type object */
const hasParamsFromTypeObject = (
  fn: FunctionRecord,
  typeObject: AllowedTypeValueObject,
) =>
  getParameterList(fn)
    .some((param) =>
      Object.values(typeObject)
        .map((val) => getParamType(val))
        .includes(getParamType(param.type))
    );

export const SlackFunctionTemplate = (fn: FunctionRecord) => {
  const schemaTypesImport = getSchemaTypeImport(fn);
  const slackSchemaTypesImport = getSlackSchemaTypeImport(fn);
  const internalSlackSchemaTypesImport = getInternalSlackSchemaTypeImport(fn);

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
    import { DefineFunction } from "../../../functions/mod.ts";${schemaTypesImport}${slackSchemaTypesImport}${internalSlackSchemaTypesImport}

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
