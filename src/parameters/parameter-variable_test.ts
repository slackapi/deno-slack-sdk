import SchemaTypes from "../schema/schema_types.ts";
import { ParameterVariable } from "./mod.ts";
import { DefineType } from "../types/mod.ts";
import { assert, assertStrictEquals } from "../dev_deps.ts";
import type { IsAny } from "../dev_deps.ts";

Deno.test("ParameterVariable string", () => {
  const param = ParameterVariable("", "incident_name", {
    type: SchemaTypes.string,
  });

  assert<IsAny<typeof param>>(false);
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
    required: [],
  });

  assert<IsAny<typeof param>>(false);
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

  assert<IsAny<typeof param>>(false);
  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  // Below should be allowed due to undefined additionalProperties
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
    required: [],
    additionalProperties: true,
  });

  assert<IsAny<typeof param>>(false);
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

  assert<IsAny<typeof param>>(false);
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

  assert<IsAny<typeof param>>(true);
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
  assert<IsAny<typeof param>>(false);
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

  assert<IsAny<typeof param>>(false);
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

  assert<IsAny<typeof param>>(false);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
  // additionalProperties on the custom type definition is undefined, so accessing random
  // additional properties should be allowed
  assertStrictEquals(`${param.anything}`, "{{myCustomType.anything}}");
});

Deno.test("ParameterVariable using Custom Type typed object with additionalProperties=true should allow accessing additional props", () => {
  const customType = DefineType({
    name: "customType",
    type: SchemaTypes.object,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
    },
    additionalProperties: true,
  });
  const param = ParameterVariable("", "myCustomType", {
    type: customType,
  });

  assert<IsAny<typeof param>>(false);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
  // additionalProperties on the custom type definition is true, so accessing random
  // additional properties should be allowed
  assertStrictEquals(`${param.anything}`, "{{myCustomType.anything}}");
});

Deno.test("ParameterVariable using Custom Type typed object with additionalProperties=false should deny accessing additional props", () => {
  const customType = DefineType({
    name: "customType",
    type: SchemaTypes.object,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
    },
    additionalProperties: false,
  });
  const param = ParameterVariable("", "myCustomType", {
    type: customType,
  });

  assert<IsAny<typeof param>>(false);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
  //@ts-expect-error anything doesn't exist
  assertStrictEquals(`${param.anything}`, "{{myCustomType.anything}}");
});

Deno.test("ParameterVariable using Custom Type untyped object", () => {
  const customType = DefineType({
    name: "customTypeObject",
    type: SchemaTypes.object,
  });
  const param = ParameterVariable("", "myCustomTypeObject", {
    type: customType,
  });

  assert<IsAny<typeof param>>(true);
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
