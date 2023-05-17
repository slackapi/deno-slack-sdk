import { assertEquals, assertStrictEquals } from "../../dev_deps.ts";
import { Schema } from "../../mod.ts";
import { ConnectorFunctionDefinition } from "./connector_function.ts";

const emptyParameter = Object.freeze({ required: [], properties: {} });

Deno.test("ConnectorFunctionDefinition sets appropriate defaults", () => {
  const Func = new ConnectorFunctionDefinition({
    callback_id: "my_connector",
    title: "My Connector",
  });

  assertEquals(Func.id, Func.definition.callback_id);
  assertEquals(Func.definition.title, "My Connector");

  const exportedFunc = Func.export();
  assertStrictEquals(exportedFunc.type, "API");
  assertEquals(exportedFunc.input_parameters, emptyParameter);
  assertEquals(exportedFunc.output_parameters, emptyParameter);
});

Deno.test("ConnectorFunctionDefinition without input and output parameters", () => {
  const NoParamFunction = new ConnectorFunctionDefinition({
    callback_id: "no_params",
    title: "No Parameter Function",
  });

  assertEquals(emptyParameter, NoParamFunction.export().input_parameters);
  assertEquals(
    emptyParameter,
    NoParamFunction.export().output_parameters,
  );
});

Deno.test("ConnectorFunctionDefinition with input parameters but no output parameters", () => {
  const inputParameters = {
    properties: {
      aString: { type: Schema.types.string },
    },
    required: [],
  };
  const NoOutputParamFunction = new ConnectorFunctionDefinition({
    callback_id: "input_params_only",
    title: "No Parameter Function",
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

Deno.test("ConnectorFunctionDefinition with output parameters but no input parameters", () => {
  const outputParameters = {
    properties: {
      aString: { type: Schema.types.string },
    },
    required: [],
  };
  const NoInputParamFunction = new ConnectorFunctionDefinition({
    callback_id: "output_params_only",
    title: "No Parameter Function",
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
