import { assert, IsExact } from "../../../src/dev_deps.ts";
import {
  EnrichedSlackFunctionHandler,
  ExtractFunctionRuntimeTypes,
} from "../../../src/functions/types.ts";
import { DefineFunction, DefineProperty, Schema } from "../../../src/mod.ts";
import { SlackFunctionTester } from "../../../src/functions/tester/mod.ts";

Deno.test("ExtractFunctionRuntimeTypes should abe able to provide a usable type of a DefineFunction return object", () => {
  const TestFn = DefineFunction({
    callback_id: "test_function",
    title: "Test function",
    source_file: "functions/test_function.ts",
    input_parameters: {
      properties: {
        bool: {
          type: Schema.types.boolean,
        },
        int: {
          type: Schema.types.integer,
        },
        num: {
          type: Schema.types.number,
        },
        string: {
          type: Schema.types.string,
        },
        arr: {
          type: Schema.types.array,
          items: {
            type: Schema.types.boolean,
          },
        },
        obj: DefineProperty({
          type: Schema.types.object,
          properties: {
            bool: {
              type: Schema.types.boolean,
            },
          },
          required: ["bool"],
        }),
      },
      required: ["bool", "int", "num", "string", "arr", "obj"],
    },
    output_parameters: {
      properties: {
        bool: {
          type: Schema.types.boolean,
        },
        int: {
          type: Schema.types.integer,
        },
        num: {
          type: Schema.types.number,
        },
        string: {
          type: Schema.types.string,
        },
        arr: {
          type: Schema.types.array,
          items: {
            type: Schema.types.boolean,
          },
        },
        obj: DefineProperty({
          type: Schema.types.object,
          properties: {
            bool: {
              type: Schema.types.boolean,
            },
          },
          required: ["bool"],
        }),
      },
      required: ["bool", "int", "num", "string", "arr", "obj"],
    },
  });

  type Actual = ExtractFunctionRuntimeTypes<typeof TestFn>;

  const expectedParams = {
    bool: true,
    int: 0,
    num: 0.1,
    string: "",
    arr: [true],
    obj: {
      bool: true,
    },
  };

  const assertHandler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    (
      args,
    ) => {
      assert<IsExact<Actual["args"], typeof args>>(true);
      return {
        outputs: expectedParams,
      };
    };
  type ExpectedOutputs = Required<ReturnType<typeof assertHandler>>["outputs"];

  const { createContext } = SlackFunctionTester(TestFn);
  const expectedContext = createContext({
    inputs: expectedParams,
  });
  assertHandler(expectedContext); // execute assertion in handler

  assert<IsExact<Actual["outputs"], ExpectedOutputs>>(true);
});

Deno.test("ExtractFunctionRuntimeTypes should be able to provide a usable type of an empty DefineFunction return object", () => {
  const TestFn = DefineFunction({
    callback_id: "test_function",
    title: "Test function",
    source_file: "functions/test_function.ts",
    input_parameters: {
      properties: {},
      required: [],
    },
    output_parameters: {
      properties: {},
      required: [],
    },
  });

  type Actual = ExtractFunctionRuntimeTypes<typeof TestFn>;

  const expectedParams = {};

  const assertHandler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    (
      args,
    ) => {
      assert<IsExact<Actual["args"], typeof args>>(true);
      return {
        outputs: expectedParams,
      };
    };
  type ExpectedOutputs = Required<ReturnType<typeof assertHandler>>["outputs"];

  const { createContext } = SlackFunctionTester(TestFn);
  const expectedContext = createContext({
    inputs: expectedParams,
  });
  assertHandler(expectedContext); // execute assertion in handler

  assert<IsExact<Actual["outputs"], ExpectedOutputs>>(true);
});

Deno.test("ExtractFunctionRuntimeTypes should be able to provide a usable type from an Async Function", async () => {
  const TestFn = DefineFunction({
    callback_id: "test_function",
    title: "Test function",
    source_file: "functions/test_function.ts",
    input_parameters: {
      properties: {
        bool: {
          type: Schema.types.boolean,
        },
      },
      required: ["bool"],
    },
    output_parameters: {
      properties: {
        bool: {
          type: Schema.types.boolean,
        },
      },
      required: ["bool"],
    },
  });

  type Actual = ExtractFunctionRuntimeTypes<typeof TestFn>;

  const expectedParams = {
    bool: true,
  };

  const assertHandler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    async (
      args,
    ) => {
      assert<IsExact<Actual["args"], typeof args>>(true);
      return await {
        outputs: expectedParams,
      };
    };
  type ExpectedOutputs = Required<
    Awaited<ReturnType<typeof assertHandler>>
  >["outputs"];

  const { createContext } = SlackFunctionTester(TestFn);
  const expectedContext = createContext({
    inputs: expectedParams,
  });
  await assertHandler(expectedContext); // execute assertion in handler

  assert<IsExact<Actual["outputs"], ExpectedOutputs>>(true);
});
