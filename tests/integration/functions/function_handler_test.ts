import {
  assert, assertEquals, assertExists, IsAny, IsExact
} from "../../../src/dev_deps.ts";
import { CanBe, CanBeUndefined, CannotBeUndefined, } from "../../../src/test_utils.ts";
import { DefineFunction, DefineType, Schema } from "../../../src/mod.ts";
import { DefineProperty } from "../../../src/parameters/define_property.ts";
import {
  EnrichedSlackFunctionHandler,
} from "../../../src/functions/types.ts";
import { SlackFunctionTester } from "../../../src/functions/tester/mod.ts";
import { assertEqualsTypedValues } from "../../../src/test_utils.ts";
import { InternalSlackTypes } from "../../../src/schema/slack/types/custom/mod.ts";

/**
 * Custom Function handler tests, exercising all different kinds of combinations of function inputs and outputs
 * TODO: May want to split this file up down the road if it gets too big, possibly organize under further sub-dirs
 */

/**
 * Testing string inputs
 */
Deno.test("Custom Function with a string input and no outputs should provide the string input in a function handler context", () => {
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
    assert<IsExact<typeof inputs.in, string>>(true);
    return {
      outputs: {},
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const inputs = { in: "test" };
  const result = handler(createContext({ inputs }));
  assertEqualsTypedValues(result.outputs, {});
});

Deno.test("Custom Function with a string input and output should provide the string input in a function handler context", () => {
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
    assert<IsExact<typeof inputs.in, string>>(true);
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

Deno.test("Custom Function with an optional string input and output should provide the string/undefined input in a function handler context", () => {
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
    assert<CanBe<typeof inputs.in, string>>(true);
    assert<CanBeUndefined<typeof inputs.in>>(true);
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

/**
 * Testing string inputs
 */
Deno.test("Custom Function with only string output", () => {
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

/**
 * Testing empty/undefined/lack of inputs/outputs as well as error or incomplete function return values
 */
Deno.test("Custom Function with no inputs or outputs", () => {
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

Deno.test("Custom Function with undefined inputs and outputs", () => {
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

Deno.test("Custom Function with empty inputs and outputs", () => {
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

Deno.test("Custom Function that returns completed=false", () => {
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

Deno.test("Custom Function that returns error", () => {
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

/**
 * Testing Untyped Object inputs/outputs
 */
Deno.test("Custom Function using untyped Objects should allow for referencing any property in a function handler context", () => {
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

/**
 * Testing Typed Object inputs/outputs
 */
Deno.test("Custom Function with a required DefineProperty-wrapped typedobject input with a required string property and a required DefineProperty-wrapped typedobject output should provide correct typing in a function handler context and complain if required output not provided", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    input_parameters: {
      properties: {
        anObject: DefineProperty({
          type: Schema.types.object,
          properties: { in: { type: "string" } },
          required: ["in"],
        }),
      },
      required: ["anObject"],
    },
    output_parameters: {
      properties: {
        anObject: DefineProperty({
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
  > = (_arg) => {
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

Deno.test("Custom Function with a required DefineProperty-wrapped typedobject input with an optional string property should provide correct typing in a function handler context", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    input_parameters: {
      properties: {
        anObject: DefineProperty({
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

Deno.test("Custom Function with a required output DefineProperty-wrapped typedobject with mixed required/optional property requirements should complain if required object properties are not returned by function", () => {
  const TestFn = DefineFunction({
    callback_id: "test",
    title: "test fn",
    source_file: "test.ts",
    output_parameters: {
      properties: {
        anObject: DefineProperty({
          type: Schema.types.object,
          properties: { req: { type: "string" }, opt: { type: "string" } },
          required: ["req"],
        }),
      },
      required: ["anObject"],
    },
  });
  
  // Ensure no error raised if object required property provided
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

  // Ensure no error raised if object required property provided
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
});

Deno.test("Custom Function with an input of DefineProperty-wrapped Typed Object with additional properties allows referencing into additional properties in a function handler context", () => {
  const obj = DefineProperty({
    type: Schema.types.object,
    properties: {
      aString: { type: Schema.types.string },
    },
    required: [],
    additionalProperties: true,
  });
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        addlPropertiesObj: obj,
      },
      required: ["addlPropertiesObj"],
    },
    output_parameters: {
      properties: {
        addlPropertiesObj: obj,
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

Deno.test("Custom Function with an input of DefineProperty-wrapped Typed Object without additional properties prevents referencing into additional properties in a function handler context", () => {
  const obj = DefineProperty({
    type: Schema.types.object,
    properties: {
      aString: { type: Schema.types.string },
    },
    required: [],
    additionalProperties: false,
  });
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        noAddlPropertiesObj: obj,
      },
      required: ["noAddlPropertiesObj"],
    },
    output_parameters: {
      properties: {
        noAddlPropertiesObj: obj,
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

/**
 * Testing Custom Type inputs/outputs
 */
Deno.test("Custom Function using a Custom Type input for a DefineProperty-wrapped typedobject with mixed required/optional properties should provide correct typedobject typing in a function handler context and should complain if typedobject output does not include required property", () => {
  const myObject = DefineProperty({
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
          type: Schema.slack.types.interactivity,
        },
        user_context: {
          type: Schema.slack.types.user_context,
        },
        custom_type: {
          type: myType,
        },
      },
      required: ["interactivity", "user_context", "custom_type"],
    },
    output_parameters: {
      properties: {
        interactivity: {
          type: Schema.slack.types.interactivity,
        },
        user_context: {
          type: Schema.slack.types.user_context,
        },
        custom_type: {
          type: myType,
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
    assert<IsExact<typeof custom_type.required_property, string>>(true);
    assert<CanBeUndefined<typeof custom_type.optional_property>>(true);
    assert<CanBe<typeof custom_type.optional_property, string>>(true);

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

Deno.test("Custom Function using Slack's FormInput internal Custom Type input should provide correct typedobject typing in a function handler context", () => {
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        formInput: {
          type: InternalSlackTypes.form_input_object,
        },
      },
      required: ["formInput"],
    },
    output_parameters: {
      properties: {
        formInput: {
          type: InternalSlackTypes.form_input_object,
        },
      },
      required: ["formInput"],
    },
  });

  const sharedInputs = {
    formInput: {
      required: [],
      elements: [],
    }
  };

  const validHandler: EnrichedSlackFunctionHandler<
    typeof TestFunction.definition
  > = (
    { inputs },
  ) => {
    const { formInput } = inputs;

    assert<CanBeUndefined<typeof formInput.required>>(
      true,
    );
    assert<CanBe<typeof formInput.required, string[]>>(true);

    assert<CannotBeUndefined<typeof formInput.elements>>(
      true,
    );
    assert<CanBe<typeof formInput.elements, any[]>>(true);
    
    return {
      outputs: inputs,
    };
  };

  const { createContext } = SlackFunctionTester(TestFunction);

  const result = validHandler(createContext({ inputs: sharedInputs }));
});

Deno.test("Custom Function using Slack's message-context Custom Type input should provide correct typedobject typing in a function handler context", () => {
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        msgContext: {
          type: Schema.slack.types.message_context,
        },
      },
      required: ["msgContext"],
    },
    output_parameters: {
      properties: {
        msgContext: {
          type: Schema.slack.types.message_context,
        },
      },
      required: ["msgContext"],
    },
  });

  const sharedInputs = {
    msgContext: {
      message_ts: "1234.567",
      channel_id: "C12345"
    }
  };

  const validHandler: EnrichedSlackFunctionHandler<
    typeof TestFunction.definition
  > = (
    { inputs },
  ) => {
    const { msgContext } = inputs;

    // channel_id sub-property
    assert<CanBeUndefined<typeof msgContext.channel_id>>(
      true,
    );
    assert<CanBe<typeof msgContext.channel_id, string>>(true);
    // user_id sub-property
    assert<CanBeUndefined<typeof msgContext.user_id>>(
      true,
    );
    assert<CanBe<typeof msgContext.user_id, string>>(true);
    // message_ts sub-property
    assert<CannotBeUndefined<typeof msgContext.message_ts>>(
      true,
    );
    assert<IsExact<typeof msgContext.message_ts, string>>(true);
    
    return {
      outputs: inputs,
    };
  };

  const { createContext } = SlackFunctionTester(TestFunction);

  const result = validHandler(createContext({ inputs: sharedInputs }));
});

/**
 * Testing Array inputs/outputs
 */
Deno.test("Custom Function using an input of Typed Arrays of Custom Types of DefineProperty-wrapped typed objects should honor required and optional properties and allow for referencing additional properties", () => {
  const obj = DefineProperty({
    type: Schema.types.object,
    properties: {
      aString: {
        type: Schema.types.string,
      },
      anOptionalString: {
        type: Schema.types.string,
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
            type: customType,
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
      assert<IsAny<typeof first.somethingRandom>>(true);
      assert<IsAny<typeof second.andNowForSomethingCompletelyDifferent>>(true);
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

Deno.test("Custom Function using an input of Typed Arrays of Custom Types of DefineProperty-wrapped typed objects should honor additionalProperties=false", () => {
  const obj = DefineProperty({
    type: Schema.types.object,
    properties: {
      aString: {
        type: Schema.types.string,
      },
      anOptionalString: {
        type: Schema.types.string,
      },
    },
    required: ["aString"],
    additionalProperties: false,
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
            type: customType,
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
      // @ts-expect-error batman cannot exist
      assertEquals(first.batman, undefined);
      // @ts-expect-error robin cannot exist
      assertEquals(second.robin, undefined);

      return {
        outputs: inputs,
      };
    };

  const { createContext } = SlackFunctionTester(TestFunction);
  handler(createContext({ inputs: sharedInputs }));
});

Deno.test("Custom Function using an input of Typed Arrays of DefineProperty-wrapped typed objects should honor required and optional properties and allow for referencing additional properties", () => {
  const obj = DefineProperty({
    type: Schema.types.object,
    properties: {
      aString: {
        type: Schema.types.string,
      },
      anOptionalString: {
        type: Schema.types.string,
      },
    },
    required: ["aString"],
    additionalProperties: true,
  });

  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        arr: {
          type: Schema.types.array,
          items: obj,
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
      assert<IsAny<typeof first.somethingRandom>>(true);
      assert<IsAny<typeof second.andNowForSomethingCompletelyDifferent>>(true);
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

Deno.test("Custom Function using an input of Typed Arrays of DefineProperty-wrapped typed objects should honor additionalProperties=false", () => {
  const obj = DefineProperty({
    type: Schema.types.object,
    properties: {
      aString: {
        type: Schema.types.string,
      },
      anOptionalString: {
        type: Schema.types.string,
      },
    },
    required: ["aString"],
    additionalProperties: false,
  });

  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        arr: {
          type: Schema.types.array,
          items: obj,
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
      // @ts-expect-error batman cannot exist
      assertEquals(first.batman, undefined);
      // @ts-expect-error robin cannot exist
      assertEquals(second.robin, undefined);

      return {
        outputs: inputs,
      };
    };

  const { createContext } = SlackFunctionTester(TestFunction);
  handler(createContext({ inputs: sharedInputs }));
});

Deno.test("Custom Function using untyped Arrays and typed arrays of strings", () => {
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
      },
      required: ["aTypedArray", "anUntypedArray"],
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
      },
      required: ["aTypedArray", "anUntypedArray"],
    },
  });

  const sharedInputs = {
    aTypedArray: ["hello"],
    anUntypedArray: [1, "goodbye"],
  };

  const handler: EnrichedSlackFunctionHandler<typeof TestFunction.definition> =
    (
      { inputs },
    ) => {
      const { aTypedArray, anUntypedArray } = inputs;
      assert<IsAny<typeof anUntypedArray[0]>>(true);
      assert<IsAny<typeof aTypedArray[0]>>(false);

      assert<CannotBeUndefined<typeof aTypedArray>>(true);
      assert<CannotBeUndefined<typeof anUntypedArray>>(true);

      // These tests are a little weird, could technically be undefined if these arrays are empty
      assert<CannotBeUndefined<typeof aTypedArray[0]>>(true);
      assert<CannotBeUndefined<typeof aTypedArray[0]>>(true);

      return {
        outputs: inputs,
      };
    };

  const { createContext } = SlackFunctionTester(TestFunction);

  const result = handler(createContext({ inputs: sharedInputs }));
  assertEqualsTypedValues(sharedInputs, result.outputs);
});