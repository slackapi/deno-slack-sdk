import { assertEquals, assertExists } from "../dev_deps.ts";
import { assertEqualsTypedValues } from "../test_utils.ts";
import { SlackFunctionTester } from "./tester/mod.ts";
import { DefineFunction } from "./mod.ts";
import { SlackFunctionHandler } from "./types.ts";
import { Schema } from "../mod.ts";

// These tests are to ensure our Function Handler types are supporting the use cases we want to
// Any "failures" here will most likely be reflected in Type errors

Deno.test("SlackFunctionHandler with inputs and outputs", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    input_parameters: {
      properties: {
        in: {
          type: "string",
        },
      },
      required: ["in"],
    },
    output_parameters: {
      properties: {
        out: {
          type: "string",
        },
      },
      required: ["out"],
    },
  });
  const handler: SlackFunctionHandler<typeof TestFn.definition> = (
    { inputs },
  ) => {
    return {
      outputs: {
        out: inputs.in,
      },
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const inputs = { in: "test" };
  const result = handler(createContext({ inputs }));

  const stringTest = SlackFunctionTester("test");
  const stringResult = handler(stringTest.createContext({ inputs }));

  assertEqualsTypedValues(
    result.outputs?.out,
    inputs.in,
  );
  assertEqualsTypedValues(
    inputs.in,
    stringResult.outputs?.out,
  );
});

Deno.test("SlackFunctionHandler with optional input", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    input_parameters: {
      properties: {
        in: {
          type: "string",
        },
      },
      required: [],
    },
    output_parameters: {
      properties: {
        out: {
          type: "string",
        },
      },
      required: ["out"],
    },
  });
  const handler: SlackFunctionHandler<typeof TestFn.definition> = (
    { inputs },
  ) => {
    return {
      outputs: {
        out: inputs.in || "default",
      },
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const inputs = {};
  const result = handler(createContext({ inputs }));
  assertEqualsTypedValues(result.outputs?.out, "default");
});

Deno.test("SlackFunctionHandler with no inputs or outputs", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
  });
  const handler: SlackFunctionHandler<typeof TestFn.definition> = () => {
    return {
      outputs: {},
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = handler(createContext({ inputs: {} }));
  assertEqualsTypedValues(result.outputs, {});
});

Deno.test("SlackFunctionHandler with undefined inputs and outputs", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    input_parameters: undefined,
    output_parameters: undefined,
  });
  const handler: SlackFunctionHandler<typeof TestFn.definition> = () => {
    return {
      outputs: {},
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = handler(createContext({ inputs: {} }));
  assertEqualsTypedValues(result.outputs, {});
});

Deno.test("SlackFunctionHandler with empty inputs and outputs", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    input_parameters: { properties: {}, required: [] },
    output_parameters: { properties: {}, required: [] },
  });
  const handler: SlackFunctionHandler<typeof TestFn.definition> = () => {
    return {
      outputs: {},
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = handler(createContext({ inputs: {} }));
  assertEqualsTypedValues(result.outputs, {});
});

Deno.test("SlackFunctionHandler with only inputs", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    input_parameters: {
      properties: {
        in: {
          type: "string",
        },
      },
      required: ["in"],
    },
  });
  const handler: SlackFunctionHandler<typeof TestFn.definition> = (
    { inputs },
  ) => {
    const _test = inputs.in;

    return {
      outputs: {},
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const inputs = { in: "test" };
  const result = handler(createContext({ inputs }));
  assertEqualsTypedValues(result.outputs, {});
});

Deno.test("SlackFunctionHandler with only outputs", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    output_parameters: {
      properties: {
        out: {
          type: "string",
        },
      },
      required: ["out"],
    },
  });
  const handler: SlackFunctionHandler<typeof TestFn.definition> = () => {
    return {
      outputs: {
        out: "test",
      },
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = handler(createContext({ inputs: {} }));
  assertEqualsTypedValues(result.outputs?.out, "test");
});

Deno.test("SlackFunctionHandler with input and output object", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    input_parameters: {
      properties: {
        anObject: {
          type: "object",
          properties: { in: { type: "string" } },
          required: ["in"],
        },
      },
      required: ["anObject"],
    },
    output_parameters: {
      properties: {
        anObject: {
          type: "object",
          properties: { out: { type: "string" } },
          required: ["out"],
        },
      },
      required: ["anObject"],
    },
  });
  const handler: SlackFunctionHandler<typeof TestFn.definition> = (
    { inputs },
  ) => {
    return {
      outputs: {
        anObject: {
          out: inputs.anObject.in,
        },
      },
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = handler(
    createContext({ inputs: { anObject: { in: "test" } } }),
  );
  assertEqualsTypedValues(result.outputs?.anObject.out, "test");
});

Deno.test("SlackFunctionHandler with only completed false", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    output_parameters: {
      properties: {
        example: {
          type: "boolean",
        },
      },
      required: ["example"],
    },
  });
  const handler: SlackFunctionHandler<typeof TestFn.definition> = () => {
    return {
      completed: false,
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = handler(createContext({ inputs: {} }));
  assertEqualsTypedValues(result.completed, false);
});

Deno.test("SlackFunctionHandler with only error", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    output_parameters: {
      properties: {
        example: {
          type: "string",
        },
      },
      required: ["example"],
    },
  });
  const handler: SlackFunctionHandler<typeof TestFn.definition> = () => {
    return {
      error: "error",
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = handler(createContext({ inputs: {} }));
  assertEqualsTypedValues(result.error, "error");
});

Deno.test("SlackFunctionHandler using Custom Types", () => {
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        interactivity: { type: Schema.slack.types.interactivity },
        user_context: { type: Schema.slack.types.user_context },
      },
      required: ["interactivity", "user_context"],
    },
    output_parameters: {
      properties: {
        interactivity: { type: Schema.slack.types.interactivity },
        user_context: { type: Schema.slack.types.user_context },
      },
      required: ["interactivity", "user_context"],
    },
  });

  const sharedInputs = {
    interactivity: {
      interactivity_pointer: "interactivity_pointer",
      interactor: {
        id: "interactor id",
        secret: "interactor secret",
      },
    },
    user_context: {
      id: "user_context id",
      secret: "user_context secret",
    },
  };

  const handler: SlackFunctionHandler<typeof TestFunction.definition> = (
    { inputs },
  ) => {
    inputs.interactivity.interactor.secret;
    const { interactivity, user_context } = inputs;
    assertEqualsTypedValues(interactivity, sharedInputs.interactivity);
    assertEqualsTypedValues(
      interactivity.interactivity_pointer,
      sharedInputs.interactivity.interactivity_pointer,
    );
    assertEqualsTypedValues(
      interactivity.interactor.id,
      sharedInputs.interactivity.interactor.id,
    );
    assertEqualsTypedValues(
      interactivity.interactor.secret,
      sharedInputs.interactivity.interactor.secret,
    );
    assertEqualsTypedValues(user_context, sharedInputs.user_context);
    assertEqualsTypedValues(
      user_context.secret,
      sharedInputs.user_context.secret,
    );
    assertEqualsTypedValues(user_context.id, sharedInputs.user_context.id);
    assertEqualsTypedValues(
      user_context.secret,
      sharedInputs.user_context.secret,
    );

    return {
      outputs: inputs,
    };
  };

  const { createContext } = SlackFunctionTester(TestFunction);

  const result = handler(createContext({ inputs: sharedInputs }));
  assertEqualsTypedValues(sharedInputs, result.outputs);
  assertExists(result.outputs?.interactivity.interactivity_pointer);
  assertExists(result.outputs?.interactivity.interactor.id);
  assertExists(result.outputs?.interactivity.interactor.secret);
  assertExists(result.outputs?.user_context.id);
  assertExists(result.outputs?.user_context.secret);
});
