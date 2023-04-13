import { SlackAPI } from "../../deps.ts";
import {
  assertEquals,
  assertExists,
  assertRejects,
  mock,
} from "../../dev_deps.ts";
import { BlockActionsRouter } from "./block_actions_router.ts";
import type { ActionContext } from "./types.ts";
import type { BlockAction } from "./block_kit_types.ts";
import type {
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
type SlackActionHandlerTesterArgs<InputParameters extends FunctionParameters> =
  & Partial<
    ActionContext<InputParameters>
  >
  & {
    inputs: InputParameters;
  };

type CreateActionHandlerContext<
  InputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
> = {
  (
    args: SlackActionHandlerTesterArgs<
      FunctionRuntimeParameters<InputParameters, RequiredInput>
    >,
  ): ActionContext<
    FunctionRuntimeParameters<InputParameters, RequiredInput>
  >;
};

type SlackActionHandlerTesterResponse<
  InputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
> = {
  createContext: CreateActionHandlerContext<InputParameters, RequiredInput>;
};

type SlackActionHandlerTesterSignature = {
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
  ): SlackActionHandlerTesterResponse<
    InputParameters,
    RequiredInput
  >;
};

// Helper test fixtures and utilities
const DEFAULT_ACTION: BlockAction = {
  type: "button",
  block_id: "block_id",
  action_ts: `${new Date().getTime()}`,
  action_id: "action_id",
  text: { type: "plain_text", text: "duncare", emoji: false },
  style: "danger",
};
const SlackActionHandlerTester: SlackActionHandlerTesterSignature = <
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
  const createContext: CreateActionHandlerContext<
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
      type: "block_actions",
      actions: [DEFAULT_ACTION],
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
        team_id: "123",
      },
      team: {
        id: "123",
        domain: "asdf",
      },
      enterprise: null,
      is_enterprise_install: false,
      api_app_id: "123",
      token: "123",
      trigger_id: "123",
      response_url: "asdf",
    };
    const token = args.token || "slack-function-test-token";

    return {
      inputs,
      env: args.env || {},
      token,
      client: SlackAPI(token),
      team_id: args.team_id || "test-team-id",
      enterprise_id: "",
      action: args.action || DEFAULT_ACTION,
      body: args.body || DEFAULT_BODY,
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
const { createContext } = SlackActionHandlerTester(func);
const inputs = { garbage: "in, garbage out" };

const getRouter = () => {
  return BlockActionsRouter(func);
};

Deno.test("ActionsRouter", async (t) => {
  await t.step(
    "export method returns result of handler when matching action comes in and baseline handler context parameters are present and exist",
    async () => {
      const router = getRouter();
      let handlerCalled = false;
      router.addHandler(DEFAULT_ACTION.action_id, (ctx) => {
        assertExists(ctx.inputs);
        assertEquals<string>(ctx.inputs.garbage, inputs.garbage);
        assertExists(ctx.token);
        assertExists(ctx.action);
        assertExists(ctx.env);
        assertExists(ctx.client);
        handlerCalled = true;
      });
      await router(createContext({ inputs }));
      assertEquals(handlerCalled, true, "action handler not called!");
    },
  );
});

Deno.test("ActionsRouter action matching happy path", async (t) => {
  await t.step("simple string matching to action_id", async () => {
    const router = getRouter();
    let handlerCalled = false;
    router.addHandler(DEFAULT_ACTION.action_id, (ctx) => {
      assertExists(ctx.inputs);
      assertExists(ctx.token);
      assertExists(ctx.action);
      assertExists(ctx.env);
      assertExists(ctx.client);
      handlerCalled = true;
    });
    await router(createContext({ inputs }));
    assertEquals(handlerCalled, true, "action handler not called!");
  });
  await t.step("array of strings matching to action_id", async () => {
    const router = getRouter();
    const handler = mock.spy();
    router.addHandler(["nope", DEFAULT_ACTION.action_id], handler);
    await router(createContext({ inputs }));
    mock.assertSpyCalls(handler, 1);
  });
  await t.step("regex matching to action_id", async () => {
    const router = getRouter();
    const handler = mock.spy();
    router.addHandler(/action/, handler);
    await router(createContext({ inputs }));
    mock.assertSpyCalls(handler, 1);
  });
  await t.step("{action_id:string} matching to action_id", async () => {
    const router = getRouter();
    const handler = mock.spy();
    router.addHandler({ action_id: DEFAULT_ACTION.action_id }, handler);
    await router(createContext({ inputs }));
    mock.assertSpyCalls(handler, 1);
  });
  await t.step("{action_id:[string]} matching to action_id", async () => {
    const router = getRouter();
    const handler = mock.spy();
    router.addHandler(
      { action_id: ["hahtrickedyou", DEFAULT_ACTION.action_id] },
      handler,
    );
    await router(createContext({ inputs }));
    mock.assertSpyCalls(handler, 1);
  });
  await t.step("{action_id:regex} matching to action_id", async () => {
    const router = getRouter();
    const handler = mock.spy();
    router.addHandler({ action_id: /action/ }, handler);
    await router(createContext({ inputs }));
    mock.assertSpyCalls(handler, 1);
  });
  await t.step("{block_id:string} matching to block_id", async () => {
    const router = getRouter();
    const handler = mock.spy();
    router.addHandler({ block_id: DEFAULT_ACTION.block_id }, handler);
    await router(createContext({ inputs }));
    mock.assertSpyCalls(handler, 1);
  });
  await t.step("{block_id:[string]} matching to block_id", async () => {
    const router = getRouter();
    const handler = mock.spy();
    router.addHandler(
      { block_id: ["lol", DEFAULT_ACTION.block_id] },
      handler,
    );
    await router(createContext({ inputs }));
    mock.assertSpyCalls(handler, 1);
  });
  await t.step("{block_id:regex} matching to block_id", async () => {
    const router = getRouter();
    const handler = mock.spy();
    router.addHandler({ block_id: /block/ }, handler);
    await router(createContext({ inputs }));
    mock.assertSpyCalls(handler, 1);
  });
  await t.step(
    "{block_id:string, action_id:string} matching to both block_id and action_id",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        block_id: DEFAULT_ACTION.block_id,
        action_id: DEFAULT_ACTION.action_id,
      }, handler);
      await router(createContext({ inputs }));
      mock.assertSpyCalls(handler, 1);
    },
  );
  await t.step(
    "{block_id:string, action_id:[string]} matching to both block_id and action_id",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        block_id: DEFAULT_ACTION.block_id,
        action_id: ["notthisoneeither", DEFAULT_ACTION.action_id],
      }, handler);
      await router(createContext({ inputs }));
      mock.assertSpyCalls(handler, 1);
    },
  );
  await t.step(
    "{block_id:string, action_id:regex} matching to both block_id and action_id",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler(
        { block_id: DEFAULT_ACTION.block_id, action_id: /action/ },
        handler,
      );
      await router(createContext({ inputs }));
      mock.assertSpyCalls(handler, 1);
    },
  );
  await t.step(
    "{block_id:[string], action_id:string} matching to both block_id and action_id",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        block_id: ["notthistime", DEFAULT_ACTION.block_id],
        action_id: DEFAULT_ACTION.action_id,
      }, handler);
      await router(createContext({ inputs }));
      mock.assertSpyCalls(handler, 1);
    },
  );
  await t.step(
    "{block_id:[string], action_id:[string]} matching to both block_id and action_id",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        block_id: ["notthistime", DEFAULT_ACTION.block_id],
        action_id: ["gotyougood", DEFAULT_ACTION.action_id],
      }, handler);
      await router(createContext({ inputs }));
      mock.assertSpyCalls(handler, 1);
    },
  );
  await t.step(
    "{block_id:[string], action_id:regex} matching to both block_id and action_id",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        block_id: ["notthistime", DEFAULT_ACTION.block_id],
        action_id: /action/,
      }, handler);
      await router(createContext({ inputs }));
      mock.assertSpyCalls(handler, 1);
    },
  );
  await t.step(
    "{block_id:regex, action_id:string} matching to both block_id and action_id",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler(
        { block_id: /block/, action_id: DEFAULT_ACTION.action_id },
        handler,
      );
      await router(createContext({ inputs }));
      mock.assertSpyCalls(handler, 1);
    },
  );
  await t.step(
    "{block_id:regex, action_id:[string]} matching to both block_id and action_id",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        block_id: /block/,
        action_id: ["hahanope", DEFAULT_ACTION.action_id],
      }, handler);
      await router(createContext({ inputs }));
      mock.assertSpyCalls(handler, 1);
    },
  );
  await t.step(
    "{block_id:regex, action_id:regex} matching to both block_id and action_id",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({ block_id: /block/, action_id: /action/ }, handler);
      await router(createContext({ inputs }));
      mock.assertSpyCalls(handler, 1);
    },
  );
});

Deno.test("ActionsRouter action matching sad path", async (t) => {
  await t.step("unhandled action should throw", async () => {
    const router = getRouter();
    await assertRejects(() => router(createContext({ inputs })));
  });

  await t.step("no false positives", async (t) => {
    await t.step(
      "not matching action_id: string",
      async () => {
        const router = getRouter();
        const handler = mock.spy();
        router.addHandler("nope", handler);

        await assertRejects(() => router(createContext({ inputs })));
        mock.assertSpyCalls(handler, 0);
      },
    );
  });

  await t.step(
    "not matching action_id: string[]",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler(["nope", "nuh uh"], handler);

      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );

  await t.step(
    "not matching action_id: regex",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler(/regex/, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );

  await t.step(
    "not matching {action_id: string}",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({ action_id: "nope" }, () => handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: string[]}",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({ action_id: ["nope", "nuh uh"] }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: regex}",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({ action_id: /regex/ }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {block_id: string}",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({ block_id: "nope" }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {block_id: string[]}",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({ block_id: ["nope", "nuh uh"] }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {block_id: regex}",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({ block_id: /regex/ }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: string, block_id: regex}, action_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        action_id: "not good enough",
        block_id: /block/,
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: string, block_id: regex}, block_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        action_id: "action_id",
        block_id: /noway/,
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: string, block_id: string[]}, action_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        action_id: "not good enough",
        block_id: ["notthisonebut", "block_id"],
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: string, block_id: string}, block_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        action_id: "action_id",
        block_id: ["this", "wont", "work"],
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: string, block_id: string}, action_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        action_id: "not good enough",
        block_id: "block_id",
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: string, block_id: string}, block_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        action_id: "action_id",
        block_id: "nicetry",
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: string[], block_id: regex}, action_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        action_id: ["not", "good", "enough"],
        block_id: /block/,
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: string[], block_id: regex}, block_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        action_id: ["decoy", "action_id"],
        block_id: /noway/,
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: string[], block_id: string[]}, action_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        action_id: ["not", "good", "enough"],
        block_id: ["notthisonebut", "block_id"],
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: string[], block_id: string}, block_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        action_id: ["decoy", "action_id"],
        block_id: ["this", "wont", "work"],
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: string[], block_id: string}, action_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        action_id: ["not", "good", "enough"],
        block_id: "block_id",
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: string[], block_id: string}, block_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        action_id: ["decoy", "action_id"],
        block_id: "nicetry",
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: regex, block_id: regex}, action_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        action_id: /heh/,
        block_id: /block/,
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: regex, block_id: regex}, block_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        action_id: /action/,
        block_id: /noway/,
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: regex, block_id: string[]}, action_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        action_id: /hah/,
        block_id: ["notthisonebut", "block_id"],
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: regex, block_id: string}, block_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        action_id: /action/,
        block_id: ["this", "wont", "work"],
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: regex, block_id: string}, action_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        action_id: /huh/,
        block_id: "block_id",
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: regex, block_id: string}, block_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy();
      router.addHandler({
        action_id: /action/,
        block_id: "nicetry",
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
});
