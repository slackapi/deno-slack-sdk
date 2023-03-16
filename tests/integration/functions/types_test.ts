import { assert } from "../../../src/dev_deps.ts";
import { FunctionRuntimeType } from "../../../src/functions/types.ts";
import { DefineFunction, Schema } from "../../../src/mod.ts";
import { CanBe } from "../../../src/test_utils.ts";

Deno.test("FunctionRuntimeType should abe able to provide a usable type of a DefineFunction return object", () => {
  const testFunctionDefinition = DefineFunction({
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
        obj: {
          type: Schema.types.object,
          properties: {
            bool: {
              type: Schema.types.boolean,
            },
          },
          required: ["bool"],
        },
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
        obj: {
          type: Schema.types.object,
          properties: {
            bool: {
              type: Schema.types.boolean,
            },
          },
          required: ["bool"],
        },
      },
      required: ["bool", "int", "num", "string", "arr", "obj"],
    },
  });

  type Actual = FunctionRuntimeType<
    typeof testFunctionDefinition
  >;

  const expected = {
    inputs: {
      bool: true,
      int: 0,
      num: 0.1,
      string: "",
      arr: [true],
      obj: {
        bool: true,
      },
    },
    outputs: {
      bool: true,
      int: 0,
      num: 0.1,
      string: "",
      arr: [true],
      obj: {
        bool: true,
      },
    },
  };

  assert<CanBe<typeof expected, Actual>>(true);
});

Deno.test("FunctionRuntimeType should be able to provide a usable type of an empty DefineFunction return object", () => {
  const testFunctionDefinition = DefineFunction({
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

  type Actual = FunctionRuntimeType<typeof testFunctionDefinition>;

  const expected = {
    inputs: {},
    outputs: {},
  };

  assert<CanBe<typeof expected, Actual>>(true);
});
