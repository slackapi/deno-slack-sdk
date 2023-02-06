import {
  ManifestFunctionSchema,
} from "../../../../../manifest/manifest_schema.ts";

export type DefineFunctionInput = ManifestFunctionSchema & {
  callbackId: string;
};

type BaseFunctionProperty = {
  type: string;
  description?: string;
  title?: string;
};

type ObjectFunctionProperty = BaseFunctionProperty & {
  properties: {
    [key: string]: FunctionProperty;
  };
  required: string[] | [];
  additionalProperties: boolean;
};

type ArrayFunctionProperty = BaseFunctionProperty & {
  items: {
    type: string;
  };
};

export type FunctionProperty =
  | BaseFunctionProperty
  | ObjectFunctionProperty
  | ArrayFunctionProperty;

export type FunctionParameter = FunctionProperty & {
  name: string;
  is_required?: boolean;
};

export type FunctionRecord = {
  callback_id: string;
  title: string;
  description: string;
  app_id?: string;
  input_parameters: FunctionParameter[];
  output_parameters: FunctionParameter[];
  type?: string;
};

export type FunctionsPayload = {
  ok: boolean;
  functions: FunctionRecord[];
};
