import { pascalCase } from "../../../../../../dev_deps.ts";
import { FunctionProperty, FunctionRecord } from "../types.ts";
import SchemaTypes from "../../../../../schema_types.ts";
import SlackTypes from "../../../../schema_types.ts";
import { InternalSlackTypes } from "../../../../types/custom/mod.ts";
import { AllowedTypeValue, AllowedTypeValueObject } from "./types.ts";
import { isCustomType } from "../../../../../../types/mod.ts";
import { isArrayFunctionProperty } from "../utils.ts";
import { isObjectFunctionProperty } from "../utils.ts";

export function autogeneratedComment(): string {
  const time = new Date();
  return `/** This file was autogenerated on ${time.toDateString()}. Follow the steps in src/schema/slack/functions/README.md to rebuild **/`;
}

export function renderFunctionImport(callbackId: string): string {
  return `import ${getFunctionName(callbackId)} from "./${callbackId}.ts";`;
}

export function getFunctionName(callbackId: string): string {
  return pascalCase(callbackId);
}

export function getSlackCallbackId(
  functionRecord: FunctionRecord,
): string {
  return `slack#/functions/${functionRecord.callback_id}`;
}

export function getParameterType(type: AllowedTypeValue): string {
  return isCustomType(type) ? type.id : type;
}

const getParameterList = (
  functionRecord: FunctionRecord,
): FunctionProperty[] => [
  ...functionRecord.input_parameters,
  ...functionRecord.output_parameters,
];

const hasTypeObject = (
  types: string[],
  typeObject: AllowedTypeValueObject,
): boolean =>
  types.some((t) =>
    Object.values(typeObject).map((val) => getParameterType(val)).includes(t)
  );

const extractTypes = (properties: FunctionProperty[]): string[] => {
  let types: Set<string> = new Set();
  properties.forEach((property) => {
    types.add(property.type);
    if (isArrayFunctionProperty(property)) {
      types = new Set([
        ...types,
        ...extractTypes([property.items]),
      ]);
    }
    if (isObjectFunctionProperty(property)) {
      types = new Set([
        ...types,
        ...extractTypes(Object.values(property.properties)),
      ]);
    }
  });
  return Array.from(types);
};

export function renderTypeImports(functionRecord: FunctionRecord) {
  const typescript: string[] = [];
  const functionRecordTypes = extractTypes(getParameterList(functionRecord));
  if (hasTypeObject(functionRecordTypes, SchemaTypes)) {
    typescript.push('import SchemaTypes from "../../schema_types.ts";');
  }
  if (hasTypeObject(functionRecordTypes, SlackTypes)) {
    typescript.push('import SlackTypes from "../schema_types.ts";');
  }
  if (hasTypeObject(functionRecordTypes, InternalSlackTypes)) {
    typescript.push(
      'import { InternalSlackTypes } from "../types/custom/mod.ts";',
    );
  }
  return typescript.join("\n");
}
