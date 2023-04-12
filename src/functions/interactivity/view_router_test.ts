import { SlackAPI } from "../../deps.ts";
import {
  assertEquals,
  assertExists,
  assertRejects,
  mock,
} from "../../dev_deps.ts";
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
  FunctionParameters,
  FunctionRuntimeParameters,
} from "../types.ts";
import type {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../../parameters/types.ts";
import type { SlackFunctionDefinition } from "../mod.ts";
import { DefineFunction, Schema } from "../../mod.ts";

// Helper test types
// TODO: maybe we want to export this for userland usage at some point?
// Very much a direct copy from the existing main function tester types and utilties in src/functions/tester
type SlackViewSubmissionHandlerTesterArgs<
  InputParameters extends FunctionParameters,
> =
  & Partial<
    ViewSubmissionContext<InputParameters>
  >
  & {
    inputs: InputParameters;
  };

type SlackViewClosedHandlerTesterArgs<
  InputParameters extends FunctionParameters,
> =
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

type SlackViewSubmissionHandlerTesterType = {
  <
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
  ): SlackViewSubmissionHandlerTesterResponse<
    InputParameters,
    RequiredInput
  >;
};

type SlackViewClosedHandlerTesterType = {
  <
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

const SlackViewSubmissionHandlerTester: SlackViewSubmissionHandlerTesterType = <
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
  RequiredOutput extends PossibleParameterKeys<OutputParameters>,
>(
  _func: SlackFunctionDefinition<
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
    const token = args.token || "slack-function-test-token";

    return {
      inputs,
      env: args.env || {},
      token,
      client: SlackAPI(token),
      view: args.view || DEFAULT_VIEW,
      body: args.body || DEFAULT_BODY,
      team_id: DEFAULT_VIEW.team_id,
      enterprise_id: "",
    };
  };

  return { createContext };
};

const SlackViewClosedHandlerTester: SlackViewClosedHandlerTesterType = <
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
  RequiredOutput extends PossibleParameterKeys<OutputParameters>,
>(
  _func: SlackFunctionDefinition<
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
    const token = args.token || "slack-function-test-token";

    return {
      inputs,
      env: args.env || {},
      token,
      client: SlackAPI(token),
      view: args.view || DEFAULT_VIEW,
      body: args.body || DEFAULT_BODY,
      team_id: DEFAULT_VIEW.team_id,
      enterprise_id: "",
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

const getRouter = () => ViewsRouter(func);

Deno.test("ViewRouter viewSubmission", async (t) => {
  await t.step(
    "export method returns result of submissionHandler when matching view comes in and baseline handler context parameters are present and exist",
    async () => {
      const router = getRouter();
      let handlerCalled = false;
      router.addSubmissionHandler(DEFAULT_VIEW.callback_id, (ctx) => {
        assertExists(ctx.inputs);
        assertEquals<string>(ctx.inputs.garbage, inputs.garbage);
        assertExists(ctx.token);
        assertExists(ctx.client);
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
});

Deno.test("ViewRouter viewSubmission happy path", async (t) => {
  await t.step("simple string matching to callback_id", async () => {
    const router = getRouter();
    let handlerCalled = false;
    router.addSubmissionHandler(DEFAULT_VIEW.callback_id, (ctx) => {
      assertExists(ctx.inputs);
      assertExists<string>(ctx.token);
      assertExists<View>(ctx.view);
      assertExists(ctx.env);
      assertExists(ctx.client);
      handlerCalled = true;
    });
    await router.viewSubmission(createSubmissionContext({ inputs }));
    assertEquals(handlerCalled, true, "view handler not called!");
  });

  await t.step("array of strings matching to callback_id", async () => {
    const router = getRouter();
    const handler = mock.spy();
    router.addSubmissionHandler(
      ["nope", DEFAULT_VIEW.callback_id],
      handler,
    );
    await router.viewSubmission(createSubmissionContext({ inputs }));
    mock.assertSpyCalls(handler, 1);
  });

  await t.step("regex matching to callback_id", async () => {
    const router = getRouter();
    const handler = mock.spy();
    router.addSubmissionHandler(/12/, handler);
    await router.viewSubmission(createSubmissionContext({ inputs }));
    mock.assertSpyCalls(handler, 1);
  });
});

Deno.test("ViewRouter viewSubmission sad path", async (t) => {
  await t.step(
    "unhandled view_submission throw",
    async () => {
      const router = getRouter();
      await assertRejects(
        () => router.viewSubmission(createSubmissionContext({ inputs })),
        "no view handler defined",
      );
    },
  );

  await t.step("no false positives", async (t) => {
    await t.step(
      "not matching callback_id: string",
      async () => {
        const router = getRouter();
        const handler = mock.spy();
        router.addSubmissionHandler("nope", handler);
        await assertRejects(() =>
          router.viewSubmission(createSubmissionContext({ inputs }))
        );
        mock.assertSpyCalls(handler, 0);
      },
    );

    await t.step(
      "not matching callback_id: string[]",
      async () => {
        const router = getRouter();
        const handler = mock.spy();
        router.addSubmissionHandler(["nope", "nuh uh"], handler);
        await assertRejects(() =>
          router.viewSubmission(createSubmissionContext({ inputs }))
        );
        mock.assertSpyCalls(handler, 0);
      },
    );

    await t.step(
      "not matching callback_id: regex",
      async () => {
        const router = getRouter();
        const handler = mock.spy();
        router.addSubmissionHandler(/regex/, handler);
        await assertRejects(() =>
          router.viewSubmission(createSubmissionContext({ inputs }))
        );
        mock.assertSpyCalls(handler, 0);
      },
    );
  });
});

Deno.test("ViewRouter viewClosed", async (t) => {
  await t.step(
    "export method returns result of closedHandler when matching view comes in and baseline handler context parameters are present and exist",
    async () => {
      const router = getRouter();
      let handlerCalled = false;
      router.addClosedHandler(DEFAULT_VIEW.callback_id, (ctx) => {
        assertExists(ctx.inputs);
        assertEquals<string>(ctx.inputs.garbage, inputs.garbage);
        assertExists(ctx.token);
        assertExists(ctx.client);
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
});

Deno.test("ViewRouter viewClosed happy path", async (t) => {
  await t.step("simple string matching to callback_id", async () => {
    const router = getRouter();
    let handlerCalled = false;
    router.addClosedHandler(DEFAULT_VIEW.callback_id, (ctx) => {
      assertExists(ctx.inputs);
      assertExists<string>(ctx.token);
      assertExists(ctx.client);
      assertExists<View>(ctx.view);
      assertExists(ctx.env);
      handlerCalled = true;
    });
    await router.viewClosed(createClosedContext({ inputs }));
    assertEquals(handlerCalled, true, "view handler not called!");
  });

  await t.step("array of strings matching to callback_id", async () => {
    const router = getRouter();
    const handler = mock.spy();
    router.addClosedHandler(
      ["nope", DEFAULT_VIEW.callback_id],
      handler,
    );
    await router.viewClosed(createClosedContext({ inputs }));
    mock.assertSpyCalls(handler, 1);
  });

  await t.step("regex matching to callback_id", async () => {
    const router = getRouter();
    const handler = mock.spy();
    router.addClosedHandler(/12/, handler);
    await router.viewClosed(createClosedContext({ inputs }));
    mock.assertSpyCalls(handler, 1);
  });
});

Deno.test("ViewRouter viewClosed sad path", async (t) => {
  await t.step(
    "unhandled view_submission should throw",
    async () => {
      const router = getRouter();
      await assertRejects(
        () => router.viewClosed(createClosedContext({ inputs })),
        "no view handler defined",
      );
    },
  );

  await t.step("no false positives", async (t) => {
    await t.step(
      "not matching callback_id: string",
      async () => {
        const router = getRouter();
        const handler = mock.spy();
        router.addClosedHandler("nope", handler);
        await assertRejects(() =>
          router.viewClosed(createClosedContext({ inputs }))
        );
        mock.assertSpyCalls(handler, 0);
      },
    );

    await t.step(
      "not matching callback_id: string[]",
      async () => {
        const router = getRouter();
        const handler = mock.spy();
        router.addClosedHandler(["nope", "nuh uh"], handler);
        await assertRejects(() =>
          router.viewClosed(createClosedContext({ inputs }))
        );
        mock.assertSpyCalls(handler, 0);
      },
    );

    await t.step(
      "not matching callback_id: regex",
      async () => {
        const router = getRouter();
        const handler = mock.spy();
        router.addClosedHandler(/regex/, handler);
        await assertRejects(() =>
          router.viewClosed(createClosedContext({ inputs }))
        );
        mock.assertSpyCalls(handler, 0);
      },
    );
  });
});
