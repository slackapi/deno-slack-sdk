import { assertEquals } from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { DefineDatastore } from "./mod.ts";
import SchemaTypes from "../schema/schema_types.ts";
import { DefineType } from "../types/mod.ts";

const customType = DefineType("custom_type", {
  type: SchemaTypes.object,
  properties: {
    id: {
      type: SchemaTypes.string,
    },
    user_id: {
      type: SchemaTypes.string,
    },
  },
});

Deno.test("Datastore sets appropriate defaults", () => {
  const datastore = DefineDatastore("dinos", {
    primary_key: "attr1",
    attributes: {
      attr1: {
        type: "string",
      },
      attr2: {
        type: "int",
      },
      attr3: {
        type: customType,
      },
    },
  });

  const exported = datastore.export();
  console.log(exported);
  assertEquals(exported.primary_key, "attr1");
  assertEquals(exported.attributes.attr1.type, "string");
  assertEquals(exported.attributes.attr2.type, "int");
  assertEquals(exported.attributes.attr3.type, customType);
});
