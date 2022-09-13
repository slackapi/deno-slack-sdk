import { ICustomType } from "../../../../../types/types.ts";

export type FunctionParameter = {
  name: string;
  description: string;
  type: string | ICustomType;
  items?: {
    type: string | ICustomType;
  };
  properties?: {
    [key: string]: FunctionParameter;
  };
  additionalProperties: boolean;
  "is_required": boolean;
};

export type FunctionRecord = {
  "callback_id": string;
  title: string;
  description: string;
  "app_id"?: string;
  "input_parameters"?: FunctionParameter[];
  "output_parameters"?: FunctionParameter[];
};

export type FunctionsPayload = {
  ok: boolean;
  functions: FunctionRecord[];
};
