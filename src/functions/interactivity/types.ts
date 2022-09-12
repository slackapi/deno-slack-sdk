import {
  BaseRuntimeFunctionContext,
  FunctionContextEnrichment,
  FunctionDefinitionArgs,
  FunctionParameters,
  FunctionRuntimeParameters,
} from "../types.ts";
import { BlockAction, BlockActionsBody } from "./block_actions_types.ts";
import {
  View,
  ViewClosedBody,
  ViewEvents,
  ViewSubmissionBody,
} from "./view_types.ts";

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

export type UnhandledEventHandler<Definition> = Definition extends
  FunctionDefinitionArgs<infer I, infer O, infer RI, infer RO> ? {
    (
      context: UnhandledEventContext<FunctionRuntimeParameters<I, RI>>,
      // deno-lint-ignore no-explicit-any
    ): Promise<any> | any;
  }
  : never;

export type BaseInteractivityContext<InputParameters> =
  & BaseRuntimeFunctionContext<InputParameters>
  & FunctionContextEnrichment;

export type ActionContext<InputParameters> =
  & BaseInteractivityContext<InputParameters>
  & ActionSpecificContext<InputParameters>;

export type ViewSubmissionContext<InputParameters> =
  & BaseInteractivityContext<InputParameters>
  & ViewSubmissionSpecificContext<InputParameters>;

export type ViewClosedContext<InputParameters> =
  & BaseInteractivityContext<InputParameters>
  & ViewClosedSpecificContext<InputParameters>;

export type UnhandledEventContext<InputParameters> =
  & BaseInteractivityContext<
    InputParameters
  >
  & UnhandledEventSpecificContext<InputParameters>;

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

type UnhandledEventSpecificContext<InputParameters extends FunctionParameters> =
  {
    // unhandled events will contain at least function_data, but the rest is unknown
    body:
      & Pick<FunctionInteractivity<InputParameters>, "function_data">
      & {
        // deno-lint-ignore no-explicit-any
        [key: string]: any;
      };
  };

export type BlockActionInvocationBody<
  InputParameters extends FunctionParameters,
> =
  & BlockActionsBody
  & FunctionInteractivity<InputParameters>;

export type ViewSubmissionInvocationBody<
  InputParameters extends FunctionParameters,
> =
  & ViewSubmissionBody
  & FunctionInteractivity<InputParameters>;

export type ViewClosedInvocationBody<
  InputParameters extends FunctionParameters,
> =
  & ViewClosedBody
  & FunctionInteractivity<InputParameters>;

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

export type ViewConstraintObject = {
  type: ViewEvents;
  callback_id: BasicConstraintField;
};

export type BasicConstraintField = string | string[] | RegExp;

// -- These types represent the deno-slack-runtime function handler interfaces
export type RuntimeActionContext<InputParameters> =
  & BaseRuntimeFunctionContext<InputParameters>
  & ActionSpecificContext<InputParameters>;

export type RuntimeViewSubmissionContext<InputParameters> =
  & BaseRuntimeFunctionContext<InputParameters>
  & ViewSubmissionSpecificContext<InputParameters>;

export type RuntimeViewClosedContext<InputParameters> =
  & BaseRuntimeFunctionContext<InputParameters>
  & ViewClosedSpecificContext<InputParameters>;
