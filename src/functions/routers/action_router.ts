import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../../parameters/mod.ts";
import { SlackFunction } from "../mod.ts";
import type {
  BlockAction,
  BlockActionConstraint,
  BlockActionConstraintField,
  BlockActionConstraintObject,
  BlockActionHandler,
} from "./types.ts";

/**
 * Define an actions "router" and its input and output parameters for use in a Slack application. The ActionsRouter will route incoming action events to action-specific handlers.
 * @param {SlackFunction<InputParameters, OutputParameters, RequiredInput, RequiredOutput>} func Reference to your previously-created SlackFunction, defined via DefineFunction
 * @returns {ActionsRouter}
 */
export const BlockActionsRouter = <
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
  RequiredOutput extends PossibleParameterKeys<OutputParameters>,
>(
  func: SlackFunction<
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutput
  >,
) => {
  const router = new ActionsRouter(func);

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

export class ActionsRouter<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
  RequiredOutput extends PossibleParameterKeys<OutputParameters>,
> {
  private routes: Array<
    [BlockActionConstraint, BlockActionHandler<typeof this.func.definition>]
  >;

  constructor(
    private func: SlackFunction<
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
   * Add an action handler for something that can match an action event.
   * @param {BlockActionConstraint} actionConstraint A BlockActionConstraintField(i.e. a string, array of strings or regular expression) or more complex BlockActionConstraintObject to match incoming block action events. A BlockActionConstraintField parameter are matched with a block action event's `action_id` property. A BlockActionConstraintObject parameter allows to match with other block action event properties like `block_id` as well as `action_id`. If multiple properties are specified using BlockActionConstraintObject, then the event must match ALL provided BlockActionConstraintObject properties.
   * @returns {ActionsRouter}
   */
  addHandler(
    actionConstraint: BlockActionConstraint,
    handler: BlockActionHandler<typeof this.func.definition>,
  ): ActionsRouter<
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutput
  > {
    this.routes.push([actionConstraint, handler]);
    return this;
  }

  /**
   * Returns a method handling routing of action payloads to the appropriate action handler.
   * The output of export() should be attached to the `blockActions` export of your function.
   */
  export(): BlockActionHandler<typeof this.func.definition> {
    return async (context) => {
      const action: BlockAction = context.action;
      const handler = this.matchHandler(action);
      if (handler === null) {
        // TODO: what do in this case?
        // perhaps the user typo'ed the action id when registering their handler or defining their block.
        // In the local-run case, this warning should be apparent to the user, but in the deployed context, this might be trickier to isolate
        console.warn(
          `Received block action payload with action=${
            JSON.stringify(action)
          } but this app has no action handler defined to handle it!`,
        );
        return;
      }
      return await handler(context);
    };
  }

  /**
   * Return the first registered ActionHandler that matches the action ID string provided.
   */
  matchHandler(
    action: BlockAction,
  ): BlockActionHandler<typeof this.func.definition> | null {
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
        if (matchBlockActionConstraintField(constraint, "action_id", action)) {
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
          actionIDMatched = matchBlockActionConstraintField(
            normalizeConstraintToArray(constraint.action_id),
            "action_id",
            action,
          );
        }
        if (constraint.block_id) {
          blockIDMatched = matchBlockActionConstraintField(
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

function normalizeConstraintToArray(constraint: BlockActionConstraintField) {
  if (typeof constraint === "string") {
    constraint = [constraint];
  }
  return constraint;
}

function matchBlockActionConstraintField(
  constraint: BlockActionConstraintField,
  field: keyof BlockActionConstraintObject,
  action: BlockAction,
) {
  if (constraint instanceof RegExp) {
    if (action[field].match(constraint)) {
      return true;
    }
  } else if (constraint instanceof Array) {
    for (let j = 0; j < constraint.length; j++) {
      const c = constraint[j];
      if (action[field] === c) {
        return true;
      }
    }
  }
  return false;
}
