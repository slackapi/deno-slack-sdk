// TODO: if we want to support unwrapped typedobject definitions being passed into ParameterVariable, we need to fix these tests.
// otherwise, we can axe this entire file!

/*
import { DefineType } from "../types/mod.ts";
import SchemaTypes from "../schema/schema_types.ts";
import { ParameterVariable } from "./mod.ts";
import {
  assert,
  assertStrictEquals,
  CannotBeUndefined,
} from "../dev_deps.ts";

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

Deno.test("ParameterVariable with unwrapped typed object with Custom Type property", () => {
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

Deno.test("ParameterVariable using Custom Type with unwrapped typedobject referencing another Custom Type", () => {
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

*/
