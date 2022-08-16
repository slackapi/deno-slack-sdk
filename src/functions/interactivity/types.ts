import {
  FunctionContext,
  FunctionDefinitionArgs,
  FunctionParameters,
  FunctionRuntimeParameters,
} from "../types.ts";
import { BlockAction, BlockActionsBody } from "./block_actions_types.ts";
import { View, ViewBody, ViewEvents } from "./view_types.ts";

export type BlockActionHandler<Definition> = Definition extends
  FunctionDefinitionArgs<infer I, infer O, infer RI, infer RO> ? {
    (
      context: ActionContext<FunctionRuntimeParameters<I, RI>>,
      // deno-lint-ignore no-explicit-any
    ): Promise<any> | any;
  }
  : never;

export type ViewSubmissionHandler<Definition> = Definition extends
  FunctionDefinitionArgs<infer I, infer O, infer RI, infer RO> ? {
    (
      context: ViewSubmissionContext<FunctionRuntimeParameters<I, RI>>,
      // deno-lint-ignore no-explicit-any
    ): Promise<any> | any;
  }
  : never;

export type ViewClosedHandler<Definition> = Definition extends
  FunctionDefinitionArgs<infer I, infer O, infer RI, infer RO> ? {
    (
      context: ViewClosedContext<FunctionRuntimeParameters<I, RI>>,
      // deno-lint-ignore no-explicit-any
    ): Promise<any> | any;
  }
  : never;

// The three interactivity handler Context objects below "inherit" properties
// from FunctionContext but omit its "event" property as a means of re-use.
// Could also refactor this differently!

export type ActionContext<InputParameters> =
  & Omit<FunctionContext<InputParameters>, "event">
  & ActionSpecificContext<InputParameters>;

export type ViewSubmissionContext<InputParameters> =
  & Omit<FunctionContext<InputParameters>, "event">
  & ViewSubmissionSpecificContext<InputParameters>;

export type ViewClosedContext<InputParameters> =
  & Omit<FunctionContext<InputParameters>, "event">
  & ViewClosedSpecificContext<InputParameters>;

type ActionSpecificContext<InputParameters extends FunctionParameters> = {
  body: BlockActionInvocationBody<InputParameters>;
  action: BlockAction;
};

type ViewSubmissionSpecificContext<InputParameters extends FunctionParameters> =
  {
    body: ViewSubmissionInvocationBody<InputParameters>;
    view: View;
  };

type ViewClosedSpecificContext<InputParameters extends FunctionParameters> = {
  body: ViewClosedInvocationBody<InputParameters>;
  view: View;
};

export type BlockActionInvocationBody<
  InputParameters extends FunctionParameters,
> =
  & BlockActionsBody
  & FunctionInteractivity<InputParameters>;

export type ViewSubmissionInvocationBody<
  InputParameters extends FunctionParameters,
> =
  & ViewBody
  & FunctionInteractivity<InputParameters>
  & {
    response_urls: string[];
    /**
     * @description Used to open a modal by passing it to e.g. `view.open` or `view.push` APIs. Represents a particular user interaction with an interactive component. Short-lived token (expires fast!) that may only be used once.
     */
    trigger_id: string;
    type: ViewEvents.SUBMISSION;
  };

export type ViewClosedInvocationBody<
  InputParameters extends FunctionParameters,
> =
  & ViewBody
  & Omit<FunctionInteractivity<InputParameters>, "interactivity">
  & {
    /**
     * @description Whether or not an entire view stack was cleared.
     */
    is_cleared: boolean;
    type: ViewEvents.CLOSED;
  };

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
  interactor: UserContext;
  interactivity_pointer: string;
};

type UserContext = {
  secret: string;
  id: string;
};

export type BlockActionConstraint =
  | BasicConstraintField
  | BlockActionConstraintObject;

export type BlockActionConstraintObject = {
  block_id?: BasicConstraintField;
  action_id?: BasicConstraintField;
};

export type BasicConstraintField = string | string[] | RegExp;