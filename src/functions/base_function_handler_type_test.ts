import { assertEquals } from "../dev_deps.ts";
import { BaseSlackFunctionHandler } from "./types.ts";

// These tests are to ensure our Function Handler types are supporting the use cases we want to
// Any "failures" here will most likely be reflected in Type errors

Deno.test("BaseSlackFunctionHandler types", () => {
  type Inputs = {
    in: string;
  };
  type Outputs = {
    out: string;
  };
  const handler: BaseSlackFunctionHandler<Inputs, Outputs> = (
    { inputs },
  ) => {
    return {
      outputs: {
        out: inputs.in,
      },
    };
  };
  assertEquals(typeof handler, "function");
});

Deno.test("BaseSlackFunctionHandler with empty inputs and outputs", () => {
  type Inputs = Record<never, never>;
  type Outputs = Record<never, never>;
  const handler: BaseSlackFunctionHandler<Inputs, Outputs> = () => {
    return {
      outputs: {},
    };
  };
  assertEquals(typeof handler, "function");
});

Deno.test("BaseSlackFunctionHandler with undefined inputs and outputs", () => {
  type Inputs = undefined;
  type Outputs = undefined;
  const handler: BaseSlackFunctionHandler<Inputs, Outputs> = () => {
    return {
      outputs: {},
    };
  };
  assertEquals(typeof handler, "function");
});

Deno.test("BaseSlackFunctionHandler with inputs and empty outputs", () => {
  type Inputs = {
    in: string;
  };
  type Outputs = Record<never, never>;
  const handler: BaseSlackFunctionHandler<Inputs, Outputs> = ({ inputs }) => {
    const _test = inputs.in;

    return {
      outputs: {},
    };
  };
  assertEquals(typeof handler, "function");
});

Deno.test("BaseSlackFunctionHandler with empty inputs and outputs", () => {
  type Inputs = Record<never, never>;
  type Outputs = {
    out: string;
  };
  const handler: BaseSlackFunctionHandler<Inputs, Outputs> = () => {
    return {
      outputs: {
        out: "test",
      },
    };
  };
  assertEquals(typeof handler, "function");
});

Deno.test("BaseSlackFunctionHandler with any inputs and any outputs", () => {
  // deno-lint-ignore no-explicit-any
  const handler: BaseSlackFunctionHandler<any, any> = ({ inputs }) => {
    return {
      outputs: {
        out: inputs.in,
      },
    };
  };
  assertEquals(typeof handler, "function");
});

Deno.test("BaseSlackFunctionHandler with set inputs and any outputs", () => {
  type Inputs = {
    in: string;
  };
  // deno-lint-ignore no-explicit-any
  const handler: BaseSlackFunctionHandler<Inputs, any> = ({ inputs }) => {
    return {
      outputs: {
        out: inputs.in,
      },
    };
  };
  assertEquals(typeof handler, "function");
});
