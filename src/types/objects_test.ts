import { DefineObject } from "./objects.ts";
import SchemaTypes from "../schema/schema_types.ts";
import { assert, IsExact } from "../dev_deps.ts";

Deno.test("DefineObject should allow for object property names to be specified in the required field", () => {
  const obj = DefineObject({
    type: SchemaTypes.object,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
      anOptionalString: {
        type: SchemaTypes.string,
      },
    },
    required: ["aString"],
    additionalProperties: true,
  });
  assert<IsExact<typeof obj.required, "aString"[]>>(true);
});

/*
TODO: DefineObject fails to constrain the required field to property names :(
Deno.test("DefineObject should prevent non-object property names to be specified in the required field", () => {
  const obj = DefineObject({
    type: SchemaTypes.object,
    properties: {
      aString: {
        type: SchemaTypes.string,
      },
      anOptionalString: {
        type: SchemaTypes.string,
      },
    },
    // @ts-expect-error should not allow for bogus property names
    required: ["bogus"],
    additionalProperties: true,
  });
});
*/
