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
    required: ["garbage"],
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
        assertEquals<string>(ctx.inputs.garbage, inputs.garbage);
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
      reset();
      await t.step("no false positives", async (t) => {
        // for these false positive tests, console.warn can be noisy, so lets turn it into a temporary no-op
        const originalWarn = console.warn;
        console.warn = () => {};
        await t.step(
          "not matching action_id: string",
          async () => {
            let handlerCalled = 0;
            router.addHandler("nope", () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching action_id: string[]",
          async () => {
            let handlerCalled = 0;
            router.addHandler(["nope", "nuh uh"], () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching action_id: regex",
          async () => {
            let handlerCalled = 0;
            router.addHandler(/regex/, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {action_id: string}",
          async () => {
            let handlerCalled = 0;
            router.addHandler({ action_id: "nope" }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {action_id: string[]}",
          async () => {
            let handlerCalled = 0;
            router.addHandler({ action_id: ["nope", "nuh uh"] }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {action_id: regex}",
          async () => {
            let handlerCalled = 0;
            router.addHandler({ action_id: /regex/ }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {block_id: string}",
          async () => {
            let handlerCalled = 0;
            router.addHandler({ block_id: "nope" }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {block_id: string[]}",
          async () => {
            let handlerCalled = 0;
            router.addHandler({ block_id: ["nope", "nuh uh"] }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {block_id: regex}",
          async () => {
            let handlerCalled = 0;
            router.addHandler({ block_id: /regex/ }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {action_id: string, block_id: regex}, action_id does not match",
          async () => {
            let handlerCalled = 0;
            router.addHandler({
              action_id: "not good enough",
              block_id: /block/,
            }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {action_id: string, block_id: regex}, block_id does not match",
          async () => {
            let handlerCalled = 0;
            router.addHandler({
              action_id: "action_id",
              block_id: /noway/,
            }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {action_id: string, block_id: string[]}, action_id does not match",
          async () => {
            let handlerCalled = 0;
            router.addHandler({
              action_id: "not good enough",
              block_id: ["notthisonebut", "block_id"],
            }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {action_id: string, block_id: string}, block_id does not match",
          async () => {
            let handlerCalled = 0;
            router.addHandler({
              action_id: "action_id",
              block_id: ["this", "wont", "work"],
            }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {action_id: string, block_id: string}, action_id does not match",
          async () => {
            let handlerCalled = 0;
            router.addHandler({
              action_id: "not good enough",
              block_id: "block_id",
            }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {action_id: string, block_id: string}, block_id does not match",
          async () => {
            let handlerCalled = 0;
            router.addHandler({
              action_id: "action_id",
              block_id: "nicetry",
            }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {action_id: string[], block_id: regex}, action_id does not match",
          async () => {
            let handlerCalled = 0;
            router.addHandler({
              action_id: ["not", "good", "enough"],
              block_id: /block/,
            }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {action_id: string[], block_id: regex}, block_id does not match",
          async () => {
            let handlerCalled = 0;
            router.addHandler({
              action_id: ["decoy", "action_id"],
              block_id: /noway/,
            }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {action_id: string[], block_id: string[]}, action_id does not match",
          async () => {
            let handlerCalled = 0;
            router.addHandler({
              action_id: ["not", "good", "enough"],
              block_id: ["notthisonebut", "block_id"],
            }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {action_id: string[], block_id: string}, block_id does not match",
          async () => {
            let handlerCalled = 0;
            router.addHandler({
              action_id: ["decoy", "action_id"],
              block_id: ["this", "wont", "work"],
            }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {action_id: string[], block_id: string}, action_id does not match",
          async () => {
            let handlerCalled = 0;
            router.addHandler({
              action_id: ["not", "good", "enough"],
              block_id: "block_id",
            }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {action_id: string[], block_id: string}, block_id does not match",
          async () => {
            let handlerCalled = 0;
            router.addHandler({
              action_id: ["decoy", "action_id"],
              block_id: "nicetry",
            }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {action_id: regex, block_id: regex}, action_id does not match",
          async () => {
            let handlerCalled = 0;
            router.addHandler({
              action_id: /heh/,
              block_id: /block/,
            }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {action_id: regex, block_id: regex}, block_id does not match",
          async () => {
            let handlerCalled = 0;
            router.addHandler({
              action_id: /action/,
              block_id: /noway/,
            }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {action_id: regex, block_id: string[]}, action_id does not match",
          async () => {
            let handlerCalled = 0;
            router.addHandler({
              action_id: /hah/,
              block_id: ["notthisonebut", "block_id"],
            }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {action_id: regex, block_id: string}, block_id does not match",
          async () => {
            let handlerCalled = 0;
            router.addHandler({
              action_id: /action/,
              block_id: ["this", "wont", "work"],
            }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {action_id: regex, block_id: string}, action_id does not match",
          async () => {
            let handlerCalled = 0;
            router.addHandler({
              action_id: /huh/,
              block_id: "block_id",
            }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        reset();
        await t.step(
          "not matching {action_id: regex, block_id: string}, block_id does not match",
          async () => {
            let handlerCalled = 0;
            router.addHandler({
              action_id: /action/,
              block_id: "nicetry",
            }, () => {
              handlerCalled++;
            });
            await router(createContext({ inputs }));
            assertEquals(
              handlerCalled,
              0,
              "action handler called when it should not be",
            );
          },
        );
        console.warn = originalWarn;
      });
    });
  });
});
