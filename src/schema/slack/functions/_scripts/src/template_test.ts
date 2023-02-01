import { pascalCase } from "https://deno.land/x/case@v2.1.0/mod.ts";
export { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { ICustomType } from "../../../../../types/types.ts";
import SchemaTypes from "../../../../schema_types.ts";
import { getManifestFunctionSchemaFields } from "./template.ts";
import {
  ManifestFunctionParameters,
  ManifestFunctionSchema,
} from "../../../../../manifest/manifest_schema.ts";
import { FunctionParameter, FunctionRecord } from "./types.ts";
import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";

type AllowedTypeValue = ICustomType | string;
type AllowedTypeValueObject = Record<string, AllowedTypeValue>;

const DESCRIPTION = "Test the built-in function template";
const TITLE = "test_function";
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
    callback_id: "test_function",
    title: TITLE,
    description: DESCRIPTION,
    type: "builtin",
    input_parameters: [],
    output_parameters: [],
  };
  const expected = getManifestFunctionSchemaFields(functionRecord);

  assertEquals(actual, expected);
});

Deno.test("getManifestFunctionSchemaFields should return proper parameter in object", () => {
  const actual: ManifestFunctionSchema = {
    description: DESCRIPTION,
    input_parameters: {
      properties: {
        channel_id: {
          description: "Search all channels",
          type: "SlackTypes.channel_id",
        },
      },
      required: [
        "channel_id",
      ],
    },
    output_parameters: {
      properties: {
        message_ts: {
          description: "Message time stamp",
          type: "SchemaTypes.string",
        },
      },
      required: [],
    },
    source_file: SOURCE_FILE,
    title: TITLE,
  };
  const functionRecord: FunctionRecord = {
    callback_id: "test_function",
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
    ],
    "output_parameters": [
      {
        "type": "string",
        "name": "message_ts",
        "title": "Message time stamp",
        "description": "Message time stamp",
      },
    ],
  };
  const expected = getManifestFunctionSchemaFields(functionRecord);
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
              description: undefined,
              type: "SchemaTypes.object",
            },
            event_type: {
              description: undefined,
              type: "SchemaTypes.string",
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
  const functionRecord: FunctionRecord = {
    callback_id: "test_function",
    title: "test_function",
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
  };
  const expected = getManifestFunctionSchemaFields(functionRecord);
  assertEquals(actual, expected);
});

// Deno.test("getManifestFunctionSchemaFields() returns stringified ManifestSchema for basic FunctionRecord", () => {
//   const actual = "";
//   const functionRecord: FunctionRecord = {
//     callback_id: "test_function",
//     title: "test_function",
//     description: "Test the built-in function template",
//     type: "builtin",
//     input_parameters: [],
//     output_parameters: [],
//   };
//   const expected = getManifestFunctionSchemaFields(functionRecord);
//   assertEquals(actual, expected);
// });
