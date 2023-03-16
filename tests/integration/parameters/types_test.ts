import { assert } from "../../../src/dev_deps.ts";
import { DefineProperty, Schema } from "../../../src/mod.ts";
import { PropertyRuntimeType } from "../../../src/parameters/types.ts";
import { CanBe } from "../../../src/test_utils.ts";

Deno.test("PropertyRuntimeType should provide a usable type from an 'object' DefineProperty", () => {
  const testProperty = DefineProperty({
    title: "test_property",
    type: Schema.types.object,
    properties: {
      bool: {
        type: Schema.types.boolean,
      },
      int: {
        type: Schema.types.integer,
      },
      num: {
        type: Schema.types.number,
      },
      string: {
        type: Schema.types.string,
      },
      arr: {
        type: Schema.types.array,
        items: {
          type: Schema.types.boolean,
        },
      },
      obj: DefineProperty({
        type: Schema.types.object,
        properties: {
          obj: DefineProperty({
            type: Schema.types.object,
            properties: {
              obj: DefineProperty({
                type: Schema.types.object,
                properties: {
                  obj: DefineProperty({
                    type: Schema.types.object,
                    properties: {
                      bool: {
                        type: Schema.types.boolean,
                      },
                    },
                    required: ["bool"],
                  }),
                },
                required: ["obj"],
              }),
            },
            required: ["obj"],
          }),
        },
        required: ["obj"],
      }),
    },
    required: ["bool", "int", "num", "string", "arr", "obj"],
  });

  type Actual = PropertyRuntimeType<typeof testProperty>;

  const expected = {
    bool: true,
    int: 0,
    num: 0.1,
    string: "",
    arr: [true],
    obj: {
      obj: {
        obj: {
          obj: {
            bool: true,
          },
        },
      },
    },
  };

  assert<CanBe<typeof expected, Actual>>(true);
});

Deno.test("PropertyRuntimeType should provide a usable type from an empty 'object' DefineProperty", () => {
  const testProperty = DefineProperty({
    title: "test_property",
    type: Schema.types.object,
    properties: {},
    required: [],
  });

  type Actual = PropertyRuntimeType<typeof testProperty>;

  const expected = {};

  assert<CanBe<typeof expected, Actual>>(true);
});
