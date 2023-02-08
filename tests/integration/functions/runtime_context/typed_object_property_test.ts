import {
  assert,
  assertEquals,
  assertExists,
  IsAny,
  IsExact,
} from "../../../../src/dev_deps.ts";
import {
  CanBe,
  CanBeUndefined,
  CannotBeUndefined,
} from "../../../../src/test_utils.ts";
import { DefineFunction, Schema } from "../../../../src/mod.ts";
import { DefineProperty } from "../../../../src/parameters/define_property.ts";
import {
  EnrichedSlackFunctionHandler,
} from "../../../../src/functions/types.ts";
import { SlackFunctionTester } from "../../../../src/functions/tester/mod.ts";
import { assertEqualsTypedValues } from "../../../../src/test_utils.ts";

/**
 * Custom Function handler tests, exercising Typed Object inputs/outputs
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

Deno.test("Custom Function using an unwrapped Typed Object input with additionalProperties=undefined should allow referencing additional properties in a function handler context", () => {
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
          required: [],
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

Deno.test("Custom Function using an unwrapped Typed Object input with additionalProperties=false should prevent referencing additional properties in a function handler context", () => {
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
          required: [],
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
