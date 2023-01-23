import SchemaTypes from "../schema/schema_types.ts";
import { ParameterVariable, SingleParameterVariable } from "./mod.ts";
import { assert, assertStrictEquals, IsAny, IsExact } from "../dev_deps.ts";

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
