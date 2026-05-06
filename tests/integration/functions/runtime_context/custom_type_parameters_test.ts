import { assert, IsAny, IsExact } from "../../../../src/dev_deps.ts";
import {
  CanBe,
  CanBeUndefined,
  CannotBeUndefined,
} from "../../../../src/test_utils.ts";
import { DefineFunction, DefineType, Schema } from "../../../../src/mod.ts";
import {
  EnrichedSlackFunctionHandler,
} from "../../../../src/functions/types.ts";
import { SlackFunctionTester } from "../../../../src/functions/tester/mod.ts";
import { assertEqualsTypedValues } from "../../../../src/test_utils.ts";
import { InternalSlackTypes } from "../../../../src/schema/slack/types/custom/mod.ts";

/**
 * Custom function handler tests, exercising Custom Type inputs/outputs, including Slack/internal custom Slack types
 */

Deno.test("Custom function using Slack's FormInput internal Custom Type input should provide correct typedobject typing in a function handler context", () => {
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        formInput: {
          type: InternalSlackTypes.form_input_object,
        },
      },
      required: ["formInput"],
    },
    output_parameters: {
      properties: {
        formInput: {
          type: InternalSlackTypes.form_input_object,
        },
      },
      required: ["formInput"],
    },
  });

  const sharedInputs = {
    formInput: {
      required: [],
      elements: [],
    },
  };

  const validHandler: EnrichedSlackFunctionHandler<
    typeof TestFunction.definition
  > = (
    { inputs },
  ) => {
    const { formInput } = inputs;

    assert<CanBeUndefined<typeof formInput.required>>(
      true,
    );
    assert<CanBe<typeof formInput.required, string[]>>(true);

    assert<CannotBeUndefined<typeof formInput.elements>>(
      true,
    );
    // deno-lint-ignore no-explicit-any
    assert<CanBe<typeof formInput.elements, any[]>>(true);

    return {
      outputs: inputs,
    };
  };

  const { createContext } = SlackFunctionTester(TestFunction);

  validHandler(createContext({ inputs: sharedInputs }));
});

Deno.test("Custom function using Slack's message-context Custom Type input should provide correct typedobject typing in a function handler context", () => {
  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        msgContext: {
          type: Schema.slack.types.message_context,
        },
      },
      required: ["msgContext"],
    },
    output_parameters: {
      properties: {
        msgContext: {
          type: Schema.slack.types.message_context,
        },
      },
      required: ["msgContext"],
    },
  });

  const sharedInputs = {
    msgContext: {
      message_ts: "1234.567",
      channel_id: "C12345",
    },
  };

  const validHandler: EnrichedSlackFunctionHandler<
    typeof TestFunction.definition
  > = (
    { inputs },
  ) => {
    const { msgContext } = inputs;

    // channel_id sub-property
    assert<CanBeUndefined<typeof msgContext.channel_id>>(
      true,
    );
    assert<CanBe<typeof msgContext.channel_id, string>>(true);
    // user_id sub-property
    assert<CanBeUndefined<typeof msgContext.user_id>>(
      true,
    );
    assert<CanBe<typeof msgContext.user_id, string>>(true);
    // message_ts sub-property
    assert<CannotBeUndefined<typeof msgContext.message_ts>>(
      true,
    );
    assert<IsExact<typeof msgContext.message_ts, string>>(true);

    return {
      outputs: inputs,
    };
  };

  const { createContext } = SlackFunctionTester(TestFunction);

  validHandler(createContext({ inputs: sharedInputs }));
});

Deno.test("Custom function using a Custom Type input for an unwrapped typedobject with mixed required/optional properties should provide correct typedobject typing in a function handler context", () => {
  const myType = DefineType({
    name: "custom",
    type: Schema.types.object,
    properties: {
      required_property: { type: "string" },
      optional_property: { type: "string" },
    },
    required: ["required_property"],
  });

  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        custom_type: {
          type: myType,
        },
      },
      required: ["custom_type"],
    },
    output_parameters: {
      properties: {
        custom_type: {
          type: myType,
        },
      },
      required: ["custom_type"],
    },
  });

  const sharedInputs = {
    custom_type: {
      required_property: "i am a necessity",
    },
  };

  const validHandler: EnrichedSlackFunctionHandler<
    typeof TestFunction.definition
  > = (
    { inputs },
  ) => {
    const { custom_type } = inputs;

    assert<IsAny<typeof custom_type>>(false);
    assert<IsExact<typeof custom_type.required_property, string>>(true);
    assert<CanBeUndefined<typeof custom_type.optional_property>>(true);
    assert<CanBe<typeof custom_type.optional_property, string>>(true);

    return {
      outputs: inputs,
    };
  };

  const { createContext } = SlackFunctionTester(TestFunction);

  const result = validHandler(createContext({ inputs: sharedInputs }));
  assertEqualsTypedValues(sharedInputs, result.outputs);
});

Deno.test("Custom function using a Custom Type input for an unwrapped typedobject with mixed required/optional properties should complain if required output not provided", () => {
  const myType = DefineType({
    name: "custom",
    type: Schema.types.object,
    properties: {
      required_property: { type: "string" },
      optional_property: { type: "string" },
    },
    required: ["required_property"],
  });

  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        custom_type: {
          type: myType,
        },
      },
      required: ["custom_type"],
    },
    output_parameters: {
      properties: {
        custom_type: {
          type: myType,
        },
      },
      required: ["custom_type"],
    },
  });

  // @ts-expect-error Type error if required property isn't returned
  const _invalidHandler: EnrichedSlackFunctionHandler<
    typeof TestFunction.definition
  > = () => {
    return {
      outputs: {
        custom_type: {
          optional_property: "im useless",
        },
      },
    };
  };
});

Deno.test("Custom function using a Custom Type input for an unwrapped typedobject with additionalProperties=undefined should allow for referencing additional properties", () => {
  const myType = DefineType({
    name: "custom",
    type: Schema.types.object,
    properties: {
      required_property: { type: "string" },
      optional_property: { type: "string" },
    },
    required: ["required_property"],
  });

  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        custom_type: {
          type: myType,
        },
      },
      required: ["custom_type"],
    },
    output_parameters: {
      properties: {
        custom_type: {
          type: myType,
        },
      },
      required: ["custom_type"],
    },
  });

  const sharedInputs = {
    custom_type: {
      required_property: "i am a necessity",
    },
  };

  const validHandler: EnrichedSlackFunctionHandler<
    typeof TestFunction.definition
  > = (
    { inputs },
  ) => {
    const { custom_type } = inputs;

    assert<IsAny<typeof custom_type>>(false);
    assert<IsAny<typeof custom_type.something>>(true);

    return {
      outputs: inputs,
    };
  };

  const { createContext } = SlackFunctionTester(TestFunction);

  const result = validHandler(createContext({ inputs: sharedInputs }));
  assertEqualsTypedValues(sharedInputs, result.outputs);
});

Deno.test("Custom function using a Custom Type input for an unwrapped typedobject with additionalProperties=true should allow for referencing additional properties", () => {
  const myType = DefineType({
    name: "custom",
    type: Schema.types.object,
    properties: {
      required_property: { type: "string" },
      optional_property: { type: "string" },
    },
    required: ["required_property"],
    additionalProperties: true,
  });

  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        custom_type: {
          type: myType,
        },
      },
      required: ["custom_type"],
    },
    output_parameters: {
      properties: {
        custom_type: {
          type: myType,
        },
      },
      required: ["custom_type"],
    },
  });

  const sharedInputs = {
    custom_type: {
      required_property: "i am a necessity",
    },
  };

  const validHandler: EnrichedSlackFunctionHandler<
    typeof TestFunction.definition
  > = (
    { inputs },
  ) => {
    const { custom_type } = inputs;

    assert<IsAny<typeof custom_type>>(false);
    assert<IsAny<typeof custom_type.something>>(true);

    return {
      outputs: inputs,
    };
  };

  const { createContext } = SlackFunctionTester(TestFunction);

  const result = validHandler(createContext({ inputs: sharedInputs }));
  assertEqualsTypedValues(sharedInputs, result.outputs);
});

Deno.test("Custom function using a Custom Type input for an unwrapped typedobject with additionalProperties=false should prevent referencing additional properties", () => {
  const myType = DefineType({
    name: "custom",
    type: Schema.types.object,
    properties: {
      required_property: { type: "string" },
      optional_property: { type: "string" },
    },
    required: ["required_property"],
    additionalProperties: false,
  });

  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        custom_type: {
          type: myType,
        },
      },
      required: ["custom_type"],
    },
    output_parameters: {
      properties: {
        custom_type: {
          type: myType,
        },
      },
      required: ["custom_type"],
    },
  });

  const sharedInputs = {
    custom_type: {
      required_property: "i am a necessity",
    },
  };

  const validHandler: EnrichedSlackFunctionHandler<
    typeof TestFunction.definition
  > = (
    { inputs },
  ) => {
    const { custom_type } = inputs;

    assert<IsAny<typeof custom_type>>(false);
    // @ts-expect-error somethingElse cant exist
    custom_type.somethingElse;

    return {
      outputs: inputs,
    };
  };

  const { createContext } = SlackFunctionTester(TestFunction);

  const result = validHandler(createContext({ inputs: sharedInputs }));
  assertEqualsTypedValues(sharedInputs, result.outputs);
});
