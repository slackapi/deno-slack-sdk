import {
  assert,
  assertEquals,
  assertExists,
  CanBe,
  CanBeUndefined,
  CannotBeUndefined,
  IsAny,
  IsExact,
} from "../dev_deps.ts";
import { assertEqualsTypedValues } from "../test_utils.ts";
import { SlackFunctionTester } from "./tester/mod.ts";
import { DefineFunction } from "./mod.ts";
import {
  EnrichedSlackFunctionHandler,
  RuntimeSlackFunctionHandler,
} from "./types.ts";
import { Schema } from "../mod.ts";
import SchemaTypes from "../schema/schema_types.ts";
import { DefineObject } from "../types/objects.ts";

// These tests are to ensure our Function Handler types are supporting the use cases we want to
// Any "failures" here will most likely be reflected in Type errors

Deno.test("EnrichedSlackFunctionHandler with string inputs and outputs", () => {
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

Deno.test("EnrichedSlackFunctionHandler with optional string input", () => {
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

Deno.test("EnrichedSlackFunctionHandler with no inputs or outputs", () => {
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

Deno.test("EnrichedSlackFunctionHandler with undefined inputs and outputs", () => {
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

Deno.test("EnrichedSlackFunctionHandler with empty inputs and outputs", () => {
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

Deno.test("EnrichedSlackFunctionHandler with only string input", () => {
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

Deno.test("EnrichedSlackFunctionHandler with only string output", () => {
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

Deno.test("EnrichedSlackFunctionHandler with a required input typedobject with a required string property, and required output typedobject with a required string property", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    input_parameters: {
      properties: {
        anObject: DefineObject({
          type: "typedobject",
          properties: { in: { type: "string" } },
          required: ["in"],
        }),
      },
      required: ["anObject"],
    },
    output_parameters: {
      properties: {
        anObject: DefineObject({
          type: "typedobject",
          properties: { out: { type: "string" } },
          required: ["out"],
        }),
      },
      required: ["anObject"],
    },
  });
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> = (
    { inputs },
  ) => {
    assert<CannotBeUndefined<typeof inputs.anObject.in>>(true);
    assert<IsExact<typeof inputs.anObject.in, string>>(true);
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

Deno.test("EnrichedSlackFunctionHandler with a required input typedobject with an optional string property", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    input_parameters: {
      properties: {
        anObject: DefineObject({
          type: "typedobject",
          properties: { in: { type: "string" } },
          required: [],
        }),
      },
      required: ["anObject"],
    },
  });
  const handler: EnrichedSlackFunctionHandler<typeof TestFn.definition> = (
    { inputs },
  ) => {
    assert<CanBeUndefined<typeof inputs.anObject.in>>(true);
    assert<CanBe<typeof inputs.anObject.in, string>>(true);
    return {
      outputs: {},
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const _result = handler(
    createContext({ inputs: { anObject: { in: "test" } } }),
  );
});

Deno.test("EnrichedSlackFunctionHandler that returns completed false", () => {
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

Deno.test("EnrichedSlackFunctionHandler that returns error", () => {
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

Deno.test("EnrichedSlackFunctionHandler using Custom Types", () => {
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        interactivity: {
          type: SchemaTypes.custom,
          custom: Schema.slack.types.interactivity,
        },
        user_context: {
          type: SchemaTypes.custom,
          custom: Schema.slack.types.user_context,
        },
      },
      required: ["interactivity", "user_context"],
    },
    output_parameters: {
      properties: {
        interactivity: {
          type: SchemaTypes.custom,
          custom: Schema.slack.types.interactivity,
        },
        user_context: {
          type: SchemaTypes.custom,
          custom: Schema.slack.types.user_context,
        },
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

Deno.test("EnrichedSlackFunctionHandler using DefineObject-wrapped Objects with additional properties", () => {
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        addlPropertiesObj: DefineObject({
          type: Schema.types.typedobject,
          properties: {
            aString: { type: Schema.types.string },
          },
          required: [],
          additionalProperties: true,
        }),
      },
      required: ["addlPropertiesObj"],
    },
    output_parameters: {
      properties: {
        addlPropertiesObj: {
          type: Schema.types.typedobject,
          properties: {
            aString: { type: Schema.types.string },
          },
          required: [],
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
      assert<IsAny<typeof addlPropertiesObj.anythingElse>>(true);
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

Deno.test("EnrichedSlackFunctionHandler using DefineObject-wrapped Objects without additional properties", () => {
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        noAddlPropertiesObj: DefineObject({
          type: Schema.types.typedobject,
          properties: {
            aString: { type: Schema.types.string },
          },
          required: [],
          additionalProperties: false,
        }),
      },
      required: ["noAddlPropertiesObj"],
    },
    output_parameters: {
      properties: {
        noAddlPropertiesObj: {
          type: Schema.types.typedobject,
          properties: {
            aString: { type: Schema.types.string },
          },
          required: [],
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

Deno.test("EnrichedSlackFunctionHandler using unwrapped Objects with additional properties", () => {
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        addlPropertiesObj: {
          type: Schema.types.typedobject,
          properties: {
            aString: { type: Schema.types.string },
          },
          required: [],
        },
      },
      required: ["addlPropertiesObj"],
    },
    output_parameters: {
      properties: {
        addlPropertiesObj: {
          type: Schema.types.typedobject,
          properties: {
            aString: { type: Schema.types.string },
          },
          required: [],
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
      assert<IsAny<typeof addlPropertiesObj.anythingElse>>(true);
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

Deno.test("EnrichedSlackFunctionHandler using unwrapped Objects without additional properties", () => {
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        noAddlPropertiesObj: {
          type: Schema.types.typedobject,
          properties: {
            aString: { type: Schema.types.string },
          },
          required: [],
          additionalProperties: false,
        },
      },
      required: ["noAddlPropertiesObj"],
    },
    output_parameters: {
      properties: {
        noAddlPropertiesObj: {
          type: Schema.types.typedobject,
          properties: {
            aString: { type: Schema.types.string },
          },
          required: [],
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
