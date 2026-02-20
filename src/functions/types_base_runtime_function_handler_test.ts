import { assertEquals } from "../dev_deps.ts";
import { SlackFunctionTester } from "./tester/mod.ts";
import type { BaseRuntimeSlackFunctionHandler } from "./types.ts";

// These tests are to ensure our Function Handler types are supporting the use cases we want to
// Any "failures" here will most likely be reflected in Type errors

Deno.test("BaseRuntimeSlackFunctionHandler types", () => {
  type Inputs = {
    in: string;
  };
  type Outputs = {
    out: string;
  };
  const handler: BaseRuntimeSlackFunctionHandler<Inputs, Outputs> = (
    { inputs },
  ) => {
    return {
      outputs: {
        out: inputs.in,
      },
    };
  };
  const { createContext } = SlackFunctionTester("test");
  const inputs = { in: "test" };
  const result = handler(createContext({ inputs }));
  assertEquals(result.outputs?.out, inputs.in);
});

Deno.test("BaseRuntimeSlackFunctionHandler with empty inputs and empty outputs", () => {
  type Inputs = Record<never, never>;
  type Outputs = Record<never, never>;
  const handler: BaseRuntimeSlackFunctionHandler<Inputs, Outputs> = () => {
    return {
      outputs: {},
    };
  };
  const { createContext } = SlackFunctionTester("test");
  const result = handler(createContext({ inputs: {} }));
  assertEquals(result.outputs, {});
});

Deno.test("BaseRuntimeSlackFunctionHandler with undefined inputs and outputs", () => {
  type Inputs = undefined;
  type Outputs = undefined;
  const handler: BaseRuntimeSlackFunctionHandler<Inputs, Outputs> = () => {
    return {
      outputs: {},
    };
  };
  const { createContext } = SlackFunctionTester("test");
  const result = handler(createContext({ inputs: undefined }));
  assertEquals(result.outputs, {});
});

Deno.test("BaseRuntimeSlackFunctionHandler with inputs and empty outputs", () => {
  type Inputs = {
    in: string;
  };
  type Outputs = Record<never, never>;
  const handler: BaseRuntimeSlackFunctionHandler<Inputs, Outputs> = (
    { inputs },
  ) => {
    const _test = inputs.in;

    return {
      outputs: {},
    };
  };
  const { createContext } = SlackFunctionTester("test");
  const inputs = { in: "test" };
  const result = handler(createContext({ inputs }));
  assertEquals(result.outputs, {});
});

Deno.test("BaseRuntimeSlackFunctionHandler with empty inputs and outputs", () => {
  type Inputs = Record<never, never>;
  type Outputs = {
    out: string;
  };
  const handler: BaseRuntimeSlackFunctionHandler<Inputs, Outputs> = () => {
    return {
      outputs: {
        out: "test",
      },
    };
  };
  const { createContext } = SlackFunctionTester("test");
  const result = handler(createContext({ inputs: {} }));
  assertEquals(result.outputs?.out, "test");
});

Deno.test("BaseRuntimeSlackFunctionHandler with any inputs and any outputs", () => {
  // deno-lint-ignore no-explicit-any
  const handler: BaseRuntimeSlackFunctionHandler<any, any> = ({ inputs }) => {
    return {
      outputs: {
        out: inputs.in,
      },
    };
  };
  const { createContext } = SlackFunctionTester("test");
  const inputs = { in: "test" };
  const result = handler(createContext({ inputs }));
  assertEquals(result.outputs?.out, inputs.in);
});

Deno.test("BaseRuntimeSlackFunctionHandler with no inputs and error output", () => {
  // deno-lint-ignore no-explicit-any
  const handler: BaseRuntimeSlackFunctionHandler<any, { example: string }> =
    () => {
      return {
        error: "error",
      };
    };
  const { createContext } = SlackFunctionTester("test");
  const result = handler(createContext({ inputs: {} }));
  assertEquals(result.error, "error");
});

Deno.test("BaseRuntimeSlackFunctionHandler with no inputs and completed false output", () => {
  // deno-lint-ignore no-explicit-any
  const handler: BaseRuntimeSlackFunctionHandler<any, { example: boolean }> =
    () => {
      return {
        completed: false,
      };
    };
  const { createContext } = SlackFunctionTester("test");
  const result = handler(createContext({ inputs: {} }));
  assertEquals(result.completed, false);
});

Deno.test("BaseRuntimeSlackFunctionHandler with set inputs and any outputs", () => {
  type Inputs = {
    in: string;
  };
  // deno-lint-ignore no-explicit-any
  const handler: BaseRuntimeSlackFunctionHandler<Inputs, any> = (
    { inputs },
  ) => {
    return {
      outputs: {
        out: inputs.in,
      },
    };
  };
  const { createContext } = SlackFunctionTester("test");
  const inputs = { in: "test" };
  const result = handler(createContext({ inputs }));
  assertEquals(result.outputs?.out, inputs.in);
});

Deno.test("BaseRuntimeSlackFunctionHandler with input and output objects", () => {
  type Inputs = {
    anObject: {
      in: string;
    };
  };
  type Outputs = {
    anObject: {
      out: string;
    };
  };
  const handler: BaseRuntimeSlackFunctionHandler<Inputs, Outputs> = (
    { inputs },
  ) => {
    return {
      outputs: {
        anObject: { out: inputs.anObject.in },
      },
    };
  };
  const { createContext } = SlackFunctionTester("test");
  const inputs = { anObject: { in: "test" } };
  const result = handler(createContext({ inputs }));
  assertEquals(result.outputs?.anObject?.out, inputs.anObject.in);
});
