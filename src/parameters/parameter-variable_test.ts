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

Deno.test("ParameterVariable typed object with all optional properties", () => {
  const param = ParameterVariable("", "incident", {
    type: SchemaTypes.typedobject,
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

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
});

Deno.test("ParameterVariable typed object with all required properties", () => {
  const param = ParameterVariable("", "incident", {
    type: SchemaTypes.typedobject,
    properties: {
      id: {
        type: SchemaTypes.integer,
      },
      name: {
        type: SchemaTypes.string,
      },
    },
    required: ["id", "name"],
  });

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
});

Deno.test("ParameterVariable typed object allows access to additional properties", () => {
  const param = ParameterVariable("", "incident", {
    type: SchemaTypes.typedobject,
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

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable typed object with additional properties", () => {
  const param = ParameterVariable("", "incident", {
    type: SchemaTypes.typedobject,
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

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable typed object with no additional properties", () => {
  const param = ParameterVariable("", "incident", {
    type: SchemaTypes.typedobject,
    properties: {
      id: {
        type: SchemaTypes.integer,
      },
      name: {
        type: SchemaTypes.string,
      },
    },
    required: [],
    additionalProperties: false,
  });
  param;

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");

  //@ts-expect-error foo doesn't exist
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable untyped object", () => {
  const param = ParameterVariable("", "incident", {
    type: SchemaTypes.untypedobject,
  });

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.name.foo.bar}`, "{{incident.name.foo.bar}}");
});

Deno.test("ParameterVariable array of strings", () => {
  const param = ParameterVariable("", "myArray", {
    type: SchemaTypes.typedarray,
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
    type: SchemaTypes.custom,
    custom: customType,
  });

  assertStrictEquals(`${param}`, "{{myCustomTypeString}}");
});

Deno.test("ParameterVariable using Custom Type typed object", () => {
  const customType = DefineType({
    name: "customType",
    type: SchemaTypes.typedobject,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
    },
    required: [],
  });
  const param = ParameterVariable("", "myCustomType", {
    type: SchemaTypes.custom,
    custom: customType,
  });

  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
});

Deno.test("ParameterVariable using Custom Type untyped object", () => {
  const customType = DefineType({
    name: "customTypeObject",
    type: SchemaTypes.untypedobject,
  });
  const param = ParameterVariable("", "myCustomTypeObject", {
    type: SchemaTypes.custom,
    custom: customType,
  });

  assertStrictEquals(`${param}`, "{{myCustomTypeObject}}");
  assertStrictEquals(`${param.foo}`, "{{myCustomTypeObject.foo}}");
  assertStrictEquals(`${param.foo.bar}`, "{{myCustomTypeObject.foo.bar}}");
  assertStrictEquals(
    `${param.foo.bar.baz}`,
    "{{myCustomTypeObject.foo.bar.baz}}",
  );
});

Deno.test("ParameterVariable using Custom Type with untypedarray", () => {
  const customType = DefineType({
    name: "customTypeArray",
    type: SchemaTypes.untypedarray,
  });
  const param = ParameterVariable("", "myCustomTypeArray", {
    type: SchemaTypes.custom,
    custom: customType,
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
    type: SchemaTypes.typedobject,
    properties: {
      customType: {
        type: SchemaTypes.custom,
        custom: StringType,
      },
    },
    required: [],
  });
  const param = ParameterVariable("", "myNestedCustomType", {
    type: SchemaTypes.custom,
    custom: customType,
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
    type: SchemaTypes.typedobject,
    properties: {
      aString: {
        type: SchemaTypes.custom,
        custom: StringType,
      },
    },
    required: [],
  });

  assertStrictEquals(`${param}`, "{{myObjectParam}}");
  assertStrictEquals(`${param.aString}`, "{{myObjectParam.aString}}");
});
