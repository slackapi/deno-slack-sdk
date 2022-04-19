import { assertEquals } from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { SlackManifestType } from "./types.ts";

import { Manifest, SlackManifest } from "./manifest.ts";
import {
  DefineFunction,
  DefineOAuth2Provider,
  DefineType,
  OAuth2ProviderTypes,
  Schema,
} from "./mod.ts";

Deno.test("Manifest() property mappings", () => {
  const definition: SlackManifestType = {
    name: "fear and loathing in las vegas",
    description:
      "fear and loathing in las vegas: a savage journey to the heart of the american dream",
    backgroundColor: "#FFF",
    longDescription:
      "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
    displayName: "fear and loathing",
    icon: "icon.png",
    runtime: "deno",
    botScopes: [],
  };
  let manifest = Manifest(definition);

  assertEquals(manifest.display_information, {
    name: definition.name,
    background_color: definition.backgroundColor,
    long_description: definition.longDescription,
    short_description: definition.description,
  });
  assertEquals(manifest.icon, definition.icon);
  assertEquals(
    manifest.features.bot_user.display_name,
    definition.displayName,
  );
  assertEquals(
    manifest.external_auth_providers,
    undefined,
  );

  // If display_name is not defined on definition, should fall back to name
  delete definition.displayName;
  manifest = Manifest(definition);
  assertEquals(
    manifest.features.bot_user.display_name,
    definition.name,
  );
});

// TODO: Re-add test to catch dup datastore names
// TODO: Re-add test for datastore columns

Deno.test("Manifest() automatically registers types used by function input and output parameters", () => {
  const inputTypeId = "test_input_type";
  const outputTypeId = "test_output_type";
  const stringTypeId = "test_string_type";

  const CustomStringType = DefineType(stringTypeId, {
    type: Schema.types.string,
  });

  const CustomInputType = DefineType(inputTypeId, {
    type: Schema.types.object,
    properties: { aString: { type: CustomStringType } },
  });

  const CustomOutputType = DefineType(outputTypeId, {
    type: Schema.types.boolean,
  });

  const Function = DefineFunction(
    {
      callback_id: "test_function",
      title: "Function title",
      source_file: "functions/test_function.ts",
      input_parameters: {
        properties: { aType: { type: CustomInputType } },
        required: [],
      },
      output_parameters: {
        properties: { aType: { type: CustomOutputType } },
        required: [],
      },
    },
  );

  const definition: SlackManifestType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    longDescription: "LongDescription",
    runtime: "deno",
    botScopes: [],
    functions: [Function],
  };
  const manifest = Manifest(definition);
  assertEquals(definition.types, [
    CustomInputType,
    CustomOutputType,
    CustomStringType,
  ]);
  assertEquals(manifest.types, {
    [inputTypeId]: CustomInputType.definition,
    [stringTypeId]: CustomStringType.definition,
    [outputTypeId]: CustomOutputType.definition,
  });
});

Deno.test("Manifest() automatically registers types referenced by other types", () => {
  const objectTypeId = "test_object_type";
  const stringTypeId = "test_string_type";
  const arrayTypeId = "test_array_type";

  const StringType = DefineType(stringTypeId, {
    type: Schema.types.string,
  });

  const ObjectType = DefineType(objectTypeId, {
    type: Schema.types.object,
    properties: {
      aString: { type: StringType },
    },
  });

  const ArrayType = DefineType(arrayTypeId, {
    type: Schema.types.array,
    items: {
      type: ObjectType,
    },
  });

  const definition: SlackManifestType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    longDescription: "LongDescription",
    runtime: "deno",
    botScopes: [],
    types: [ArrayType],
  };
  const manifest = Manifest(definition);
  assertEquals(definition.types, [ArrayType, ObjectType, StringType]);
  assertEquals(manifest.types, {
    [arrayTypeId]: ArrayType.definition,
    [objectTypeId]: ObjectType.definition,
    [stringTypeId]: StringType.definition,
  });
});

Deno.test("SlackManifest() registration functions don't allow duplicates", () => {
  const functionId = "test_function";
  const objectTypeId = "test_object_type";
  const stringTypeId = "test_string_type";

  const CustomStringType = DefineType(stringTypeId, {
    type: Schema.types.string,
  });

  const CustomObjectType = DefineType(objectTypeId, {
    type: Schema.types.object,
    properties: {
      aString: {
        type: CustomStringType,
      },
    },
  });

  const Func = DefineFunction({
    callback_id: functionId,
    title: "Function title",
    source_file: `functions/${functionId}.ts`,
  });

  const definition: SlackManifestType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    longDescription: "LongDescription",
    runtime: "deno",
    botScopes: [],
    functions: [Func],
    types: [CustomObjectType],
  };

  const Manifest = new SlackManifest(definition);

  Manifest.registerFunction(Func);
  Manifest.registerFunction(Func);
  Manifest.registerType(CustomObjectType);
  Manifest.registerType(CustomObjectType);
  Manifest.registerType(CustomStringType);

  const exportedManifest = Manifest.export();

  assertEquals(definition.functions, [Func]);
  assertEquals(exportedManifest.functions, { [functionId]: Func.export() });
  assertEquals(definition.types, [CustomObjectType, CustomStringType]);
  assertEquals(exportedManifest.types, {
    [objectTypeId]: CustomObjectType.definition,
    [stringTypeId]: CustomStringType.definition,
  });
});

Deno.test("SlackManifest() oauth2 providers get set properly", () => {
  const providerKey = "test_provider";

  const Provider = DefineOAuth2Provider({
    provider_key: providerKey,
    provider_type: OAuth2ProviderTypes.CUSTOM,
    options: {
      "client_id": "123.456",
      "client_secret": "secret",
      "scope": ["scope_a", "scope_b"],
    },
  });

  const definition: SlackManifestType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    runtime: "deno",
    botScopes: [],
    oauth2_providers: [Provider],
  };

  const Manifest = new SlackManifest(definition);

  const exportedManifest = Manifest.export();

  assertEquals(definition.oauth2_providers, [Provider]);
  assertEquals(exportedManifest.external_auth_providers?.oauth2, {
    [providerKey]: Provider.export(),
  });
});
