import { assert, assertEquals, assertExists, IsAny, IsExact } from "../../../src/dev_deps.ts";
import { CanBe, CanBeUndefined } from "../../../src/test_utils.ts";
import { assertEqualsTypedValues } from "../../../src/test_utils.ts";
import { SlackFunctionTester } from "../../../src/functions/tester/mod.ts";
import { DefineFunction, DefineType } from "../../../src/mod.ts";
import { EnrichedSlackFunctionHandler } from "../../../src/functions/types.ts";
import { Schema } from "../../../src/mod.ts";

/**
 * Custom Function handler tests, exercising inputs of unwrapped typed object parameters
 * Unwrapped typed object parameters are object parameters that are not defined using the DefineProperty helper
 * TODO: some of these are commented out and failing as we attempt to address the issues
 * TODO: May want to split this file up down the road if it gets too big, possibly organize under further sub-dirs
 */


// TODO: unwrapped typed object, in a custom type, fed to a typed array, yields an array of `any` items at runtime
/*
Deno.test("Custom Function using Typed Arrays of Custom Types of unwrapped typed objects should honor required and optional properties", () => {
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

Deno.test("Custom Function using Typed Arrays of unwrapped typed objects should honor required and optional properties", () => {
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

Deno.test("Custom Function using a Custom Type input for an unwrapped typedobject with mixed required/optional properties should provide correct typedobject typing in a function handler context", () => {
  const myType = DefineType({
    name: "custom",
    type: Schema.types.object,
    properties: {
      required_property: { type: "string" },
      optional_property: { type: "string" },
    },
    required: ["required_property"],
  });

  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        custom_type: {
          type: myType,
        },
      },
      required: ["custom_type"],
    },
    output_parameters: {
      properties: {
        custom_type: {
          type: myType,
        },
      },
      required: ["custom_type"],
    },
  });

  const sharedInputs = {
    custom_type: {
      required_property: "i am a necessity",
    },
  };

  const validHandler: EnrichedSlackFunctionHandler<
    typeof TestFunction.definition
  > = (
    { inputs },
  ) => {
    const { custom_type } = inputs;

    assert<IsAny<typeof custom_type>>(false);
    assert<IsExact<typeof custom_type.required_property, string>>(true);
    assert<CanBeUndefined<typeof custom_type.optional_property>>(true);
    assert<CanBe<typeof custom_type.optional_property, string>>(true);

    return {
      outputs: inputs,
    };
  };

  const { createContext } = SlackFunctionTester(TestFunction);

  const result = validHandler(createContext({ inputs: sharedInputs }));
  assertEqualsTypedValues(sharedInputs, result.outputs);
});

Deno.test("Custom Function using a Custom Type input for an unwrapped typedobject with mixed required/optional properties should complain if required output not provided", () => {
  const myType = DefineType({
    name: "custom",
    type: Schema.types.object,
    properties: {
      required_property: { type: "string" },
      optional_property: { type: "string" },
    },
    required: ["required_property"],
  });

  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        custom_type: {
          type: myType,
        },
      },
      required: ["custom_type"],
    },
    output_parameters: {
      properties: {
        custom_type: {
          type: myType,
        },
      },
      required: ["custom_type"],
    },
  });

  const sharedInputs = {
    custom_type: {
      required_property: "i am a necessity",
    },
  };

  const { createContext } = SlackFunctionTester(TestFunction);

  // @ts-expect-error Type error if required property isn't returned
  const _invalidHandler: EnrichedSlackFunctionHandler<
    typeof TestFunction.definition
  > = (
    { inputs },
  ) => {
    return {
      outputs: {
        custom_type: {
          optional_property: "im useless",
        },
      },
    };
  };
});

Deno.test("Custom Function using a Custom Type input for an unwrapped typedobject with additionalProperties=undefined should allow for referencing additional properties", () => {
  const myType = DefineType({
    name: "custom",
    type: Schema.types.object,
    properties: {
      required_property: { type: "string" },
      optional_property: { type: "string" },
    },
    required: ["required_property"],
  });

  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        custom_type: {
          type: myType,
        },
      },
      required: ["custom_type"],
    },
    output_parameters: {
      properties: {
        custom_type: {
          type: myType,
        },
      },
      required: ["custom_type"],
    },
  });

  const sharedInputs = {
    custom_type: {
      required_property: "i am a necessity",
    },
  };

  const validHandler: EnrichedSlackFunctionHandler<
    typeof TestFunction.definition
  > = (
    { inputs },
  ) => {
    const { custom_type } = inputs;

    assert<IsAny<typeof custom_type>>(false);
    assert<IsAny<typeof custom_type.something>>(true);

    return {
      outputs: inputs,
    };
  };

  const { createContext } = SlackFunctionTester(TestFunction);

  const result = validHandler(createContext({ inputs: sharedInputs }));
  assertEqualsTypedValues(sharedInputs, result.outputs);
});

Deno.test("Custom Function using a Custom Type input for an unwrapped typedobject with additionalProperties=true should allow for referencing additional properties", () => {
  const myType = DefineType({
    name: "custom",
    type: Schema.types.object,
    properties: {
      required_property: { type: "string" },
      optional_property: { type: "string" },
    },
    required: ["required_property"],
    additionalProperties: true
  });

  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        custom_type: {
          type: myType,
        },
      },
      required: ["custom_type"],
    },
    output_parameters: {
      properties: {
        custom_type: {
          type: myType,
        },
      },
      required: ["custom_type"],
    },
  });

  const sharedInputs = {
    custom_type: {
      required_property: "i am a necessity",
    },
  };

  const validHandler: EnrichedSlackFunctionHandler<
    typeof TestFunction.definition
  > = (
    { inputs },
  ) => {
    const { custom_type } = inputs;

    assert<IsAny<typeof custom_type>>(false);
    assert<IsAny<typeof custom_type.something>>(true);

    return {
      outputs: inputs,
    };
  };

  const { createContext } = SlackFunctionTester(TestFunction);

  const result = validHandler(createContext({ inputs: sharedInputs }));
  assertEqualsTypedValues(sharedInputs, result.outputs);
});

Deno.test("Custom Function using a Custom Type input for an unwrapped typedobject with additionalProperties=false should prevent referencing additional properties", () => {
  const myType = DefineType({
    name: "custom",
    type: Schema.types.object,
    properties: {
      required_property: { type: "string" },
      optional_property: { type: "string" },
    },
    required: ["required_property"],
    additionalProperties: false
  });

  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        custom_type: {
          type: myType,
        },
      },
      required: ["custom_type"],
    },
    output_parameters: {
      properties: {
        custom_type: {
          type: myType,
        },
      },
      required: ["custom_type"],
    },
  });

  const sharedInputs = {
    custom_type: {
      required_property: "i am a necessity",
    },
  };

  const validHandler: EnrichedSlackFunctionHandler<
    typeof TestFunction.definition
  > = (
    { inputs },
  ) => {
    const { custom_type } = inputs;

    assert<IsAny<typeof custom_type>>(false);
    // @ts-expect-error somethingElse cant exist
    custom_type.somethingElse;

    return {
      outputs: inputs,
    };
  };

  const { createContext } = SlackFunctionTester(TestFunction);

  const result = validHandler(createContext({ inputs: sharedInputs }));
  assertEqualsTypedValues(sharedInputs, result.outputs);
});