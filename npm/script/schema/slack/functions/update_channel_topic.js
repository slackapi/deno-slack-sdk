"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/** This file was autogenerated on Wed Jul 06 2022. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
const mod_js_1 = require("../../../functions/mod.js");
const schema_types_js_1 = __importDefault(require("../../schema_types.js"));
const schema_types_js_2 = __importDefault(require("../schema_types.js"));
exports.default = (0, mod_js_1.DefineFunction)({
    callback_id: "slack#/functions/update_channel_topic",
    source_file: "",
    title: "Update channel topic",
    description: "Update a channel topic",
    input_parameters: {
        required: ["channel_id", "topic"],
        properties: {
            channel_id: {
                type: schema_types_js_2.default.channel_id,
                description: "Channel",
            },
            topic: {
                type: schema_types_js_1.default.string,
                description: "New topic",
            },
        },
    },
    output_parameters: {
        required: ["topic"],
        properties: {
            topic: {
                type: schema_types_js_1.default.string,
                description: "The string to which the channel topic was updated",
            },
        },
    },
});
