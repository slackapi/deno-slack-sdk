import { assertEquals } from "../dev_deps.ts";
import { SlackFunctionTester } from "./function_tester.ts";
import { DefineFunction } from "./mod.ts";

Deno.test("SlackFunctionTester.createContext", () => {
  const callbackId = "my_callback_id";
  const TestFunction = DefineFunction({
    callback_id: callbackId,
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        myValue: { type: "string" },
      },
      required: ["myValue"],
    },
  });
  const { createContext } = SlackFunctionTester(TestFunction.definition);

  const inputs = {
    myValue: "some value",
  };
  const ctx = createContext({
    inputs,
  });

  assertEquals(ctx.inputs, inputs);
  assertEquals(ctx.env, {});
  assertEquals(typeof ctx.token, "string");
  assertEquals(ctx.event.type, "function_executed");
  assertEquals(ctx.event.function.callback_id, callbackId);
});

Deno.test("SlackFunctionTester.createContext with empty inputs", () => {
  const callbackId = "my_callback_id";
  const TestFunction = DefineFunction({
    callback_id: callbackId,
    source_file: "test",
    title: "Test",
  });
  const { createContext } = SlackFunctionTester(TestFunction.definition);

  const ctx = createContext({ inputs: {} });

  assertEquals(ctx.inputs, {});
  assertEquals(ctx.env, {});
  assertEquals(typeof ctx.token, "string");
  assertEquals(ctx.event.type, "function_executed");
  assertEquals(ctx.event.function.callback_id, callbackId);
});
