import { assertEquals } from "../../dev_deps.ts";
import { SlackFunctionTester } from "./mod.ts";
import { DefineFunction } from "../mod.ts";
import { Schema } from "../../mod.ts";

Deno.test("SlackFunctionTester.createContext using a string for callback_id", () => {
  const callbackId = "my_callback_id";
  const { createContext } = SlackFunctionTester(callbackId);

  const inputs = {
    myValue: "some value",
  };

  const ctxWithInputs = createContext({
    inputs,
  });

  const ctxWithoutInputs = createContext({ inputs: {} });

  assertEquals(ctxWithInputs.inputs, inputs);
  assertEquals(ctxWithInputs.env, {});
  assertEquals(typeof ctxWithInputs.token, "string");
  assertEquals(ctxWithInputs.event.type, "function_executed");
  assertEquals(ctxWithInputs.event.function.callback_id, callbackId);

  assertEquals(ctxWithoutInputs.inputs, {});
  assertEquals(ctxWithoutInputs.event.function.callback_id, callbackId);
});

Deno.test("SlackFunctionTester.createContext using Function definitions", () => {
  const callbackId = "my_callback_id";
  const TestFunction = DefineFunction({
    callback_id: callbackId,
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        myValue: { type: Schema.types.string },
        myOptionalValue: { type: Schema.types.boolean },
      },
      required: ["myValue"],
    },
  });

  const { createContext } = SlackFunctionTester(TestFunction);
  const requiredCtx = createContext({
    inputs: { myValue: "some value" },
  });

  const optionalCtx = createContext({
    inputs: { myValue: "some value", myOptionalValue: true },
  });

  assertEquals(requiredCtx.inputs, { myValue: "some value" });
  assertEquals(requiredCtx.env, {});
  assertEquals(typeof requiredCtx.token, "string");
  assertEquals(requiredCtx.event.type, "function_executed");
  assertEquals(requiredCtx.event.function.callback_id, callbackId);

  assertEquals(optionalCtx.inputs, {
    myValue: "some value",
    myOptionalValue: true,
  });
});

Deno.test("SlackFunctionTester.createContext with empty inputs", () => {
  const callbackId = "my_callback_id";
  const { createContext } = SlackFunctionTester(callbackId);

  const ctx = createContext({ inputs: {} });

  assertEquals(ctx.inputs, {});
  assertEquals(ctx.env, {});
  assertEquals(typeof ctx.token, "string");
  assertEquals(ctx.event.type, "function_executed");
  assertEquals(ctx.event.function.callback_id, callbackId);
});
