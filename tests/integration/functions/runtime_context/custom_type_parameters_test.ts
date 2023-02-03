import {
  assert, assertExists, IsAny, IsExact
} from "../../../../src/dev_deps.ts";
import { CanBe, CanBeUndefined, CannotBeUndefined, } from "../../../../src/test_utils.ts";
import { DefineFunction, DefineType, Schema } from "../../../../src/mod.ts";
import { DefineProperty } from "../../../../src/parameters/define_property.ts";
import {
  EnrichedSlackFunctionHandler,
} from "../../../../src/functions/types.ts";
import { SlackFunctionTester } from "../../../../src/functions/tester/mod.ts";
import { assertEqualsTypedValues } from "../../../../src/test_utils.ts";
import { InternalSlackTypes } from "../../../../src/schema/slack/types/custom/mod.ts";

/**
 * Custom Function handler tests, exercising Custom Type inputs/outputs, including built-in/internal Slack custom types
 */
Deno.test("Custom Function using a Custom Type input for a DefineProperty-wrapped typedobject with mixed required/optional properties should provide correct typedobject typing in a function handler context and should complain if typedobject output does not include required property", () => {
  const myObject = DefineProperty({
    type: Schema.types.object,
    properties: {
      required_property: { type: "string" },
      optional_property: { type: "string" },
    },
    required: ["required_property"],
  });

  const myType = DefineType({
    name: "custom",
    ...myObject,
  });

  const TestFunction = DefineFunction({
    callback_id: "my_callback_id",
    source_file: "test",
    title: "Test",
    input_parameters: {
      properties: {
        interactivity: {
          type: Schema.slack.types.interactivity,
        },
        user_context: {
          type: Schema.slack.types.user_context,
        },
        custom_type: {
          type: myType,
        },
      },
      required: ["interactivity", "user_context", "custom_type"],
    },
    output_parameters: {
      properties: {
        interactivity: {
          type: Schema.slack.types.interactivity,
        },
        user_context: {
          type: Schema.slack.types.user_context,
        },
        custom_type: {
          type: myType,
        },
      },
      required: ["interactivity", "user_context", "custom_type"],
    },
  });

  const sharedInputs = {
    interactivity: {
      interactivity_pointer: "interactivity_pointer",
      interactor: {
        id: "interactor id",
        secret: "interactor secret",
      },
    },
    user_context: {
      id: "user_context id",
      secret: "user_context secret",
    },
    custom_type: {
      required_property: "i am a necessity",
    },
  };

  const validHandler: EnrichedSlackFunctionHandler<
    typeof TestFunction.definition
  > = (
    { inputs },
  ) => {
    const { interactivity, user_context, custom_type } = inputs;

    assert<CannotBeUndefined<typeof interactivity.interactivity_pointer>>(
      true,
    );
    assert<CannotBeUndefined<typeof interactivity.interactor.id>>(true);
    assert<CannotBeUndefined<typeof interactivity.interactor.secret>>(true);
    assert<CannotBeUndefined<typeof user_context.id>>(true);
    assert<CannotBeUndefined<typeof user_context.secret>>(true);
    assert<IsExact<typeof custom_type.required_property, string>>(true);
    assert<CanBeUndefined<typeof custom_type.optional_property>>(true);
    assert<CanBe<typeof custom_type.optional_property, string>>(true);

    assertEqualsTypedValues(interactivity, sharedInputs.interactivity);
    assertEqualsTypedValues(
      interactivity.interactivity_pointer,
      sharedInputs.interactivity.interactivity_pointer,
    );
    assertEqualsTypedValues(
      interactivity.interactor.id,
      sharedInputs.interactivity.interactor.id,
    );
    assertEqualsTypedValues(
      interactivity.interactor.secret,
      sharedInputs.interactivity.interactor.secret,
    );
    assertEqualsTypedValues(user_context, sharedInputs.user_context);
    assertEqualsTypedValues(
      user_context.secret,
      sharedInputs.user_context.secret,
    );
    assertEqualsTypedValues(user_context.id, sharedInputs.user_context.id);
    assertEqualsTypedValues(
      user_context.secret,
      sharedInputs.user_context.secret,
    );

    return {
      outputs: inputs,
    };
  };

  const { createContext } = SlackFunctionTester(TestFunction);

  const result = validHandler(createContext({ inputs: sharedInputs }));
  assertEqualsTypedValues(sharedInputs, result.outputs);
  assertExists(result.outputs?.interactivity.interactivity_pointer);
  assertExists(result.outputs?.interactivity.interactor.id);
  assertExists(result.outputs?.interactivity.interactor.secret);
  assertExists(result.outputs?.user_context.id);
  assertExists(result.outputs?.user_context.secret);

  // @ts-expect-error Type error if required property isn't returned
  const _invalidHandler: EnrichedSlackFunctionHandler<
    typeof TestFunction.definition
  > = (
    { inputs },
  ) => {
    const { interactivity, user_context } = inputs;
    return {
      outputs: {
        custom_type: {
          optional_property: "im useless",
        },
        interactivity,
        user_context,
      },
    };
  };
});

Deno.test("Custom Function using Slack's FormInput internal Custom Type input should provide correct typedobject typing in a function handler context", () => {
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
    }
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
    assert<CanBe<typeof formInput.elements, any[]>>(true);
    
    return {
      outputs: inputs,
    };
  };

  const { createContext } = SlackFunctionTester(TestFunction);

  const result = validHandler(createContext({ inputs: sharedInputs }));
});

Deno.test("Custom Function using Slack's message-context Custom Type input should provide correct typedobject typing in a function handler context", () => {
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
      channel_id: "C12345"
    }
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

  const result = validHandler(createContext({ inputs: sharedInputs }));
});

Deno.test("Custom Function using a Custom Type input for an unwrapped typedobject with mixed required/optional properties should provide correct typedobject typing in a function handler context", () => {
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

Deno.test("Custom Function using a Custom Type input for an unwrapped typedobject with mixed required/optional properties should complain if required output not provided", () => {
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

  const { createContext } = SlackFunctionTester(TestFunction);

  // @ts-expect-error Type error if required property isn't returned
  const _invalidHandler: EnrichedSlackFunctionHandler<
    typeof TestFunction.definition
  > = (
    { inputs },
  ) => {
    return {
      outputs: {
        custom_type: {
          optional_property: "im useless",
        },
      },
    };
  };
});

Deno.test("Custom Function using a Custom Type input for an unwrapped typedobject with additionalProperties=undefined should allow for referencing additional properties", () => {
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

Deno.test("Custom Function using a Custom Type input for an unwrapped typedobject with additionalProperties=true should allow for referencing additional properties", () => {
  const myType = DefineType({
    name: "custom",
    type: Schema.types.object,
    properties: {
      required_property: { type: "string" },
      optional_property: { type: "string" },
    },
    required: ["required_property"],
    additionalProperties: true
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

Deno.test("Custom Function using a Custom Type input for an unwrapped typedobject with additionalProperties=false should prevent referencing additional properties", () => {
  const myType = DefineType({
    name: "custom",
    type: Schema.types.object,
    properties: {
      required_property: { type: "string" },
      optional_property: { type: "string" },
    },
    required: ["required_property"],
    additionalProperties: false
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