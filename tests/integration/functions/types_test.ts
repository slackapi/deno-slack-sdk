import { assert, IsExact } from "../../../src/dev_deps.ts";
import {
  EnrichedSlackFunctionHandler,
  FunctionRuntimeType,
} from "../../../src/functions/types.ts";
import { DefineFunction, DefineProperty, Schema } from "../../../src/mod.ts";
import { SlackFunctionTester } from "../../../src/functions/tester/mod.ts";

Deno.test("FunctionRuntimeType should abe able to provide a usable type of a DefineFunction return object", () => {
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

  type Actual = FunctionRuntimeType<typeof TestFn>;

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

  const validHandler: EnrichedSlackFunctionHandler<typeof TestFn.definition> = (
    args,
  ) => {
    assert<IsExact<typeof args, Actual["args"]>>(true);
    return {
      outputs: expectedParams,
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const expectedContext = createContext({
    inputs: expectedParams,
  });
  const expectedResult = validHandler(expectedContext);

  type Expected = {
    outputs: typeof expectedResult.outputs;
    args: typeof expectedContext;
  };

  assert<IsExact<Actual, Expected>>(true);
});

Deno.test("FunctionRuntimeType should be able to provide a usable type of an empty DefineFunction return object", () => {
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

  type Actual = FunctionRuntimeType<typeof TestFn>;

  const expectedParams = {};

  const validHandler: EnrichedSlackFunctionHandler<typeof TestFn.definition> = (
    args,
  ) => {
    assert<IsExact<typeof args, Actual["args"]>>(true);
    return {
      outputs: expectedParams,
    };
  };
  const { createContext } = SlackFunctionTester(TestFn);
  const expectedContext = createContext({
    inputs: expectedParams,
  });
  const expectedResult = validHandler(expectedContext);

  type Expected = {
    outputs: typeof expectedResult.outputs;
    args: typeof expectedContext;
  };

  assert<IsExact<Actual, Expected>>(true);
});

Deno.test("FunctionRuntimeType should be able to provide a usable type from an Async Function", () => {
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

  type Actual = FunctionRuntimeType<typeof TestFn>;

  const expectedParams = {
    bool: true,
  };

  const validHandler: EnrichedSlackFunctionHandler<typeof TestFn.definition> =
    async (args) => {
      assert<IsExact<typeof args, Actual["args"]>>(true);
      return await {
        outputs: expectedParams,
      };
    };
  const { createContext } = SlackFunctionTester(TestFn);
  const expectedContext = createContext({
    inputs: expectedParams,
  });
  const expectedResult = validHandler(expectedContext);

  type Expected = {
    outputs: Awaited<typeof expectedResult>["outputs"];
    args: typeof expectedContext;
  };

  assert<IsExact<Actual, Expected>>(true);
});
