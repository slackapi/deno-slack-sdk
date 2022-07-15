"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dntShim = __importStar(require("../_dnt.test_shims.js"));
const mod_js_1 = require("./mod.js");
const dev_deps_js_1 = require("../dev_deps.js");
dntShim.Deno.test("DefineType test against id using the name parameter", () => {
    const Type = (0, mod_js_1.DefineType)({
        title: "Title",
        description: "Description",
        name: "Name",
        type: "Type",
    });
    (0, dev_deps_js_1.assertEquals)(Type.id, "Name");
});
dntShim.Deno.test("DefineType test against id using the callback_id parameter", () => {
    const Type = (0, mod_js_1.DefineType)({
        title: "Title",
        description: "Description",
        callback_id: "Callback_id",
        type: "Type",
    });
    (0, dev_deps_js_1.assertEquals)(Type.id, "Callback_id");
});
dntShim.Deno.test("DefineType test toString using the callback_id parameter", () => {
    const Type = (0, mod_js_1.DefineType)({
        title: "Title",
        description: "Description",
        callback_id: "Callback_id",
        type: "Type",
    });
    const typeString = Type.toString();
    (0, dev_deps_js_1.assertEquals)(typeString, "#/types/Callback_id");
});
dntShim.Deno.test("DefineType test toString using the name parameter", () => {
    const Type = (0, mod_js_1.DefineType)({
        title: "Title",
        description: "Description",
        name: "Name",
        type: "Type",
    });
    const typeJson = Type.toJSON();
    (0, dev_deps_js_1.assertEquals)(typeJson, "#/types/Name");
});
dntShim.Deno.test("DefineType test export using the name parameter", () => {
    const Type = (0, mod_js_1.DefineType)({
        title: "Title",
        description: "Description",
        name: "Name",
        type: "Type",
    });
    const exportType = Type.export();
    (0, dev_deps_js_1.assertEquals)(exportType, {
        title: "Title",
        description: "Description",
        type: "Type",
    });
});
dntShim.Deno.test("DefineType test export using the callback_id parameter", () => {
    const Type = (0, mod_js_1.DefineType)({
        title: "Title",
        description: "Description",
        callback_id: "Callback_id",
        type: "Type",
    });
    const exportType = Type.export();
    (0, dev_deps_js_1.assertEquals)(exportType, {
        title: "Title",
        description: "Description",
        type: "Type",
    });
});
