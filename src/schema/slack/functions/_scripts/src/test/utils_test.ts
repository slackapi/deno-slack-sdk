export { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import SchemaTypes from "../../../../../schema_types.ts";
import SlackSchemaTypes from "../../../../schema_types.ts";
import { InternalSlackTypes } from "../../../../types/custom/mod.ts";
import { getDefineFunctionInput, getManifestFunctionSchema } from "../utils.ts";
import {
  ManifestFunctionSchema,
} from "../../../../../../manifest/manifest_schema.ts";
import { DefineFunctionInput, FunctionRecord } from "../types.ts";
import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";

const DESCRIPTION = "Test the built-in function template";
const TITLE = "test function";
const CALLBACK_ID = "test_function";
const SOURCE_FILE = "";

Deno.test("getManifestFunctionSchemaFields should return proper object", () => {
  const actual: ManifestFunctionSchema = {
    description: DESCRIPTION,
    input_parameters: {
      properties: {},
      required: [],
    },
    output_parameters: {
      properties: {},
      required: [],
    },
    source_file: SOURCE_FILE,
    title: TITLE,
  };
  const functionRecord: FunctionRecord = {
    callback_id: CALLBACK_ID,
    title: TITLE,
    description: DESCRIPTION,
    type: "builtin",
    input_parameters: [],
    output_parameters: [],
  };
  const expected = getManifestFunctionSchema(functionRecord);

  assertEquals(actual, expected);
});

Deno.test("getDefineFunctionInput should return proper callback_id", () => {
  const actual: DefineFunctionInput = {
    callbackId: CALLBACK_ID,
    description: DESCRIPTION,
    input_parameters: {
      properties: {},
      required: [],
    },
    output_parameters: {
      properties: {},
      required: [],
    },
    source_file: SOURCE_FILE,
    title: TITLE,
  };
  const functionRecord: FunctionRecord = {
    callback_id: CALLBACK_ID,
    title: TITLE,
    description: DESCRIPTION,
    type: "builtin",
    input_parameters: [],
    output_parameters: [],
  };
  const expected = getDefineFunctionInput(functionRecord);

  assertEquals(actual, expected);
});

Deno.test("getManifestFunctionSchemaFields should return proper parameter in object", () => {
  const actual: ManifestFunctionSchema = {
    description: DESCRIPTION,
    input_parameters: {
      properties: {
        channel_id: {
          description: "Search all channels",
          type: SlackSchemaTypes.channel_id,
        },
        fields: {
          type: InternalSlackTypes.form_input_object.id,
          description: "Input fields to be shown on the form",
        },
      },
      required: [
        "channel_id",
        "fields",
      ],
    },
    output_parameters: {
      properties: {
        message_ts: {
          description: "Message time stamp",
          type: SchemaTypes.string,
        },
        user_ids: {
          description: "User Ids",
          type: SchemaTypes.array,
          items: {
            type: SchemaTypes.integer,
          },
        },
      },
      required: [],
    },
    source_file: SOURCE_FILE,
    title: TITLE,
  };

  const expected = getManifestFunctionSchema({
    callback_id: CALLBACK_ID,
    title: TITLE,
    description: DESCRIPTION,
    type: "builtin",
    input_parameters: [
      {
        "type": "slack#/types/channel_id",
        "name": "channel_id",
        "title": "Select a channel",
        "is_required": true,
        "description": "Search all channels",
      },
      {
        "type": "slack#/types/form_input_object",
        "name": "fields",
        "title": "fields",
        "is_required": true,
        "description": "Input fields to be shown on the form",
      },
    ],
    "output_parameters": [
      {
        "type": "string",
        "name": "message_ts",
        "title": "Message time stamp",
        "description": "Message time stamp",
      },
      {
        "type": "array",
        "name": "user_ids",
        "title": "User Ids",
        "description": "User Ids",
        "items": {
          "type": "integer",
        },
      },
    ],
  });
  assertEquals(actual, expected);
});

Deno.test("getManifestFunctionSchemaFields should return complex objects", () => {
  const actual: ManifestFunctionSchema = {
    description: DESCRIPTION,
    input_parameters: {
      properties: {
        metadata: {
          additionalProperties: true,
          description:
            "Metadata you post to Slack is accessible to any app or user who is a member of that workspace",
          properties: {
            event_payload: {
              type: SchemaTypes.object,
            },
            event_type: {
              type: SchemaTypes.string,
            },
          },
          required: [
            "event_type",
            "event_payload",
          ],
          type: SchemaTypes.object,
        },
      },
      required: [],
    },
    output_parameters: {
      properties: {},
      required: [],
    },
    source_file: SOURCE_FILE,
    title: TITLE,
  };
  const expected = getManifestFunctionSchema({
    callback_id: CALLBACK_ID,
    title: TITLE,
    description: "Test the built-in function template",
    type: "builtin",
    input_parameters: [
      {
        "type": "object",
        "name": "metadata",
        "title": "Message metadata",
        "description":
          "Metadata you post to Slack is accessible to any app or user who is a member of that workspace",
        "required": ["event_type", "event_payload"],
        "additionalProperties": true,
        "properties": {
          "event_type": {
            "type": "string",
          },
          "event_payload": {
            "type": "object",
          },
        },
      },
    ],
    "output_parameters": [],
  });
  assertEquals(actual, expected);
});
