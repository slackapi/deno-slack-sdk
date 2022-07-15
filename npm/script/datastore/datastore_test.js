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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dntShim = __importStar(require("../_dnt.test_shims.js"));
const dev_deps_js_1 = require("../dev_deps.js");
const mod_js_1 = require("./mod.js");
const schema_types_js_1 = __importDefault(require("../schema/schema_types.js"));
const mod_js_2 = require("../types/mod.js");
const customType = (0, mod_js_2.DefineType)({
    name: "custom_type",
    type: schema_types_js_1.default.boolean,
});
dntShim.Deno.test("Datastore sets appropriate defaults", () => {
    const datastore = (0, mod_js_1.DefineDatastore)({
        name: "dinos",
        primary_key: "attr1",
        attributes: {
            attr1: {
                type: schema_types_js_1.default.string,
            },
            attr2: {
                type: schema_types_js_1.default.boolean,
            },
            attr3: {
                type: customType,
            },
            attr4: {
                type: schema_types_js_1.default.object,
                properties: {
                    anObjectString: { type: schema_types_js_1.default.string },
                },
            },
        },
    });
    const exported = datastore.export();
    (0, dev_deps_js_1.assertStrictEquals)(exported.primary_key, "attr1");
    (0, dev_deps_js_1.assertStrictEquals)(exported.attributes.attr1.type, schema_types_js_1.default.string);
    (0, dev_deps_js_1.assertStrictEquals)(exported.attributes.attr2.type, schema_types_js_1.default.boolean);
    (0, dev_deps_js_1.assertStrictEquals)(exported.attributes.attr3.type, customType);
    (0, dev_deps_js_1.assertStrictEquals)(exported.attributes.attr4.type, schema_types_js_1.default.object);
    (0, dev_deps_js_1.assertStrictEquals)(exported.attributes.attr4.properties?.anObjectString?.type, schema_types_js_1.default.string);
});
