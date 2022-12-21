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
import { DefineType, Schema } from "../mod.ts";
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

Deno.test("EnrichedSlackFunctionHandler with a required input DefineObject-wrapped typedobject with a required string property", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    input_parameters: {
      properties: {
        anObject: DefineObject({
          type: Schema.types.object,
          properties: { in: { type: "string" } },
          required: ["in"],
        }),
      },
      required: ["anObject"],
    },
    output_parameters: {
      properties: {
        anObject: DefineObject({
          type: Schema.types.object,
          properties: { out: { type: "string" } },
          required: ["out"],
        }),
      },
      required: ["anObject"],
    },
  });
  const validHandler: EnrichedSlackFunctionHandler<typeof TestFn.definition> = (
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

  // @ts-expect-error Type error if required property isn't returned
  const _invalidHandler: EnrichedSlackFunctionHandler<
    typeof TestFn.definition
  > = (
    { inputs: _inputs },
  ) => {
    return {
      outputs: {
        anObject: {},
      },
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const result = validHandler(
    createContext({ inputs: { anObject: { in: "test" } } }),
  );
  assertEqualsTypedValues(result.outputs?.anObject.out, "test");
});

Deno.test("EnrichedSlackFunctionHandler with a required input DefineObject-wrapped typedobject with an optional string property", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    input_parameters: {
      properties: {
        anObject: DefineObject({
          type: Schema.types.object,
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

Deno.test("EnrichedSlackFunctionHandler with a required output DefineObject-wrapped typedobject with mixed property requirements", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    output_parameters: {
      properties: {
        anObject: DefineObject({
          type: Schema.types.object,
          properties: { req: { type: "string" }, opt: { type: "string" } },
          required: ["req"],
        }),
      },
      required: ["anObject"],
    },
  });
  const _reqHandler: EnrichedSlackFunctionHandler<typeof TestFn.definition> = (
    _arg,
  ) => {
    return {
      outputs: {
        anObject: { req: "i'm here" },
      },
    };
  };

  //@ts-expect-error anObject.req is a required property and must be defined
  const _optHandler: EnrichedSlackFunctionHandler<typeof TestFn.definition> = (
    _arg,
  ) => {
    return {
      outputs: {
        anObject: { opt: "i'm here" },
      },
    };
  };

  const _mixedHandler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    (
      _arg,
    ) => {
      return {
        outputs: {
          anObject: {
            req: "i'm here",
            opt: "i'm here",
          },
        },
      };
    };

  assert(true);
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
  const myObject = DefineObject({
    type: Schema.types.object,
    properties: {
      required_property: { type: "string" },
      optional_property: { type: "string" },
    },
    required: ["required_property"],
  });

  const myType = DefineType({
    name: "custom",
    ...myObject,
  });

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
        custom_type: {
          type: "custom",
          custom: myType,
        },
      },
      required: ["interactivity", "user_context", "custom_type"],
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
        custom_type: {
          type: "custom",
          custom: myType,
        },
      },
      required: ["interactivity", "user_context", "custom_type"],
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
    custom_type: {
      required_property: "i am a necessity",
    },
  };

  const validHandler: EnrichedSlackFunctionHandler<
    typeof TestFunction.definition
  > = (
    { inputs },
  ) => {
    const { interactivity, user_context, custom_type } = inputs;

    assert<CannotBeUndefined<typeof interactivity.interactivity_pointer>>(
      true,
    );
    assert<CannotBeUndefined<typeof interactivity.interactor.id>>(true);
    assert<CannotBeUndefined<typeof interactivity.interactor.secret>>(true);
    assert<CannotBeUndefined<typeof user_context.id>>(true);
    assert<CannotBeUndefined<typeof user_context.secret>>(true);
    assert<CannotBeUndefined<typeof custom_type.required_property>>(true);
    assert<CanBeUndefined<typeof custom_type.optional_property>>(true);

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

  const result = validHandler(createContext({ inputs: sharedInputs }));
  assertEqualsTypedValues(sharedInputs, result.outputs);
  assertExists(result.outputs?.interactivity.interactivity_pointer);
  assertExists(result.outputs?.interactivity.interactor.id);
  assertExists(result.outputs?.interactivity.interactor.secret);
  assertExists(result.outputs?.user_context.id);
  assertExists(result.outputs?.user_context.secret);

  // @ts-expect-error Type error if required property isn't returned
  const _invalidHandler: EnrichedSlackFunctionHandler<
    typeof TestFunction.definition
  > = (
    { inputs },
  ) => {
    const { interactivity, user_context } = inputs;
    return {
      outputs: {
        custom_type: {
          optional_property: "im useless",
        },
        interactivity,
        user_context,
      },
    };
  };
});

Deno.test("EnrichedSlackFunctionHandler using Typed Arrays of Custom Types of DefineObject-wrapped typed objects should honor required and optional properties", () => {
  const obj = DefineObject({
    type: SchemaTypes.object,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
      anOptionalString: {
        type: SchemaTypes.string,
      },
    },
    required: ["aString"],
    additionalProperties: true,
  });
  const customType = DefineType({
    name: "customType",
    ...obj,
  });

  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        arr: {
          type: Schema.types.array,
          items: {
            type: SchemaTypes.custom,
            custom: customType,
          },
        },
      },
      required: ["arr"],
    },
  });

  const sharedInputs = {
    arr: [{ aString: "hi" }, { aString: "hello", anOptionalString: "goodbye" }],
  };

  const handler: EnrichedSlackFunctionHandler<typeof TestFunction.definition> =
    (
      { inputs },
    ) => {
      const { arr } = inputs;
      const first = arr[0];
      const second = arr[1];
      assert<CannotBeUndefined<typeof first.aString>>(true);
      assert<CanBeUndefined<typeof first.anOptionalString>>(true);
      assert<CannotBeUndefined<typeof second.aString>>(true);
      assert<CanBeUndefined<typeof second.anOptionalString>>(true);
      assertEqualsTypedValues(
        first.aString,
        sharedInputs.arr[0].aString,
      );
      assertEqualsTypedValues(
        first.anOptionalString,
        undefined,
      );
      assertEqualsTypedValues(
        second.aString,
        sharedInputs.arr[1].aString,
      );
      assertEqualsTypedValues(
        second.anOptionalString,
        sharedInputs.arr[1].anOptionalString,
      );

      return {
        outputs: inputs,
      };
    };

  const { createContext } = SlackFunctionTester(TestFunction);
  handler(createContext({ inputs: sharedInputs }));
});

Deno.test("EnrichedSlackFunctionHandler using DefineObject-wrapped Objects with additional properties", () => {
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        addlPropertiesObj: DefineObject({
          type: Schema.types.object,
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
        addlPropertiesObj: DefineObject({
          type: Schema.types.object,
          properties: {
            aString: { type: Schema.types.string },
          },
          required: [],
          additionalProperties: true,
        }),
      },
      required: ["addlPropertiesObj"],
    },
  });

  const sharedInputs = {
    addlPropertiesObj: { aString: "hi", somethingElse: "ello" },
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
      assert<IsAny<typeof addlPropertiesObj.somethingElse>>(true);
      assert<IsAny<typeof addlPropertiesObj.anythingElse>>(true);
      assertEquals(addlPropertiesObj.somethingElse, "ello");
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
  assertEquals(result.outputs?.addlPropertiesObj.somethingElse, "ello");
  assertEquals(result.outputs?.addlPropertiesObj.anythingElse, undefined);
  if (result.outputs) {
    assert<IsAny<typeof result.outputs.addlPropertiesObj.anythingElse>>(true);
  }
  result.outputs.addlPropertiesObj.anothaOne;
});

Deno.test("EnrichedSlackFunctionHandler using DefineObject-wrapped Objects without additional properties", () => {
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        noAddlPropertiesObj: DefineObject({
          type: Schema.types.object,
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
        noAddlPropertiesObj: DefineObject({
          type: Schema.types.object,
          properties: {
            aString: { type: Schema.types.string },
          },
          required: [],
          additionalProperties: false,
        }),
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

Deno.test("EnrichedSlackFunctionHandler using untyped Objects", () => {
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        untypedObj: {
          type: Schema.types.object,
        },
      },
      required: ["untypedObj"],
    },
    output_parameters: {
      properties: {
        untypedObj: {
          type: Schema.types.object,
        },
      },
      required: ["untypedObj"],
    },
  });

  const sharedInputs = {
    untypedObj: { aString: "hi" },
  };

  const handler: EnrichedSlackFunctionHandler<typeof TestFunction.definition> =
    (
      { inputs },
    ) => {
      const { untypedObj } = inputs;

      assert<IsAny<typeof untypedObj>>(true);
      assert<IsAny<typeof untypedObj.aString>>(true);

      return {
        outputs: {
          untypedObj: { literallyAnything: "ok" },
        },
      };
    };

  const { createContext } = SlackFunctionTester(TestFunction);

  const result = handler(createContext({ inputs: sharedInputs }));

  assertExists(result.outputs?.untypedObj);
  if (result.outputs?.untypedObj) {
    assert<IsAny<typeof result.outputs.untypedObj>>(true);
  }
});

Deno.test("EnrichedSlackFunctionHandler using Arrays", () => {
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        anUntypedArray: {
          type: Schema.types.array,
        },
        aTypedArray: {
          type: Schema.types.array,
          items: {
            type: "string",
          },
        },
        aTypedArrayOfObjects: {
          type: Schema.types.array,
          items: DefineObject({
            type: Schema.types.object,
            properties: {
              requiredString: { type: "string" },
              optionalString: { type: "string" },
            },
            required: ["requiredString"],
          }),
        },
      },
      required: ["aTypedArray", "aTypedArrayOfObjects", "anUntypedArray"],
    },
    output_parameters: {
      properties: {
        anUntypedArray: {
          type: Schema.types.array,
        },
        aTypedArray: {
          type: Schema.types.array,
          items: {
            type: "string",
          },
        },
        aTypedArrayOfObjects: {
          type: Schema.types.array,
          items: DefineObject({
            type: Schema.types.object,
            properties: {
              requiredString: { type: "string" },
              optionalString: { type: "string" },
            },
            required: ["requiredString"],
          }),
        },
      },
      required: ["aTypedArray", "aTypedArrayOfObjects", "anUntypedArray"],
    },
  });

  const sharedInputs = {
    aTypedArray: ["hello"],
    anUntypedArray: [1, "goodbye"],
    aTypedArrayOfObjects: [{ requiredString: "hello from the other side" }],
  };

  const handler: EnrichedSlackFunctionHandler<typeof TestFunction.definition> =
    (
      { inputs },
    ) => {
      const { aTypedArray, aTypedArrayOfObjects, anUntypedArray } = inputs;
      assert<IsAny<typeof anUntypedArray[0]>>(true);
      assert<IsAny<typeof aTypedArray[0]>>(false);
      assert<IsAny<typeof aTypedArrayOfObjects[0]>>(false);

      assert<CannotBeUndefined<typeof aTypedArray>>(true);
      assert<CannotBeUndefined<typeof aTypedArrayOfObjects>>(true);
      assert<CannotBeUndefined<typeof anUntypedArray>>(true);

      // These tests are a little weird, could technically be undefined if these arrays are empty
      assert<CannotBeUndefined<typeof aTypedArray[0]>>(true);
      assert<CannotBeUndefined<typeof aTypedArray[0]>>(true);
      assert<CannotBeUndefined<typeof aTypedArrayOfObjects[0]>>(true);
      assert<
        CannotBeUndefined<typeof aTypedArrayOfObjects[0]["requiredString"]>
      >(true);

      assert<CanBeUndefined<typeof aTypedArrayOfObjects[0]["optionalString"]>>(
        true,
      );

      return {
        outputs: inputs,
      };
    };

  const { createContext } = SlackFunctionTester(TestFunction);

  const result = handler(createContext({ inputs: sharedInputs }));
  assertEqualsTypedValues(sharedInputs, result.outputs);
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
