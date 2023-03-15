import { assert, IsExact } from "../../../src/dev_deps.ts";
import { FunctionType } from "../../../src/functions/types.ts";
import { DefineFunction, DefineProperty, Schema } from "../../../src/mod.ts";
import { PropertyType } from "../../../src/parameters/types.ts";
import { CanBe } from "../../../src/test_utils.ts";

Deno.test("Defined Functions should be able to provide the custom input object as a type", () => {
  const testProperty = DefineProperty({
    title: "test_property",
    type: Schema.types.object,
    properties: {
      id: {
        type: Schema.types.string,
        minLength: 3,
      },
      name: {
        type: Schema.types.string,
      },
    },
    required: ["name"],
  });

  const testFunctionDefinition = DefineFunction({
    callback_id: "test_function",
    title: "Test function",
    source_file: "functions/test_function.ts",
    input_parameters: {
      properties: {
        test_property: testProperty,
        message: {
          type: Schema.types.string,
          description: "Message to the recipient",
        },
      },
      required: ["message"],
    },
    output_parameters: {
      properties: {},
      required: [],
    },
  });
  type inputs = FunctionType<typeof testFunctionDefinition>;
  type property = PropertyType<typeof testProperty>;

  const test = (obj: inputs): property => {
    const hello: property = {
      name: "william",
      id: "1h2jkia",
    };
    return hello;
  };
  // TODO not sure what im asserting for here
});

Deno.test("Defined Functions should be able to provide the custom output object as a type", () => {
  const testProperty = DefineProperty({
    title: "test_property",
    type: Schema.types.object,
    properties: {
      id: {
        type: Schema.types.string,
        minLength: 3,
      },
      name: {
        type: Schema.types.string,
      },
    },
    required: ["name"],
  });

  const testFunctionDefinition = DefineFunction({
    callback_id: "test_function",
    title: "Test function",
    source_file: "functions/test_function.ts",
    input_parameters: {
      properties: {},
      required: [],
    },
    output_parameters: {
      properties: {
        test_property: testProperty,
        message: {
          type: Schema.types.string,
          description: "Message to the recipient",
        },
      },
      required: ["message"],
    },
  });

  type outputs = FunctionType<typeof testFunctionDefinition>;

  const test = (obj: outputs) => {
    obj.outputs.test_property?.name;
  };
  // TODO not sure what im asserting for here
});

Deno.test("DefinedProperty should be able to provide the defined object as usable type", () => {
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
                    required: [],
                  }),
                },
                required: [],
              }),
            },
            required: [],
          }),
        },
        required: [],
      }),
    },
    required: ["bool", "int", "num"],
  });

  type TestPropertyType = PropertyType<typeof testProperty>;

  const expected = {
    bool: true,
    int: 0,
    num: 0.1,
    strings: "",
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
