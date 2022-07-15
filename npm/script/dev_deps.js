"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assert = exports.assertStrictEquals = exports.assertExists = exports.assertEquals = void 0;
var asserts_js_1 = require("./deps/deno.land/std@0.134.0/testing/asserts.js");
Object.defineProperty(exports, "assertEquals", { enumerable: true, get: function () { return asserts_js_1.assertEquals; } });
Object.defineProperty(exports, "assertExists", { enumerable: true, get: function () { return asserts_js_1.assertExists; } });
Object.defineProperty(exports, "assertStrictEquals", { enumerable: true, get: function () { return asserts_js_1.assertStrictEquals; } });
var mod_js_1 = require("./deps/deno.land/x/conditional_type_checks@1.0.6/mod.js");
Object.defineProperty(exports, "assert", { enumerable: true, get: function () { return mod_js_1.assert; } });
