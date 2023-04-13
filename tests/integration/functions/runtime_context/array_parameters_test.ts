import { assert, assertEquals, IsAny } from "../../../../src/dev_deps.ts";
import {
  CanBeUndefined,
  CannotBeUndefined,
} from "../../../../src/test_utils.ts";
import { DefineFunction, DefineType, Schema } from "../../../../src/mod.ts";
import { DefineProperty } from "../../../../src/parameters/define_property.ts";
import {
  EnrichedSlackFunctionHandler,
} from "../../../../src/functions/types.ts";
import { SlackFunctionTester } from "../../../../src/functions/tester/mod.ts";
import { assertEqualsTypedValues } from "../../../../src/test_utils.ts";

/**
 * Custom function handler tests, exercising Array inputs/outputs
 */
Deno.test("Custom function using an input of Typed Arrays of Custom Types of DefineProperty-wrapped typed objects should honor required and optional properties and allow for referencing additional properties", () => {
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

Deno.test("Custom function using an input of Typed Arrays of Custom Types of DefineProperty-wrapped typed objects should honor additionalProperties=false", () => {
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

Deno.test("Custom function using an input of Typed Arrays of DefineProperty-wrapped typed objects should honor required and optional properties and allow for referencing additional properties", () => {
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

Deno.test("Custom function using an input of Typed Arrays of DefineProperty-wrapped typed objects should honor additionalProperties=false", () => {
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

Deno.test("Custom function using untyped Arrays and typed arrays of strings", () => {
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
/**
 * TODO: the next two particular tests lead to the array items being typed as `any`

Deno.test("Custom function using Typed Arrays of Custom Types of unwrapped typed objects should honor required and optional properties", () => {
  const obj = {
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
  };
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

      return {
        outputs: inputs,
      };
    };

  const { createContext } = SlackFunctionTester(TestFunction);
  handler(createContext({ inputs: sharedInputs }));
});
Deno.test("Custom function using Typed Arrays of unwrapped typed objects should honor required and optional properties", () => {
  const obj = {
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
  };

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

      return {
        outputs: inputs,
      };
    };

  const { createContext } = SlackFunctionTester(TestFunction);
  handler(createContext({ inputs: sharedInputs }));
});
*/
