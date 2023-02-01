import SchemaTypes from "../schema/schema_types.ts";
import { ParameterVariable, SingleParameterVariable } from "./mod.ts";
import { assert, assertStrictEquals, IsAny, IsExact } from "../dev_deps.ts";
import { CannotBeUndefined } from "../test_utils.ts";
/**
 * ParameterVariable-wrapped parameters should yield particular types
 */
Deno.test("ParameterVariable of type string yields a SingleParameterVariable type that coerces into a string containing the provided parameter name", () => {
  const param = ParameterVariable("", "incident_name", {
    type: SchemaTypes.string,
  });
  assertStrictEquals(`${param}`, "{{incident_name}}");
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

Deno.test("ParameterVariable array should yield SingleParameterVariable type", () => {
  const param = ParameterVariable("", "myArray", {
    type: SchemaTypes.array,
    items: {
      type: SchemaTypes.string,
    },
  });
  assert<IsExact<typeof param, SingleParameterVariable>>(true);

  assertStrictEquals(`${param}`, "{{myArray}}");
  assertStrictEquals(`${param}`, "{{myArray}}");
});

Deno.test("ParameterVariable unwrapped typed object with all optional properties should never yield object with potentially undefined properties", () => {
  const obj = {
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
  };
  const param = ParameterVariable("", "incident", obj);

  assert<CannotBeUndefined<typeof param.id>>(true);
  assert<CannotBeUndefined<typeof param.name>>(true);
  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
});

Deno.test("ParameterVariable unwrapped typed object with all required properties should yield object with properties that cannot be undefined", () => {
  const obj = {
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
  };

  const param = ParameterVariable("", "incident", obj);
  assert<CannotBeUndefined<typeof param.id>>(true);
  assert<CannotBeUndefined<typeof param.name>>(true);
  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
});

Deno.test("ParameterVariable unwrapped typed object with mix of optional and required properties should yield object with no undefined properties", () => {
  const obj = {
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

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable unwrapped typed object with all required properties and undefined additionalProperties allows access to additional properties", () => {
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
    required: ["id", "name"],
  });

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable unwrapped typed object with mix of required and optional properties and undefined additionalProperties allows access to additional properties", () => {
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
    required: ["id"],
  });

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable unwrapped typed object with all optional properties and additionalProperties=true allows access to additional properties", () => {
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

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable unwrapped typed object with all required properties and additionalProperties=true allows access to additional properties", () => {
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
    required: ["id", "name"],
    additionalProperties: true,
  });

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable unwrapped typed object with mix of required and optional properties and additionalProperties=true allows access to additional properties", () => {
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

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  //@ts-expect-error foo doesn't exist
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable unwrapped typed object with all required properties and additionalProperties=false prevents access to additional properties", () => {
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
    required: ["id", "name"],
    additionalProperties: false,
  });

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  //@ts-expect-error foo doesn't exist
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});

Deno.test("ParameterVariable unwrapped typed object with mix of required and optional properties and additionalProperties=false prevents access to additional properties", () => {
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
    required: ["id"],
    additionalProperties: false,
  });

  assertStrictEquals(`${param}`, "{{incident}}");
  assertStrictEquals(`${param.id}`, "{{incident.id}}");
  assertStrictEquals(`${param.name}`, "{{incident.name}}");
  //@ts-expect-error foo doesn't exist
  assertStrictEquals(`${param.foo.bar}`, "{{incident.foo.bar}}");
});
