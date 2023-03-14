import { FunctionType, PropertyType } from "../../../src/functions/types.ts";
import { DefineFunction, DefineProperty, Schema } from "../../../src/mod.ts";

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

  const test = (obj: inputs) => {
    obj.inputs.test_property?.name;
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

  type MyProperty = PropertyType<typeof testProperty>;

  const test = (obj: MyProperty) => {
    obj.name;
  };
  // TODO not sure what im asserting for here
});
