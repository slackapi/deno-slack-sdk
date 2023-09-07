import {
  autogeneratedComment,
  getFunctionName,
  getSlackCallbackId,
  renderFunctionImport,
  renderTypeImports,
  sanitize,
} from "../template_utils.ts";
import {
  assertEquals,
  assertStringIncludes,
} from "../../../../../../../dev_deps.ts";
import { FunctionRecord } from "../../types.ts";
import SchemaTypes from "../../../../../../schema_types.ts";
import SlackTypes from "../../../../../schema_types.ts";
import { InternalSlackTypes } from "../../../../../types/custom/mod.ts";

const DESCRIPTION = "Test the Slack function template";
const TITLE = "test function";
const CALLBACK_ID = "test_function";
const SLACK_FUNCTION_TYPE = "builtin";

Deno.test("Autogenerated comment should contain readme location", () => {
  const actual = autogeneratedComment();
  assertStringIncludes(actual, "src/schema/slack/functions/_scripts/README.md");
});

Deno.test("Autogenerated comment shouldn't mention the date by default", () => {
  const actual = autogeneratedComment();
  assertStringIncludes(actual, "autogenerated.");
});

Deno.test("Autogenerated comment can include the date", () => {
  const actual = autogeneratedComment(true);
  assertStringIncludes(actual, "autogenerated on ");
});

Deno.test("Function name should be pascal case", () => {
  const actual = getFunctionName(CALLBACK_ID);
  assertEquals(actual, "TestFunction");
});

Deno.test("Function import should contain file path", () => {
  const actual = renderFunctionImport(CALLBACK_ID);
  assertStringIncludes(actual, `./${CALLBACK_ID}.ts`);
});

Deno.test("getSlackCallbackId should generate the valid slack callback_id", () => {
  const actual = `slack#/functions/${CALLBACK_ID}`;
  const expected = getSlackCallbackId({
    callback_id: CALLBACK_ID,
    title: TITLE,
    description: DESCRIPTION,
    type: SLACK_FUNCTION_TYPE,
    input_parameters: [],
    output_parameters: [],
  });
  assertStringIncludes(actual, expected);
});

Deno.test("renderTypeImports should render all imports provided with slack and primitive types", () => {
  const dfi: FunctionRecord = {
    callback_id: CALLBACK_ID,
    title: TITLE,
    description: DESCRIPTION,
    type: SLACK_FUNCTION_TYPE,
    input_parameters: [
      {
        type: SlackTypes.channel_id,
        name: "channel_id",
        title: "Select a channel",
        is_required: true,
        description: "Search all channels",
      },
      {
        type: InternalSlackTypes.form_input_object.id,
        name: "fields",
        title: "fields",
        is_required: true,
        description: "Input fields to be shown on the form",
      },
    ],
    output_parameters: [
      {
        type: SchemaTypes.string,
        name: "message_ts",
        title: "Message time stamp",
        description: "Message time stamp",
      },
    ],
  };
  const actual = renderTypeImports(dfi);
  assertStringIncludes(actual, "SchemaTypes");
  assertStringIncludes(actual, "SlackTypes");
  assertStringIncludes(actual, "InternalSlackTypes");
});

Deno.test("renderTypeImports should render imports required for array type", () => {
  const dfi: FunctionRecord = {
    callback_id: CALLBACK_ID,
    title: TITLE,
    description: DESCRIPTION,
    type: SLACK_FUNCTION_TYPE,
    input_parameters: [],
    output_parameters: [
      {
        type: SchemaTypes.array,
        name: "user_ids",
        title: "User Ids",
        description: "User Ids",
        items: {
          type: SlackTypes.channel_id,
        },
      },
    ],
  };
  const actual = renderTypeImports(dfi);
  assertStringIncludes(actual, "SchemaTypes");
  assertStringIncludes(actual, "SlackTypes");
});

Deno.test("renderTypeImports should render imports required for object type", () => {
  const dfi: FunctionRecord = {
    callback_id: CALLBACK_ID,
    title: TITLE,
    description: DESCRIPTION,
    type: SLACK_FUNCTION_TYPE,
    input_parameters: [],
    output_parameters: [
      {
        type: SchemaTypes.object,
        name: "user_ids",
        title: "User Ids",
        description: "User Ids",
        properties: {
          my_param: {
            type: SlackTypes.channel_id,
          },
        },
      },
    ],
  };
  const actual = renderTypeImports(dfi);
  assertStringIncludes(actual, "SchemaTypes");
  assertStringIncludes(actual, "SlackTypes");
});

Deno.test("renderTypeImports should render imports required for a nested complex object type", () => {
  const dfi: FunctionRecord = {
    callback_id: CALLBACK_ID,
    title: TITLE,
    description: DESCRIPTION,
    type: SLACK_FUNCTION_TYPE,
    input_parameters: [],
    output_parameters: [
      {
        type: SchemaTypes.array,
        items: {
          type: SchemaTypes.object,
          properties: {
            my_slack_type: {
              type: InternalSlackTypes.form_input_object.id,
            },
            my_primitive_type: {
              type: SlackTypes.channel_id,
            },
          },
        },
        name: "user_ids",
      },
    ],
  };
  const actual = renderTypeImports(dfi);
  assertStringIncludes(actual, "InternalSlackTypes");
  assertStringIncludes(actual, "SchemaTypes");
  assertStringIncludes(actual, "SlackTypes");
});

Deno.test("renderTypeImports should render imports required for primitive & complex types", () => {
  const dfi: FunctionRecord = {
    callback_id: CALLBACK_ID,
    title: TITLE,
    description: DESCRIPTION,
    type: SLACK_FUNCTION_TYPE,
    input_parameters: [],
    output_parameters: [
      {
        type: SchemaTypes.array,
        items: {
          type: SchemaTypes.string,
        },
        name: "user_ids",
      },
      {
        type: SchemaTypes.object,
        name: "my_object",
        properties: {
          my_param: {
            type: SchemaTypes.string,
          },
        },
      },
      {
        type: SchemaTypes.string,
        name: "my_primitive",
      },
    ],
  };
  const actual = renderTypeImports(dfi);
  assertStringIncludes(actual, "SchemaTypes");
});

Deno.test(`${sanitize.name} should properly escape \" characters`, () => {
  const testText = 'Send an "only visible to you" message';
  const actual = sanitize(testText);
  assertEquals(actual, '"Send an \\"only visible to you\\" message"');
});
