import SchemaTypes from "../schema/schema_types.ts";
import { ParameterVariable } from "./mod.ts";
import { DefineObject } from "../types/objects.ts";
import { DefineType } from "../types/mod.ts";
import {
  assert,
  assertStrictEquals,
  CanBeUndefined,
  CannotBeUndefined,
  IsAny,
} from "../dev_deps.ts";

Deno.test("ParameterVariable of type string yields a SingleParameterVariable type that coerces into a string containing the provided parameter name", () => {
  const param = ParameterVariable("", "incident_name", {
    type: SchemaTypes.string,
  });
  assertStrictEquals(`${param}`, "{{incident_name}}");
});

Deno.test("ParameterVariable DefineObject-wrapped typed object with all optional properties should never yield object with potentially undefined properties", () => {
  const obj = DefineObject({
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
  const param = ParameterVariable("", "incident", obj);

  assert<CannotBeUndefined<typeof param.id>>(true);
  assert<CannotBeUndefined<typeof param.name>>(true);
  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
});

Deno.test("ParameterVariable unwrapped typed object with all optional properties should never yield object with potentially undefined properties", () => {
  const obj = {
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
  };
  const param = ParameterVariable("", "incident", obj);

  assert<CannotBeUndefined<typeof param.id>>(true);
  assert<CannotBeUndefined<typeof param.name>>(true);
  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
});

Deno.test("ParameterVariable DefineObject-wrapped typed object with all required properties should yield object with properties that cannot be undefined", () => {
  const obj = DefineObject({
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

  const param = ParameterVariable("", "incident", obj);
  assert<CannotBeUndefined<typeof param.id>>(true);
  assert<CannotBeUndefined<typeof param.name>>(true);
  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
});

// TODO: below test fails, unwrapped typed object yields a SingleParameterVariable, which is incorrect. Seems to only happen when required properties are set.
Deno.test("ParameterVariable unwrapped typed object with all required properties should yield object with properties that cannot be undefined", () => {
  const obj = {
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
  };

  const param = ParameterVariable("", "incident", obj);
  assert<CannotBeUndefined<typeof param.id>>(true);
  assert<CannotBeUndefined<typeof param.name>>(true);
  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
});

Deno.test("ParameterVariable DefineObject-wrapped typed object with mix of optional and required properties should yield object with no undefined properties", () => {
  const obj = DefineObject({
    type: SchemaTypes.typedobject,
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

// TODO: below test fails, unwrapped typed object yields a SingleParameterVariable, which is incorrect. Seems to only happen when required properties are set.
Deno.test("ParameterVariable unwrapped typed object with mix of optional and required properties should yield object with no undefined properties", () => {
  const obj = {
    type: SchemaTypes.typedobject,
    properties: {
      id: {
        type: SchemaTypes.integer,
      },
      name: {
        type: SchemaTypes.string,
      },
    },
    required: ["id"],
  };
  const param = ParameterVariable("", "incident", obj);

  assert<CannotBeUndefined<typeof param.id>>(true);
  assert<CannotBeUndefined<typeof param.name>>(true);
  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
});

Deno.test("ParameterVariable DefineObject-wrapped typed object with all optional properties and undefined additionalProperties allows access to additional properties", () => {
  const obj = DefineObject({
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
  const param = ParameterVariable("", "incident", obj);

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable unwrapped typed object with all optional properties and undefined additionalProperties allows access to additional properties", () => {
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

Deno.test("ParameterVariable DefineObject-wrapped typed object with all required properties and undefined additionalProperties allows access to additional properties", () => {
  const obj = DefineObject({
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
  const param = ParameterVariable("", "incident", obj);

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

// TODO: below test fails, unwrapped typed object yields a SingleParameterVariable, which is incorrect. Seems to only happen when required properties are set.
Deno.test("ParameterVariable unwrapped typed object with all required properties and undefined additionalProperties allows access to additional properties", () => {
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
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable DefineObject-wrapped typed object with mix of required and optional properties and undefined additionalProperties allows access to additional properties", () => {
  const obj = DefineObject({
    type: SchemaTypes.typedobject,
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

// TODO: below test fails, unwrapped typed object yields a SingleParameterVariable, which is incorrect. Seems to only happen when required properties are set.
Deno.test("ParameterVariable unwrapped typed object with mix of required and optional properties and undefined additionalProperties allows access to additional properties", () => {
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
    required: ["id"],
  });

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable DefineObject-wrapped typed object with all optional properties and additionalProperties=true allows access to additional properties", () => {
  const obj = DefineObject({
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
  const param = ParameterVariable("", "incident", obj);

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable unwrapped typed object with all optional properties and additionalProperties=true allows access to additional properties", () => {
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

Deno.test("ParameterVariable DefineObject-wrapped typed object with all required properties and additionalProperties=true allows access to additional properties", () => {
  const obj = DefineObject({
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
    additionalProperties: true,
  });
  const param = ParameterVariable("", "incident", obj);

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

// TODO: below test fails, unwrapped typed object yields a SingleParameterVariable, which is incorrect. Seems to only happen when required properties are set.
Deno.test("ParameterVariable unwrapped typed object with all required properties and additionalProperties=true allows access to additional properties", () => {
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
    additionalProperties: true,
  });

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable DefineObject-wrapped typed object with mix of required and optional properties and additionalProperties=true allows access to additional properties", () => {
  const obj = DefineObject({
    type: SchemaTypes.typedobject,
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

// TODO: below test fails, unwrapped typed object yields a SingleParameterVariable, which is incorrect. Seems to only happen when required properties are set.
Deno.test("ParameterVariable unwrapped typed object with mix of required and optional properties and additionalProperties=true allows access to additional properties", () => {
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
    required: ["id"],
    additionalProperties: true,
  });

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable DefineObject-wrapped typed object with all optional properties and additionalProperties=false prevents access to additional properties", () => {
  const obj = DefineObject({
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
  const param = ParameterVariable("", "incident", obj);

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  //@ts-expect-error foo doesn't exist
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable unwrapped typed object with all optional properties and additionalProperties=false prevents access to additional properties", () => {
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

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  //@ts-expect-error foo doesn't exist
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable DefineObject-wrapped typed object with all required properties and additionalProperties=false prevents access to additional properties", () => {
  const obj = DefineObject({
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
    additionalProperties: false,
  });
  const param = ParameterVariable("", "incident", obj);

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  //@ts-expect-error foo doesn't exist
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

// TODO: below test fails, unwrapped typed object yields a SingleParameterVariable, which is incorrect. Seems to only happen when required properties are set.
Deno.test("ParameterVariable unwrapped typed object with all required properties and additionalProperties=false prevents access to additional properties", () => {
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
    additionalProperties: false,
  });

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  // TODO: current failure mode of this test actually causes this next line to incorrectly pass
  //@ts-expect-error foo doesn't exist
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable DefineObject-wrapped typed object with mix of required and optional properties and additionalProperties=false prevents access to additional properties", () => {
  const obj = DefineObject({
    type: SchemaTypes.typedobject,
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

// TODO: below test fails, unwrapped typed object yields a SingleParameterVariable, which is incorrect. Seems to only happen when required properties are set.
Deno.test("ParameterVariable unwrapped typed object with mix of required and optional properties and additionalProperties=false prevents access to additional properties", () => {
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
    required: ["id"],
    additionalProperties: false,
  });

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  // TODO: current failure mode of this test actually causes this next line to incorrectly pass
  //@ts-expect-error foo doesn't exist
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable untyped object should yield a parameter of type any", () => {
  const param = ParameterVariable("", "incident", {
    type: SchemaTypes.untypedobject,
  });

  assert<IsAny<typeof param>>(true);
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

Deno.test("ParameterVariable using Custom Type with unwrapped typed object with optional property yields object with no undefined property", () => {
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

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
});

Deno.test("ParameterVariable using Custom Type with DefineObject-wrapped typed object with optional property yields object with no undefined property", () => {
  const obj = DefineObject({
    type: SchemaTypes.typedobject,
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
    type: SchemaTypes.custom,
    custom: customType,
  });

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
});

// TODO: below test fails, unwrapped typed object yields a SingleParameterVariable, which is incorrect. Seems to only happen when required properties are set.
Deno.test("ParameterVariable using Custom Type with unwrapped typed object with required property yields object with no undefined property", () => {
  const customType = DefineType({
    name: "customType",
    type: SchemaTypes.typedobject,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
    },
    required: ["aString"],
  });
  const param = ParameterVariable("", "myCustomType", {
    type: SchemaTypes.custom,
    custom: customType,
  });

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
});

Deno.test("ParameterVariable using Custom Type with DefineObject-wrapped typed object with required property yields object with no undefined property", () => {
  const obj = DefineObject({
    type: SchemaTypes.typedobject,
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
    type: SchemaTypes.custom,
    custom: customType,
  });

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
});

Deno.test("ParameterVariable using Custom Type with unwrapped typed object with optional property and additionalProperties=true yields object that allows access to additional properties", () => {
  const customType = DefineType({
    name: "customType",
    type: SchemaTypes.typedobject,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
    },
    required: [],
    additionalProperties: true,
  });
  const param = ParameterVariable("", "myCustomType", {
    type: SchemaTypes.custom,
    custom: customType,
  });

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable using Custom Type with DefineObject-wrapped typed object with optional property and additionalProperties=true yields object that allows access to additional properties", () => {
  const obj = DefineObject({
    type: SchemaTypes.typedobject,
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
  const param = ParameterVariable("", "myCustomType", {
    type: SchemaTypes.custom,
    custom: customType,
  });

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

// TODO: below test fails, unwrapped typed object yields a SingleParameterVariable, which is incorrect. Seems to only happen when required properties are set.
Deno.test("ParameterVariable using Custom Type with unwrapped typed object with required property and additionalProperties=true yields object that allows access to additional properties", () => {
  const customType = DefineType({
    name: "customType",
    type: SchemaTypes.typedobject,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
    },
    required: ["aString"],
    additionalProperties: true,
  });
  const param = ParameterVariable("", "myCustomType", {
    type: SchemaTypes.custom,
    custom: customType,
  });

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable using Custom Type with DefineObject-wrapped typed object with required property and additionalProperties=true yields object that allows access to additional properties", () => {
  const obj = DefineObject({
    type: SchemaTypes.typedobject,
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
  const param = ParameterVariable("", "myCustomType", {
    type: SchemaTypes.custom,
    custom: customType,
  });

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable using Custom Type with unwrapped typed object with optional property and additionalProperties=false yields object that prevents access to additional properties", () => {
  const customType = DefineType({
    name: "customType",
    type: SchemaTypes.typedobject,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
    },
    required: [],
    additionalProperties: false,
  });
  const param = ParameterVariable("", "myCustomType", {
    type: SchemaTypes.custom,
    custom: customType,
  });

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
  //@ts-expect-error foo doesn't exist
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable using Custom Type with DefineObject-wrapped typed object with optional property and additionalProperties=false yields object that prevents access to additional properties", () => {
  const obj = DefineObject({
    type: SchemaTypes.typedobject,
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
  const param = ParameterVariable("", "myCustomType", {
    type: SchemaTypes.custom,
    custom: customType,
  });

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
  //@ts-expect-error foo doesn't exist
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

// TODO: below test fails, unwrapped typed object yields a SingleParameterVariable, which is incorrect. Seems to only happen when required properties are set.
Deno.test("ParameterVariable using Custom Type with unwrapped typed object with required property and additionalProperties=false yields object that prevents access to additional properties", () => {
  const customType = DefineType({
    name: "customType",
    type: SchemaTypes.typedobject,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
    },
    required: ["aString"],
    additionalProperties: false,
  });
  const param = ParameterVariable("", "myCustomType", {
    type: SchemaTypes.custom,
    custom: customType,
  });

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
  // TODO: current failure mode of this test actually causes this next line to incorrectly pass
  //@ts-expect-error foo doesn't exist
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable using Custom Type with DefineObject-wrapped typed object with required property and additionalProperties=false yields object that prevents access to additional properties", () => {
  const obj = DefineObject({
    type: SchemaTypes.typedobject,
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
  const param = ParameterVariable("", "myCustomType", {
    type: SchemaTypes.custom,
    custom: customType,
  });

  assert<CannotBeUndefined<typeof param.aString>>(true);
  assertStrictEquals(`${param}`, "{{myCustomType}}");
  assertStrictEquals(`${param.aString}`, "{{myCustomType.aString}}");
  //@ts-expect-error foo doesn't exist
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
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
