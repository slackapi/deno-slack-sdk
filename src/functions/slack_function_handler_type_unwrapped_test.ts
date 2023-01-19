import {
  assert,
  assertEquals,
  assertExists,
  CanBeUndefined,
  CannotBeUndefined,
  IsAny,
} from "../dev_deps.ts";
import { assertEqualsTypedValues } from "../test_utils.ts";
import { SlackFunctionTester } from "./tester/mod.ts";
import { DefineFunction } from "./mod.ts";
import { EnrichedSlackFunctionHandler } from "./types.ts";
import { DefineType, Schema } from "../mod.ts";
import { DefineObject } from "../types/objects.ts";

// TODO: unwrapped typed object, in a custom type, fed to a typed array, yields an array of `any` items at runtime
/*
Deno.test("EnrichedSlackFunctionHandler using Typed Arrays of Custom Types of unwrapped typed objects should honor required and optional properties", () => {
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

Deno.test("EnrichedSlackFunctionHandler using Typed Arrays of unwrapped typed objects should honor required and optional properties", () => {
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
Deno.test("EnrichedSlackFunctionHandler using unwrapped Objects with additional properties", () => {
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

Deno.test("EnrichedSlackFunctionHandler using unwrapped Objects without additional properties", () => {
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

Deno.test("EnrichedSlackFunctionHandler using unwrapped untyped Objects", () => {
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
