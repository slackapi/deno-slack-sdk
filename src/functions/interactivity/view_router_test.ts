import { assertEquals, assertExists, assertMatch } from "../../dev_deps.ts";
import { ViewsRouter } from "./view_router.ts";
import type {
  ViewClosedContext,
  ViewClosedInvocationBody,
  ViewSubmissionContext,
  ViewSubmissionInvocationBody,
} from "./types.ts";
import type { View } from "./view_types.ts";
import type {
  FunctionDefinitionArgs,
  FunctionRuntimeParameters,
} from "../types.ts";
import type {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../../parameters/mod.ts";
import type { SlackFunction } from "../mod.ts";
import { DefineFunction, Schema } from "../../mod.ts";

// Helper test types
// TODO: maybe we want to export this for userland usage at some point?
// Very much a direct copy from the existing main function tester types and utilties in src/functions/tester
type SlackViewSubmissionHandlerTesterArgs<InputParameters> =
  & Partial<
    ViewSubmissionContext<InputParameters>
  >
  & {
    inputs: InputParameters;
  };

type SlackViewClosedHandlerTesterArgs<InputParameters> =
  & Partial<
    ViewClosedContext<InputParameters>
  >
  & {
    inputs: InputParameters;
  };

type CreateViewSubmissionHandlerContext<
  InputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
> = {
  (
    args: SlackViewSubmissionHandlerTesterArgs<
      FunctionRuntimeParameters<InputParameters, RequiredInput>
    >,
  ): ViewSubmissionContext<
    FunctionRuntimeParameters<InputParameters, RequiredInput>
  >;
};

type CreateViewClosedHandlerContext<
  InputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
> = {
  (
    args: SlackViewClosedHandlerTesterArgs<
      FunctionRuntimeParameters<InputParameters, RequiredInput>
    >,
  ): ViewClosedContext<
    FunctionRuntimeParameters<InputParameters, RequiredInput>
  >;
};

type SlackViewSubmissionHandlerTesterResponse<
  InputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
> = {
  createContext: CreateViewSubmissionHandlerContext<
    InputParameters,
    RequiredInput
  >;
};

type SlackViewClosedHandlerTesterResponse<
  InputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
> = {
  createContext: CreateViewClosedHandlerContext<
    InputParameters,
    RequiredInput
  >;
};

type SlackViewSubmissionHandlerTesterFn = {
  // Accept a Slack Function
  <
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
  ): SlackViewSubmissionHandlerTesterResponse<
    InputParameters,
    RequiredInput
  >;
};

type SlackViewClosedHandlerTesterFn = {
  // Accept a Slack Function
  <
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
  ): SlackViewClosedHandlerTesterResponse<
    InputParameters,
    RequiredInput
  >;
};
// Helper test fixtures and utilities
const DEFAULT_VIEW: View = {
  type: "modal",
  team_id: "T123456",
  state: { values: {} },
  notify_on_close: false,
  hash: "pipe",
  clear_on_close: false,
  callback_id: "123",
  blocks: [],
  app_installed_team_id: "T123456",
  app_id: "A123456",
};

const SlackViewSubmissionHandlerTester: SlackViewSubmissionHandlerTesterFn = <
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
  RequiredOutput extends PossibleParameterKeys<OutputParameters>,
>(
  _func: SlackFunction<
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutput
  >,
) => {
  const createContext: CreateViewSubmissionHandlerContext<
    InputParameters,
    RequiredInput
  > = (
    args,
  ) => {
    const inputs = (args.inputs || {}) as FunctionRuntimeParameters<
      InputParameters,
      RequiredInput
    >;
    const DEFAULT_BODY = {
      type: "view_submission" as const,
      view: DEFAULT_VIEW,
      function_data: {
        execution_id: "123",
        function: { callback_id: "456" },
        inputs,
      },
      interactivity: {
        interactor: {
          secret: "shhhh",
          id: "123",
        },
        interactivity_pointer: "123.asdf",
      },
      user: {
        id: "123",
        name: "asdf",
        team_id: DEFAULT_VIEW.team_id,
      },
      team: {
        id: DEFAULT_VIEW.team_id,
        domain: "asdf",
      },
      enterprise: null,
      is_enterprise_install: false,
      api_app_id: DEFAULT_VIEW.app_id,
      app_id: DEFAULT_VIEW.app_id,
      token: "123",
      response_urls: [],
      trigger_id: "12345",
    };

    return {
      inputs,
      env: args.env || {},
      token: args.token || "slack-function-test-token",
      view: args.view || DEFAULT_VIEW,
      body: args.body || DEFAULT_BODY,
      team_id: DEFAULT_VIEW.team_id,
    };
  };

  return { createContext };
};

const SlackViewClosedHandlerTester: SlackViewClosedHandlerTesterFn = <
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
  RequiredOutput extends PossibleParameterKeys<OutputParameters>,
>(
  _func: SlackFunction<
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutput
  >,
) => {
  const createContext: CreateViewClosedHandlerContext<
    InputParameters,
    RequiredInput
  > = (
    args,
  ) => {
    const inputs = (args.inputs || {}) as FunctionRuntimeParameters<
      InputParameters,
      RequiredInput
    >;
    const DEFAULT_BODY = {
      type: "view_closed" as const,
      view: DEFAULT_VIEW,
      function_data: {
        execution_id: "123",
        function: { callback_id: "456" },
        inputs,
      },
      interactivity: {
        interactor: {
          secret: "shhhh",
          id: "123",
        },
        interactivity_pointer: "123.asdf",
      },
      user: {
        id: "123",
        name: "asdf",
        team_id: DEFAULT_VIEW.team_id,
      },
      team: {
        id: DEFAULT_VIEW.team_id,
        domain: "asdf",
      },
      enterprise: null,
      is_enterprise_install: false,
      api_app_id: DEFAULT_VIEW.app_id,
      app_id: DEFAULT_VIEW.app_id,
      token: "123",
      is_cleared: false,
    };

    return {
      inputs,
      env: args.env || {},
      token: args.token || "slack-function-test-token",
      view: args.view || DEFAULT_VIEW,
      body: args.body || DEFAULT_BODY,
      team_id: DEFAULT_VIEW.team_id,
    };
  };

  return { createContext };
};
// a basic function definition and associated block action router to test
const func = DefineFunction({
  callback_id: "id",
  title: "test",
  source_file: "whatever",
  input_parameters: {
    properties: {
      garbage: { type: Schema.types.string },
    },
    required: ["garbage"],
  },
});
const { createContext: createSubmissionContext } =
  SlackViewSubmissionHandlerTester(func);
const { createContext: createClosedContext } = SlackViewClosedHandlerTester(
  func,
);
// Dummy object to be able to programmatically reference the identifiers
const inputs = { garbage: "in, garbage out" };
let router = ViewsRouter(func);

const reset = () => {
  router = ViewsRouter(func);
};

Deno.test("ViewRouter", async (t) => {
  reset();
  await t.step("viewSubmission", async (t) => {
    await t.step("event matching", async (t) => {
      await t.step(
        "export method returns result of submissionHandler when matching view comes in and baseline handler context parameters are present and exist",
        async () => {
          let handlerCalled = false;
          router.addSubmissionHandler(DEFAULT_VIEW.callback_id, (ctx) => {
            assertExists(ctx.inputs);
            assertEquals<string>(ctx.inputs.garbage, inputs.garbage);
            assertExists(ctx.token);
            assertExists<View>(ctx.view);
            assertExists<
              ViewSubmissionInvocationBody<
                typeof func.definition extends
                  FunctionDefinitionArgs<infer I, infer O, infer RI, infer RO>
                  ? FunctionRuntimeParameters<I, RI>
                  : never
              >
            >(ctx.body);
            assertExists(ctx.env);
            handlerCalled = true;
          });
          await router.viewSubmission(createSubmissionContext({ inputs }));
          assertEquals(handlerCalled, true, "view handler not called!");
        },
      );
      reset();
      await t.step("happy path", async (t) => {
        await t.step("simple string matching to callback_id", async () => {
          let handlerCalled = false;
          router.addSubmissionHandler(DEFAULT_VIEW.callback_id, (ctx) => {
            assertExists(ctx.inputs);
            assertExists<string>(ctx.token);
            assertExists<View>(ctx.view);
            assertExists(ctx.env);
            handlerCalled = true;
          });
          await router.viewSubmission(createSubmissionContext({ inputs }));
          assertEquals(handlerCalled, true, "view handler not called!");
        });
        reset();
        await t.step("array of strings matching to callback_id", async () => {
          let handlerCalled = 0;
          router.addSubmissionHandler(
            ["nope", DEFAULT_VIEW.callback_id],
            () => {
              handlerCalled++;
            },
          );
          await router.viewSubmission(createSubmissionContext({ inputs }));
          assertEquals(
            handlerCalled,
            1,
            "view handler not called exactly once",
          );
        });
        reset();
        await t.step("regex matching to callback_id", async () => {
          let handlerCalled = 0;
          router.addSubmissionHandler(/12/, () => {
            handlerCalled++;
          });
          await router.viewSubmission(createSubmissionContext({ inputs }));
          assertEquals(
            handlerCalled,
            1,
            "view handler not called exactly once",
          );
        });
        reset();
      });
      await t.step("sad path", async (t) => {
        await t.step(
          "unhandled view_submission should log to console",
          async () => {
            const originalWarn = console.warn;
            let warnCalled = 0;
            // deno-lint-ignore no-explicit-any
            console.warn = (...data: any[]) => {
              warnCalled++;
              const warn = data[0];
              assertMatch(warn, /no view handler defined/);
            };
            await router.viewSubmission(createSubmissionContext({ inputs }));
            assertEquals(
              warnCalled,
              1,
              "console.warn not called exactly once",
            );
            console.warn = originalWarn;
          },
        );
        reset();
        await t.step("no false positives", async (t) => {
          // for these false positive tests, console.warn can be noisy, so lets turn it into a temporary no-op
          const originalWarn = console.warn;
          console.warn = () => {};
          await t.step(
            "not matching callback_id: string",
            async () => {
              let handlerCalled = 0;
              router.addSubmissionHandler("nope", () => {
                handlerCalled++;
              });
              await router.viewSubmission(createSubmissionContext({ inputs }));
              assertEquals(
                handlerCalled,
                0,
                "view handler called when it should not be",
              );
            },
          );
          reset();
          await t.step(
            "not matching callback_id: string[]",
            async () => {
              let handlerCalled = 0;
              router.addSubmissionHandler(["nope", "nuh uh"], () => {
                handlerCalled++;
              });
              await router.viewSubmission(createSubmissionContext({ inputs }));
              assertEquals(
                handlerCalled,
                0,
                "view handler called when it should not be",
              );
            },
          );
          reset();
          await t.step(
            "not matching callback_id: regex",
            async () => {
              let handlerCalled = 0;
              router.addSubmissionHandler(/regex/, () => {
                handlerCalled++;
              });
              await router.viewSubmission(createSubmissionContext({ inputs }));
              assertEquals(
                handlerCalled,
                0,
                "view handler called when it should not be",
              );
            },
          );
          reset();
          console.warn = originalWarn;
        });
      });
    });
  });
  reset();
  await t.step("viewClosed", async (t) => {
    await t.step("event matching", async (t) => {
      await t.step(
        "export method returns result of closedHandler when matching view comes in and baseline handler context parameters are present and exist",
        async () => {
          let handlerCalled = false;
          router.addClosedHandler(DEFAULT_VIEW.callback_id, (ctx) => {
            assertExists(ctx.inputs);
            assertEquals<string>(ctx.inputs.garbage, inputs.garbage);
            assertExists(ctx.token);
            assertExists<View>(ctx.view);
            assertExists<
              ViewClosedInvocationBody<
                typeof func.definition extends
                  FunctionDefinitionArgs<infer I, infer O, infer RI, infer RO>
                  ? FunctionRuntimeParameters<I, RI>
                  : never
              >
            >(ctx.body);
            assertExists(ctx.env);
            handlerCalled = true;
          });
          await router.viewClosed(createClosedContext({ inputs }));
          assertEquals(handlerCalled, true, "view handler not called!");
        },
      );
      reset();
      await t.step("happy path", async (t) => {
        await t.step("simple string matching to callback_id", async () => {
          let handlerCalled = false;
          router.addClosedHandler(DEFAULT_VIEW.callback_id, (ctx) => {
            assertExists(ctx.inputs);
            assertExists<string>(ctx.token);
            assertExists<View>(ctx.view);
            assertExists(ctx.env);
            handlerCalled = true;
          });
          await router.viewClosed(createClosedContext({ inputs }));
          assertEquals(handlerCalled, true, "view handler not called!");
        });
        reset();
        await t.step("array of strings matching to callback_id", async () => {
          let handlerCalled = 0;
          router.addClosedHandler(
            ["nope", DEFAULT_VIEW.callback_id],
            () => {
              handlerCalled++;
            },
          );
          await router.viewClosed(createClosedContext({ inputs }));
          assertEquals(
            handlerCalled,
            1,
            "view handler not called exactly once",
          );
        });
        reset();
        await t.step("regex matching to callback_id", async () => {
          let handlerCalled = 0;
          router.addClosedHandler(/12/, () => {
            handlerCalled++;
          });
          await router.viewClosed(createClosedContext({ inputs }));
          assertEquals(
            handlerCalled,
            1,
            "view handler not called exactly once",
          );
        });
        reset();
      });
      await t.step("sad path", async (t) => {
        await t.step(
          "unhandled view_submission should log to console",
          async () => {
            const originalWarn = console.warn;
            let warnCalled = 0;
            // deno-lint-ignore no-explicit-any
            console.warn = (...data: any[]) => {
              warnCalled++;
              const warn = data[0];
              assertMatch(warn, /no view handler defined/);
            };
            await router.viewClosed(createClosedContext({ inputs }));
            assertEquals(
              warnCalled,
              1,
              "console.warn not called exactly once",
            );
            console.warn = originalWarn;
          },
        );
        reset();
        await t.step("no false positives", async (t) => {
          // for these false positive tests, console.warn can be noisy, so lets turn it into a temporary no-op
          const originalWarn = console.warn;
          console.warn = () => {};
          await t.step(
            "not matching callback_id: string",
            async () => {
              let handlerCalled = 0;
              router.addClosedHandler("nope", () => {
                handlerCalled++;
              });
              await router.viewClosed(createClosedContext({ inputs }));
              assertEquals(
                handlerCalled,
                0,
                "view handler called when it should not be",
              );
            },
          );
          reset();
          await t.step(
            "not matching callback_id: string[]",
            async () => {
              let handlerCalled = 0;
              router.addClosedHandler(["nope", "nuh uh"], () => {
                handlerCalled++;
              });
              await router.viewClosed(createClosedContext({ inputs }));
              assertEquals(
                handlerCalled,
                0,
                "view handler called when it should not be",
              );
            },
          );
          reset();
          await t.step(
            "not matching callback_id: regex",
            async () => {
              let handlerCalled = 0;
              router.addClosedHandler(/regex/, () => {
                handlerCalled++;
              });
              await router.viewClosed(createClosedContext({ inputs }));
              assertEquals(
                handlerCalled,
                0,
                "view handler called when it should not be",
              );
            },
          );
          reset();
          console.warn = originalWarn;
        });
      });
    });
  });
});
