import { DefineFunction } from "./mod.ts";
import Schema from "../schema/mod.ts";
import { assertEquals, assertStrictEquals } from "../dev_deps.ts";

// TODO: Re-add tests to validate function execution when we've determined how to execute functions locally

const emptyParameterObject = Object.freeze({ required: [], properties: {} });

Deno.test("DefineFunction sets appropriate defaults", () => {
  const Func = DefineFunction({
    callback_id: "my_function",
    title: "My function",
    source_file: "functions/dino.ts",
  });

  assertEquals(Func.id, Func.definition.callback_id);
  assertEquals(Func.definition.title, "My function");
  assertEquals(Func.definition.source_file, "functions/dino.ts");

  const exportedFunc = Func.export();
  assertStrictEquals(exportedFunc.source_file, "functions/dino.ts");
  assertEquals(exportedFunc.input_parameters, emptyParameterObject);
  assertEquals(exportedFunc.output_parameters, emptyParameterObject);
});

Deno.test("DefineFunction with required params", () => {
  const AllTypesFunction = DefineFunction({
    callback_id: "my_function",
    title: "All Types Function",
    source_file: "functions/example.ts",
    input_parameters: {
      properties: {
        myString: {
          type: Schema.types.string,
          title: "My string",
          description: "a really neat value",
          hint: "Ex. my neat value",
        },
        myBoolean: {
          type: Schema.types.boolean,
          title: "My boolean",
          hint: "Ex: true/false",
        },
        myInteger: {
          type: Schema.types.integer,
          description: "integer",
          hint: "0-100",
        },
        myNumber: {
          type: Schema.types.number,
          description: "number",
        },
      },
      required: ["myString", "myNumber"],
    },
    output_parameters: {
      properties: {
        out: {
          type: Schema.types.string,
        },
      },
      required: ["out"],
    },
  });

  assertEquals(AllTypesFunction.definition.input_parameters?.required, [
    "myString",
    "myNumber",
  ]);
  assertEquals(AllTypesFunction.definition.output_parameters?.required, [
    "out",
  ]);
  assertEquals(
    AllTypesFunction.definition.input_parameters?.properties.myString.hint,
    "Ex. my neat value",
  );
  assertEquals(
    AllTypesFunction.definition.input_parameters?.properties.myBoolean.hint,
    "Ex: true/false",
  );
});

Deno.test("DefineFunction without input and output parameters", () => {
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

Deno.test("DefineFunction with input parameters but no output parameters", () => {
  const inputParameters = {
    properties: {
      aString: { type: Schema.types.string },
    },
    required: [],
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

Deno.test("DefineFunction with output parameters but no input parameters", () => {
  const outputParameters = {
    properties: {
      aString: { type: Schema.types.string },
    },
    required: [],
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
