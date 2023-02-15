import {
  getSlackFunctions,
  greenText,
  isArrayFunctionProperty,
  isObjectFunctionProperty,
  redText,
  yellowText,
} from "../utils.ts";
import { assert, assertEquals } from "../../../../../../dev_deps.ts";
import { FunctionProperty } from "../types.ts";
import { CanBeUndefined } from "../../../../../../test_utils.ts";

Deno.test("colored text remain consistent", () => {
  assertEquals("\x1b[92mtest\x1b[0m", greenText("test"));
  assertEquals("\x1b[91mtest\x1b[0m", redText("test"));
  assertEquals("\x1b[38;5;214mtest\x1b[0m", yellowText("test"));
});

Deno.test("Non builtin functions should be filtered", async () => {
  const actual = await getSlackFunctions(
    "src/schema/slack/functions/_scripts/src/test/data/function.json",
  );
  assertEquals(actual.length, 1);
});

Deno.test("isObjectFunctionProperty distinguishes ObjectFunctionProperty from FunctionProperty", () => {
  const property: FunctionProperty = {
    type: "object",
    properties: {
      myString: {
        type: "string",
        description: "test description",
        title: "String property",
      },
    },
    required: [],
    additionalProperties: true,
  };
  assertEquals(true, isObjectFunctionProperty(property));
  if (isObjectFunctionProperty(property)) {
    assert<CanBeUndefined<typeof property.additionalProperties>>(true);
    assert<CanBeUndefined<typeof property.required>>(true);
  }
});

Deno.test("isArrayFunctionProperty distinguishes ArrayFunctionProperty from FunctionProperty", () => {
  const property: FunctionProperty = {
    type: "array",
    description: "test description",
    title: "ArrayFunctionProperty",
    items: {
      type: "string",
    },
  };
  assertEquals(true, isArrayFunctionProperty(property));
  if (isArrayFunctionProperty(property)) {
    assert<CanBeUndefined<typeof property.description>>(true);
    assert<CanBeUndefined<typeof property.title>>(true);
  }
});
