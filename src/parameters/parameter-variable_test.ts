import SchemaTypes from "../schema/schema_types.ts";
import { ParameterVariable } from "./mod.ts";
import { DefineType } from "../types/mod.ts";
import { assertStrictEquals } from "../dev_deps.ts";

Deno.test("ParameterVariable string", () => {
  const param = ParameterVariable("", "incident_name", {
    type: SchemaTypes.string,
  });

  assertStrictEquals(`${param}`, "{{incident_name}}");
});

Deno.test("ParameterVariable typed object", () => {
  const param = ParameterVariable("", "incident", {
    type: SchemaTypes.object,
    properties: {
      id: {
        type: SchemaTypes.integer,
      },
      name: {
        type: SchemaTypes.string,
      },
    },
  });

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
});

Deno.test("ParameterVariable typed object allows access to additional properties", () => {
  const param = ParameterVariable("", "incident", {
    type: SchemaTypes.object,
    properties: {
      id: {
        type: SchemaTypes.integer,
      },
      name: {
        type: SchemaTypes.string,
      },
    },
  });

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable typed object with additional properties", () => {
  const param = ParameterVariable("", "incident", {
    type: SchemaTypes.object,
    properties: {
      id: {
        type: SchemaTypes.integer,
      },
      name: {
        type: SchemaTypes.string,
      },
    },
    additionalProperties: true,
  });

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable typed object with no additional properties", () => {
  const param = ParameterVariable("", "incident", {
    type: SchemaTypes.object,
    properties: {
      id: {
        type: SchemaTypes.integer,
      },
      name: {
        type: SchemaTypes.string,
      },
    },
    additionalProperties: false,
  });

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");

  //@ts-expect-error foo doesn't exist
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable untyped object", () => {
  const param = ParameterVariable("", "incident", {
    type: SchemaTypes.object,
  });

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.name.foo.bar}`, "{{incident.name.foo.bar}}");
});

Deno.test("ParameterVariable array of strings", () => {
  const param = ParameterVariable("", "myArray", {
    type: SchemaTypes.array,
    items: {
      type: SchemaTypes.string,
    },
  });

  assertStrictEquals(`${param}`, "{{myArray}}");
});

Deno.test("ParameterVariable using CustomType string", () => {
  const customType = DefineType({
    name: "customTypeString",
    type: SchemaTypes.string,
  });
  const param = ParameterVariable("", "myCustomTypeString", {
    type: customType,
  });

  assertStrictEquals(`${param}`, "{{myCustomTypeString}}");
});

Deno.test("ParameterVariable using Custom Type typed object", () => {
  const customType = DefineType({
    name: "customType",
    type: SchemaTypes.object,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
    },
  });
  const param = ParameterVariable("", "myCustomType", {
    type: customType,
  });

  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
});

Deno.test("ParameterVariable using Custom Type untyped object", () => {
  const customType = DefineType({
    name: "customTypeObject",
    type: SchemaTypes.object,
  });
  const param = ParameterVariable("", "myCustomTypeObject", {
    type: customType,
  });

  assertStrictEquals(`${param}`, "{{myCustomTypeObject}}");
  assertStrictEquals(`${param.foo}`, "{{myCustomTypeObject.foo}}");
  assertStrictEquals(`${param.foo.bar}`, "{{myCustomTypeObject.foo.bar}}");
  assertStrictEquals(
    `${param.foo.bar.baz}`,
    "{{myCustomTypeObject.foo.bar.baz}}",
  );
});

Deno.test("ParameterVariable using Custom Type array", () => {
  const customType = DefineType({
    name: "customTypeArray",
    type: SchemaTypes.array,
  });
  const param = ParameterVariable("", "myCustomTypeArray", {
    type: customType,
  });

  assertStrictEquals(`${param}`, "{{myCustomTypeArray}}");
});

Deno.test("ParameterVariable using Custom Type object referencing another Custom Type", () => {
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

Deno.test("ParameterVariable typed object with Custom Type property", () => {
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
  });

  assertStrictEquals(`${param}`, "{{myObjectParam}}");
  assertStrictEquals(`${param.aString}`, "{{myObjectParam.aString}}");
});
