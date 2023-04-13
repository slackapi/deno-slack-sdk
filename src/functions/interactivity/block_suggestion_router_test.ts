import { SlackAPI } from "../../deps.ts";
import {
  assertEquals,
  assertExists,
  assertRejects,
  mock,
} from "../../dev_deps.ts";
import { BlockSuggestionRouter } from "./block_suggestion_router.ts";
import type { SuggestionContext } from "./types.ts";
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
type SlackSuggestionHandlerTesterArgs<
  InputParameters extends FunctionParameters,
> =
  & Partial<
    SuggestionContext<InputParameters>
  >
  & {
    inputs: InputParameters;
  };

type CreateSuggestionHandlerContext<
  InputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
> = {
  (
    args: SlackSuggestionHandlerTesterArgs<
      FunctionRuntimeParameters<InputParameters, RequiredInput>
    >,
  ): SuggestionContext<
    FunctionRuntimeParameters<InputParameters, RequiredInput>
  >;
};

type SlackSuggestionHandlerTesterResponse<
  InputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
> = {
  createContext: CreateSuggestionHandlerContext<InputParameters, RequiredInput>;
};

type SlackSuggestionHandlerTesterSignature = {
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
  ): SlackSuggestionHandlerTesterResponse<
    InputParameters,
    RequiredInput
  >;
};

const DEFAULT_ACTION_ID = "action_id";
const DEFAULT_BLOCK_ID = "block_id";
// deno-lint-ignore no-explicit-any
const generateSuggestion = (inputs: any) => ({
  block_id: DEFAULT_BLOCK_ID,
  action_id: DEFAULT_ACTION_ID,
  value: "ohai",
  type: "block_suggestion",
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
  api_app_id: "123",
});

const SlackSuggestionHandlerTester: SlackSuggestionHandlerTesterSignature = <
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
  const createContext: CreateSuggestionHandlerContext<
    InputParameters,
    RequiredInput
  > = (
    args,
  ) => {
    const inputs = (args.inputs || {}) as FunctionRuntimeParameters<
      InputParameters,
      RequiredInput
    >;
    const token = args.token || "slack-function-test-token";

    return {
      inputs,
      env: args.env || {},
      token,
      client: SlackAPI(token),
      team_id: args.team_id || "test-team-id",
      enterprise_id: "",
      body: args.body || generateSuggestion(inputs),
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
const { createContext } = SlackSuggestionHandlerTester(func);
const inputs = { garbage: "in, garbage out" };

const getRouter = () => {
  return BlockSuggestionRouter(func);
};

Deno.test("SuggestionRouter", async (t) => {
  await t.step(
    "export method returns result of handler when matching suggestion comes in and baseline handler context parameters are present and exist",
    async () => {
      const router = getRouter();
      let handlerCalled = false;
      router.addHandler(DEFAULT_ACTION_ID, (ctx) => {
        assertExists(ctx.inputs);
        assertEquals<string>(ctx.inputs.garbage, inputs.garbage);
        assertExists(ctx.token);
        assertExists(ctx.body);
        assertExists(ctx.env);
        assertExists(ctx.client);
        handlerCalled = true;
        return { options: [] };
      });
      await router(createContext({ inputs }));
      assertEquals(handlerCalled, true, "suggestion handler not called!");
    },
  );
});

Deno.test("SuggestionRouter matching happy path", async (t) => {
  await t.step("simple string matching to action_id", async () => {
    const router = getRouter();
    let handlerCalled = false;
    router.addHandler(DEFAULT_ACTION_ID, (ctx) => {
      assertExists(ctx.inputs);
      assertExists(ctx.token);
      assertExists(ctx.body);
      assertExists(ctx.env);
      assertExists(ctx.client);
      handlerCalled = true;
      return { options: [] };
    });
    await router(createContext({ inputs }));
    assertEquals(handlerCalled, true, "suggestion handler not called!");
  });
  await t.step("array of strings matching to action_id", async () => {
    const router = getRouter();
    const handler = mock.spy(() => ({ options: [] }));
    router.addHandler(["nope", DEFAULT_ACTION_ID], handler);
    await router(createContext({ inputs }));
    mock.assertSpyCalls(handler, 1);
  });
  await t.step("regex matching to action_id", async () => {
    const router = getRouter();
    const handler = mock.spy(() => ({ options: [] }));
    router.addHandler(/action/, handler);
    await router(createContext({ inputs }));
    mock.assertSpyCalls(handler, 1);
  });
  await t.step("{action_id:string} matching to action_id", async () => {
    const router = getRouter();
    const handler = mock.spy(() => ({ options: [] }));
    router.addHandler({ action_id: DEFAULT_ACTION_ID }, handler);
    await router(createContext({ inputs }));
    mock.assertSpyCalls(handler, 1);
  });
  await t.step("{action_id:[string]} matching to action_id", async () => {
    const router = getRouter();
    const handler = mock.spy(() => ({ options: [] }));
    router.addHandler(
      { action_id: ["hahtrickedyou", DEFAULT_ACTION_ID] },
      handler,
    );
    await router(createContext({ inputs }));
    mock.assertSpyCalls(handler, 1);
  });
  await t.step("{action_id:regex} matching to action_id", async () => {
    const router = getRouter();
    const handler = mock.spy(() => ({ options: [] }));
    router.addHandler({ action_id: /action/ }, handler);
    await router(createContext({ inputs }));
    mock.assertSpyCalls(handler, 1);
  });
  await t.step("{block_id:string} matching to block_id", async () => {
    const router = getRouter();
    const handler = mock.spy(() => ({ options: [] }));
    router.addHandler({ block_id: DEFAULT_BLOCK_ID }, handler);
    await router(createContext({ inputs }));
    mock.assertSpyCalls(handler, 1);
  });
  await t.step("{block_id:[string]} matching to block_id", async () => {
    const router = getRouter();
    const handler = mock.spy(() => ({ options: [] }));
    router.addHandler(
      { block_id: ["lol", DEFAULT_BLOCK_ID] },
      handler,
    );
    await router(createContext({ inputs }));
    mock.assertSpyCalls(handler, 1);
  });
  await t.step("{block_id:regex} matching to block_id", async () => {
    const router = getRouter();
    const handler = mock.spy(() => ({ options: [] }));
    router.addHandler({ block_id: /block/ }, handler);
    await router(createContext({ inputs }));
    mock.assertSpyCalls(handler, 1);
  });
  await t.step(
    "{block_id:string, action_id:string} matching to both block_id and action_id",
    async () => {
      const router = getRouter();
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({
        block_id: DEFAULT_BLOCK_ID,
        action_id: DEFAULT_ACTION_ID,
      }, handler);
      await router(createContext({ inputs }));
      mock.assertSpyCalls(handler, 1);
    },
  );
  await t.step(
    "{block_id:string, action_id:[string]} matching to both block_id and action_id",
    async () => {
      const router = getRouter();
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({
        block_id: DEFAULT_BLOCK_ID,
        action_id: ["notthisoneeither", DEFAULT_ACTION_ID],
      }, handler);
      await router(createContext({ inputs }));
      mock.assertSpyCalls(handler, 1);
    },
  );
  await t.step(
    "{block_id:string, action_id:regex} matching to both block_id and action_id",
    async () => {
      const router = getRouter();
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler(
        { block_id: DEFAULT_BLOCK_ID, action_id: /action/ },
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
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({
        block_id: ["notthistime", DEFAULT_BLOCK_ID],
        action_id: DEFAULT_ACTION_ID,
      }, handler);
      await router(createContext({ inputs }));
      mock.assertSpyCalls(handler, 1);
    },
  );
  await t.step(
    "{block_id:[string], action_id:[string]} matching to both block_id and action_id",
    async () => {
      const router = getRouter();
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({
        block_id: ["notthistime", DEFAULT_BLOCK_ID],
        action_id: ["gotyougood", DEFAULT_ACTION_ID],
      }, handler);
      await router(createContext({ inputs }));
      mock.assertSpyCalls(handler, 1);
    },
  );
  await t.step(
    "{block_id:[string], action_id:regex} matching to both block_id and action_id",
    async () => {
      const router = getRouter();
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({
        block_id: ["notthistime", DEFAULT_BLOCK_ID],
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
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler(
        { block_id: /block/, action_id: DEFAULT_ACTION_ID },
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
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({
        block_id: /block/,
        action_id: ["hahanope", DEFAULT_ACTION_ID],
      }, handler);
      await router(createContext({ inputs }));
      mock.assertSpyCalls(handler, 1);
    },
  );
  await t.step(
    "{block_id:regex, action_id:regex} matching to both block_id and action_id",
    async () => {
      const router = getRouter();
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({ block_id: /block/, action_id: /action/ }, handler);
      await router(createContext({ inputs }));
      mock.assertSpyCalls(handler, 1);
    },
  );
});

Deno.test("SuggestionRouter matching sad path", async (t) => {
  await t.step("unhandled suggestion should throw", async () => {
    const router = getRouter();
    await assertRejects(() => router(createContext({ inputs })));
  });

  await t.step("no false positives", async (t) => {
    await t.step(
      "not matching action_id: string",
      async () => {
        const router = getRouter();
        const handler = mock.spy(() => ({ options: [] }));
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
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler(["nope", "nuh uh"], handler);

      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );

  await t.step(
    "not matching action_id: regex",
    async () => {
      const router = getRouter();
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler(/regex/, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );

  await t.step(
    "not matching {action_id: string}",
    async () => {
      const router = getRouter();
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({ action_id: "nope" }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: string[]}",
    async () => {
      const router = getRouter();
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({ action_id: ["nope", "nuh uh"] }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: regex}",
    async () => {
      const router = getRouter();
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({ action_id: /regex/ }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {block_id: string}",
    async () => {
      const router = getRouter();
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({ block_id: "nope" }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {block_id: string[]}",
    async () => {
      const router = getRouter();
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({ block_id: ["nope", "nuh uh"] }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {block_id: regex}",
    async () => {
      const router = getRouter();
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({ block_id: /regex/ }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: string, block_id: regex}, action_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy(() => ({ options: [] }));
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
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({
        action_id: DEFAULT_ACTION_ID,
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
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({
        action_id: "not good enough",
        block_id: ["notthisonebut", DEFAULT_BLOCK_ID],
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: string, block_id: string}, block_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({
        action_id: DEFAULT_ACTION_ID,
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
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({
        action_id: "not good enough",
        block_id: DEFAULT_BLOCK_ID,
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: string, block_id: string}, block_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({
        action_id: DEFAULT_ACTION_ID,
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
      const handler = mock.spy(() => ({ options: [] }));
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
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({
        action_id: ["decoy", DEFAULT_ACTION_ID],
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
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({
        action_id: ["not", "good", "enough"],
        block_id: ["notthisonebut", DEFAULT_BLOCK_ID],
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: string[], block_id: string}, block_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({
        action_id: ["decoy", DEFAULT_ACTION_ID],
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
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({
        action_id: ["not", "good", "enough"],
        block_id: DEFAULT_BLOCK_ID,
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: string[], block_id: string}, block_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({
        action_id: ["decoy", DEFAULT_ACTION_ID],
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
      const handler = mock.spy(() => ({ options: [] }));
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
      const handler = mock.spy(() => ({ options: [] }));
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
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({
        action_id: /hah/,
        block_id: ["notthisonebut", DEFAULT_BLOCK_ID],
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: regex, block_id: string}, block_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy(() => ({ options: [] }));
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
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({
        action_id: /huh/,
        block_id: DEFAULT_BLOCK_ID,
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
  await t.step(
    "not matching {action_id: regex, block_id: string}, block_id does not match",
    async () => {
      const router = getRouter();
      const handler = mock.spy(() => ({ options: [] }));
      router.addHandler({
        action_id: /action/,
        block_id: "nicetry",
      }, handler);
      await assertRejects(() => router(createContext({ inputs })));
      mock.assertSpyCalls(handler, 0);
    },
  );
});
