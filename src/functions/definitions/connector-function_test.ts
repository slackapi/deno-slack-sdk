import {
  assertEquals,
  assertInstanceOf,
  assertStrictEquals,
} from "../../dev_deps.ts";
import type { PossibleParameterKeys } from "../../parameters/types.ts";
import Schema from "../../schema/mod.ts";
import {
  ConnectorFunctionDefinition,
  DefineConnector,
} from "./connector-function.ts";

type emptyParameterType = Record<string, never>;

Deno.test("DefineConnector returns an instance of `ConnectorFunctionDefinition`", () => {
  const connector = DefineConnector({
    callback_id: "my_connector",
    title: "My Connector",
  });

  assertInstanceOf(
    connector,
    ConnectorFunctionDefinition<
      emptyParameterType,
      emptyParameterType,
      PossibleParameterKeys<emptyParameterType>,
      PossibleParameterKeys<emptyParameterType>
    >,
  );
});

Deno.test("DefineConnector sets appropriate defaults", () => {
  const Func = DefineConnector({
    callback_id: "my_connector",
    title: "My Connector",
  });

  assertEquals(Func.id, Func.definition.callback_id);
  assertStrictEquals(Func.type, "API");
  assertEquals(Func.definition.title, "My Connector");
  assertEquals(Func.definition.input_parameters, undefined);
  assertEquals(Func.definition.output_parameters, undefined);
});

Deno.test("DefineConnector with input parameters but no output parameters", () => {
  const inputParameters = {
    properties: {
      aString: { type: Schema.types.string },
    },
    required: [],
  };
  const NoOutputParamFunction = DefineConnector({
    callback_id: "input_params_only",
    title: "No Parameter Function",
    input_parameters: inputParameters,
  });

  assertStrictEquals(
    NoOutputParamFunction.definition.input_parameters,
    inputParameters,
  );
  assertEquals(
    NoOutputParamFunction.definition.output_parameters,
    undefined,
  );
});

Deno.test("DefineConnector with output parameters but no input parameters", () => {
  const outputParameters = {
    properties: {
      aString: { type: Schema.types.string },
    },
    required: [],
  };
  const NoInputParamFunction = DefineConnector({
    callback_id: "output_params_only",
    title: "No Parameter Function",
    output_parameters: outputParameters,
  });

  assertEquals(
    NoInputParamFunction.definition.input_parameters,
    undefined,
  );
  assertStrictEquals(
    NoInputParamFunction.definition.output_parameters,
    outputParameters,
  );
});
