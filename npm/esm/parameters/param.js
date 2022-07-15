// deno-lint-ignore no-explicit-any
export const ParamReference = (...path) => {
    const fullPath = path.filter(Boolean).join(".");
    return {
        toString: () => `{{${fullPath}}}`,
        toJSON: () => `{{${fullPath}}}`,
    };
};
