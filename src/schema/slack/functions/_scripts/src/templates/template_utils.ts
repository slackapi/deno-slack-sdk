import { pascalCase } from "../deps.ts";
import { FunctionParameter, FunctionRecord } from "../types.ts";
import SchemaTypes from "../../../../../schema_types.ts";
import SlackTypes from "../../../../schema_types.ts";
import { InternalSlackTypes } from "../../../../types/custom/mod.ts";
import { AllowedTypeValue, AllowedTypeValueObject } from "./types.ts";
import { isCustomType } from "../../../../../../types/mod.ts";

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
): FunctionParameter[] => [
  ...functionRecord.input_parameters,
  ...functionRecord.output_parameters,
];

const hasParamsFromTypeObject = (
  functionRecord: FunctionRecord,
  typeObject: AllowedTypeValueObject,
): boolean =>
  getParameterList(functionRecord).some((param) =>
    Object.values(typeObject)
      .map((val) => getParameterType(val))
      .includes(param.type)
  );

export function renderTypeImports(functionRecord: FunctionRecord) {
  const typescript: string[] = [];
  if (hasParamsFromTypeObject(functionRecord, SchemaTypes)) {
    typescript.push('import SchemaTypes from "../../schema_types.ts";');
  }
  if (hasParamsFromTypeObject(functionRecord, SlackTypes)) {
    typescript.push('import SlackTypes from "../schema_types.ts";');
  }
  if (hasParamsFromTypeObject(functionRecord, InternalSlackTypes)) {
    typescript.push(
      'import { InternalSlackTypes } from "../types/custom/mod.ts";',
    );
  }
  return typescript.join("\n");
}
