import { ParameterDefinition } from "../../../../../parameters/definition_types.ts";

export type FunctionParameter = ParameterDefinition & {
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
