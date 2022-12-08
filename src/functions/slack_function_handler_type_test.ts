import { assertEquals, assertExists } from "../dev_deps.ts";
import { assertEqualsTypedValues } from "../test_utils.ts";
import { SlackFunctionTester } from "./tester/mod.ts";
import { DefineFunction } from "./mod.ts";
import {
  EnrichedSlackFunctionHandler,
  RuntimeSlackFunctionHandler,
} from "./types.ts";
import { DefineType, Schema } from "../mod.ts";

// These tests are to ensure our Function Handler types are supporting the use cases we want to
// Any "failures" here will most likely be reflected in Type errors

Deno.test("EnrichedSlackFunctionHandler with string input passed to string output echoes output appropriately", () => {
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
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> = (
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

Deno.test("EnrichedSlackFunctionHandler with optional string input that echoes it or returns default fallback value returns fallback value when input is undefined", () => {
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
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> = (
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

Deno.test("EnrichedSlackFunctionHandler with no inputs or outputs and implementation that returns empty object yields empty object", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
  });
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    () => {
      return {
        outputs: {},
      };
    };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = handler(createContext({ inputs: {} }));
  assertEqualsTypedValues(result.outputs, {});
});

Deno.test("EnrichedSlackFunctionHandler with undefined inputs and outputs and implementation that returns empty object yields empty object", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    input_parameters: undefined,
    output_parameters: undefined,
  });
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    () => {
      return {
        outputs: {},
      };
    };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = handler(createContext({ inputs: {} }));
  assertEqualsTypedValues(result.outputs, {});
});

Deno.test("EnrichedSlackFunctionHandler with empty inputs and outputs and implementation that returns empty object yields empty object", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    input_parameters: { properties: {}, required: [] },
    output_parameters: { properties: {}, required: [] },
  });
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    () => {
      return {
        outputs: {},
      };
    };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = handler(createContext({ inputs: {} }));
  assertEqualsTypedValues(result.outputs, {});
});

Deno.test("EnrichedSlackFunctionHandler with only string input and implementation that returns empty object yields empty object", () => {
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
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> = (
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

Deno.test("EnrichedSlackFunctionHandler with only string output and implementation that returns a 'test' string yields 'test' string", () => {
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
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    () => {
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

Deno.test("EnrichedSlackFunctionHandler with input and output objects that have a single required string property and implementation that passed input object string to output object yields expected string", () => {
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
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> = (
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

Deno.test("EnrichedSlackFunctionHandler that returns { completed: false } should be acceptable", () => {
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
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    () => {
      return {
        completed: false,
      };
    };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = handler(createContext({ inputs: {} }));
  assertEqualsTypedValues(result.completed, false);
});

Deno.test("EnrichedSlackFunctionHandler that returns { error } should be acceptable", () => {
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
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    () => {
      return {
        error: "error",
      };
    };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = handler(createContext({ inputs: {} }));
  assertEqualsTypedValues(result.error, "error");
});

// TODO: custom type tests:
// - typedobject custom type with various use of `required`
// - the other kinds of acceptable custom type tests (primitive, untypedobject, the array types)
Deno.test("EnrichedSlackFunctionHandler with a Custom Type of type:object with undefined additionalProperties should allow for referencing extra properties on the Custom Type input", () => {
  const myType = DefineType({
    name: "myType",
    type: Schema.types.object,
    properties: {
      first: { type: Schema.types.string },
    },
    required: ["first"],
  });
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        custom: { type: myType },
      },
      required: ["custom"],
    },
    output_parameters: {
      properties: {
        out: { type: Schema.types.string },
      },
      required: ["out"],
    },
  });
  const sharedInputs = {
    custom: { first: "test" },
  };
  const handler: EnrichedSlackFunctionHandler<typeof TestFunction.definition> =
    (
      { inputs },
    ) => {
      assertEquals<string>(inputs.custom.first, "test");
      // Next line should compile / be allowed by TS
      inputs.custom.anything;
      return {
        outputs: {
          out: inputs.custom.first,
        },
      };
    };
  const { createContext } = SlackFunctionTester(TestFunction);

  const result = handler(createContext({ inputs: sharedInputs }));
  assertEqualsTypedValues(result.outputs?.out, sharedInputs.custom.first);
});

Deno.test("EnrichedSlackFunctionHandler with a Custom Type of type:object with additionalProperties=true should allow for referencing extra properties on the Custom Type input", () => {
  const myType = DefineType({
    name: "myType",
    type: Schema.types.object,
    properties: {
      first: { type: Schema.types.string },
    },
    required: ["first"],
    additionalProperties: true,
  });
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        custom: { type: myType },
      },
      required: ["custom"],
    },
    output_parameters: {
      properties: {
        out: { type: Schema.types.string },
      },
      required: ["out"],
    },
  });
  const sharedInputs = {
    custom: { first: "test" },
  };
  const handler: EnrichedSlackFunctionHandler<typeof TestFunction.definition> =
    (
      { inputs },
    ) => {
      assertEquals<string>(inputs.custom.first, "test");
      // Next line should compile / be allowed by TS
      inputs.custom.anything;
      return {
        outputs: {
          out: inputs.custom.first,
        },
      };
    };
  const { createContext } = SlackFunctionTester(TestFunction);

  const result = handler(createContext({ inputs: sharedInputs }));
  assertEqualsTypedValues(result.outputs?.out, sharedInputs.custom.first);
});

Deno.test("EnrichedSlackFunctionHandler with a Custom Type of type:object with additionalProperties=false should prevent referencing extra properties on the Custom Type input", () => {
  const myType = DefineType({
    name: "myType",
    type: Schema.types.object,
    properties: {
      first: { type: Schema.types.string },
    },
    required: ["first"],
    additionalProperties: false,
  });
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        custom: { type: myType },
      },
      required: ["custom"],
    },
    output_parameters: {
      properties: {
        out: { type: Schema.types.string },
      },
      required: ["out"],
    },
  });
  const sharedInputs = {
    custom: { first: "test" },
  };
  const handler: EnrichedSlackFunctionHandler<typeof TestFunction.definition> =
    (
      { inputs },
    ) => {
      assertEquals<string>(inputs.custom.first, "test");
      // @ts-expect-error anything cannot exist
      inputs.custom.anything;
      return {
        outputs: {
          out: inputs.custom.first,
        },
      };
    };
  const { createContext } = SlackFunctionTester(TestFunction);

  const result = handler(createContext({ inputs: sharedInputs }));
  assertEqualsTypedValues(result.outputs?.out, sharedInputs.custom.first);
});

Deno.test("EnrichedSlackFunctionHandler using Slack Custom Types (interactivity and user context) should propagate inputs to outputs", () => {
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

  const handler: EnrichedSlackFunctionHandler<typeof TestFunction.definition> =
    (
      { inputs },
    ) => {
      const { interactivity, user_context } = inputs;
      // TODO: is there a assertDeepEquals or equiv we can use instead of the below multiple assert statements?
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

Deno.test("EnrichedSlackFunctionHandler using Objects with optional properties", () => {
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        addlPropertiesObj: {
          type: Schema.types.object,
          properties: {
            aString: { type: Schema.types.string },
          },
        },
      },
      required: [],
    },
    output_parameters: {
      properties: {
        addlPropertiesObj: {
          type: Schema.types.object,
          properties: {
            aString: { type: Schema.types.string },
          },
        },
      },
      required: ["addlPropertiesObj"],
    },
  });

  const sharedInputs = {
    addlPropertiesObj: { aString: "hi" },
  };

  const handler: EnrichedSlackFunctionHandler<typeof TestFunction.definition> =
    (
      { inputs },
    ) => {
      const { addlPropertiesObj } = inputs;
      assertEqualsTypedValues(
        addlPropertiesObj,
        sharedInputs.addlPropertiesObj,
      );
      assertEqualsTypedValues(
        addlPropertiesObj?.aString,
        sharedInputs.addlPropertiesObj.aString,
      );
      assertEquals(addlPropertiesObj?.anythingElse, undefined);
      return {
        outputs: {
          addlPropertiesObj: {
            aString: addlPropertiesObj?.aString || "hi",
          },
        },
      };
    };

  const { createContext } = SlackFunctionTester(TestFunction);

  const result = handler(createContext({ inputs: sharedInputs }));
  assertEqualsTypedValues(sharedInputs, result.outputs);
  assertExists(result.outputs?.addlPropertiesObj);
  assertExists(result.outputs?.addlPropertiesObj.aString);
  assertEquals(result.outputs?.addlPropertiesObj.anythingElse, undefined);
});

Deno.test("EnrichedSlackFunctionHandler using Objects with additional properties", () => {
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        addlPropertiesObj: {
          type: Schema.types.object,
          properties: {
            aString: { type: Schema.types.string },
          },
        },
      },
      required: ["addlPropertiesObj"],
    },
    output_parameters: {
      properties: {
        addlPropertiesObj: {
          type: Schema.types.object,
          properties: {
            aString: { type: Schema.types.string },
          },
        },
      },
      required: ["addlPropertiesObj"],
    },
  });

  const sharedInputs = {
    addlPropertiesObj: { aString: "hi" },
  };

  const handler: EnrichedSlackFunctionHandler<typeof TestFunction.definition> =
    (
      { inputs },
    ) => {
      const { addlPropertiesObj } = inputs;
      assertEqualsTypedValues(
        addlPropertiesObj,
        sharedInputs.addlPropertiesObj,
      );
      assertEqualsTypedValues(
        addlPropertiesObj.aString,
        sharedInputs.addlPropertiesObj.aString,
      );
      assertEquals(addlPropertiesObj.anythingElse, undefined);
      return {
        outputs: inputs,
      };
    };

  const { createContext } = SlackFunctionTester(TestFunction);

  const result = handler(createContext({ inputs: sharedInputs }));
  assertEqualsTypedValues(sharedInputs, result.outputs);
  assertExists(result.outputs?.addlPropertiesObj);
  assertExists(result.outputs?.addlPropertiesObj.aString);
  assertEquals(result.outputs?.addlPropertiesObj.anythingElse, undefined);
});

Deno.test("EnrichedSlackFunctionHandler using Objects without additional properties", () => {
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        noAddlPropertiesObj: {
          type: Schema.types.object,
          properties: {
            aString: { type: Schema.types.string },
          },
          additionalProperties: false,
        },
      },
      required: ["noAddlPropertiesObj"],
    },
    output_parameters: {
      properties: {
        noAddlPropertiesObj: {
          type: Schema.types.object,
          properties: {
            aString: { type: Schema.types.string },
          },
          additionalProperties: false,
        },
      },
      required: ["noAddlPropertiesObj"],
    },
  });

  const sharedInputs = {
    noAddlPropertiesObj: { aString: "hi" },
  };

  const handler: EnrichedSlackFunctionHandler<typeof TestFunction.definition> =
    (
      { inputs },
    ) => {
      const { noAddlPropertiesObj } = inputs;
      assertEqualsTypedValues(
        noAddlPropertiesObj,
        sharedInputs.noAddlPropertiesObj,
      );
      assertEqualsTypedValues(
        noAddlPropertiesObj.aString,
        sharedInputs.noAddlPropertiesObj.aString,
      );
      // @ts-expect-error anythingElse cant exist
      assertEquals(noAddlPropertiesObj.anythingElse, undefined);
      return {
        outputs: inputs,
      };
    };

  const { createContext } = SlackFunctionTester(TestFunction);

  const result = handler(createContext({ inputs: sharedInputs }));
  assertEqualsTypedValues(sharedInputs, result.outputs);
  assertExists(result.outputs?.noAddlPropertiesObj);
  assertExists(result.outputs?.noAddlPropertiesObj.aString);

  // @ts-expect-error anythingElse cant exist
  assertEquals(result.outputs?.noAddlPropertiesObj.anythingElse, undefined);
});

Deno.test("RuntimeSlackFunctionHandler type should not include a client property", () => {
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
  const handler: RuntimeSlackFunctionHandler<typeof TestFn.definition> = (
    ctx,
  ) => {
    // @ts-expect-error ctx.client shouldn't be typed by RuntimeSlackFunctionHandler type - but SlackFunctionTester should inject it at runtime
    assertExists(ctx.client);

    return {
      completed: false,
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = handler(createContext({ inputs: {} }));
  assertEqualsTypedValues(result.completed, false);
});
