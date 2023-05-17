import { SlackFunctionDefinition } from "./mod.ts";
import { assertEquals, assertStrictEquals } from "../../dev_deps.ts";

const emptyParameterObject = Object.freeze({ required: [], properties: {} });

Deno.test("DefineFunction sets appropriate defaults", () => {
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
  assertEquals(exportedFunc.input_parameters, emptyParameterObject);
  assertEquals(exportedFunc.output_parameters, emptyParameterObject);
});
