export type FunctionParameter = {
  name: string;
  description: string;
  type: string;
  items: {
    type: string;
  };
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
