import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../parameters/mod.ts";
import {
  RuntimeFunctionContext,
  RuntimeUnhandledEventContext,
  SlackFunctionHandler,
  SlackFunctionType,
} from "./types.ts";
import { SlackFunctionDefinition } from "./mod.ts";
import { enrichContext } from "./enrich-context.ts";
import { BlockActionsRouter } from "./interactivity/action_router.ts";
import { ViewsRouter } from "./interactivity/view_router.ts";

export const SlackFunction = <
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
  functionHandler: SlackFunctionHandler<typeof func.definition>,
) => {
  // Start with the provided fn handler, and we'll wrap it up so we can append some additional functions to it

  // Wrap the provided handler's call so we can add additional context
  // deno-lint-ignore no-explicit-any
  const handlerModule: any = (
    ctx: RuntimeFunctionContext<InputParameters>,
    // deno-lint-ignore no-explicit-any
    ...args: any
  ) => {
    // enrich the context w/ additional properties
    const newContext = enrichContext(ctx);

    //@ts-ignore - intentionally specifying the provided functionHandler as the `this` arg for the handler's call
    return functionHandler.apply(functionHandler, [newContext, ...args]);
  };
  // Unhandled events are sent to a single handler, which is not set by default
  handlerModule.unhandledEvent = undefined;

  // Create routers for block/view actions
  // TODO: we could probably lazily create these when corresponding add* functions are called
  const blockActionsRouter = BlockActionsRouter(func);
  const viewsRouter = ViewsRouter(func);

  // Add fns for additional function handlers

  // deno-lint-ignore no-explicit-any
  handlerModule.addBlockActionsHandler = (...args: any) => {
    blockActionsRouter.addHandler.apply(blockActionsRouter, args);

    return handlerModule;
  };

  // deno-lint-ignore no-explicit-any
  handlerModule.addViewClosedHandler = (...args: any) => {
    viewsRouter.addClosedHandler.apply(viewsRouter, args);

    return handlerModule;
  };

  // deno-lint-ignore no-explicit-any
  handlerModule.addViewSubmissionHandler = (...args: any) => {
    viewsRouter.addSubmissionHandler.apply(viewsRouter, args);

    return handlerModule;
  };

  // deno-lint-ignore no-explicit-any
  handlerModule.addUnhandledEventHandler = (handler: any) => {
    // Set the unhandledEvent property directly
    handlerModule.unhandledEvent = (
      ctx: RuntimeUnhandledEventContext<InputParameters>,
      // deno-lint-ignore no-explicit-any
      ...args: any
    ) => {
      const newContext = enrichContext(ctx);

      return handler.apply(handler, [newContext, ...args]);
    };

    return handlerModule;
  };

  // Expose named handlers that the deno-slack-runtime will invoke
  handlerModule.blockActions = blockActionsRouter;
  handlerModule.viewClosed = viewsRouter.viewClosed;
  handlerModule.viewSubmission = viewsRouter.viewSubmission;

  return handlerModule as SlackFunctionType<typeof func.definition>;
};
