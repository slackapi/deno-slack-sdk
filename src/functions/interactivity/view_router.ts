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
  func: SlackFunction<
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutput
  >,
) => {
  const router = new ViewRouter(func);

  // deno-lint-ignore no-explicit-any
  const exportedHandler: any = router.export();

  // deno-lint-ignore no-explicit-any
  exportedHandler.addSubmissionHandler = ((...args: any) => {
    router.addSubmissionHandler.apply(router, args);

    return exportedHandler;
  }) as typeof router.addSubmissionHandler;

  // deno-lint-ignore no-explicit-any
  exportedHandler.addClosedHandler = ((...args: any) => {
    router.addClosedHandler.apply(router, args);

    return exportedHandler;
  }) as typeof router.addClosedHandler;

  return exportedHandler as
    & ReturnType<typeof router.export>
    & Pick<typeof router, "addSubmissionHandler" | "addClosedHandler">;
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
    private func: SlackFunction<
      InputParameters,
      OutputParameters,
      RequiredInput,
      RequiredOutput
    >,
  ) {
    this.func = func;
    this.submissionRoutes = [];
    this.closedRoutes = [];
  }

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
   * Returns a method handling routing of view events to the appropriate view handler.
   * The output of export() should be attached to either the `viewSubmission` or the `viewClosed` export of your function.
   */
  export(): ViewExports<
    FunctionDefinitionArgs<
      InputParameters,
      OutputParameters,
      RequiredInput,
      RequiredOutput
    >
  > {
    return {
      viewClosed: async (context) => {
        const handler = this.matchHandler(context.body.type, context.view);
        if (handler === null) {
          // TODO: what do in this case?
          // perhaps the user typo'ed the action id when registering their handler or defining their callback_id.
          // In the local-run case, this warning should be apparent to the user, but in the deployed context, this might be trickier to isolate
          console.warn(
            `Received ${context.body.type} payload ${
              JSON.stringify(context.view)
            } but this app has no view handler defined to handle it!`,
          );
          return;
        }
        return await handler(context);
      },
      viewSubmission: async (context) => {
        const handler = this.matchHandler(context.body.type, context.view);
        if (handler === null) {
          // TODO: what do in this case?
          // perhaps the user typo'ed the action id when registering their handler or defining their callback_id.
          // In the local-run case, this warning should be apparent to the user, but in the deployed context, this might be trickier to isolate
          console.warn(
            `Received ${context.body.type} payload ${
              JSON.stringify(context.view)
            } but this app has no view handler defined to handle it!`,
          );
          return;
        }
        return await handler(context);
      },
    };
  }

  matchHandler(
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

type ViewExports<Definition> = {
  viewSubmission: ViewSubmissionHandler<Definition>;
  viewClosed: ViewClosedHandler<Definition>;
};
