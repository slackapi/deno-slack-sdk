import { assert } from "../../../src/dev_deps.ts";
import { FunctionType } from "../../../src/functions/types.ts";
import { DefineFunction, DefineProperty, Schema } from "../../../src/mod.ts";
import { PropertyType } from "../../../src/parameters/types.ts";
import { CanBe } from "../../../src/test_utils.ts";

Deno.test("FunctionType should abe able to provide a usable type of a DefineFunction return object", () => {
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

  type testFunctionDefinitionType = FunctionType<typeof testFunctionDefinition>;

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

  assert<CanBe<typeof expected, testFunctionDefinitionType>>(true);
});

Deno.test("FunctionType should be able to provide a usable type of an empty DefineFunction return object", () => {
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

  type testFunctionDefinitionType = FunctionType<typeof testFunctionDefinition>;

  const expected = {
    inputs: {},
    outputs: {},
  };

  assert<CanBe<typeof expected, testFunctionDefinitionType>>(true);
});

Deno.test("PropertyType should provide a usable type from an 'object' DefineProperty", () => {
  const testProperty = DefineProperty({
    title: "test_property",
    type: Schema.types.object,
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
          obj: DefineProperty({
            type: Schema.types.object,
            properties: {
              obj: DefineProperty({
                type: Schema.types.object,
                properties: {
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
                required: ["obj"],
              }),
            },
            required: ["obj"],
          }),
        },
        required: ["obj"],
      }),
    },
    required: ["bool", "int", "num", "string", "arr", "obj"],
  });

  type TestPropertyType = PropertyType<typeof testProperty>;

  const expected = {
    bool: true,
    int: 0,
    num: 0.1,
    string: "",
    arr: [true],
    obj: {
      obj: {
        obj: {
          obj: {
            bool: true,
          },
        },
      },
    },
  };

  assert<CanBe<typeof expected, TestPropertyType>>(true);
});

Deno.test("PropertyType should provide a usable type from an empty 'object' DefineProperty", () => {
  const testProperty = DefineProperty({
    title: "test_property",
    type: Schema.types.object,
    properties: {},
    required: [],
  });

  type TestPropertyType = PropertyType<typeof testProperty>;

  const expected = {};

  assert<CanBe<typeof expected, TestPropertyType>>(true);
});
