import { DefineType } from "../../../src/types/mod.ts";
import SchemaTypes from "../../../src/schema/schema_types.ts";
import { ParameterVariable } from "../../../src/parameters/mod.ts";
import { assert, assertStrictEquals, IsAny } from "../../../src/dev_deps.ts";
import { CannotBeUndefined } from "../../../src/test_utils.ts";

Deno.test("ParameterVariable with unwrapped typed object with an optional Custom Type property should yield an object with a definite value for its sub-properties", () => {
  const StringType = DefineType({
    name: "stringType",
    type: SchemaTypes.string,
    minLength: 2,
  });

  const param = ParameterVariable("", "myObjectParam", {
    type: SchemaTypes.object,
    properties: {
      aString: {
        type: StringType,
      },
    },
    required: [],
  });

  assertStrictEquals(`${param}`, "{{myObjectParam}}");
  assertStrictEquals(`${param.aString}`, "{{myObjectParam.aString}}");
});

Deno.test("ParameterVariable using Custom Type with unwrapped object referencing another Custom Type as property should yield an object with a definite value for its sub-properties", () => {
  const StringType = DefineType({
    name: "stringType",
    type: SchemaTypes.string,
    minLength: 2,
  });
  const customType = DefineType({
    name: "customTypeWithCustomType",
    type: SchemaTypes.object,
    properties: {
      customType: {
        type: StringType,
      },
    },
    required: [],
  });
  const param = ParameterVariable("", "myNestedCustomType", {
    type: customType,
  });

  assertStrictEquals(`${param}`, "{{myNestedCustomType}}");
  assertStrictEquals(
    `${param.customType}`,
    "{{myNestedCustomType.customType}}",
  );
});

Deno.test("ParameterVariable using Custom Type with unwrapped typed object with optional property yields object with no undefined property", () => {
  const customType = DefineType({
    name: "customType",
    type: SchemaTypes.object,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
    },
    required: [],
  });
  const param = ParameterVariable("", "myCustomType", {
    type: customType,
  });

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
});

Deno.test("ParameterVariable using Custom Type with unwrapped typed object with optional property and additionalProperties=true yields object that allows access to additional properties", () => {
  const customType = DefineType({
    name: "customType",
    type: SchemaTypes.object,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
    },
    required: [],
    additionalProperties: true,
  });
  const param = ParameterVariable("", "myCustomType", {
    type: customType,
  });

  assert<IsAny<typeof param.additionalProp>>(true);
  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
  assertStrictEquals(`${param.foo.bar}`, "{{myCustomType.foo.bar}}");
});

Deno.test("ParameterVariable using Custom Type with unwrapped typed object with optional property and additionalProperties=false yields object that prevents access to additional properties", () => {
  const customType = DefineType({
    name: "customType",
    type: SchemaTypes.object,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
    },
    required: [],
    additionalProperties: false,
  });
  const param = ParameterVariable("", "myCustomType", {
    type: customType,
  });

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
  //@ts-expect-error foo doesn't exist
  assertStrictEquals(`${param.foo.bar}`, "{{myCustomType.foo.bar}}");
});

/**
 * TODO: below tests fail because unwrapped typed object yields a SingleParameterVariable, which is incorrect. Only happens when required properties are set.

Deno.test("ParameterVariable using Custom Type with unwrapped typed object with required property yields object with no undefined property", () => {
  const customType = DefineType({
    name: "customType",
    type: SchemaTypes.object,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
    },
    required: ["aString"],
  });
  const param = ParameterVariable("", "myCustomType", {
    type: customType,
  });

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
});

Deno.test("ParameterVariable using Custom Type with unwrapped typed object with required property and additionalProperties=true yields object that allows access to additional properties", () => {
  const customType = DefineType({
    name: "customType",
    type: SchemaTypes.object,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
    },
    required: ["aString"],
    additionalProperties: true,
  });
  const param = ParameterVariable("", "myCustomType", {
    type: customType,
  });

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable using Custom Type with unwrapped typed object with required property and additionalProperties=false yields object that prevents access to additional properties", () => {
  const customType = DefineType({
    name: "customType",
    type: SchemaTypes.object,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
    },
    required: ["aString"],
    additionalProperties: false,
  });
  const param = ParameterVariable("", "myCustomType", {
    type: customType,
  });

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
  // TODO: current failure mode of this test actually causes this next line to incorrectly pass
  //@ts-expect-error foo doesn't exist
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});
*/
