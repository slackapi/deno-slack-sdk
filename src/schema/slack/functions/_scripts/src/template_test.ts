import { pascalCase } from "https://deno.land/x/case@v2.1.0/mod.ts";
export { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { ICustomType } from "../../../../../types/types.ts";
import SchemaTypes from "../../../../schema_types.ts";
import { getManifestFunctionSchemaFields } from "./template.ts";
import SlackSchemaTypes from "../../../schema_types.ts";
import { InternalSlackTypes } from "../../../types/custom/mod.ts";
import { FunctionParameter, FunctionRecord } from "./types.ts";
import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";

type AllowedTypeValue = ICustomType | string;
type AllowedTypeValueObject = Record<string, AllowedTypeValue>;

// Deno.test("getManifestFunctionSchemaFields should return proper stringified ManifestSchema for the FunctionRecord", () => {
//   const actual = "";
//   const functionRecord: FunctionRecord = {
//     callback_id: "test_function",
//     title: "test_function",
//     description: "Test the built-in function template",
//     type: "builtin",
//     input_parameters: [
//       {
//         "type": "slack#/types/channel_id",
//         "name": "channel_id",
//         "title": "Select a channel",
//         "is_required": true,
//         "description": "Search all channels",
//       },
//       {
//         "type": "slack#/types/rich_text",
//         "name": "message",
//         "title": "Add a message",
//         "is_required": true,
//         "description": "Add a message",
//       },
//       {
//         "type": "string",
//         "name": "thread_ts",
//         "title": "Another message's timestamp value",
//         "description":
//           "Provide another message's ts value to make this message a reply",
//       },
//       {
//         "type": "object",
//         "name": "metadata",
//         "title": "Message metadata",
//         "description":
//           "Metadata you post to Slack is accessible to any app or user who is a member of that workspace",
//         "required": ["event_type", "event_payload"],
//         "additionalProperties": true,
//         "properties": {
//           "event_type": {
//             "type": "string",
//           },
//           "event_payload": {
//             "type": "object",
//           },
//         },
//       },
//       {
//         "type": "slack#/types/blocks",
//         "name": "interactive_blocks",
//         "title": "Button(s) to send with the message",
//         "description": "Button(s) to send with the message",
//       },
//     ],
//     "output_parameters": [
//       {
//         "type": "string",
//         "name": "message_ts",
//         "title": "Message time stamp",
//         "is_required": true,
//         "description": "Message time stamp",
//       },
//       {
//         "type": "string",
//         "name": "message_link",
//         "title": "Message link",
//         "is_required": true,
//         "description": "Message link",
//       },
//       {
//         "type": "object",
//         "name": "action",
//         "title": "Button interactivity data",
//         "description": "Button interactivity data",
//       },
//       {
//         "type": "slack#/types/interactivity",
//         "name": "interactivity",
//         "title": "interactivity",
//         "description": "Interactivity context",
//       },
//     ],
//   };
//   const expected = getManifestFunctionSchemaFields(functionRecord);
//   assertEquals(actual, expected);
// });

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
