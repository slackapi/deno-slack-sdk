"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_types_js_1 = __importDefault(require("./schema_types.js"));
const mod_js_1 = __importDefault(require("./slack/mod.js"));
const mod_js_2 = __importDefault(require("./providers/mod.js"));
const Schema = {
    // Contains primitive types
    types: schema_types_js_1.default,
    // Contains slack-specific schema types
    slack: mod_js_1.default,
    providers: mod_js_2.default,
};
exports.default = Schema;
