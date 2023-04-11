import { assertEquals, mock } from "../../dev_deps.ts";
import { DEFAULT_FUNCTION_TESTER_TITLE, SlackFunctionTester } from "./mod.ts";
import { DefineFunction } from "../mod.ts";
import { Schema, SlackFunction } from "../../mod.ts";

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
  assertEquals(
    ctxWithInputs.event.function.title,
    DEFAULT_FUNCTION_TESTER_TITLE,
  );

  assertEquals(ctxWithoutInputs.inputs, {});
  assertEquals(ctxWithoutInputs.event.function.callback_id, callbackId);
});

Deno.test("SlackFunctionTester.createContext using function definitions", () => {
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
  assertEquals(requiredCtx.event.function.title, TestFunction.definition.title);

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

Deno.test("SlackFunctionTester with a SlackFunction()", async () => {
  const callbackId = "my_callback_id";
  const outputValue = "an-output-value";
  const { createContext } = SlackFunctionTester(callbackId);

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
    output_parameters: {
      properties: {
        myOutput: { type: Schema.types.string },
      },
      required: ["myOutput"],
    },
  });

  const handlerSpy = mock.spy(() => {
    return { outputs: { myOutput: outputValue } };
  });

  const handler = SlackFunction(TestFunction, handlerSpy);
  const ctx = createContext({ inputs: { myValue: "test" } });
  const resp = await handler(ctx);
  assertEquals(resp.outputs?.myOutput, outputValue);
});
