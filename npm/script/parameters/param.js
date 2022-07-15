"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParamReference = void 0;
// deno-lint-ignore no-explicit-any
const ParamReference = (...path) => {
    const fullPath = path.filter(Boolean).join(".");
    return {
        toString: () => `{{${fullPath}}}`,
        toJSON: () => `{{${fullPath}}}`,
    };
};
exports.ParamReference = ParamReference;
