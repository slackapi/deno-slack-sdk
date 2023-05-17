import { SlackFunctionDefinition } from "./slack_function.ts";
import { assertEquals, assertStrictEquals } from "../../dev_deps.ts";
import Schema from "../../schema/mod.ts";

const emptyParameter = Object.freeze({ required: [], properties: {} });

Deno.test("SlackFunctionDefinition sets appropriate defaults", () => {
  const Func = new SlackFunctionDefinition({
    callback_id: "my_function",
    title: "My function",
    source_file: "functions/dino.ts",
  });

  assertEquals(Func.id, Func.definition.callback_id);
  assertEquals(Func.definition.title, "My function");
  assertEquals(Func.definition.source_file, "functions/dino.ts");

  const exportedFunc = Func.export();
  assertStrictEquals(exportedFunc.source_file, "functions/dino.ts");
  assertEquals(exportedFunc.input_parameters, emptyParameter);
  assertEquals(exportedFunc.output_parameters, emptyParameter);
});

Deno.test("SlackFunctionDefinition without input and output parameters", () => {
  const NoParamFunction = new SlackFunctionDefinition({
    callback_id: "no_params",
    title: "No Parameter Function",
    source_file: "functions/no_params.ts",
  });

  assertEquals(emptyParameter, NoParamFunction.export().input_parameters);
  assertEquals(
    emptyParameter,
    NoParamFunction.export().output_parameters,
  );
});

Deno.test("SlackFunctionDefinition with input parameters but no output parameters", () => {
  const inputParameters = {
    properties: {
      aString: { type: Schema.types.string },
    },
    required: [],
  };
  const NoOutputParamFunction = new SlackFunctionDefinition({
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
    emptyParameter,
    NoOutputParamFunction.export().output_parameters,
  );
});

Deno.test("SlackFunctionDefinition with output parameters but no input parameters", () => {
  const outputParameters = {
    properties: {
      aString: { type: Schema.types.string },
    },
    required: [],
  };
  const NoInputParamFunction = new SlackFunctionDefinition({
    callback_id: "output_params_only",
    title: "No Parameter Function",
    source_file: "functions/output_params_only.ts",
    output_parameters: outputParameters,
  });

  assertEquals(
    emptyParameter,
    NoInputParamFunction.export().input_parameters,
  );
  assertStrictEquals(
    outputParameters,
    NoInputParamFunction.definition.output_parameters,
  );
});
