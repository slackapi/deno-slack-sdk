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
const with_untyped_object_proxy_js_1 = require("./with-untyped-object-proxy.js");
const dev_deps_js_1 = require("../dev_deps.js");
dntShim.Deno.test("WithUntypedObjectProxy", () => {
    const ctx = (0, with_untyped_object_proxy_js_1.WithUntypedObjectProxy)({});
    (0, dev_deps_js_1.assertStrictEquals)(`${ctx.foo}`, "{{foo}}");
    (0, dev_deps_js_1.assertStrictEquals)(`${ctx.foo.baz}`, "{{foo.baz}}");
    (0, dev_deps_js_1.assertStrictEquals)(`${ctx.foo.baz.biz.buzz.wut.wut.hi.bye}`, "{{foo.baz.biz.buzz.wut.wut.hi.bye}}");
    (0, dev_deps_js_1.assertStrictEquals)(`Some text ${ctx.variable}`, "Some text {{variable}}");
});
dntShim.Deno.test("WithUntypedObjectProxy with namespace", () => {
    const ctx = (0, with_untyped_object_proxy_js_1.WithUntypedObjectProxy)({}, "metadata");
    (0, dev_deps_js_1.assertStrictEquals)(`${ctx.foo}`, "{{metadata.foo}}");
    (0, dev_deps_js_1.assertStrictEquals)(`${ctx.foo.baz}`, "{{metadata.foo.baz}}");
    (0, dev_deps_js_1.assertStrictEquals)(`${ctx.foo.baz.biz.buzz.wut.wut.hi.bye}`, "{{metadata.foo.baz.biz.buzz.wut.wut.hi.bye}}");
    (0, dev_deps_js_1.assertStrictEquals)(`Some text ${ctx.variable}`, "Some text {{metadata.variable}}");
});
