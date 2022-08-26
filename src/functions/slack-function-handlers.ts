import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../parameters/mod.ts";
import { SlackFunctionHandler, SlackFunctionHandlersType } from "./types.ts";
import { SlackFunctionDefinition } from "./mod.ts";
import { BlockActionsRouter } from "./interactivity/action_router.ts";
import { ViewsRouter } from "./interactivity/view_router.ts";

export const SlackFunctionHandlers = <
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
  // Start with their fn handler, and we'll wrap it up so we can append some additional functions to it

  // @ts-ignore - creating a wrapper around provided fn handler so we don't mutate it directly
  // deno-lint-ignore no-explicit-any
  const handlerModule: any = (...args) => functionHandler(...args);
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
    handlerModule.unhandledEvent = handler;

    return handlerModule;
  };

  // Expose named handlers that the deno-slack-runtime will invoke
  handlerModule.blockActions = blockActionsRouter;
  handlerModule.viewClosed = viewsRouter.viewClosed;
  handlerModule.viewSubmission = viewsRouter.viewSubmission;

  return handlerModule as SlackFunctionHandlersType<typeof func.definition>;
};
