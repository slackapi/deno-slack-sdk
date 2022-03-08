import { assertEquals } from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { DefineFunction } from "./mod.ts";
import Schema from "../schema/mod.ts";

Deno.test("Function with all input types", async () => {
  const AllTypesFunction = DefineFunction("my_function", {
    title: "All Types Function",
    input_parameters: {
      required: [],
      properties: {
        string: {
          type: Schema.types.string,
          title: "My string",
          description: "a really neat value",
          enum: ["Neat", "REALLY neat", "SO NEAT OMG"],
          choices: [
            {
              value: "Neat",
              title: "A neat value",
              description: "this value is neat",
            },
            {
              value: "REALLY neat",
              title: "A really neat value",
              description: "this value is really neat",
            },
            {
              value: "SO NEAT OMG",
              title: "An extremely neat value",
              description: "This value is the neatest of all of the values",
            },
          ],
          default: "default string",
          examples: ["example 1", "example 2", "example 3"],
        },
        integer: {
          type: Schema.types.integer,
          description: "integer",
          enum: [1, 2, 3],
          choices: [
            {
              value: 1,
              title: "The first value",
              description: "really it's just the number 1",
            },
            {
              value: 2,
              title: "The second value",
              description: "really it's just the number 2",
            },
            {
              value: 3,
              title: "The third value",
              description: "really it's just the number 3",
            },
          ],
          minimum: 0,
          maximum: 10,
          default: 1,
          examples: [2, 3, 4],
        },
        number: {
          type: Schema.types.number,
          description: "number",
          enum: [1.1, 2.2, 3.3],
          choices: [
            {
              value: 1.1,
              title: "The first value",
              description: "really it's just the number 1.1",
            },
            {
              value: 2.2,
              title: "The second value",
              description: "really it's just the number 2.2",
            },
            {
              value: 3.3,
              title: "The third value",
              description: "really it's just the number 3.3",
            },
          ],
          minimum: 1.1,
          maximum: 100.23,
          default: 2.3,
          examples: [4.5, 6.7, 8.9],
        },
        boolean: {
          type: Schema.types.boolean,
          description: "boolean",
          default: true,
          examples: [true, false],
        },
        slack_user_id: {
          type: Schema.slack.types.user_id,
          description: "slack_user_id",
          default: "WBTKKNH24",
          examples: ["WL4EQABR6", "WBS276WCU", "U01TTAV3VV5"],
        },
        slack_channel_id: {
          type: Schema.slack.types.channel_id,
          description: "slack_channel_id",
          default: "C01UVFR6HJS",
          examples: ["C01M03DN554", "C01J7GQ6BBL", "C01DTBA4XHD", "CBS24HDDY"],
        },
        slack_usergroup_id: {
          type: Schema.slack.types.usergroup_id,
          description: "slack_usergroup_id",
          default: "S000000001",
          examples: ["S000000002", "S000000003", "S000000003"],
        },
        slack_timestamp: {
          type: Schema.slack.types.timestamp,
          description: "slack_timestamp",
          default: "390402000",
          examples: ["394635600", "441982800"],
        },
        slack_blocks: {
          type: Schema.slack.types.blocks,
          description: "slack_blocks",
          default: "message",
          examples: ["plain", "text"],
        },
        myArray: {
          type: Schema.types.array,
          items: {
            type: Schema.types.string,
          },
          default: ["louie", "storm", "fiona"],
          examples: [
            ["winston", "arthur"],
          ],
        },
        myObject: {
          type: Schema.types.object,
          properties: {
            id: {
              type: Schema.types.integer,
            },
            name: {
              type: Schema.types.string,
            },
          },
          default: {
            age: 7,
            name: "louie",
            neurotic: true,
          },
          examples: [
            {
              age: 4,
              name: "winston",
              neurotic: false,
            },
            {
              age: 2,
              name: "arthur",
              neurotic: false,
            },
          ],
        },
      },
    },
  }, async ({ inputs }) => {
    return await {
      outputs: inputs,
    };
  });

  const inputs = {
    string: "SO NEAT OMG",
    integer: 1,
    number: 1.5,
    boolean: true,
    "slack_user_id": "U123456",
    "slack_channel_id": "C123456",
    "slack_usergroup_id": "wutwut",
    "slack_timestamp": 316742400,
    myArray: [
      "one",
      "two",
    ],
    myObject: {
      id: 1234,
      name: "a name",
    },
  };

  const { outputs } = await AllTypesFunction.run({
    client: {
      call: async () => await { ok: true },
      response: async () => await { ok: true },
    },
    executionId: "FxTESTID",
    env: {},
    inputs,
  });
  assertEquals(inputs, outputs);
});

Deno.test("Function with all required input types", async () => {
  const AllTypesFunction = DefineFunction("my_function", {
    title: "All Types Function",
    input_parameters: {
      required: ["myString", "myNumber"],
      properties: {
        myString: {
          type: Schema.types.string,
          title: "My string",
          description: "a really neat value",
        },
        integer: {
          type: Schema.types.integer,
          description: "integer",
        },
        myNumber: {
          type: Schema.types.number,
          description: "number",
        },
      },
    },
    output_parameters: {
      required: ["out"],
      properties: {
        out: {
          type: Schema.types.integer,
        },
      },
    },
  }, async ({ inputs }) => {
    return await {
      outputs: {
        out: inputs.integer ?? 0,
      },
    };
  });

  assertEquals(AllTypesFunction.definition.input_parameters?.required, [
    "myString",
    "myNumber",
  ]);

  const inputs = {
    integer: 1,
    myNumber: 1.5,
    myString: "123",
  };

  const { outputs } = await AllTypesFunction.run({
    client: {
      call: async () => await { ok: true },
      response: async () => await { ok: true },
    },
    env: {},
    inputs,
    executionId: "test",
  });

  assertEquals({ out: inputs.integer }, outputs);
});

Deno.test("Function without input and output parameters", () => {
  const NoParamFunction = DefineFunction("no_params", {
    title: "No Parameter Function",
  }, async () => {
    return await {};
  });

  assertEquals(
    { properties: {}, required: [] },
    NoParamFunction.export().input_parameters,
  );
  assertEquals(
    { properties: {}, required: [] },
    NoParamFunction.export().output_parameters,
  );
});

Deno.test("Function with input parameters but no output parameters", () => {
  const inputParameters = {
    required: [],
    properties: {
      aString: { type: Schema.types.string },
    },
  };
  const NoOutputParamFunction = DefineFunction("no_params", {
    title: "No Parameter Function",
    input_parameters: inputParameters,
  }, async () => {
    return await {};
  });

  NoOutputParamFunction.export();

  assertEquals(
    inputParameters,
    NoOutputParamFunction.definition.input_parameters,
  );
  assertEquals(
    { properties: {}, required: [] },
    NoOutputParamFunction.export().output_parameters,
  );
});

Deno.test("Function with output parameters but no input parameters", () => {
  const outputParameters = {
    required: [],
    properties: {
      aString: { type: Schema.types.string },
    },
  };
  const NoInputParamFunction = DefineFunction("no_params", {
    title: "No Parameter Function",
    output_parameters: outputParameters,
  }, async () => {
    return await {};
  });

  assertEquals(
    { properties: {}, required: [] },
    NoInputParamFunction.export().input_parameters,
  );
  assertEquals(
    outputParameters,
    NoInputParamFunction.definition.output_parameters,
  );
});
