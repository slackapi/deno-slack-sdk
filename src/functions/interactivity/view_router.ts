import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../../parameters/mod.ts";
import { SlackFunction } from "../mod.ts";
import { FunctionDefinitionArgs } from "../types.ts";
import {
  matchBasicConstraintField,
  normalizeConstraintToArray,
} from "./matchers.ts";
import type {
  BasicConstraintField,
  ViewClosedHandler,
  ViewSubmissionHandler,
} from "./types.ts";
import type { View, ViewEvents } from "./view_types.ts";

export const ViewsRouter = <
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
  eventFilter: ViewEvents,
) => {
  const router = new ViewRouter<
    typeof eventFilter,
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutput
  >(func);

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

class ViewRouter<
  ViewEvent,
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
  RequiredOutput extends PossibleParameterKeys<OutputParameters>,
> {
  private routes: Array<
    [
      BasicConstraintField,
      ViewEvent extends ViewEvents.SUBMISSION
        ? ViewSubmissionHandler<typeof this.func.definition>
        : ViewClosedHandler<typeof this.func.definition>,
    ]
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
   * Add a view event handler by matching against the view's `callback_id`.
   * @param {string | RegExp} viewConstraint A string or regular expression to match incoming view events' `callback_id` property.
   * @returns {ViewRouter}
   */
  addHandler(
    viewConstraint: BasicConstraintField,
    handler: ViewEvent extends ViewEvents.SUBMISSION ? ViewSubmissionHandler<
        FunctionDefinitionArgs<
          InputParameters,
          OutputParameters,
          RequiredInput,
          RequiredOutput
        >
      >
      : ViewClosedHandler<
        FunctionDefinitionArgs<
          InputParameters,
          OutputParameters,
          RequiredInput,
          RequiredOutput
        >
      >,
  ): ViewRouter<
    ViewEvent,
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutput
  > {
    this.routes.push([viewConstraint, handler]);
    return this;
  }

  /**
   * Returns a method handling routing of view events to the appropriate view handler.
   * The output of export() should be attached to either the `viewSubmission` or the `viewClosed` export of your function.
   */
  export(): ViewEvent extends ViewEvents.SUBMISSION ? ViewSubmissionHandler<
      FunctionDefinitionArgs<
        InputParameters,
        OutputParameters,
        RequiredInput,
        RequiredOutput
      >
    >
    : ViewClosedHandler<
      FunctionDefinitionArgs<
        InputParameters,
        OutputParameters,
        RequiredInput,
        RequiredOutput
      >
    > {
    return async (context) => {
      const handler = this.matchHandler(context.view);
      if (handler === null) {
        // TODO: what do in this case?
        // perhaps the user typo'ed the action id when registering their handler or defining their block.
        // In the local-run case, this warning should be apparent to the user, but in the deployed context, this might be trickier to isolate
        console.warn(
          `Received block action payload with action=${
            JSON.stringify(context.view)
          } but this app has no action handler defined to handle it!`,
        );
        return;
      }
      return await handler(context);
    };
  }
  matchHandler(
    view: View,
  ):
    | (ViewEvent extends ViewEvents.SUBMISSION
      ? ViewSubmissionHandler<typeof this.func.definition>
      : ViewClosedHandler<typeof this.func.definition>)
    | null {
    for (let i = 0; i < this.routes.length; i++) {
      const route = this.routes[i];
      let [constraint, handler] = route;
      // Normalize simple string constraints to be an array of strings for consistency in handling inside this method.
      constraint = normalizeConstraintToArray(constraint);
      // Handle the case where the constraint is either a regex or an array of strings to match against action_id
      if (matchBasicConstraintField(constraint, "callback_id", view)) {
        return handler;
      }
    }
    return null;
  }
}
