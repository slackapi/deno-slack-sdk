type BaseFunctionProperty = {
  type: string;
  description?: string;
  title?: string;
};

export type ObjectFunctionProperty = BaseFunctionProperty & {
  properties: FunctionProperties;
  required?: string[];
  additionalProperties?: boolean;
};

export type ArrayFunctionProperty = BaseFunctionProperty & {
  items: FunctionProperty;
};

export type FunctionProperty =
  | BaseFunctionProperty
  | ObjectFunctionProperty
  | ArrayFunctionProperty;

export type FunctionProperties = {
  [key: string]: FunctionProperty;
};

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
