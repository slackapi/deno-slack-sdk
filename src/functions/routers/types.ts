import {
  FunctionContext,
  FunctionDefinitionArgs,
  FunctionParameters,
  FunctionRuntimeParameters,
} from "../types.ts";

export type BlockActionHandler<Definition> = Definition extends
  FunctionDefinitionArgs<infer I, infer O, infer RI, infer RO> ? {
    (
      context: ActionContext<FunctionRuntimeParameters<I, RI>>,
      // deno-lint-ignore no-explicit-any
    ): Promise<any> | any;
  }
  : never;

export type ActionContext<InputParameters> =
  & Omit<FunctionContext<InputParameters>, "event">
  & ActionSpecificContext<InputParameters>;

type ActionSpecificContext<InputParameters extends FunctionParameters> = {
  body: BlockActionInvocationBody<InputParameters>;
  action: BlockAction;
};

// TODO: all below stolen from deno-slack-runtime, need to centralize these somewhere
export type BlockActionInvocationBody<
  InputParameters extends FunctionParameters,
> = {
  type: string;
  actions: BlockAction[];
  function_data: FunctionData<InputParameters>;
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
};

type FunctionData<InputParameters extends FunctionParameters> = {
  function: {
    callback_id: string;
  };
  execution_id: string;
  inputs: InputParameters;
};

export type BlockAction = {
  type: string;
  block_id: string;
  action_id: string;
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
};

export type BlockActionConstraint =
  | BlockActionConstraintField
  | BlockActionConstraintObject;

export type BlockActionConstraintObject = {
  block_id?: BlockActionConstraintField;
  action_id?: BlockActionConstraintField;
};

export type BlockActionConstraintField = string | string[] | RegExp;
