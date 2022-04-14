import { DefineFunction } from "./mod.ts";
import Schema from "../schema/mod.ts";
import { assertEquals, assertStrictEquals } from "../dev_deps.ts";

// TODO: Re-add tests to validate function execution when we've determined how to execute functions locally

const emptyParameterObject = Object.freeze({ required: [], properties: {} });

Deno.test("Function sets appropriate defaults", () => {
  const Func = DefineFunction({
    callback_id: "my_function",
    title: "My function",
    source_file: "functions/dino.ts",
  });

  const exportedFunc = Func.export();
  assertStrictEquals(exportedFunc.source_file, "functions/dino.ts");
  assertEquals(exportedFunc.input_parameters, emptyParameterObject);
  assertEquals(exportedFunc.output_parameters, emptyParameterObject);
});

Deno.test("Function with required params", () => {
  const AllTypesFunction = DefineFunction({
    callback_id: "my_function",
    title: "All Types Function",
    source_file: "functions/example.ts",
    input_parameters: {
      required: ["myString" /* , "myNumber" */],
      properties: {
        myString: {
          type: Schema.types.string,
          title: "My string",
          description: "a really neat value",
        },
        myBoolean: {
          type: Schema.types.boolean,
          title: "My boolean",
        },
        // integer: {
        //   type: Schema.types.integer,
        //   description: "integer",
        // },
        // myNumber: {
        //   type: Schema.types.number,
        //   description: "number",
        // },
      },
    },
    output_parameters: {
      required: ["out"],
      properties: {
        out: {
          type: Schema.types.string,
        },
      },
    },
  });

  assertEquals(AllTypesFunction.definition.input_parameters?.required, [
    "myString",
    // "myNumber",
  ]);
  assertEquals(AllTypesFunction.definition.output_parameters?.required, [
    "out",
  ]);
});

Deno.test("Function without input and output parameters", () => {
  const NoParamFunction = DefineFunction({
    callback_id: "no_params",
    title: "No Parameter Function",
    source_file: "functions/no_params.ts",
  });

  assertEquals(emptyParameterObject, NoParamFunction.export().input_parameters);
  assertEquals(
    emptyParameterObject,
    NoParamFunction.export().output_parameters,
  );
});

Deno.test("Function with input parameters but no output parameters", () => {
  const inputParameters = {
    required: [],
    properties: {
      aString: { type: Schema.types.string },
    },
  };
  const NoOutputParamFunction = DefineFunction({
    callback_id: "input_params_only",
    title: "No Parameter Function",
    source_file: "functions/input_params_only.ts",
    input_parameters: inputParameters,
  });

  NoOutputParamFunction.export();

  assertStrictEquals(
    inputParameters,
    NoOutputParamFunction.definition.input_parameters,
  );
  assertEquals(
    emptyParameterObject,
    NoOutputParamFunction.export().output_parameters,
  );
});

Deno.test("Function with output parameters but no input parameters", () => {
  const outputParameters = {
    required: [],
    properties: {
      aString: { type: Schema.types.string },
    },
  };
  const NoInputParamFunction = DefineFunction({
    callback_id: "output_params_only",
    title: "No Parameter Function",
    source_file: "functions/output_params_only.ts",
    output_parameters: outputParameters,
  });

  assertEquals(
    emptyParameterObject,
    NoInputParamFunction.export().input_parameters,
  );
  assertStrictEquals(
    outputParameters,
    NoInputParamFunction.definition.output_parameters,
  );
});
