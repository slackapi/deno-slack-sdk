import {
  BaseRuntimeFunctionContext,
  FunctionContextEnrichment,
  FunctionDefinitionArgs,
  FunctionParameters,
  FunctionRuntimeParameters,
} from "../types.ts";
import { BlockActionsBody } from "./block_actions_types.ts";
import { BlockSuggestionBody } from "./block_suggestion_types.ts";
import { BlockAction } from "./block_kit_types.ts";
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

export type BlockSuggestionHandler<Definition> = Definition extends
  FunctionDefinitionArgs<infer I, infer O, infer RI, infer RO> ? {
    (
      context: SuggestionContext<FunctionRuntimeParameters<I, RI>>,
    ): Promise<BlockSuggestionHandlerResponse> | BlockSuggestionHandlerResponse;
  }
  : never;

type BlockSuggestionHandlerResponse =
  | BlockSuggestionHandlerOptionsResponse
  | BlockSuggestionHandlerOptionGroupsResponse;

type BlockSuggestionHandlerOptionsResponse = {
  options: MenuOption[];
};

type BlockSuggestionHandlerOptionGroupsResponse = {
  option_groups: MenuOptionGroup[];
};

type MenuOptionGroup = {
  /**
   * @description A {@link PlainTextObject} that defines the label shown above this group of options. Maximum length for the `text` property inside this field is 75 characters.
   */
  label: PlainTextObject;
  /**
   * @description An array of {@link MenuOption} objects that belong to this specific group. Maximum of 100 items.
   */
  options: MenuOption[];
};

type MenuOption = {
  /**
   * @description A {@link PlainTextObject} that defines the text shown in the option on the menu. Maximum length for the `text` property inside this field is 75 characters.
   */
  text: PlainTextObject;
  /**
   * @description A unique string value that will be passed to your app when this option is chosen. Maximum length for this filed is 75 characters.
   */
  value: string;
};

type PlainTextObject = {
  type: "plain_text";
  /**
   * @description The text for the object.
   */
  text: string;
  /**
   * @description Indicates whether emojis in the text field shoul be escaped into a colon emoji format.
   */
  emoji?: boolean;
};

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

export type BaseInteractivityContext<
  InputParameters extends FunctionParameters,
> =
  & BaseRuntimeFunctionContext<InputParameters>
  & FunctionContextEnrichment;

export type ActionContext<InputParameters extends FunctionParameters> =
  & BaseInteractivityContext<InputParameters>
  & ActionSpecificContext<InputParameters>;

export type SuggestionContext<InputParameters extends FunctionParameters> =
  & BaseInteractivityContext<InputParameters>
  & SuggestionSpecificContext<InputParameters>;

export type ViewSubmissionContext<InputParameters extends FunctionParameters> =
  & BaseInteractivityContext<InputParameters>
  & ViewSubmissionSpecificContext<InputParameters>;

export type ViewClosedContext<InputParameters extends FunctionParameters> =
  & BaseInteractivityContext<InputParameters>
  & ViewClosedSpecificContext<InputParameters>;

export type UnhandledEventContext<InputParameters extends FunctionParameters> =
  & BaseInteractivityContext<
    InputParameters
  >
  & UnhandledEventSpecificContext<InputParameters>;

type ActionSpecificContext<InputParameters extends FunctionParameters> = {
  body: BlockActionInvocationBody<InputParameters>;
  action: BlockAction;
};

type SuggestionSpecificContext<InputParameters extends FunctionParameters> = {
  body: BlockSuggestionInvocationBody<InputParameters>;
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

export type BlockSuggestionInvocationBody<
  InputParameters extends FunctionParameters,
> =
  & BlockSuggestionBody
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

// TODO: with the arrival of block_suggestion payloads, the naming here is not
// fully accurate: these constraint fields can apply to both block_actions and block_suggestion
// payloads. Perhaps worth renaming to BlockConstraint?
/**
 * @description An {@link BlockActionConstraintObject} or {@link BasicConstraintField} constraining which Block Kit interaction payloads get handled by particular interactivity handlers.
 */
export type BlockActionConstraint =
  | BasicConstraintField
  | BlockActionConstraintObject;

/**
 * @description An object constraining which Block Kit interaction payloads get handled by particular interactivity handlers.
 * If both `block_id` and `action_id` properties are specified, then both properties must have their constraint satisfied in order for there to be a match.
 */
export type BlockActionConstraintObject = {
  /**
   * @description A {@link BasicConstraintField} to match against the `block_id` property of a Block Kit interactivity event.
   */
  block_id?: BasicConstraintField;
  /**
   * @description A {@link BasicConstraintField} to match against the `action_id` property of a Block Kit interactivity event.
   */
  action_id?: BasicConstraintField;
};

export type ViewConstraintObject = {
  type: ViewEvents;
  callback_id: BasicConstraintField;
};

export type BasicConstraintField = string | string[] | RegExp;

// -- These types represent the deno-slack-runtime function handler interfaces
export type RuntimeSuggestionContext<
  InputParameters extends FunctionParameters,
> =
  & BaseRuntimeFunctionContext<InputParameters>
  & SuggestionSpecificContext<InputParameters>;

export type RuntimeActionContext<InputParameters extends FunctionParameters> =
  & BaseRuntimeFunctionContext<InputParameters>
  & ActionSpecificContext<InputParameters>;

export type RuntimeViewSubmissionContext<
  InputParameters extends FunctionParameters,
> =
  & BaseRuntimeFunctionContext<InputParameters>
  & ViewSubmissionSpecificContext<InputParameters>;

export type RuntimeViewClosedContext<
  InputParameters extends FunctionParameters,
> =
  & BaseRuntimeFunctionContext<InputParameters>
  & ViewClosedSpecificContext<InputParameters>;
