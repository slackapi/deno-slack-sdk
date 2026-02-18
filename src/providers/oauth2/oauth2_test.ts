import type { SlackManifestType } from "../../manifest/types.ts";
import { Manifest, SlackManifest } from "../../manifest/mod.ts";
import { DefineOAuth2Provider, Schema } from "../../mod.ts";
import {
  assertEquals,
  assertInstanceOf,
  AssertionError,
  assertStrictEquals,
  assertStringIncludes,
  fail,
} from "../../dev_deps.ts";
import { DuplicateProviderKeyError } from "../../manifest/errors.ts";

Deno.test("SlackManifest() oauth2 throws error when Providers with duplicate provider_keys are added", () => {
  const provider1 = DefineOAuth2Provider({
    provider_key: "test",
    provider_type: Schema.providers.oauth2.CUSTOM,
    options: {
      "client_id": "123.456",
      "scope": ["scope_a"],
    },
  });

  const provider2 = DefineOAuth2Provider({
    provider_key: "test",
    provider_type: Schema.providers.oauth2.CUSTOM,
    options: {
      "client_id": "123.456",
      "scope": ["scope_a"],
    },
  });

  try {
    Manifest({
      name: "Name",
      description: "Description",
      botScopes: [],
      icon: "icon.png",
      externalAuthProviders: [provider1, provider2],
    });
    fail("Manifest() should have thrown an error");
  } catch (error) {
    if (error instanceof AssertionError) throw error;
    assertInstanceOf(error, DuplicateProviderKeyError);
    assertStringIncludes(error.message, "OAuth2Provider");
  }
});

Deno.test("SlackManifest() oauth2 providers get set properly", () => {
  const providerKey = "test_provider";

  const Provider = DefineOAuth2Provider({
    provider_key: providerKey,
    provider_type: Schema.providers.oauth2.CUSTOM,
    options: {
      "client_id": "123.456",
      "scope": ["scope_a", "scope_b"],
    },
  });

  const definition: SlackManifestType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    botScopes: [],
    externalAuthProviders: [Provider],
  };

  const Manifest = new SlackManifest(definition);
  const exportedManifest = Manifest.export();
  assertEquals(definition.externalAuthProviders, [Provider]);
  assertEquals(exportedManifest.external_auth_providers, {
    "oauth2": { "test_provider": Provider.export() },
  });
});

Deno.test("SlackManifest() oauth2 providers get set properly with use_pkce", () => {
  const providerKey1 = "test_provider_with_with_pkce_true";
  const providerKey2 = "test_provider_with_with_pkce_false";
  const providerKey3 = "test_provider_with_with_pkce_unset";

  const Provider1 = DefineOAuth2Provider({
    provider_key: providerKey1,
    provider_type: Schema.providers.oauth2.CUSTOM,
    options: {
      "client_id": "123.456",
      "scope": ["scope_a", "scope_b"],
      "use_pkce": true,
    },
  });

  const Provider2 = DefineOAuth2Provider({
    provider_key: providerKey2,
    provider_type: Schema.providers.oauth2.CUSTOM,
    options: {
      "client_id": "123.456",
      "scope": ["scope_a", "scope_b"],
      "use_pkce": false,
    },
  });

  const Provider3 = DefineOAuth2Provider({
    provider_key: providerKey3,
    provider_type: Schema.providers.oauth2.CUSTOM,
    options: {
      "client_id": "123.456",
      "scope": ["scope_a", "scope_b"],
    },
  });

  const definition: SlackManifestType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    botScopes: [],
    externalAuthProviders: [Provider1, Provider2, Provider3],
  };
  assertEquals(definition.externalAuthProviders, [
    Provider1,
    Provider2,
    Provider3,
  ]);
  const Manifest = new SlackManifest(definition);
  const exportedManifest = Manifest.export();

  assertEquals(exportedManifest.external_auth_providers, {
    "oauth2": {
      "test_provider_with_with_pkce_true": Provider1.export(),
      "test_provider_with_with_pkce_false": Provider2.export(),
      "test_provider_with_with_pkce_unset": Provider3.export(),
    },
  });
  assertStrictEquals(
    exportedManifest.external_auth_providers?.oauth2
      ?.test_provider_with_with_pkce_true?.options?.use_pkce,
    true,
  );
  assertStrictEquals(
    exportedManifest.external_auth_providers?.oauth2
      ?.test_provider_with_with_pkce_false?.options?.use_pkce,
    false,
  );
  assertStrictEquals(
    exportedManifest.external_auth_providers?.oauth2
      ?.test_provider_with_with_pkce_unset?.options?.use_pkce,
    undefined,
  );
});

Deno.test("SlackManifest() oauth2 providers are undefined when not configured", () => {
  const definition: SlackManifestType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    botScopes: [],
  };

  const Manifest = new SlackManifest(definition);

  const exportedManifest = Manifest.export();

  assertEquals(definition.externalAuthProviders, undefined);
  assertEquals(exportedManifest.external_auth_providers, undefined);
});

Deno.test("SlackManifest() oauth2 providers are undefined when set to the empty array", () => {
  const definition: SlackManifestType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    botScopes: [],
    externalAuthProviders: [],
  };

  const Manifest = new SlackManifest(definition);

  const exportedManifest = Manifest.export();

  assertEquals(definition.externalAuthProviders, []);
  assertEquals(exportedManifest.external_auth_providers, undefined);
});

Deno.test("SlackManifest() oauth2 providers get set properly with token_url_config", () => {
  // test with token_url_config unset
  const providerKey1 = "test_provider_with_token_url_config_unset";
  const Provider1 = DefineOAuth2Provider({
    provider_key: providerKey1,
    provider_type: Schema.providers.oauth2.CUSTOM,
    options: {
      "client_id": "123.456",
      "scope": ["scope_a", "scope_b"],
      "token_url_config": {},
    },
  });
  // test with use_basic_auth_scheme false
  const providerKey2 = "test_provider_with_use_basic_auth_scheme_false";
  const Provider2 = DefineOAuth2Provider({
    provider_key: providerKey2,
    provider_type: Schema.providers.oauth2.CUSTOM,
    options: {
      "client_id": "123.456",
      "scope": ["scope_a", "scope_b"],
      "token_url_config": {
        "use_basic_auth_scheme": false,
      },
    },
  });
  // test with use_basic_auth_scheme true
  const providerKey3 = "test_provider_with_use_basic_auth_scheme_true";
  const Provider3 = DefineOAuth2Provider({
    provider_key: providerKey3,
    provider_type: Schema.providers.oauth2.CUSTOM,
    options: {
      "client_id": "123.456",
      "scope": ["scope_a", "scope_b"],
      "token_url_config": {
        "use_basic_auth_scheme": true,
      },
    },
  });
  const definition: SlackManifestType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    botScopes: [],
    externalAuthProviders: [Provider1, Provider2, Provider3],
  };
  assertEquals(definition.externalAuthProviders, [
    Provider1,
    Provider2,
    Provider3,
  ]);
  const Manifest = new SlackManifest(definition);
  const exportedManifest = Manifest.export();

  assertEquals(exportedManifest.external_auth_providers, {
    "oauth2": {
      "test_provider_with_token_url_config_unset": Provider1.export(),
      "test_provider_with_use_basic_auth_scheme_false": Provider2
        .export(),
      "test_provider_with_use_basic_auth_scheme_true": Provider3
        .export(),
    },
  });
  // test with use_basic_auth_scheme unset
  assertStrictEquals(
    exportedManifest.external_auth_providers?.oauth2
      ?.test_provider_with_token_url_config_unset?.options
      ?.token_url_config?.use_basic_auth_scheme,
    undefined,
  );
  // test with use_basic_auth_scheme false
  assertStrictEquals(
    exportedManifest.external_auth_providers?.oauth2
      ?.test_provider_with_use_basic_auth_scheme_false?.options
      ?.token_url_config?.use_basic_auth_scheme,
    false,
  );
  // test with use_basic_auth_scheme true
  assertStrictEquals(
    exportedManifest.external_auth_providers?.oauth2
      ?.test_provider_with_use_basic_auth_scheme_true?.options
      ?.token_url_config?.use_basic_auth_scheme,
    true,
  );
});

Deno.test("SlackManifest() oauth2 providers get set properly with identity_config", () => {
  //test with identity_config containing required fields
  const providerKey1 =
    "test_provider_with_identity_config_required_fields_set1";
  const Provider1 = DefineOAuth2Provider({
    provider_key: providerKey1,
    provider_type: Schema.providers.oauth2.CUSTOM,
    options: {
      "client_id": "123.456",
      "scope": ["scope_a", "scope_b"],
      "identity_config": {
        "url": "https://example.com",
        "account_identifier": "account_identifier_string",
      },
    },
  });

  //test with identity_config containing all fields with POST method
  const providerKey2 =
    "test_provider_with_identity_config_with_all_fields_set2";
  const Provider2 = DefineOAuth2Provider({
    provider_key: providerKey2,
    provider_type: Schema.providers.oauth2.CUSTOM,
    options: {
      "client_id": "123.456",
      "scope": ["scope_a", "scope_b"],
      "identity_config": {
        "url": "https://example.com",
        "account_identifier": "account_identifier_string",
        "headers": { "key1": "header_1", "key2": "header_2" },
        "body": { "param1": "body_1", "param2": "body_2" },
        "http_method_type": "POST",
      },
    },
  });

  // test with identity_config containing all fields with GET method
  const providerKey3 =
    "test_provider_with_identity_config_with_all_fields_set3";
  const Provider3 = DefineOAuth2Provider({
    provider_key: providerKey3,
    provider_type: Schema.providers.oauth2.CUSTOM,
    options: {
      "client_id": "123.456",
      "scope": ["scope_a", "scope_b"],
      "identity_config": {
        "url": "https://example.com",
        "account_identifier": "account_identifier_string",
        "headers": { "key1": "header_1", "key2": "header_2" },
        "body": { "param1": "body_1", "param2": "body_2" },
        "http_method_type": "GET",
      },
    },
  });
  const definition: SlackManifestType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    botScopes: [],
    externalAuthProviders: [Provider1, Provider2, Provider3],
  };
  assertEquals(definition.externalAuthProviders, [
    Provider1,
    Provider2,
    Provider3,
  ]);
  const Manifest = new SlackManifest(definition);
  const exportedManifest = Manifest.export();

  assertEquals(exportedManifest.external_auth_providers, {
    "oauth2": {
      "test_provider_with_identity_config_required_fields_set1": Provider1
        .export(),
      "test_provider_with_identity_config_with_all_fields_set2": Provider2
        .export(),
      "test_provider_with_identity_config_with_all_fields_set3": Provider3
        .export(),
    },
  });
  //test with identity_config containing required fields
  assertEquals(
    exportedManifest.external_auth_providers?.oauth2
      ?.test_provider_with_identity_config_required_fields_set1?.options
      ?.identity_config,
    {
      "url": "https://example.com",
      "account_identifier": "account_identifier_string",
    },
  );
  //test with identity_config containing all fields with POST method
  assertEquals(
    exportedManifest.external_auth_providers?.oauth2
      ?.test_provider_with_identity_config_with_all_fields_set2?.options
      ?.identity_config,
    {
      "url": "https://example.com",
      "account_identifier": "account_identifier_string",
      "headers": { "key1": "header_1", "key2": "header_2" },
      "body": { "param1": "body_1", "param2": "body_2" },
      "http_method_type": "POST",
    },
  );
  //test with identity_config containing all fields with GET metthod
  assertEquals(
    exportedManifest.external_auth_providers?.oauth2
      ?.test_provider_with_identity_config_with_all_fields_set3?.options
      ?.identity_config,
    {
      "url": "https://example.com",
      "account_identifier": "account_identifier_string",
      "headers": { "key1": "header_1", "key2": "header_2" },
      "body": { "param1": "body_1", "param2": "body_2" },
      "http_method_type": "GET",
    },
  );
});
