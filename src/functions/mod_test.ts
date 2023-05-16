import { assertEquals, assertStrictEquals } from "../dev_deps.ts";
import { ConnectorDefinition } from "./mod.ts";

const emptyParameterObject = Object.freeze({ required: [], properties: {} });

Deno.test("ConnectorDefinition sets appropriate defaults", () => {
  const Func = new ConnectorDefinition({
    callback_id: "my_connector",
    title: "My Connector",
  });

  assertEquals(Func.id, Func.definition.callback_id);
  assertEquals(Func.definition.title, "My Connector");

  const exportedFunc = Func.export();
  assertStrictEquals(exportedFunc.type, "API");
  assertEquals(exportedFunc.input_parameters, emptyParameterObject);
  assertEquals(exportedFunc.output_parameters, emptyParameterObject);
});
