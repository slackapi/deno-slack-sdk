import { assertEquals } from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { DefineDatastore } from "./mod.ts";
import SchemaTypes from "../schema/schema_types.ts";
import { DefineType } from "../types/mod.ts";

const customType = DefineType({
  callback_id: "custom_type",
  type: SchemaTypes.boolean,
});

Deno.test("Datastore sets appropriate defaults", () => {
  const datastore = DefineDatastore({
    name: "dinos",
    primary_key: "attr1",
    attributes: {
      attr1: {
        type: SchemaTypes.string,
      },
      attr2: {
        type: SchemaTypes.boolean,
      },
      attr3: {
        type: customType,
      },
    },
  });

  const exported = datastore.export();
  assertEquals(exported.primary_key, "attr1");
  assertEquals(exported.attributes.attr1.type, SchemaTypes.string);
  assertEquals(exported.attributes.attr2.type, SchemaTypes.boolean);
  assertEquals(exported.attributes.attr3.type, customType);
});
