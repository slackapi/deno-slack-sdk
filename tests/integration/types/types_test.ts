import { assert } from "../../../src/dev_deps.ts";
import { DefineProperty, DefineType, Schema } from "../../../src/mod.ts";
import { CanBe } from "../../../src/test_utils.ts";
import { CustomTypeRuntimeType } from "../../../src/types/types.ts";

Deno.test("CustomTypeRuntimeType should provide a usable type from DefineType return object with type: 'object'", () => {
  const customType = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
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
        description: "hello",
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
                    required: ["obj"],
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

  type Actual = CustomTypeRuntimeType<typeof customType>;

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

Deno.test("CustomTypeRuntimeType should provide a usable type from DefineType return object with type: 'object' and empty", () => {
  const customType = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
    type: Schema.types.object,
    properties: {},
    required: [],
  });

  type Actual = CustomTypeRuntimeType<typeof customType>;

  const expected = {};

  assert<CanBe<typeof expected, Actual>>(true);
});

Deno.test("CustomTypeRuntimeType should provide a usable type from DefineType return object with type: 'string'", () => {
  const customType = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
    type: Schema.types.string,
  });

  type Actual = CustomTypeRuntimeType<typeof customType>;

  assert<CanBe<string, Actual>>(true);
});

Deno.test("CustomTypeRuntimeType should provide a usable type from DefineType return object with type: 'array'", () => {
  const customType = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
    type: Schema.types.array,
    items: {
      type: Schema.types.boolean,
    },
  });

  type Actual = CustomTypeRuntimeType<typeof customType>;

  assert<CanBe<boolean[], Actual>>(true);
});

Deno.test("CustomTypeRuntimeType should provide a usable type from DefineType return object with type: 'channel_id'", () => {
  const customType = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
    type: Schema.slack.types.channel_id,
  });

  type Actual = CustomTypeRuntimeType<typeof customType>;

  assert<CanBe<string, Actual>>(true);
});

Deno.test("CustomTypeRuntimeType should provide a usable type from DefineType return object with type: 'message_context'", () => {
  const customType = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
    type: Schema.slack.types.message_context,
  });

  type Actual = CustomTypeRuntimeType<typeof customType>;

  const expected: Actual = {
    message_ts: "",
    user_id: "",
    channel_id: "",
  };

  assert<CanBe<typeof expected, Actual>>(true);
});

Deno.test("CustomTypeRuntimeType should provide any from DefineType nesting DefineType", () => {
  const customType = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
    type: Schema.types.object,
    properties: {
      obj: DefineType({
        title: "Title",
        description: "Description",
        name: "Name1",
        type: Schema.types.string,
      }),
    },
    required: ["obj"],
  });

  type Actual = CustomTypeRuntimeType<typeof customType>;

  // deno-lint-ignore no-explicit-any
  assert<CanBe<any, Actual>>(true);
});
