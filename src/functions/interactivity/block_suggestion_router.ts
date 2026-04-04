import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../../parameters/types.ts";
import { SlackFunctionDefinition } from "../definitions/mod.ts";
import { UnhandledEventError } from "../unhandled-event-error.ts";
import { enrichContext } from "../enrich-context.ts";
import { FunctionDefinitionArgs, FunctionRuntimeParameters } from "../types.ts";
import type {
  BlockActionConstraint,
  BlockSuggestionHandler,
  RuntimeSuggestionContext,
  SuggestionContext,
} from "./types.ts";
import { BlockAction } from "./block_kit_types.ts";
import {
  matchBasicConstraintField,
  normalizeConstraintToArray,
} from "./matchers.ts";

/**
 * Define a suggestion "router" and its input and output parameters for use in a Slack application. The SuggestionRouter will route incoming action events to action-specific handlers.
 * @param {SlackFunctionDefinition<InputParameters, OutputParameters, RequiredInput, RequiredOutput>} func Reference to your previously-created SlackFunction, defined via DefineFunction
 * @returns {SuggestionRouter}
 */
export const BlockSuggestionRouter = <
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
  RequiredOutput extends PossibleParameterKeys<OutputParameters>,
>(
  func: SlackFunctionDefinition<
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutput
  >,
) => {
  const router = new SuggestionRouter(func);

  // deno-lint-ignore no-explicit-any
  const exportedHandler: any = router.export();

  // deno-lint-ignore no-explicit-any
  exportedHandler.addHandler = ((...args: any) => {
    router.addHandler.apply(router, args);

    return exportedHandler;
  }) as typeof router.addHandler;

  return exportedHandler as
    & ReturnType<typeof router.export>
    & Pick<typeof router, "addHandler">;
};

export class SuggestionRouter<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
  RequiredOutput extends PossibleParameterKeys<OutputParameters>,
> {
  private routes: Array<
    [BlockActionConstraint, BlockSuggestionHandler<typeof this.func.definition>]
  >;

  constructor(
    private func: SlackFunctionDefinition<
      InputParameters,
      OutputParameters,
      RequiredInput,
      RequiredOutput
    >,
  ) {
    this.func = func;
    this.routes = [];
  }

  /**
   * Add a suggestion handler for something that can match an action event.
   * @param {BlockActionConstraint} actionConstraint A BlockActionConstraintField(i.e. a string, array of strings or regular expression) or more complex BlockActionConstraintObject to match incoming block suggestion events. A BlockActionConstraintField parameter are matched with a block suggestion event's `action_id` property. A BlockActionConstraintObject parameter allows to match with other block suggestion event properties like `block_id` as well as `action_id`. If multiple properties are specified using BlockActionConstraintObject, then the event must match ALL provided BlockActionConstraintObject properties.
   * @returns {SuggestionRouter}
   */
  addHandler(
    actionConstraint: BlockActionConstraint,
    handler: BlockSuggestionHandler<
      FunctionDefinitionArgs<
        InputParameters,
        OutputParameters,
        RequiredInput,
        RequiredOutput
      >
    >,
  ): SuggestionRouter<
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutput
  > {
    this.routes.push([actionConstraint, handler]);
    return this;
  }

  /**
   * Returns a method handling routing of suggestion payloads to the appropriate suggestion handler.
   * The output of export() should be attached to the `blockSuggestion` export of your function.
   */
  export() {
    return async (
      context: RuntimeSuggestionContext<
        FunctionRuntimeParameters<InputParameters, RequiredInput>
      >,
    ) => {
      const suggestion = context.body;
      const handler = this.matchHandler(suggestion);
      if (handler === null) {
        throw new UnhandledEventError(
          `Received block suggestion payload with suggestion=${
            JSON.stringify(suggestion)
          } but this app has no suggestion handler defined to handle it!`,
        );
      }

      const enrichedContext = enrichContext(context) as SuggestionContext<
        FunctionRuntimeParameters<InputParameters, RequiredInput>
      >;

      return await handler(enrichedContext);
    };
  }

  /**
   * Return the first registered SuggestionHandler that matches the action and/or block ID string(s) provided.
   */
  matchHandler(
    action: BlockAction, // TODO: this type name is a bit misleading; BlockAction just has both action_id and block_id props on it, so it applies to both block_suggestion and block_action payloads
  ):
    | BlockSuggestionHandler<
      FunctionDefinitionArgs<
        InputParameters,
        OutputParameters,
        RequiredInput,
        RequiredOutput
      >
    >
    | null {
    for (let i = 0; i < this.routes.length; i++) {
      const route = this.routes[i];
      let [constraint, handler] = route;
      // Handle different constraint types below
      if (
        constraint instanceof RegExp || constraint instanceof Array ||
        typeof constraint === "string"
      ) {
        // Normalize simple string constraints to be an array of strings for consistency in handling inside this method.
        constraint = normalizeConstraintToArray(constraint);
        // Handle the case where the constraint is either a regex or an array of strings to match against action_id
        if (matchBasicConstraintField(constraint, "action_id", action)) {
          return handler;
        }
      } else {
        // Assumes an object as a constraint (type BlockActionConstraintObject)
        // Return first match *within* any of the defined fields on the constaint object, but ensure there is a match on *all* defined fields
        // Effectively a logical AND across the action_id and block_id field(s)
        // If either of the constraint fields are not defined, pre-set them to have matched so we can effectively
        // ignore them when determining if we have a match by &&'ing them
        let actionIDMatched = constraint.action_id ? false : true;
        let blockIDMatched = constraint.block_id ? false : true;
        if (constraint.action_id) {
          actionIDMatched = matchBasicConstraintField(
            normalizeConstraintToArray(constraint.action_id),
            "action_id",
            action,
          );
        }
        if (constraint.block_id) {
          blockIDMatched = matchBasicConstraintField(
            normalizeConstraintToArray(constraint.block_id),
            "block_id",
            action,
          );
        }
        if (blockIDMatched && actionIDMatched) {
          return handler;
        }
      }
    }
    return null;
  }
}
