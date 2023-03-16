import { assert } from "../../src/dev_deps.ts";
import {
  DefineFunction,
  DefineProperty,
  DefineType,
  Schema,
} from "../../src/mod.ts";
import { CanBe } from "../../src/test_utils.ts";
import { RuntimeType } from "../../src/types.ts";

Deno.test("RuntimeType should provide a usable type from DefineType returned object", () => {
  const customType = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
    type: Schema.types.boolean,
  });

  type Actual = RuntimeType<typeof customType>;

  assert<CanBe<boolean, Actual>>(true);
});

Deno.test("RuntimeType should provide a usable type from DefineFunction returned object", () => {
  const testFunctionDefinition = DefineFunction({
    callback_id: "test_function",
    title: "Test function",
    source_file: "functions/test_function.ts",
    input_parameters: {
      properties: {},
      required: [],
    },
    output_parameters: {
      properties: {},
      required: [],
    },
  });

  type Actual = RuntimeType<typeof testFunctionDefinition>;

  const expected = {
    inputs: {},
    outputs: {},
  };

  assert<CanBe<typeof expected, Actual>>(true);
});

Deno.test("RuntimeType should provide a usable type from DefineProperty returned object", () => {
  const testProperty = DefineProperty({
    title: "test_property",
    type: Schema.types.object,
    properties: {},
    required: [],
  });

  type Actual = RuntimeType<typeof testProperty>;

  const expected = {};

  assert<CanBe<typeof expected, Actual>>(true);
});
