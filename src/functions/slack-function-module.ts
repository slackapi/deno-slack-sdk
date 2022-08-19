import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../parameters/mod.ts";
import { FunctionDefinitionArgs, SlackFunctionHandler } from "./types.ts";
import {
  BasicConstraintField,
  BlockActionConstraint,
  BlockActionHandler,
  ViewClosedHandler,
  ViewSubmissionHandler,
} from "./interactivity/types.ts";
import { SlackFunction } from "./mod.ts";
import { BlockActionsRouter } from "./interactivity/action_router.ts";
import { ViewsRouter } from "./interactivity/view_router.ts";

// Types
export type SlackFunctionModuleType<Definition> = Definition extends
  FunctionDefinitionArgs<infer I, infer O, infer RI, infer RO> ? {
    (): SlackFunctionHandler<Definition>;
    addBlockActionsHandler(
      actionConstraint: BlockActionConstraint,
      handler: BlockActionHandler<
        FunctionDefinitionArgs<I, O, RI, RO>
      >,
    ): SlackFunctionModuleType<Definition>;
    addViewClosedHandler(
      viewConstraint: BasicConstraintField,
      handler: ViewClosedHandler<
        FunctionDefinitionArgs<I, O, RI, RO>
      >,
    ): SlackFunctionModuleType<Definition>;
    addViewSubmissionHandler(
      viewConstraint: BasicConstraintField,
      handler: ViewSubmissionHandler<
        FunctionDefinitionArgs<I, O, RI, RO>
      >,
    ): SlackFunctionModuleType<Definition>;
  }
  : never;

// Functions
export const SlackFunctionModule = <
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
  functionHandler: SlackFunctionHandler<typeof func.definition>,
) => {
  // deno-lint-ignore no-explicit-any
  const handlerModule: any = functionHandler;

  const blockActionsRouter = BlockActionsRouter(func);
  const viewsRouter = ViewsRouter(func);

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

  // Expose named handlers
  handlerModule.blockActions = blockActionsRouter;
  handlerModule.viewClosed = viewsRouter.viewClosed;
  handlerModule.viewSubmission = viewsRouter.viewSubmission;

  return handlerModule as SlackFunctionModuleType<typeof func.definition>;
};
