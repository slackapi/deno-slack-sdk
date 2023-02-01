import { DefineParameter } from "../../../src/parameters/define_parameter.ts";
import { ParameterVariable, SingleParameterVariable } from "../../../src/parameters/mod.ts";
import { DefineType } from "../../../src/types/mod.ts";
import SchemaTypes from "../../../src/schema/schema_types.ts";
import {
  assert,
  assertStrictEquals,
  IsAny,
  IsExact,
} from "../../../src/dev_deps.ts";
import { CannotBeUndefined, } from "../../../src/test_utils.ts";
/**
 * Typed Object required/optional property definitions should never yield undefined ParameterVariable properties
 */
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

Deno.test("ParameterVariable DefineParameter-wrapped typed object with all required properties should never yield object with potentially undefined properties", () => {
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

Deno.test("ParameterVariable DefineParameter-wrapped typed object with mix of optional and required properties should never yield object with potentially undefined properties", () => {
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

Deno.test("ParameterVariable using Custom Type with DefineParameter-wrapped typed object with optional property should never yield object with potentially undefined property", () => {
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

Deno.test("ParameterVariable using Custom Type with DefineParameter-wrapped typed object with required property should never yield object with potentially undefined property", () => {
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


/**
 * Typed Object additionalProperties controls whether ParameterVariable allows access to additional properties
 */
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

/**
 * ParameterVariable wrapped parameters result in specific types returned
 */
Deno.test("ParameterVariable using Custom Type string should yield SingleParameterVariable type", () => {
  const customType = DefineType({
    name: "customTypeString",
    type: SchemaTypes.string,
  });
  const param = ParameterVariable("", "myCustomTypeString", {
    type: customType,
  });

  assert<IsExact<typeof param, SingleParameterVariable>>(true);
  assertStrictEquals(`${param}`, "{{myCustomTypeString}}");
});

Deno.test("ParameterVariable using Custom Type with untypedarray should yield SingleParameterVariable type", () => {
  const customType = DefineType({
    name: "customTypeArray",
    type: SchemaTypes.array,
  });
  const param = ParameterVariable("", "myCustomTypeArray", {
    type: customType,
  });

  assert<IsExact<typeof param, SingleParameterVariable>>(true);
  assertStrictEquals(`${param}`, "{{myCustomTypeArray}}");
});

Deno.test("ParameterVariable using Custom Type untyped object should yield any type", () => {
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
