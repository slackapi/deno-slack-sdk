import SchemaTypes from "../schema/schema_types.ts";
import { ParameterVariable } from "./mod.ts";
import { DefineParameter } from "../parameters/define_parameter.ts";
import { DefineType } from "../types/mod.ts";
import {
  assert,
  assertStrictEquals,
  CannotBeUndefined,
  IsAny,
} from "../dev_deps.ts";

Deno.test("ParameterVariable of type string yields a SingleParameterVariable type that coerces into a string containing the provided parameter name", () => {
  const param = ParameterVariable("", "incident_name", {
    type: SchemaTypes.string,
  });
  assertStrictEquals(`${param}`, "{{incident_name}}");
});

Deno.test("ParameterVariable DefineParameter-wrapped typed object with all optional properties should never yield object with potentially undefined properties", () => {
  const obj = DefineParameter({
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
  const param = ParameterVariable("", "incident", obj);

  assert<CannotBeUndefined<typeof param.id>>(true);
  assert<CannotBeUndefined<typeof param.name>>(true);
  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
});

Deno.test("ParameterVariable DefineParameter-wrapped typed object with all required properties should yield object with properties that cannot be undefined", () => {
  const obj = DefineParameter({
    type: SchemaTypes.object,
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

  const param = ParameterVariable("", "incident", obj);
  assert<CannotBeUndefined<typeof param.id>>(true);
  assert<CannotBeUndefined<typeof param.name>>(true);
  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
});

Deno.test("ParameterVariable DefineParameter-wrapped typed object with mix of optional and required properties should yield object with no undefined properties", () => {
  const obj = DefineParameter({
    type: SchemaTypes.object,
    properties: {
      id: {
        type: SchemaTypes.integer,
      },
      name: {
        type: SchemaTypes.string,
      },
    },
    required: ["id"],
  });
  const param = ParameterVariable("", "incident", obj);

  assert<CannotBeUndefined<typeof param.id>>(true);
  assert<CannotBeUndefined<typeof param.name>>(true);
  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
});

Deno.test("ParameterVariable DefineParameter-wrapped typed object with all optional properties and undefined additionalProperties allows access to additional properties", () => {
  const obj = DefineParameter({
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
  const param = ParameterVariable("", "incident", obj);

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable DefineParameter-wrapped typed object with all required properties and undefined additionalProperties allows access to additional properties", () => {
  const obj = DefineParameter({
    type: SchemaTypes.object,
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
  const param = ParameterVariable("", "incident", obj);

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable DefineParameter-wrapped typed object with mix of required and optional properties and undefined additionalProperties allows access to additional properties", () => {
  const obj = DefineParameter({
    type: SchemaTypes.object,
    properties: {
      id: {
        type: SchemaTypes.integer,
      },
      name: {
        type: SchemaTypes.string,
      },
    },
    required: ["id"],
  });
  const param = ParameterVariable("", "incident", obj);

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable DefineParameter-wrapped typed object with all optional properties and additionalProperties=true allows access to additional properties", () => {
  const obj = DefineParameter({
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
  const param = ParameterVariable("", "incident", obj);

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable DefineParameter-wrapped typed object with all required properties and additionalProperties=true allows access to additional properties", () => {
  const obj = DefineParameter({
    type: SchemaTypes.object,
    properties: {
      id: {
        type: SchemaTypes.integer,
      },
      name: {
        type: SchemaTypes.string,
      },
    },
    required: ["id", "name"],
    additionalProperties: true,
  });
  const param = ParameterVariable("", "incident", obj);

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable DefineParameter-wrapped typed object with mix of required and optional properties and additionalProperties=true allows access to additional properties", () => {
  const obj = DefineParameter({
    type: SchemaTypes.object,
    properties: {
      id: {
        type: SchemaTypes.integer,
      },
      name: {
        type: SchemaTypes.string,
      },
    },
    required: ["id"],
    additionalProperties: true,
  });
  const param = ParameterVariable("", "incident", obj);

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable DefineParameter-wrapped typed object with all optional properties and additionalProperties=false prevents access to additional properties", () => {
  const obj = DefineParameter({
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
    additionalProperties: false,
  });
  const param = ParameterVariable("", "incident", obj);

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  //@ts-expect-error foo doesn't exist
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable DefineParameter-wrapped typed object with all required properties and additionalProperties=false prevents access to additional properties", () => {
  const obj = DefineParameter({
    type: SchemaTypes.object,
    properties: {
      id: {
        type: SchemaTypes.integer,
      },
      name: {
        type: SchemaTypes.string,
      },
    },
    required: ["id", "name"],
    additionalProperties: false,
  });
  const param = ParameterVariable("", "incident", obj);

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  //@ts-expect-error foo doesn't exist
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable DefineParameter-wrapped typed object with mix of required and optional properties and additionalProperties=false prevents access to additional properties", () => {
  const obj = DefineParameter({
    type: SchemaTypes.object,
    properties: {
      id: {
        type: SchemaTypes.integer,
      },
      name: {
        type: SchemaTypes.string,
      },
    },
    required: ["id"],
    additionalProperties: false,
  });
  const param = ParameterVariable("", "incident", obj);

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  //@ts-expect-error foo doesn't exist
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable untyped object should yield a parameter of type any", () => {
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

  assertStrictEquals(`${param}`, "{{myArray}}");
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

Deno.test("ParameterVariable using Custom Type with DefineParameter-wrapped typed object with optional property yields object with no undefined property", () => {
  const obj = DefineParameter({
    type: SchemaTypes.object,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
    },
    required: [],
  });
  const customType = DefineType({
    name: "customType",
    ...obj,
  });
  const param = ParameterVariable("", "myCustomType", {
    type: customType,
  });

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
});

Deno.test("ParameterVariable using Custom Type with DefineParameter-wrapped typed object with required property yields object with no undefined property", () => {
  const obj = DefineParameter({
    type: SchemaTypes.object,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
    },
    required: ["aString"],
  });
  const customType = DefineType({
    name: "customType",
    ...obj,
  });
  const param = ParameterVariable("", "myCustomType", {
    type: customType,
  });

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
});

Deno.test("ParameterVariable using Custom Type with DefineParameter-wrapped typed object with optional property and additionalProperties=true yields object that allows access to additional properties", () => {
  const obj = DefineParameter({
    type: SchemaTypes.object,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
    },
    required: [],
    additionalProperties: true,
  });
  const customType = DefineType({
    name: "customType",
    ...obj,
  });
  const paramName = "myCustomType";
  const param = ParameterVariable("", paramName, {
    type: customType,
  });

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, `{{${paramName}}}`);
  assertStrictEquals(`${param.aString}`, `{{${paramName}.aString}}`);
  assertStrictEquals(`${param.foo.bar}`, `{{${paramName}.foo.bar}}`);
});

Deno.test("ParameterVariable using Custom Type with DefineParameter-wrapped typed object with required property and additionalProperties=true yields object that allows access to additional properties", () => {
  const obj = DefineParameter({
    type: SchemaTypes.object,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
    },
    required: ["aString"],
    additionalProperties: true,
  });
  const customType = DefineType({
    name: "customType",
    ...obj,
  });
  const paramName = "myCustomType";
  const param = ParameterVariable("", paramName, {
    type: customType,
  });

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, `{{${paramName}}}`);
  assertStrictEquals(`${param.aString}`, `{{${paramName}.aString}}`);
  assertStrictEquals(`${param.foo.bar}`, `{{${paramName}.foo.bar}}`);
});

Deno.test("ParameterVariable using Custom Type with DefineParameter-wrapped typed object with optional property and additionalProperties=false yields object that prevents access to additional properties", () => {
  const obj = DefineParameter({
    type: SchemaTypes.object,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
    },
    required: [],
    additionalProperties: false,
  });
  const customType = DefineType({
    name: "customType",
    ...obj,
  });
  const paramName = "myCustomType";
  const param = ParameterVariable("", paramName, {
    type: customType,
  });

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, `{{${paramName}}}`);
  assertStrictEquals(`${param.aString}`, `{{${paramName}.aString}}`);
  //@ts-expect-error foo doesn't exist
  assertStrictEquals(`${param.foo.bar}`, `{{${paramName}.foo.bar}}`);
});

Deno.test("ParameterVariable using Custom Type with DefineParameter-wrapped typed object with required property and additionalProperties=false yields object that prevents access to additional properties", () => {
  const obj = DefineParameter({
    type: SchemaTypes.object,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
    },
    required: ["aString"],
    additionalProperties: false,
  });
  const customType = DefineType({
    name: "customType",
    ...obj,
  });
  const paramName = "myCustomType";
  const param = ParameterVariable("", paramName, {
    type: customType,
  });

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, `{{${paramName}}}`);
  assertStrictEquals(`${param.aString}`, `{{${paramName}.aString}}`);
  //@ts-expect-error foo doesn't exist
  assertStrictEquals(`${param.foo.bar}`, `{{${paramName}.foo.bar}}`);
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

Deno.test("ParameterVariable using Custom Type with untypedarray", () => {
  const customType = DefineType({
    name: "customTypeArray",
    type: SchemaTypes.array,
  });
  const param = ParameterVariable("", "myCustomTypeArray", {
    type: customType,
  });

  assertStrictEquals(`${param}`, "{{myCustomTypeArray}}");
});
