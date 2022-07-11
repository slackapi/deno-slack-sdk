import { assertEquals, assertExists, assertMatch } from "../../dev_deps.ts";
import { BlockActionsRouter } from "./action_router.ts";
import { DefineFunction, Schema } from "../../mod.ts";
import { DEFAULT_ACTION, SlackActionHandlerTester } from "../tester/mod.ts";

// Test fixtures: a basic function definition and associated block action router to test
const func = DefineFunction({
  callback_id: "id",
  title: "test",
  source_file: "whatever",
  input_parameters: {
    properties: {
      garbage: { type: Schema.types.string },
    },
    required: [],
  },
});
const { createContext } = SlackActionHandlerTester(func);
const inputs = { garbage: "in, garbage out" };
let router = BlockActionsRouter(func);

const reset = () => {
  router = BlockActionsRouter(func);
};

Deno.test("ActionsRouter", async (t) => {
  await t.step(
    "export method returns result of handler when matching action comes in and baseline handler context parameters are present and exist",
    async () => {
      let handlerCalled = false;
      router.addHandler(DEFAULT_ACTION.action_id, (ctx) => {
        assertExists(ctx.inputs);
        assertEquals<string>(ctx.inputs.garbage as string, inputs.garbage);
        assertExists(ctx.token);
        assertExists(ctx.action);
        assertExists(ctx.env);
        handlerCalled = true;
      });
      await router(createContext({ inputs }));
      assertEquals(handlerCalled, true, "action handler not called!");
    },
  );
  reset();
  await t.step("action matching", async (t) => {
    await t.step("happy path", async (t) => {
      await t.step("simple string matching to action_id", async () => {
        let handlerCalled = false;
        router.addHandler(DEFAULT_ACTION.action_id, (ctx) => {
          assertExists(ctx.inputs);
          assertExists(ctx.token);
          assertExists(ctx.action);
          assertExists(ctx.env);
          handlerCalled = true;
        });
        await router(createContext({ inputs }));
        assertEquals(handlerCalled, true, "action handler not called!");
      });
      reset();
      await t.step("array of strings matching to action_id", async () => {
        let handlerCalled = 0;
        router.addHandler(["nope", DEFAULT_ACTION.action_id], () => {
          handlerCalled++;
        });
        await router(createContext({ inputs }));
        assertEquals(
          handlerCalled,
          1,
          "action handler not called exactly once",
        );
      });
      reset();
      await t.step("regex matching to action_id", async () => {
        let handlerCalled = 0;
        router.addHandler(/action/, () => {
          handlerCalled++;
        });
        await router(createContext({ inputs }));
        assertEquals(
          handlerCalled,
          1,
          "action handler not called exactly once",
        );
      });
      reset();
      await t.step("{action_id:string} matching to action_id", async () => {
        let handlerCalled = 0;
        router.addHandler({ action_id: DEFAULT_ACTION.action_id }, () => {
          handlerCalled++;
        });
        await router(createContext({ inputs }));
        assertEquals(
          handlerCalled,
          1,
          "action handler not called exactly once",
        );
      });
      reset();
      await t.step("{action_id:[string]} matching to action_id", async () => {
        let handlerCalled = 0;
        router.addHandler(
          { action_id: ["hahtrickedyou", DEFAULT_ACTION.action_id] },
          () => {
            handlerCalled++;
          },
        );
        await router(createContext({ inputs }));
        assertEquals(
          handlerCalled,
          1,
          "action handler not called exactly once",
        );
      });
      reset();
      await t.step("{action_id:regex} matching to action_id", async () => {
        let handlerCalled = 0;
        router.addHandler({ action_id: /action/ }, () => {
          handlerCalled++;
        });
        await router(createContext({ inputs }));
        assertEquals(
          handlerCalled,
          1,
          "action handler not called exactly once",
        );
      });
      reset();
      await t.step("{block_id:string} matching to block_id", async () => {
        let handlerCalled = 0;
        router.addHandler({ block_id: DEFAULT_ACTION.block_id }, () => {
          handlerCalled++;
        });
        await router(createContext({ inputs }));
        assertEquals(
          handlerCalled,
          1,
          "action handler not called exactly once",
        );
      });
      reset();
      await t.step("{block_id:[string]} matching to block_id", async () => {
        let handlerCalled = 0;
        router.addHandler(
          { block_id: ["lol", DEFAULT_ACTION.block_id] },
          () => {
            handlerCalled++;
          },
        );
        await router(createContext({ inputs }));
        assertEquals(
          handlerCalled,
          1,
          "action handler not called exactly once",
        );
      });
      reset();
      await t.step("{block_id:regex} matching to block_id", async () => {
        let handlerCalled = 0;
        router.addHandler({ block_id: /block/ }, () => {
          handlerCalled++;
        });
        await router(createContext({ inputs }));
        assertEquals(
          handlerCalled,
          1,
          "action handler not called exactly once",
        );
      });
      reset();
      await t.step(
        "{block_id:string, action_id:string} matching to both block_id and action_id",
        async () => {
          let handlerCalled = 0;
          router.addHandler({
            block_id: DEFAULT_ACTION.block_id,
            action_id: DEFAULT_ACTION.action_id,
          }, () => {
            handlerCalled++;
          });
          await router(createContext({ inputs }));
          assertEquals(
            handlerCalled,
            1,
            "action handler not called exactly once",
          );
        },
      );
      reset();
      await t.step(
        "{block_id:string, action_id:[string]} matching to both block_id and action_id",
        async () => {
          let handlerCalled = 0;
          router.addHandler({
            block_id: DEFAULT_ACTION.block_id,
            action_id: ["notthisoneeither", DEFAULT_ACTION.action_id],
          }, () => {
            handlerCalled++;
          });
          await router(createContext({ inputs }));
          assertEquals(
            handlerCalled,
            1,
            "action handler not called exactly once",
          );
        },
      );
      reset();
      await t.step(
        "{block_id:string, action_id:regex} matching to both block_id and action_id",
        async () => {
          let handlerCalled = 0;
          router.addHandler(
            { block_id: DEFAULT_ACTION.block_id, action_id: /action/ },
            () => {
              handlerCalled++;
            },
          );
          await router(createContext({ inputs }));
          assertEquals(
            handlerCalled,
            1,
            "action handler not called exactly once",
          );
        },
      );
      reset();
      await t.step(
        "{block_id:[string], action_id:string} matching to both block_id and action_id",
        async () => {
          let handlerCalled = 0;
          router.addHandler({
            block_id: ["notthistime", DEFAULT_ACTION.block_id],
            action_id: DEFAULT_ACTION.action_id,
          }, () => {
            handlerCalled++;
          });
          await router(createContext({ inputs }));
          assertEquals(
            handlerCalled,
            1,
            "action handler not called exactly once",
          );
        },
      );
      reset();
      await t.step(
        "{block_id:[string], action_id:[string]} matching to both block_id and action_id",
        async () => {
          let handlerCalled = 0;
          router.addHandler({
            block_id: ["notthistime", DEFAULT_ACTION.block_id],
            action_id: ["gotyougood", DEFAULT_ACTION.action_id],
          }, () => {
            handlerCalled++;
          });
          await router(createContext({ inputs }));
          assertEquals(
            handlerCalled,
            1,
            "action handler not called exactly once",
          );
        },
      );
      reset();
      await t.step(
        "{block_id:[string], action_id:regex} matching to both block_id and action_id",
        async () => {
          let handlerCalled = 0;
          router.addHandler({
            block_id: ["notthistime", DEFAULT_ACTION.block_id],
            action_id: /action/,
          }, () => {
            handlerCalled++;
          });
          await router(createContext({ inputs }));
          assertEquals(
            handlerCalled,
            1,
            "action handler not called exactly once",
          );
        },
      );
      reset();
      await t.step(
        "{block_id:regex, action_id:string} matching to both block_id and action_id",
        async () => {
          let handlerCalled = 0;
          router.addHandler(
            { block_id: /block/, action_id: DEFAULT_ACTION.action_id },
            () => {
              handlerCalled++;
            },
          );
          await router(createContext({ inputs }));
          assertEquals(
            handlerCalled,
            1,
            "action handler not called exactly once",
          );
        },
      );
      reset();
      await t.step(
        "{block_id:regex, action_id:[string]} matching to both block_id and action_id",
        async () => {
          let handlerCalled = 0;
          router.addHandler({
            block_id: /block/,
            action_id: ["hahanope", DEFAULT_ACTION.action_id],
          }, () => {
            handlerCalled++;
          });
          await router(createContext({ inputs }));
          assertEquals(
            handlerCalled,
            1,
            "action handler not called exactly once",
          );
        },
      );
      reset();
      await t.step(
        "{block_id:regex, action_id:regex} matching to both block_id and action_id",
        async () => {
          let handlerCalled = 0;
          router.addHandler({ block_id: /block/, action_id: /action/ }, () => {
            handlerCalled++;
          });
          await router(createContext({ inputs }));
          assertEquals(
            handlerCalled,
            1,
            "action handler not called exactly once",
          );
        },
      );
      reset();
    });
    reset();
    await t.step("sad path", async (t) => {
      await t.step("unhandled action should log to console", async () => {
        const originalWarn = console.warn;
        let warnCalled = 0;
        // deno-lint-ignore no-explicit-any
        console.warn = (...data: any[]) => {
          warnCalled++;
          const warn = data[0];
          assertMatch(warn, /no action handler defined/);
        };
        await router(createContext({ inputs }));
        assertEquals(
          warnCalled,
          1,
          "console.warn not called exactly once",
        );
        console.warn = originalWarn;
      });
    });
  });
});
