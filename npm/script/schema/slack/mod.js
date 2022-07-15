"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_types_js_1 = __importDefault(require("./schema_types.js"));
const mod_js_1 = __importDefault(require("./functions/mod.js"));
const SlackSchema = {
    types: schema_types_js_1.default,
    functions: mod_js_1.default,
};
exports.default = SlackSchema;
