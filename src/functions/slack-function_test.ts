import { assertEquals, assertExists, mock } from "../dev_deps.ts";
import { DefineFunction, SlackFunction } from "../mod.ts";

const TestFunction = DefineFunction({
  title: "Test",
  callback_id: "test",
  source_file: "test.js",
});

Deno.test("SlackFunction returns the expected interface", () => {
  const mainFnHandler = mock.spy(() => ({ outputs: {} }));

  const handlers = SlackFunction(TestFunction, mainFnHandler);

  assertEquals(typeof handlers.addBlockActionsHandler, "function");
  assertEquals(typeof handlers.addViewClosedHandler, "function");
  assertEquals(typeof handlers.addViewSubmissionHandler, "function");
  assertEquals(typeof handlers.addUnhandledEventHandler, "function");
});

Deno.test("SlackFunction returns a proper function module definition", () => {
  const mainFnHandler = mock.spy(() => ({ outputs: {} }));

  const handlers = SlackFunction(TestFunction, mainFnHandler);
  const typedHandlers = typeHandlersForTesting(handlers);

  assertEquals(typeof handlers, "function");
  assertEquals(typeof typedHandlers.blockActions, "function");
  assertEquals(typeof typedHandlers.viewSubmission, "function");
  assertEquals(typeof typedHandlers.viewClosed, "function");
});

Deno.test("SlackFunction unhandledEvent is undefined by default", () => {
  const mainFnHandler = mock.spy(() => ({ outputs: {} }));

  const handlers = SlackFunction(TestFunction, mainFnHandler);
  const typedHandlers = typeHandlersForTesting(handlers);

  assertEquals(typedHandlers.unhandledEvent, undefined);
});

Deno.test("SlackFunction unhandledEvent is defined after calling addUnhandledEventHandler", () => {
  const mainFnHandler = mock.spy(() => ({ outputs: {} }));

  const handlers = SlackFunction(TestFunction, mainFnHandler);
  const typedHandlers = typeHandlersForTesting(handlers);

  const handlerSpy = mock.spy();
  typedHandlers.addUnhandledEventHandler(handlerSpy);

  assertEquals(typeof typedHandlers.unhandledEvent, "function");
});

Deno.test("Main handler should pass arguments through", () => {
  const args = { test: "arguments" };

  // deno-lint-ignore no-explicit-any
  const mainFnHandler = mock.spy((ctx: any) => {
    assertEquals(ctx.test, args.test);
    assertExists(ctx.client);

    return { outputs: {} };
  });

  const handlers = SlackFunction(TestFunction, mainFnHandler);
  const typedHandlers = typeHandlersForTesting(handlers);

  typedHandlers(args);

  mock.assertSpyCalls(mainFnHandler, 1);
});

Deno.test("Main handler should have a client instance", () => {
  const args = { test: "arguments" };

  // deno-lint-ignore no-explicit-any
  const mainFnHandler = mock.spy((ctx: any) => {
    assertExists(ctx.client);

    return { outputs: {} };
  });

  const handlers = SlackFunction(TestFunction, mainFnHandler);
  const typedHandlers = typeHandlersForTesting(handlers);

  typedHandlers(args);

  mock.assertSpyCalls(mainFnHandler, 1);
});

Deno.test("addBlockActionsHandler", async () => {
  const mainFnHandler = mock.spy(() => ({ outputs: {} }));

  const handlers = SlackFunction(TestFunction, mainFnHandler);
  const typedHandlers = typeHandlersForTesting(handlers);

  const actionId = "whatever";
  const actionSpy = mock.spy();
  typedHandlers.addBlockActionsHandler(actionId, actionSpy);

  await typedHandlers.blockActions({ action: { action_id: actionId } });
  mock.assertSpyCalls(actionSpy, 1);
});

Deno.test("addBlockSuggestionHandler", async () => {
  const mainFnHandler = mock.spy(() => ({ outputs: {} }));

  const handlers = SlackFunction(TestFunction, mainFnHandler);
  const typedHandlers = typeHandlersForTesting(handlers);

  const actionId = "whatever";
  const suggestionSpy = mock.spy(() => ({ options: [] }));
  typedHandlers.addBlockSuggestionHandler(actionId, suggestionSpy);

  await typedHandlers.blockSuggestion({ body: { action_id: actionId } });
  mock.assertSpyCalls(suggestionSpy, 1);
});

Deno.test("addViewClosedHandler", async () => {
  const mainFnHandler = mock.spy(() => ({ outputs: {} }));

  const handlers = SlackFunction(TestFunction, mainFnHandler);
  const typedHandlers = typeHandlersForTesting(handlers);

  const callbackId = "lolwutwut";
  const closedHandler = mock.spy();
  typedHandlers.addViewClosedHandler(callbackId, closedHandler);

  await typedHandlers.viewClosed({
    body: { type: "view_closed" },
    view: { callback_id: callbackId },
  });
  mock.assertSpyCalls(closedHandler, 1);
});

Deno.test("addViewSubmissionHandler", async () => {
  const mainFnHandler = mock.spy(() => ({ outputs: {} }));

  const handlers = SlackFunction(TestFunction, mainFnHandler);
  const typedHandlers = typeHandlersForTesting(handlers);

  const callbackId = "lolwutwut";
  const submissionSpy = mock.spy();
  typedHandlers.addViewSubmissionHandler(callbackId, submissionSpy);

  await typedHandlers.viewSubmission({
    body: { type: "view_submission" },
    view: { callback_id: callbackId },
  });
  mock.assertSpyCalls(submissionSpy, 1);
});

Deno.test("addUnhandledEventHandler", async () => {
  const mainFnHandler = mock.spy(() => ({ outputs: {} }));

  const handlers = SlackFunction(TestFunction, mainFnHandler);
  const typedHandlers = typeHandlersForTesting(handlers);

  // deno-lint-ignore no-explicit-any
  const handlerSpy = mock.spy((ctx: any) => {
    assertEquals(ctx.some, args.some);
    assertExists(ctx.client);

    return { outputs: {} };
  });
  typedHandlers.addUnhandledEventHandler(handlerSpy);

  const args = { some: "arguments" };
  await typedHandlers.unhandledEvent(args);
});

const typeHandlersForTesting = <HandlerType>(handlers: HandlerType) => {
  return handlers as HandlerType & {
    (...args: unknown[]): unknown;
    blockActions: (...args: unknown[]) => void;
    blockSuggestion: (...args: unknown[]) => void;
    viewSubmission: (...args: unknown[]) => void;
    viewClosed: (...args: unknown[]) => void;
    unhandledEvent: (...args: unknown[]) => void;
  };
};
