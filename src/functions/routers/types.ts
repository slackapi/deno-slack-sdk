import {
  FunctionContext,
  FunctionDefinitionArgs,
  FunctionParameters,
  FunctionRuntimeParameters,
} from "../types.ts";
import { BlockAction, BlockActionsBody } from "./block_actions_types.ts";

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

export type BlockActionInvocationBody<
  InputParameters extends FunctionParameters,
> = BlockActionsBody & FunctionInteractivity<InputParameters>;

type FunctionInteractivity<InputParameters extends FunctionParameters> = {
  function_data: FunctionData<InputParameters>;
  interactivity: Interactivity;
};

type FunctionData<InputParameters extends FunctionParameters> = {
  function: {
    callback_id: string;
  };
  execution_id: string;
  inputs: InputParameters;
};

type Interactivity = {
  interactor: {
    secret: string;
    id: string;
  };
  interactivity_pointer: string;
};

export type BlockActionConstraint =
  | BlockActionConstraintField
  | BlockActionConstraintObject;

export type BlockActionConstraintObject = {
  block_id?: BlockActionConstraintField;
  action_id?: BlockActionConstraintField;
};

export type BlockActionConstraintField = string | string[] | RegExp;
