import { assert, IsExact } from "../../src/dev_deps.ts";
import { DefineProperty, DefineType, Schema } from "../../src/mod.ts";
import { CanBe } from "../../src/test_utils.ts";
import { ToRuntimePropertyType } from "../../src/types.ts";

Deno.test("ToRuntimePropertyType should provide a usable type from DefineType returned object", () => {
  const customType = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
    type: Schema.types.boolean,
  });

  type Actual = ToRuntimePropertyType<typeof customType>;

  assert<IsExact<Actual, boolean>>(true);
});

Deno.test("ToRuntimePropertyType should provide a usable type from DefineProperty returned object", () => {
  const testProperty = DefineProperty({
    title: "test_property",
    type: Schema.types.object,
    properties: {},
    required: [],
  });

  type Actual = ToRuntimePropertyType<typeof testProperty>;

  // deno-lint-ignore no-explicit-any
  type Expected = Record<string, any>; // empty object

  assert<IsExact<Actual, Expected>>(true);
});

Deno.test("ToRuntimePropertyType should provide a usable type from DefineType return object with type: 'object'", () => {
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

  type Actual = ToRuntimePropertyType<typeof customType>;

  type Expected = {
    bool: boolean;
    int: number;
    num: number;
    string: string;
    arr: boolean[];
    obj: {
      obj: {
        obj: {
          obj: {
            bool: boolean;
          };
        };
      };
    };
  };

  assert<CanBe<Actual, Expected>>(true);
});

Deno.test("ToRuntimePropertyType should provide a usable type from DefineType return object with type: 'object' and empty", () => {
  const customType = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
    type: Schema.types.object,
    properties: {},
    required: [],
  });

  type Actual = ToRuntimePropertyType<typeof customType>;

  // deno-lint-ignore no-explicit-any
  type Expected = Record<string, any>;

  assert<IsExact<Actual, Expected>>(true);
});

Deno.test("ToRuntimePropertyType should provide a usable type from DefineType return object with type: 'string'", () => {
  const customType = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
    type: Schema.types.string,
  });

  type Actual = ToRuntimePropertyType<typeof customType>;

  assert<IsExact<Actual, string>>(true);
});

Deno.test("ToRuntimePropertyType should provide a usable type from DefineType return object with type: 'array'", () => {
  const customType = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
    type: Schema.types.array,
    items: {
      type: Schema.types.boolean,
    },
  });

  type Actual = ToRuntimePropertyType<typeof customType>;

  assert<IsExact<Actual, boolean[]>>(true);
});

Deno.test("ToRuntimePropertyType should provide a usable type from DefineType return object with type: 'channel_id'", () => {
  const customType = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
    type: Schema.slack.types.channel_id,
  });

  type Actual = ToRuntimePropertyType<typeof customType>;

  assert<IsExact<Actual, string>>(true);
});

Deno.test("ToRuntimePropertyType should provide a usable type from DefineType return object with type: 'message_context'", () => {
  const customType = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
    type: Schema.slack.types.message_context,
  });

  type Actual = ToRuntimePropertyType<typeof customType>;

  type Expected = {
    message_ts: string;
    user_id?: string | undefined;
    channel_id?: string | undefined;
  };

  assert<CanBe<Actual, Expected>>(true);
});

Deno.test("ToRuntimePropertyType should provide any from DefineType nesting DefineType", () => {
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

  type Actual = ToRuntimePropertyType<typeof customType>;

  // deno-lint-ignore no-explicit-any
  assert<IsExact<Actual, any>>(true);
});

Deno.test("ToRuntimePropertyType should provide a usable type from an 'object' DefineProperty", () => {
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

  type Actual = ToRuntimePropertyType<typeof testProperty>;

  type Expected = {
    bool: boolean;
    int: number;
    num: number;
    string: string;
    arr: boolean[];
    obj: {
      obj: {
        obj: {
          obj: {
            bool: boolean;
          };
        };
      };
    };
  };

  assert<CanBe<Expected, Actual>>(true);
});

Deno.test("ToRuntimePropertyType should provide a usable type from an empty 'object' DefineProperty", () => {
  const testProperty = DefineProperty({
    title: "test_property",
    type: Schema.types.object,
    properties: {},
    required: [],
  });

  type Actual = ToRuntimePropertyType<typeof testProperty>;

  type Expected = Record<string | number | symbol, never>; // empty object

  assert<CanBe<Expected, Actual>>(true);
});
