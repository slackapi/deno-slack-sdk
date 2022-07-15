import * as dntShim from "../_dnt.test_shims.js";
import { assertStrictEquals } from "../dev_deps.js";
import { DefineDatastore } from "./mod.js";
import SchemaTypes from "../schema/schema_types.js";
import { DefineType } from "../types/mod.js";

const customType = DefineType({
  name: "custom_type",
  type: SchemaTypes.boolean,
});

dntShim.Deno.test("Datastore sets appropriate defaults", () => {
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
      attr4: {
        type: SchemaTypes.object,
        properties: {
          anObjectString: { type: SchemaTypes.string },
        },
      },
    },
  });

  const exported = datastore.export();
  assertStrictEquals(exported.primary_key, "attr1");
  assertStrictEquals(exported.attributes.attr1.type, SchemaTypes.string);
  assertStrictEquals(exported.attributes.attr2.type, SchemaTypes.boolean);
  assertStrictEquals(exported.attributes.attr3.type, customType);
  assertStrictEquals(exported.attributes.attr4.type, SchemaTypes.object);
  assertStrictEquals(
    exported.attributes.attr4.properties?.anObjectString?.type,
    SchemaTypes.string,
  );
});
