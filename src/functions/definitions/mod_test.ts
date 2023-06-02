import { SlackFunctionDefinition } from "./slack_function.ts";
import { ConnectorFunctionDefinition } from "./connector_function.ts";
import { DefineConnector, DefineFunction } from "./mod.ts";
import { assertInstanceOf } from "../../dev_deps.ts";
import { PossibleParameterKeys } from "../../parameters/types.ts";

type emptyParameterType = Record<string, never>;

Deno.test("DefineFunction sets appropriate defaults", () => {
  const func = DefineFunction({
    callback_id: "my_function",
    title: "My function",
    source_file: "functions/dino.ts",
  });

  assertInstanceOf(
    func,
    SlackFunctionDefinition<
      emptyParameterType,
      emptyParameterType,
      PossibleParameterKeys<emptyParameterType>,
      PossibleParameterKeys<emptyParameterType>
    >,
  );
});

Deno.test("DefineConnector returns an instance of ConnectorFunctionDefinition", () => {
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
