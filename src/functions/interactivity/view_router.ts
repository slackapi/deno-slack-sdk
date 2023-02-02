import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../../parameters/types.ts";
import { SlackFunctionDefinition } from "../mod.ts";
import { UnhandledEventError } from "../unhandled-event-error.ts";
import { enrichContext } from "../enrich-context.ts";
import { FunctionDefinitionArgs, FunctionRuntimeParameters } from "../types.ts";
import {
  matchBasicConstraintField,
  normalizeConstraintToArray,
} from "./matchers.ts";
import type {
  BasicConstraintField,
  RuntimeViewClosedContext,
  RuntimeViewSubmissionContext,
  ViewClosedHandler,
  ViewConstraintObject,
  ViewSubmissionHandler,
} from "./types.ts";
import { View, ViewEvents } from "./view_types.ts";

export const ViewsRouter = <
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
  return new ViewRouter(func);
};

class ViewRouter<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
  RequiredOutput extends PossibleParameterKeys<OutputParameters>,
> {
  private closedRoutes: Array<
    [
      ViewConstraintObject,
      ViewClosedHandler<typeof this.func.definition>,
    ]
  >;
  private submissionRoutes: Array<
    [
      ViewConstraintObject,
      ViewSubmissionHandler<typeof this.func.definition>,
    ]
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
    this.submissionRoutes = [];
    this.closedRoutes = [];

    // Bind these two handler functions as they're meant to exported directly by the user-defined function module
    this.viewClosed = this.viewClosed.bind(this);
    this.viewSubmission = this.viewSubmission.bind(this);
  }

  /**
   * Add a handler for view_closed events
   * @param {BasicConstraintField} viewConstraint A view constraing (i.e. a string, array of strings or regular expression) that matches against view_closed event's `callback_id` property.
   * @param handler A handler function for the matched view_closed event
   * @returns {ViewRouter}
   */
  addClosedHandler(
    viewConstraint: BasicConstraintField,
    handler: ViewClosedHandler<
      FunctionDefinitionArgs<
        InputParameters,
        OutputParameters,
        RequiredInput,
        RequiredOutput
      >
    >,
  ): ViewRouter<
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutput
  > {
    const constraint: ViewConstraintObject = {
      type: "view_closed",
      callback_id: viewConstraint,
    };
    this.closedRoutes.push([constraint, handler]);
    return this;
  }

  /**
   * Add a handler for view_submission events
   * @param {BasicConstraintField} viewConstraint A view constraing (i.e. a string, array of strings or regular expression) that matches against view_submission event's `callback_id` property.
   * @param handler A handler function for the matched view_submission event
   * @returns {ViewRouter}
   */
  addSubmissionHandler(
    viewConstraint: BasicConstraintField,
    handler: ViewSubmissionHandler<
      FunctionDefinitionArgs<
        InputParameters,
        OutputParameters,
        RequiredInput,
        RequiredOutput
      >
    >,
  ): ViewRouter<
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutput
  > {
    const constraint: ViewConstraintObject = {
      type: "view_submission",
      callback_id: viewConstraint,
    };
    this.submissionRoutes.push([constraint, handler]);
    return this;
  }

  /**
   * Method for handling view_closed events. This should be the `viewClosed` export of your function module.
   */
  async viewClosed(
    context: RuntimeViewClosedContext<
      FunctionRuntimeParameters<InputParameters, RequiredInput>
    >,
  ) {
    const handler = this.matchHandler(context.body.type, context.view);
    if (handler === null) {
      throw new UnhandledEventError(
        `Received ${context.body.type} payload ${
          JSON.stringify(context.view)
        } but this app has no view handler defined to handle it!`,
      );
    }
    const enrichedContext = enrichContext(context);

    return await handler(enrichedContext);
  }

  /**
   * Method for handling view_submission events. This should be the `viewSubmission` export of your function module.
   */
  async viewSubmission(
    context: RuntimeViewSubmissionContext<
      FunctionRuntimeParameters<InputParameters, RequiredInput>
    >,
  ) {
    const handler = this.matchHandler(context.body.type, context.view);
    if (handler === null) {
      throw new UnhandledEventError(
        `Received ${context.body.type} payload ${
          JSON.stringify(context.view)
        } but this app has no view handler defined to handle it!`,
      );
    }
    const enrichedContext = enrichContext(context);

    return await handler(enrichedContext);
  }

  private matchHandler(
    type: ViewEvents,
    view: View,
    // deno-lint-ignore no-explicit-any
  ): any {
    let routes;
    let _handler: typeof type extends "view_closed" ? ViewClosedHandler<
        FunctionDefinitionArgs<
          InputParameters,
          OutputParameters,
          RequiredInput,
          RequiredOutput
        >
      >
      : ViewSubmissionHandler<
        FunctionDefinitionArgs<
          InputParameters,
          OutputParameters,
          RequiredInput,
          RequiredOutput
        >
      >;
    if (type === "view_closed") {
      routes = this.closedRoutes;
    } else {
      routes = this.submissionRoutes;
    }
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      const [constraint, _handler] = route;
      // Check that the view event type (submission vs. closed) matches
      if (constraint.type !== type) continue;
      // Normalize simple string constraints to be an array of strings for consistency in handling inside this method.
      const constraintArray = normalizeConstraintToArray(
        constraint.callback_id,
      );
      // Handle the case where the constraint is either a regex or an array of strings to match against action_id
      if (matchBasicConstraintField(constraintArray, "callback_id", view)) {
        return _handler;
      }
    }
    return null;
  }
}
